const FR_CONFIG = {
  SPREADSHEET_ID: "PASTE_GOOGLE_SHEET_ID_HERE",
  RESPONSE_SHEET_NAME: "Founder Readiness v3",
  SENDER_NAME: "MissyVe"
};

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    validatePayload(payload);

    const sheet = getResponseSheet();
    appendResponse(sheet, payload);
    MailApp.sendEmail({
      to: payload.email,
      subject: `${payload.name}, your Founder Readiness report`,
      body: renderPlainText(payload),
      htmlBody: renderHtml(payload),
      name: FR_CONFIG.SENDER_NAME
    });

    return jsonResponse({ ok: true, attemptId: payload.attemptId });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message || error) });
  }
}

function validatePayload(payload) {
  if (payload.schemaVersion !== 3) throw new Error("Unsupported report schema.");
  if (!payload.attemptId) throw new Error("Missing attemptId.");
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw new Error("A valid recipient email is required.");
}

function getResponseSheet() {
  if (!FR_CONFIG.SPREADSHEET_ID || FR_CONFIG.SPREADSHEET_ID === "PASTE_GOOGLE_SHEET_ID_HERE") {
    throw new Error("Set FR_CONFIG.SPREADSHEET_ID before deploying.");
  }
  const spreadsheet = SpreadsheetApp.openById(FR_CONFIG.SPREADSHEET_ID);
  return spreadsheet.getSheetByName(FR_CONFIG.RESPONSE_SHEET_NAME) || spreadsheet.insertSheet(FR_CONFIG.RESPONSE_SHEET_NAME);
}

function appendResponse(sheet, payload) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At", "Attempt ID", "Mode", "Name", "Email", "Starting Number %", "Baseline Score %",
      "Final Score %", "Gap From Starting %", "Gap From Baseline %", "Profile", "Capacity Constraint",
      "Empty Support Seats", "Unvalidated Partner Items", "Section Reflections", "Full Payload JSON"
    ]);
  }

  const partnerItems = (payload.partner && payload.partner.unvalidatedItems || []).map((item) => `${item.question}: ${item.answer}`).join(" | ");
  const reflections = Object.entries(payload.sectionReflections || {}).map(([section, answer]) => `${section}: ${answer}`).join(" | ");
  const constraint = payload.capacity && payload.capacity.constraint;
  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.attemptId,
    payload.mode || "self-paced",
    payload.name || "",
    payload.email,
    payload.startingNumberPct,
    payload.baselineScorePct,
    payload.finalScorePct,
    payload.gapFromStartingNumberPct,
    payload.gapFromBaselinePct,
    profileLabel(payload),
    constraint ? `${constraint.name} (${constraint.score}/5)` : "",
    (payload.emptySupportSeats || []).join(", "),
    partnerItems,
    reflections,
    JSON.stringify(payload)
  ]);
}

