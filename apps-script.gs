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
    payload.mode || "workshop",
    payload.name || "",
    payload.email,
    payload.startingNumberPct,
    payload.baselineScorePct,
    payload.finalScorePct,
    payload.gapFromStartingNumberPct,
    payload.gapFromBaselinePct,
    payload.profile && payload.profile.label || "",
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
    `Final readiness score: ${payload.finalScorePct}%`,
    `Starting number: ${payload.startingNumberPct}%`,
    `Gap from starting number: ${signed(payload.gapFromStartingNumberPct)} points`,
    payload.baselineScorePct === null ? "" : `Previous score baseline: ${payload.baselineScorePct}% (${signed(payload.gapFromBaselinePct)} points)`,
    `Profile: ${payload.profile && payload.profile.label || ""}`,
    "",
    "SECTION SCORES",
    ...(payload.sectionScores || []).map((item) => `${item.title}: ${item.pct}%`),
    ...(payload.retakeModuleScores || []).map((item) => `${item.title} (retake): ${item.pct}%`),
    "",
    "SECTION ANSWERS",
    ...(payload.sectionAnswers || []).flatMap((section) => [
      `${section.title} (${section.scorePct}%)`,
      ...(section.answers || []).map((item) => `${item.question}: ${Array.isArray(item.answer) ? item.answer.join(", ") : item.answer}`)
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
    "MISSING 30% REFLECTIONS",
    ...Object.entries(payload.sectionReflections || {}).map(([section, answer]) => `${section}: ${answer || "No response"}`),
    "",
    `First assignment: ${payload.firstAssignment || "Choose one item from your missing 30% and make it your first concrete step."}`,
    "",
    `Book a session: ${payload.bookingUrl || ""}`,
    `Venture Validation Framework: ${payload.frameworkUrl || ""}`
  ];
  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

function renderHtml(payload) {
  const sectionRows = (payload.sectionScores || []).map((item) => `<tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.pct)}%</td></tr>`).join("");
  const retakeRows = (payload.retakeModuleScores || []).map((item) => `<tr><td>${escapeHtml(item.title)} (retake)</td><td>${escapeHtml(item.pct)}%</td></tr>`).join("");
  const sectionAnswerBlocks = (payload.sectionAnswers || []).map((section) => `<h3>${escapeHtml(section.title)} (${escapeHtml(section.scorePct)}%)</h3><ul>${(section.answers || []).map((item) => `<li><strong>${escapeHtml(item.question)}</strong><br>${escapeHtml(Array.isArray(item.answer) ? item.answer.join(", ") : item.answer)}</li>`).join("")}</ul>`).join("");
  const capacityRows = (payload.capacity && payload.capacity.inventory || []).map((item) => `<li>${escapeHtml(item.name)}: ${escapeHtml(item.score)}/5</li>`).join("");
  const supportRows = (payload.supportMap || []).map((item) => `<li>${escapeHtml(item.seat)}: ${escapeHtml(item.status || "Not provided")}</li>`).join("");
  const partnerRows = (payload.partner && payload.partner.unvalidatedItems || []).map((item) => `<li><strong>${escapeHtml(item.question)}</strong><br>${escapeHtml(item.answer)}</li>`).join("") || "<li>No unvalidated items reported.</li>";
  const reflectionRows = Object.entries(payload.sectionReflections || {}).map(([section, answer]) => `<li><strong>${escapeHtml(section)}</strong><br>${escapeHtml(answer || "No response")}</li>`).join("");
  const emptySeats = (payload.emptySupportSeats || []).join(", ") || "None";
  const constraint = payload.capacity && payload.capacity.constraint;
  const bookingUrl = safeLink(payload.bookingUrl);
  const frameworkUrl = safeLink(payload.frameworkUrl);
  const baselineLine = payload.baselineScorePct === null ? "" : `<p>Previous score baseline: <strong>${escapeHtml(payload.baselineScorePct)}%</strong> (${escapeHtml(signed(payload.gapFromBaselinePct))} points)</p>`;

  return `<div style="font-family:Arial,sans-serif;color:#142033;max-width:680px;margin:0 auto;line-height:1.55">
    <h1 style="color:#142033">Your Founder Readiness Report</h1>
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>Your final readiness score is <strong>${escapeHtml(payload.finalScorePct)}%</strong>. Your starting number was <strong>${escapeHtml(payload.startingNumberPct)}%</strong>, a gap of <strong>${escapeHtml(signed(payload.gapFromStartingNumberPct))} points</strong>.</p>
    ${baselineLine}
    <h2>${escapeHtml(payload.profile && payload.profile.label || "Your profile")}</h2>
    <p>${escapeHtml(payload.profile && payload.profile.summary || "")}</p>
    <h2>Readiness scores</h2><table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%"><tbody>${sectionRows}${retakeRows}</tbody></table>
    <h2>Section answers</h2>${sectionAnswerBlocks}
    <h2>Capacity inventory</h2><ul>${capacityRows}</ul>
    <p><strong>Constraint:</strong> ${constraint ? `${escapeHtml(constraint.name)} (${escapeHtml(constraint.score)}/5)` : "Not available"}</p>
    <p><strong>Hours last month:</strong> ${escapeHtml(payload.capacity && payload.capacity.hoursLastMonth || "Not provided")}<br><strong>Runway:</strong> ${escapeHtml(payload.capacity && payload.capacity.runwayMonths || "Not provided")}</p>
    <h2>Support map</h2><ul>${supportRows}</ul><p><strong>Gaps to fill before launch:</strong> ${escapeHtml(emptySeats)}</p>
    <h2>Co-founder / partner items to validate</h2><ul>${partnerRows}</ul>
    <h2>Your missing 30%</h2><ul>${reflectionRows}</ul>
    <h2>Your first assignment</h2><p>${escapeHtml(payload.firstAssignment || "Choose one item from your missing 30% and make it your first concrete step.")}</p>
    <h2>30-Day Experiment</h2><p>${escapeHtml(payload.capacity && payload.capacity.homework || "Live the schedule your audit says you'll need for 30 days before committing years.")}</p>
    <p style="margin:28px 0"><a href="${escapeHtml(bookingUrl)}" style="background:#C6A15B;color:#0A1220;text-decoration:none;padding:12px 18px;border-radius:5px;display:inline-block;font-weight:bold">Book a session</a></p>
    <p><a href="${escapeHtml(frameworkUrl)}">Venture Validation Framework</a></p>
    <p>In 30 days, retake the assessment with tonight's score as your baseline. Leadership and Daily Rhythm will be added.</p>
  </div>`;
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