function renderPlainText(payload) {
  const lines = [
    `Founder Readiness Report for ${payload.name}`,
    "",
    `Final readiness score: ${finalScore(payload)}%`,
    "No founder is ever 100% ready. A gap between how ready you felt and how you scored isn't a verdict. It's your map.",
    `Starting number: ${startingNumber(payload)}%`,
    `Gap from starting number: ${signed(payload.gapFromStartingNumberPct ?? payload.gap)} points`,
    payload.baselineScorePct === null || payload.baselineScorePct === undefined ? "" : `Previous score baseline: ${payload.baselineScorePct}% (${signed(payload.gapFromBaselinePct)} points)`,
    `Profile: ${profileLabel(payload)}`,
    "",
    "SECTION SCORES",
    ...(payload.sectionScores || []).map((item) => `${item.title}: ${item.pct}%`),
    ...(payload.retakeModuleScores || []).map((item) => `${item.title} (retake): ${item.pct}%`),
    "",
    "SECTION ANSWERS",
    ...(payload.sectionAnswers || []).flatMap((section) => [
      `${section.title} (${section.scorePct}%)`,
      ...(section.answers || []).map((item) => `${answerQuestionLabel(item)}: ${Array.isArray(item.answer) ? item.answer.join(", ") : item.answer}`)
    ]),
    "",
    "CAPACITY INVENTORY",
    ...(payload.capacity && payload.capacity.inventory || []).map((item) => `${item.name}: ${item.score}/5`),
    `Constraint: ${payload.capacity && payload.capacity.constraint ? `${payload.capacity.constraint.name} (${payload.capacity.constraint.score}/5)` : "Not available"}`,
    `Hours spent last month: ${payload.capacity && payload.capacity.hoursLastMonth || "Not provided"}`,
    `Runway: ${payload.capacity && payload.capacity.runwayMonths || "Not provided"}`,
    `30-Day Experiment: ${payload.capacity && payload.capacity.homework || ""}`,
    "",
    "SUPPORT MAP",
    ...(payload.supportMap || []).map((item) => `${item.seat}: ${item.status || "Not provided"}`),
    `Empty seats to fill before launch: ${(payload.emptySupportSeats || []).join(", ") || "None"}`,
    "",
    "CO-FOUNDER / PARTNER ITEMS TO VALIDATE",
    ...(payload.partner && payload.partner.unvalidatedItems || []).map((item) => `${item.question}: ${item.answer}`),
    "",
    "MISSING % SUMMARY",
    ...missing30Lines(payload.missing30Summary),
    "",
    `First assignment: ${firstAssignment(payload)}`,
    "",
    "Your next step: read Cowgirl Power",
    "Gay Gaddis's book is the companion to everything we covered. It's honest, practical, and written by a founder who built her company the hard way.",
    "Order the book: https://www.amazon.com/Cowgirl-Power-Kick-Business-Life/dp/1478948213",
    "",
    "Bring this report. In 30 minutes we'll pick your biggest gap and the first person you need to recruit to fill it.",
    "Book your free 30-minute session.",
    payload.bookingUrl || ""
  ];
  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

function renderHtml(payload) {
  const NAVY = "#142033", GOLD = "#C6A15B", CREAM = "#F5EFE3", MUTED = "#6B6556";
  const h2 = (text) => `<h2 style="margin:32px 0 10px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED}">${escapeHtml(text)}</h2>`;
  const h3 = (text) => `<h3 style="margin:20px 0 6px;font-family:Arial,sans-serif;font-size:15px;color:${NAVY}">${text}</h3>`;
  const list = (items) => `<ul style="margin:0 0 8px;padding-left:20px">${items.join("")}</ul>`;
  const bar = (title, pct) => `<tr><td style="padding:8px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${NAVY}">${escapeHtml(title)}</td><td align="right" style="padding:8px 0 0;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${NAVY}">${escapeHtml(pct)}%</td></tr><tr><td colspan="2" style="padding:4px 0 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E9E1D0"><tr><td width="${Math.max(0, Math.min(100, Number(pct) || 0))}%" style="background:${GOLD};height:6px;line-height:6px;font-size:0">&nbsp;</td><td style="height:6px;line-height:6px;font-size:0">&nbsp;</td></tr></table></td></tr>`;
  const box = (heading, text) => `<div style="margin:20px 0;padding:16px 18px;background:#FAF6EC;border-left:3px solid ${GOLD}"><p style="margin:0 0 6px;font-weight:bold;color:${NAVY}">${escapeHtml(heading)}</p><p style="margin:0">${text}</p></div>`;

  const sections = payload.sectionScores || [];
  const retakes = payload.retakeModuleScores || [];
  const scoreRows = [...sections, ...retakes].filter((item) => item.pct !== null && item.pct !== undefined).map((item) => bar(item.title, item.pct)).join("");
  const strengths = (payload.strengths || []).map((item) => `<li>${escapeHtml(item)}</li>`);
  const focusAreas = (payload.focusAreas || payload.focus || []).map((item) => `<li>${escapeHtml(item)}</li>`);

  const missing = payload.missing30Summary || {};
  const missingRows = [
    missing.mindsetAnswer ? `<li><strong>MINDSET</strong><br>${escapeHtml(missing.mindsetAnswer)}</li>` : "",
    ...Object.entries(missing.sectionReflections || {}).filter(([, answer]) => answer).map(([section, answer]) => `<li><strong>${escapeHtml(section.toUpperCase())}</strong><br>${escapeHtml(answer)}</li>`),
    `<li><strong>Capacity constraint</strong><br>${missing.capacityConstraint ? `${escapeHtml(missing.capacityConstraint.name)} (${escapeHtml(missing.capacityConstraint.score)}/5)` : "Not identified"}</li>`,
    `<li><strong>Empty Support seats</strong><br>${escapeHtml((missing.emptySupportSeats || []).join(", ") || "None")}</li>`,
    ...(missing.unvalidatedPartnerItems || []).map((item) => `<li><strong>${escapeHtml(item.question)}</strong><br>${escapeHtml(item.answer)}</li>`)
  ].filter(Boolean);

  const sectionAnswerBlocks = (payload.sectionAnswers || []).map((section) => h3(`${escapeHtml(section.title)} (${escapeHtml(section.scorePct)}%)`) + list((section.answers || []).map((item) => `<li style="margin-bottom:8px"><strong>${escapeHtml(answerQuestionLabel(item))}</strong><br>${escapeHtml(Array.isArray(item.answer) ? item.answer.join(", ") : item.answer)}</li>`))).join("");
  const capacityRows = (payload.capacity && payload.capacity.inventory || []).map((item) => `<li>${escapeHtml(item.name)}: ${escapeHtml(item.score)}/5</li>`);
  const supportRows = (payload.supportMap || []).map((item) => `<li>${escapeHtml(item.seat)}: ${escapeHtml(item.status || "Not provided")}</li>`);
  const partnerRows = (payload.partner && payload.partner.unvalidatedItems || []).map((item) => `<li><strong>${escapeHtml(item.question)}</strong><br>${escapeHtml(item.answer)}</li>`);
  const constraint = payload.capacity && payload.capacity.constraint;
  const emptySeats = (payload.emptySupportSeats || []).join(", ") || "None";
  const bookingUrl = safeLink(payload.bookingUrl);
  const baselineLine = payload.baselineScorePct === null || payload.baselineScorePct === undefined ? "" : `<p style="margin:8px 0 0">Change from your previous score baseline (${escapeHtml(payload.baselineScorePct)}%): ${escapeHtml(signed(payload.gapFromBaselinePct))} points.</p>`;

  return `<div style="background:${CREAM};padding:24px 12px;font-family:Georgia,serif;color:${NAVY};line-height:1.6">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-top:4px solid ${GOLD};padding:32px 28px">
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:${MUTED}">MissyVe Founder Readiness</p>
    <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;color:${NAVY}">${escapeHtml(payload.name)}, you're ${/^[aeiou]/i.test(profileLabel(payload)) ? "an" : "a"} ${escapeHtml(profileLabel(payload) || "founder in the making")}</h1>
    <p style="margin:0;font-size:56px;line-height:1.1;color:${GOLD}">${escapeHtml(finalScore(payload))}%</p>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:${MUTED}">overall readiness</p>
    <p>No founder is ever 100% ready. A gap between how ready you felt and how you scored isn't a verdict. It's your map.</p>
    <p style="margin:0">Starting number: <strong>${escapeHtml(startingNumber(payload))}%</strong>. Final score: <strong>${escapeHtml(finalScore(payload))}%</strong>. Gap: <strong>${escapeHtml(signed(payload.gapFromStartingNumberPct ?? payload.gap))} points</strong>.</p>
    ${baselineLine}
    <p>${escapeHtml(profileSummary(payload))}</p>

    ${h2("Your missing %")}${list(missingRows)}
    ${box("Your first assignment: missing %", escapeHtml(firstAssignment(payload)))}
    ${box("30-Day Experiment", escapeHtml(payload.capacity && payload.capacity.homework || "Live the schedule your audit says you'll need for 30 days before committing years."))}

    ${h2("Readiness by dimension")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody>${scoreRows}</tbody></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
      <td valign="top" width="50%"><p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED}">Your strengths</p>${list(strengths)}</td>
      <td valign="top" width="50%"><p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED}">Focus areas</p>${list(focusAreas)}</td>
    </tr></table>

    <div style="margin:28px 0 20px;padding:18px 20px;background:#0F1B33;border-left:3px solid ${GOLD};color:#F5F0E3">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#E3CD9A">Your next step: read Cowgirl Power</p>
      <p style="margin:0 0 12px;color:#F5F0E3">Gay Gaddis's book is the companion to everything we covered. It's honest, practical, and written by a founder who built her company the hard way.</p>
      <p style="margin:0"><a href="https://www.amazon.com/Cowgirl-Power-Kick-Business-Life/dp/1478948213" target="_blank" rel="noopener noreferrer" style="color:#E3CD9A;font-family:Arial,sans-serif;font-weight:bold">Order the book</a></p>
    </div>

    <p>Bring this report. In 30 minutes we'll pick your biggest gap and the first person you need to recruit to fill it.</p>
    <p style="margin:16px 0"><a href="${escapeHtml(bookingUrl)}" style="background:${GOLD};color:#0A1220;text-decoration:none;padding:12px 20px;border-radius:5px;display:inline-block;font-family:Arial,sans-serif;font-size:14px;font-weight:bold">Book your free 30-minute session.</a></p>
    <p>${escapeHtml(payload.next || "")}</p>
    ${h2("In 30 days")}<p style="margin:0">Retake in 30 days with tonight's ${escapeHtml(finalScore(payload))}% score as your baseline. The retake adds Leadership and Daily Rhythm.</p>

    <hr style="border:none;border-top:1px solid #E9E1D0;margin:36px 0 0">
    ${h2("Full breakdown")}
    ${h3("Your answers by section")}${sectionAnswerBlocks}
    ${h3("Capacity inventory")}${list(capacityRows)}
    <p style="margin:0 0 6px"><strong>Constraint:</strong> ${constraint ? `${escapeHtml(constraint.name)} (${escapeHtml(constraint.score)}/5)` : "Not available"}</p>
    <p style="margin:0"><strong>Hours last month:</strong> ${escapeHtml(payload.capacity && payload.capacity.hoursLastMonth || "Not provided")}<br><strong>Runway:</strong> ${escapeHtml(payload.capacity && payload.capacity.runwayMonths || "Not provided")}<br><strong>When work has no owner:</strong> ${escapeHtml(payload.capacity && payload.capacity.unownedWorkResponse || "Not provided")}</p>
    ${h3("Support map")}${list(supportRows)}
    <p style="margin:0"><strong>Gaps to fill before launch:</strong> ${escapeHtml(emptySeats)}</p>
    ${h3("Co-founder / partner items to validate")}${list(partnerRows.length ? partnerRows : ["<li>No unvalidated items reported.</li>"])}

    <p style="margin:32px 0 0;font-style:italic;color:${MUTED}">"The biggest risk in entrepreneurship is not that your startup fails. The biggest risk is becoming disconnected from yourself while trying to build it."</p>
    <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px">Melissa Wood<br>MissyVe | <a href="mailto:melissa@missyve.co">melissa@missyve.co</a></p>
  </div>
</div>`;
}

function answerQuestionLabel(item) {
  return item.id === "why-reflection" || item.id === "reality-reflection" ? "Your reflection" : item.question;
}

function profileData(payload) {
  return payload.profileDetails || (payload.profile && typeof payload.profile === "object" ? payload.profile : {});
}

function profileLabel(payload) {
  const profile = profileData(payload);
  return profile.label || (typeof payload.profile === "string" ? payload.profile : "");
}

function profileSummary(payload) {
  return profileData(payload).summary || payload.summary || "";
}

function finalScore(payload) {
  return payload.finalScorePct ?? payload.score;
}

function startingNumber(payload) {
  return payload.startingNumberPct ?? payload.felt;
}

function firstAssignment(payload) {
  return payload.firstAssignment || payload.assignment || "Choose one item from your missing % and make it your first concrete step.";
}

function missing30Lines(summary) {
  if (!summary) return ["No missing % findings were submitted."];
  const constraint = summary.capacityConstraint;
  return [
    `MINDSET: ${summary.mindsetAnswer || "No response"}`,
    ...Object.entries(summary.sectionReflections || {}).filter(([, answer]) => answer).map(([section, answer]) => `${section.toUpperCase()}: ${answer}`),
    `Capacity constraint: ${constraint ? `${constraint.name} (${constraint.score}/5)` : "Not identified"}`,
    `Empty Support seats: ${(summary.emptySupportSeats || []).join(", ") || "None"}`,
    ...(summary.unvalidatedPartnerItems || []).map((item) => `${item.question}: ${item.answer}`)
  ];
}

function safeLink(value) {
  const url = String(value || "");
  return /^(https:\/\/|mailto:)/i.test(url) ? url : "mailto:melissa@missyve.co";
}

function escapeHtml(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function signed(value) {
  const number = Number(value || 0);
  return `${number >= 0 ? "+" : ""}${number}`;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}