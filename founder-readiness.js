(() => {
  const ACCESS_CODE = "femmefounders26";
  // ---------------------------------------------------------------------------
  // CONFIG: edit these to run a workshop
  // ---------------------------------------------------------------------------
  // Each access code sets a mode. "workshop" = gated sections you open live.
  // "self" = self-paced, all 10 modules, no holds. Add more codes as needed.
  const CODES = {
    "femmefounders26": "workshop"
  };
  // Words shown on your slides to open each section (case doesn't matter).
  const UNLOCK_WORDS = { why: "why", reality: "reality", capacity: "capacity", support: "support", results: "ready" };
  // Optional: where coaching buttons go. Leave blank to use email.
  const BOOKING_URL = "";
  const CONTACT_EMAIL = "melissa@missyve.co";
  // Your Google Apps Script web app URL (see apps-script.gs). It saves each
  // finished assessment to your Google Sheet and emails the report to the
  // founder. Leave blank and results stay on the device only.
  const RESULTS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxtnhckqHy2eyVJnMOYl1WR-jOjqzd4e7VxL5EtvUtJiMjiAJ8tT4NK-0Jb28gV2_bIsQ/exec";

  const LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  const L = (text) => ({ type: "likert", text });
  const C = (text, options) => ({ type: "choice", text, options });
  const T = (text, placeholder) => ({ type: "text", text, placeholder });

  const MODULES = [
    {
      title: "Why Found?",
      fullTitle: "Why Do You Want to Be a Founder?",
      description: "Understanding your core motivation is the foundation of everything. Founders who know their why outlast those who don't.",
      assignment: "Write your why in one sentence without the words money, freedom, or founder. Then ask whether it would survive ten years of this.",
      questions: [
        L("I can clearly articulate a specific problem I want to solve, and it matters deeply to me personally."),
        L("My desire to build a company comes from an internal drive rather than external pressures like status or financial gain."),
        L("I have a clear personal definition of what success looks like beyond revenue or valuation."),
        T("Finish the sentence: I want to build this because...", "Skip the words money, freedom, and founder")
      ]
    },
    {
      title: "Reality Check",
      fullTitle: "Understanding the Founder Reality",
      description: "Entrepreneurship is an emotional rollercoaster. Honest self-awareness about what it actually demands is not optional.",
      assignment: "Write two lists: what you're willing to sacrifice and what you're not. Share both with the people closest to you.",
      questions: [
        L("I know what I'm willing to sacrifice for this, and what I'm not willing to sacrifice."),
        L("I can tolerate long periods of uncertainty and ambiguity without being paralyzed."),
        L("The people closest to me understand and support my entrepreneurial ambitions.")
      ]
    },
    {
      title: "Mindset",
      fullTitle: "Mindset Shifts for Entrepreneurship",
      description: "The right mental frameworks separate founders who adapt from those who quit. You don't need to feel ready to begin.",
      assignment: "Take the part of your missing 30% that scares you most and schedule one small action on it this week.",
      questions: [
        L("When I fail or receive criticism, I view it as data to learn from, not a reflection of my worth."),
        L("I can take meaningful action despite feeling uncertain or unqualified."),
        L("I consistently choose progress and iteration over waiting for the perfect moment."),
        T("What's in your missing 30%? Name up to three things.", "What you don't know yet, or know you avoid")
      ]
    },
    {
      title: "Capacity",
      fullTitle: "Commitment & Capacity",
      description: "Wanting to be a founder isn't enough. Do you actually have the time, energy, and financial runway to pursue this?",
      assignment: "Run a 30-day founder experiment: live the schedule your time audit says you'd need before you commit years.",
      questions: [
        C("In the last 30 days, how many hours a week did you actually spend on your venture?", [["0 to 5", 1], ["5 to 10", 2], ["10 to 20", 4], ["20 or more", 5]]),
        C("How many months of personal expenses could you cover with no income?", [["Under 3", 1], ["3 to 6", 3], ["6 to 12", 4], ["12 or more", 5]]),
        L("I want the outcome enough to endure the difficult, unglamorous work of getting there.")
      ]
    },
    {
      title: "Support Systems",
      fullTitle: "Founder Support Systems",
      description: "No founder builds alone. The quality of your support network directly impacts your odds of success.",
      assignment: "Fill one empty seat this month: a mentor, a peer founder, or someone who will tell you the truth.",
      questions: [
        L("I have at least one mentor or advisor who has been through the entrepreneurial journey and can provide guidance."),
        L("I'm part of, or actively building, a peer community of other founders or aspiring entrepreneurs."),
        C("The last time someone gave me direct, critical feedback on my venture was...", [["This month", 5], ["This quarter", 4], ["This year", 2], ["Never", 1]])
      ]
    },
    {
      title: "Co-Founder Fit",
      fullTitle: "Co-Founder Alignment",
      description: "Co-founder breakups kill more startups than bad ideas. Whether solo or paired, clarity here is essential.",
      assignment: "Before anyone gets equity, write down their role, what leadership looks like in it, and what happens if they don't grow into it.",
      questions: [
        C("Roles, equity, and vesting for everyone involved are written down.", [["Yes", 5], ["Partly", 3], ["No", 1], ["No co-founder yet", null]]),
        C("Everyone holding equity is contributing at a level that matches their share.", [["Yes", 5], ["Mostly", 4], ["Not sure", 2], ["No", 1], ["No one else holds equity", null]]),
        L("I know how I handle conflict and have a clear process for navigating disagreement with a partner.")
      ]
    },
    {
      title: "Well-Being",
      fullTitle: "Founder Well-Being & Sustainability",
      description: "The founder is the company's most important asset. Neglecting yourself is not a badge of honor; it's a liability.",
      assignment: "Write down your three burnout warning signs and one thing you'll do when you notice each one.",
      questions: [
        L("I consistently get the sleep I need to perform at my best."),
        L("I know my warning signs for burnout and have strategies to recover before it becomes a crisis."),
        L("I can set and hold boundaries around my time and energy, even when things get hectic.")
      ]
    },
    {
      title: "Resilience",
      fullTitle: "Resilience & Failure",
      description: "Things will go wrong. Your ability to recover and keep moving is more important than avoiding failure.",
      assignment: "Write about one setback you recovered from and what it taught you. Keep it as evidence that you can do hard things.",
      questions: [
        L("I have real examples from my life where I bounced back from a significant setback and grew from it."),
        L("I can treat failure as data and reflect on what went wrong without spiraling into self-blame."),
        L("I can maintain forward momentum even when results are disappointing or timelines slip.")
      ]
    },
    {
      title: "Leadership",
      fullTitle: "Leadership & Decision-Making",
      description: "Founders are decision-making machines. Leading yourself and others under uncertainty is a learnable skill.",
      assignment: "Write down your top three values and use them to make one decision you've been putting off.",
      questions: [
        L("I can make decisions quickly with incomplete information; I don't wait for certainty before acting."),
        L("I hold myself accountable to my commitments and can model that accountability for others."),
        L("My values are clear enough that I can use them as a filter when making hard calls under pressure.")
      ]
    },
    {
      title: "Daily Rhythm",
      fullTitle: "Building a Founder Rhythm",
      description: "Entrepreneurship is a marathon, not a sprint. The daily and weekly rhythms you build now will sustain you for years.",
      assignment: "Block 30 minutes every Friday for a weekly review: what worked, what didn't, and one win to celebrate.",
      questions: [
        L("I have a regular reflection practice, like journaling or weekly reviews, that helps me stay intentional."),
        L("I celebrate small wins and milestones; I don't just keep moving the goalposts without acknowledgment."),
        L("I actively invest in my own learning and development on a consistent, ongoing basis.")
      ]
    }
  ];

  // Workshop sections, in the order you teach them. Leadership and Daily Rhythm
  // are left out of the live session and saved for the 30-day retake.
  const SECTIONS = [
    { id: "why", name: "Founder Why", modules: [0] },
    { id: "reality", name: "Reality & Mindset", modules: [1, 2] },
    { id: "capacity", name: "Commitment & Capacity", modules: [3] },
    { id: "support", name: "Support & Sustainability", modules: [4, 5, 6, 7] }
  ];

  const PROFILES = [
    {
      min: 85,
      label: "Primed to Launch",
      summary: "You show strong readiness across nearly every founder dimension. Your self-awareness, mindset, and habits give you a solid base for what's ahead.",
      next: "Founder readiness is the first pillar. Your next step is testing the venture itself: the opportunity, the market, and the business model."
    },
    {
      min: 70,
      label: "Ready Founder",
      summary: "You have solid foundations across most areas. A few gaps remain, but none are disqualifying. With intentional work over the next 60 days, you can close them.",
      next: "Spend the next 30 days on your lowest-scoring area, then move on to validating the venture itself."
    },
    {
      min: 55,
      label: "Emerging Founder",
      summary: "You have real entrepreneurial potential, with meaningful gaps between where you are and where the journey will ask you to be. Every one of these areas is learnable.",
      next: "Start with your first assignment below. Find a mentor, join a founder community, and run a 30-day founder experiment."
    },
    {
      min: 40,
      label: "Aspiring Founder",
      summary: "You're drawn to entrepreneurship but haven't yet built the inner infrastructure the journey demands. This isn't a no. It's a not yet, and you know exactly what to work on.",
      next: "Before pursuing your idea, invest in your mindset and support systems. Give yourself 90 days to build that foundation."
    },
    {
      min: 0,
      label: "Early Explorer",
      summary: "You're at the very beginning of your founder readiness journey. The most important thing right now is getting honest about your motivations and what you want your life to look like.",
      next: "Start with your why. Find a community of aspiring founders and give yourself 90 days of intentional preparation."
    }
  ];

  function installStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .fr-overlay{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:rgba(3,8,16,.84);backdrop-filter:blur(8px)}
      .fr-overlay[hidden]{display:none}
      .fr-panel{position:relative;width:min(760px,100%);max-height:min(900px,calc(100vh - 40px));overflow:auto;background:#0F1B33;color:#F5F0E3;border:1px solid rgba(198,161,91,.42);border-radius:10px;box-shadow:0 24px 80px rgba(0,0,0,.5)}
      .fr-top{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 24px;background:rgba(15,27,51,.96);border-bottom:1px solid rgba(198,161,91,.22)}
      .fr-brand{margin:0;color:#E3CD9A;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
      .fr-close{width:36px;height:36px;border:1px solid rgba(198,161,91,.35);border-radius:50%;background:transparent;color:#F5F0E3;font-size:21px;line-height:1;cursor:pointer}
      .fr-close:hover,.fr-close:focus-visible{color:#E3CD9A;border-color:#C6A15B}
      .fr-close:focus-visible,.fr-button:focus-visible,.fr-choice:focus-visible,.fr-code:focus-visible{outline:2px solid #E3CD9A;outline-offset:3px}
      .fr-content{padding:clamp(24px,5vw,42px)}
      .fr-eyebrow{margin:0 0 10px;color:#E3CD9A;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
      .fr-title{margin:0 0 12px;color:#F5F0E3;font-family:'Fraunces',Georgia,serif;font-size:clamp(28px,6vw,40px);font-weight:500;line-height:1.12}
      .fr-copy{margin:0;color:#B9B2A0;font-size:14px;line-height:1.7}
      .fr-gate{max-width:480px;margin:auto;text-align:center}
      .fr-form{display:flex;gap:10px;margin-top:28px}
      .fr-code{min-width:0;flex:1;padding:13px 14px;border:1px solid rgba(198,161,91,.38);border-radius:6px;background:rgba(255,255,255,.04);color:#F5F0E3;font:inherit;font-size:14px}
      .fr-code::placeholder{color:#B9B2A0}
      .fr-error{min-height:1.4em;margin:10px 0 0;color:#E3CD9A;font-size:12px;text-align:left}
      .fr-button{border:1px solid #C6A15B;border-radius:6px;padding:12px 18px;background:#C6A15B;color:#0A1220;font:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:background .2s ease,border-color .2s ease}
      .fr-button:hover:not(:disabled){background:#E3CD9A;border-color:#E3CD9A}
      .fr-button:disabled{border-color:rgba(198,161,91,.18);background:rgba(198,161,91,.13);color:#B9B2A0;cursor:not-allowed}
      .fr-progress-label{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;color:#B9B2A0;font-size:12px}
      .fr-progress-track{height:4px;overflow:hidden;background:rgba(245,240,227,.13)}
      .fr-progress-fill{height:100%;background:#C6A15B;transition:width .3s ease}
      .fr-module{margin:26px 0 20px;padding:22px 24px;border:1px solid rgba(198,161,91,.28);border-radius:8px;background:rgba(255,255,255,.025)}
      .fr-module h2{margin:0 0 8px;color:#F5F0E3;font-family:'Fraunces',Georgia,serif;font-size:25px;font-weight:500;line-height:1.2}
      .fr-module p{margin:0;color:#B9B2A0;font-size:13px;line-height:1.65}
      .fr-question{margin:12px 0;padding:20px;border:1px solid rgba(198,161,91,.18);border-radius:8px;background:rgba(255,255,255,.025)}
      .fr-question-title{display:flex;gap:12px;align-items:flex-start;margin:0 0 18px;color:#F5F0E3;font-size:14px;font-weight:500;line-height:1.6}
      .fr-number{display:grid;flex:0 0 24px;place-items:center;width:24px;height:24px;border-radius:50%;background:#C6A15B;color:#0A1220;font-size:12px;font-weight:700}
      .fr-options{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
      .fr-choice{min-height:68px;padding:8px 5px;border:1px solid rgba(198,161,91,.25);border-radius:6px;background:rgba(255,255,255,.025);color:#B9B2A0;font:inherit;font-size:10px;line-height:1.35;cursor:pointer}
      .fr-choice:hover{border-color:#C6A15B;color:#F5F0E3}
      .fr-choice[aria-pressed=true]{border-color:#C6A15B;background:rgba(198,161,91,.18);color:#F5F0E3}
      .fr-choice b{display:block;margin:0 auto 5px;color:#E3CD9A;font-size:13px}
      .fr-nav{display:flex;gap:10px;margin-top:22px}
      .fr-nav .fr-button{flex:1}
      .fr-back{background:transparent;color:#E3CD9A}
      .fr-hint{margin:12px 0 0;color:#B9B2A0;font-size:11px;text-align:center}
      .fr-result-score{display:flex;align-items:baseline;gap:10px;margin:20px 0 14px;color:#E3CD9A}
      .fr-result-score strong{font-family:'Fraunces',Georgia,serif;font-size:48px;font-weight:500;line-height:1}
      .fr-result-score span{color:#B9B2A0;font-size:12px}
      .fr-result-block{margin-top:20px;padding:20px;border-left:3px solid #C6A15B;background:rgba(198,161,91,.08)}
      .fr-result-block h3,.fr-breakdown h3{margin:0 0 8px;color:#E3CD9A;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
      .fr-result-block p{margin:0;color:#F5F0E3;font-size:13px;line-height:1.7}
      .fr-breakdown{margin-top:30px}
      .fr-score-row{margin:15px 0}
      .fr-score-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:7px;color:#F5F0E3;font-size:12px}
      .fr-score-head span:last-child{color:#E3CD9A;font-weight:700}
      .fr-score-track{height:4px;background:rgba(245,240,227,.13)}
      .fr-score-track span{display:block;height:100%;background:#C6A15B}
      .fr-highlights{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(198,161,91,.2)}
      .fr-highlights h3{margin:0 0 10px;color:#E3CD9A;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
      .fr-highlights p{margin:6px 0;color:#B9B2A0;font-size:12px;line-height:1.5}
      .fr-quote{margin:25px 0 0;color:#B9B2A0;font-family:'Fraunces',Georgia,serif;font-size:16px;line-height:1.55}
      .fr-contact,.fr-assessment{border-bottom:0;padding-bottom:0}
      .fr-home-break{width:100%;max-width:420px;height:clamp(24px,4vw,32px);margin-top:clamp(32px,5vw,48px);flex:none;border-top:1px solid var(--line);opacity:0;animation:rise .9s ease-out 1.45s forwards}
      .fr-footer{display:flex;width:100%;flex-direction:column;align-items:center;gap:12px;opacity:0;animation:rise .9s ease-out 1.6s forwards}
      .fr-contact-label{margin:0;color:#B9B2A0;font-size:11px}
      .fr-footer-row{display:flex;align-items:center;justify-content:center;gap:clamp(18px,3vw,34px);flex-wrap:wrap}
      .fr-footer .fr-contact{margin:0;flex-direction:row;align-items:center;gap:8px}
      .fr-footer .social{margin:0}
      .fr-copyright{margin:0;color:#B9B2A0;font-size:10px}
      @media(min-width:768px){.page{align-items:flex-start;padding-top:clamp(48px,8vh,88px);padding-bottom:32px}main.hero{width:100%}}
      @media(max-width:520px){.fr-overlay{padding:10px}.fr-panel{max-height:calc(100vh - 20px)}.fr-top{padding:14px 18px}.fr-content{padding:22px 18px}.fr-form{flex-direction:column}.fr-form .fr-button{width:100%}.fr-options{gap:4px}.fr-choice{min-height:70px;padding:7px 2px;font-size:9px}.fr-question{padding:16px}.fr-module{padding:18px}.fr-highlights{gap:14px}.fr-footer-row{gap:16px}}
      .fr-pct{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:8px}
      .fr-pct-choice{min-height:56px}
      .fr-pct-choice b{margin:0;font-size:15px}
      .fr-choice-list{display:grid;gap:8px}
      .fr-choice-row{min-height:48px;padding:12px 16px;text-align:left;font-size:13px}
      .fr-text{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid rgba(198,161,91,.3);border-radius:6px;background:rgba(255,255,255,.04);color:#F5F0E3;font:inherit;font-size:14px;line-height:1.5;resize:vertical}
      .fr-text::placeholder{color:#8F8A7C}
      .fr-text:focus-visible{outline:2px solid #E3CD9A;outline-offset:2px}
      .fr-hint-left{text-align:left;margin-top:8px}
      .fr-hold{padding:24px 0 8px}
      .fr-gap{margin:0 0 14px;color:#F5F0E3;font-family:'Fraunces',Georgia,serif;font-size:19px;line-height:1.45}
      .fr-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
      .fr-cta .fr-button{flex:1 1 220px;text-align:center;text-decoration:none}
      .fr-next{margin-top:16px}
      .fr-email{margin-top:20px}
      .fr-reflection{margin:10px 0;color:#F5F0E3;font-size:13px;line-height:1.6}
      .fr-reflection span{display:block;color:#B9B2A0;font-size:11px;margin-bottom:2px}
      @media(max-width:520px){.fr-pct{gap:6px}.fr-cta{flex-direction:column}}
      .fr-details{display:grid;gap:14px;margin-top:8px}
      .fr-field{display:grid;gap:6px;color:#B9B2A0;font-size:12px}
      .fr-wide{width:100%;margin-top:4px}
      .fr-sent{margin:16px 0 0;padding:12px 14px;border:1px solid rgba(198,161,91,.3);border-radius:6px;color:#F5F0E3;font-size:13px}
      @media(prefers-reduced-motion:reduce){.fr-home-break,.fr-footer{animation:none;opacity:1;transform:none}.fr-progress-fill,.fr-button{transition:none}}
    `;
    document.head.append(style);
  }

  function init() {
    const hero = document.querySelector("main.hero");
    const contactButton = hero && hero.querySelector(".cta");
    if (!hero || !contactButton) return;

    installStyles();

    document.title = "MissyVe";
    hero.querySelector(".badge")?.remove();
    contactButton.classList.add("fr-contact");
    contactButton.innerHTML = "<span>get in touch</span>";
    const social = hero.querySelector(".social");
    const portfolio = hero.querySelector(".portfolio");
    const formusLink = portfolio && portfolio.querySelector('a[href*="formus.ai"]');
    if (formusLink) {
      formusLink.querySelector(".name").textContent = "Formus";
      formusLink.querySelector("img").alt = "Formus logo";
      formusLink.setAttribute("aria-label", "Formus");
    }
    const footer = document.createElement("div");
    footer.className = "fr-footer";
    const contactLabel = document.createElement("p");
    contactLabel.className = "fr-contact-label";
    contactLabel.textContent = "For more info";
    const footerRow = document.createElement("div");
    footerRow.className = "fr-footer-row";
    footer.append(contactLabel, footerRow);
    footerRow.append(contactButton);
    if (social) footerRow.append(social);
    const copyright = document.createElement("p");
    copyright.className = "fr-copyright";
    copyright.textContent = "\u00a9 MissyVe 2026";
    footer.append(copyright);
    if (portfolio) {
      const sectionBreak = document.createElement("div");
      sectionBreak.className = "fr-home-break";
      sectionBreak.setAttribute("aria-hidden", "true");
      portfolio.insertAdjacentElement("afterend", sectionBreak);
      sectionBreak.insertAdjacentElement("afterend", footer);
    } else {
      hero.append(footer);
    }

    const launchButton = document.createElement("button");
    launchButton.type = "button";
    launchButton.className = "cta fr-assessment";
    launchButton.setAttribute("aria-haspopup", "dialog");
    launchButton.innerHTML = '<span class="label">For aspiring founders,</span><span>take the assessment</span><span class="arrow" aria-hidden="true">&rarr;</span>';
    if (portfolio) portfolio.insertAdjacentElement("beforebegin", launchButton);
    else contactButton.insertAdjacentElement("afterend", launchButton);

    const overlay = document.createElement("div");
    overlay.className = "fr-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="fr-panel" role="dialog" aria-modal="true" aria-labelledby="fr-dialog-title">
        <header class="fr-top"><p class="fr-brand">MissyVe | Founder Readiness</p><button class="fr-close" type="button" aria-label="Close assessment">&times;</button></header>
        <div class="fr-content fr-body"></div>
      </section>`;
    document.body.append(overlay);

    const body = overlay.querySelector(".fr-body");
    const closeButton = overlay.querySelector(".fr-close");

    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const scored = (q) => q.type !== "text";
    let code = null;
    let mode = "self";
    let flow = [];
    let state = null;

    function freshState() {
      return { step: 0, answers: {}, unlocked: {}, felt: null, sent: false, name: "", email: "" };
    }
    function storageKey() { return `fr-state-v2-${code}`; }
    function save() {
      try { localStorage.setItem(storageKey(), JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
    }
    function load() {
      try { const raw = localStorage.getItem(storageKey()); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    }

    function buildFlow() {
      const steps = [{ type: "details" }, { type: "checkin" }];
      if (mode === "workshop") {
        SECTIONS.forEach((section, sectionIndex) => {
          steps.push({ type: "hold", id: section.id, sectionIndex });
          section.modules.forEach((m) => steps.push({ type: "module", m, sectionIndex }));
        });
        steps.push({ type: "hold", id: "results" });
      } else {
        MODULES.forEach((_, m) => steps.push({ type: "module", m }));
      }
      steps.push({ type: "results" });
      return steps;
    }
    const activeModules = () => flow.filter((s) => s.type === "module").map((s) => s.m);

    function questionScore(m, qi) {
      const q = MODULES[m].questions[qi];
      const a = state.answers[`${m}-${qi}`];
      if (a === undefined || a === null || a === "") return null;
      if (q.type === "likert") return a;
      if (q.type === "choice") return q.options[a][1];
      return null;
    }
    function moduleScore(m) {
      let got = 0, max = 0;
      MODULES[m].questions.forEach((q, qi) => {
        const s = questionScore(m, qi);
        if (s !== null) { got += s; max += 5; }
      });
      return max ? Math.round((got / max) * 100) : null;
    }
    function moduleComplete(m) {
      return MODULES[m].questions.every((q, qi) => !scored(q) || state.answers[`${m}-${qi}`] !== undefined);
    }

    function renderGate(message = "") {
      body.innerHTML = `
        <div class="fr-gate">
          <p class="fr-eyebrow">Private assessment</p>
          <h1 class="fr-title" id="fr-dialog-title">Founder Readiness</h1>
          <p class="fr-copy">Enter your access code to begin. Your answers are saved on this device, so you can pick up where you left off.</p>
          <form class="fr-form" data-form="access">
            <input class="fr-code" type="password" name="code" autocomplete="off" placeholder="Access code" aria-label="Access code" required>
            <button class="fr-button" type="submit">Continue</button>
          </form>
          <p class="fr-error" role="alert">${message}</p>
        </div>`;
      body.querySelector("input").focus();
    }

    function progressHeader(label) {
      const total = flow.length - 1;
      const pct = Math.round((state.step / total) * 100);
      return `
        <div class="fr-progress-label"><span>${esc(label)}</span><span>${pct}% complete</span></div>
        <div class="fr-progress-track" role="progressbar" aria-label="Assessment progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div class="fr-progress-fill" style="width:${pct}%"></div></div>`;
    }

    function renderDetails(message = "") {
      body.innerHTML = `
        ${progressHeader("Before we begin")}
        <div class="fr-module"><h2 id="fr-dialog-title">Where should we send your report?</h2><p>When you finish, we'll email you your full readiness report: your score, your strengths, your focus areas, and your first assignment.</p></div>
        <form class="fr-details" data-form="details" novalidate>
          <label class="fr-field"><span>First name</span><input class="fr-code" type="text" name="name" autocomplete="given-name" value="${esc(state.name)}" required></label>
          <label class="fr-field"><span>Email</span><input class="fr-code" type="email" name="email" autocomplete="email" inputmode="email" value="${esc(state.email)}" required></label>
          <p class="fr-error" role="alert">${message}</p>
          <button class="fr-button fr-wide" type="submit">Start the assessment</button>
          <p class="fr-hint">We'll only use your email to send your report and follow up about founder coaching. Unsubscribe anytime.</p>
        </form>`;
      body.querySelector("input").focus();
    }

    function renderCheckin() {
      const options = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) =>
        `<button class="fr-choice fr-pct-choice" type="button" data-action="felt" data-value="${v}" aria-pressed="${state.felt === v}"><b>${v}%</b></button>`).join("");
      body.innerHTML = `
        ${progressHeader("Before we begin")}
        <div class="fr-module"><h2 id="fr-dialog-title">How ready do you feel?</h2><p>Go with your gut. As a percentage, how ready do you feel to be a founder right now? You'll see how this compares to your score at the end.</p></div>
        <div class="fr-pct" aria-label="Choose a percentage">${options}</div>
        <nav class="fr-nav" aria-label="Assessment navigation">
          <button class="fr-button fr-back" type="button" data-action="back">Back</button>
          <button class="fr-button" type="button" data-action="next" ${state.felt ? "" : "disabled"}>Continue</button>
        </nav>`;
    }

    function renderHold(step, message = "") {
      const isResults = step.id === "results";
      const section = isResults ? null : SECTIONS[step.sectionIndex];
      const title = isResults ? "Your results are next" : `Next: ${section.name}`;
      const copy = isResults
        ? "Hold here. We'll reveal results together at the end. Enter the word on screen when it's time."
        : "Hold here. We'll open this section together when we get to it. Enter the word on screen to continue.";
      const label = isResults ? "All sections complete" : `Section ${step.sectionIndex + 1} of ${SECTIONS.length}`;
      body.innerHTML = `
        ${progressHeader(label)}
        <div class="fr-gate fr-hold">
          <p class="fr-eyebrow">Hold here</p>
          <h1 class="fr-title" id="fr-dialog-title">${esc(title)}</h1>
          <p class="fr-copy">${copy}</p>
          <form class="fr-form" data-form="unlock">
            <input class="fr-code" type="text" name="word" autocomplete="off" autocapitalize="none" placeholder="Word on screen" aria-label="Unlock word" required>
            <button class="fr-button" type="submit">Open</button>
          </form>
          <p class="fr-error" role="alert">${message}</p>
          ${state.step > 2 ? '<nav class="fr-nav"><button class="fr-button fr-back" type="button" data-action="back">Review my answers</button></nav>' : ""}
        </div>`;
    }

    function renderQuestion(m, q, qi) {
      const key = `${m}-${qi}`;
      const selected = state.answers[key];
      const title = `<h3 class="fr-question-title" id="fr-q-${key}"><span class="fr-number">${qi + 1}</span>${esc(q.text)}</h3>`;
      if (q.type === "text") {
        return `<section class="fr-question" aria-labelledby="fr-q-${key}">${title}<textarea class="fr-text" data-question="${key}" rows="3" placeholder="${esc(q.placeholder)}">${esc(selected || "")}</textarea><p class="fr-hint fr-hint-left">Optional. Only you see this.</p></section>`;
      }
      let choices;
      if (q.type === "choice") {
        choices = `<div class="fr-choice-list">${q.options.map(([label], oi) =>
          `<button class="fr-choice fr-choice-row" type="button" data-action="answer" data-question="${key}" data-value="${oi}" aria-pressed="${selected === oi}">${esc(label)}</button>`).join("")}</div>`;
      } else {
        choices = `<div class="fr-options" aria-label="Choose a response">${LABELS.map((label, index) => {
          const value = index + 1;
          return `<button class="fr-choice" type="button" data-action="answer" data-question="${key}" data-value="${value}" aria-pressed="${selected === value}" aria-label="${value}, ${label}"><b>${value}</b>${label}</button>`;
        }).join("")}</div>`;
      }
      return `<section class="fr-question" aria-labelledby="fr-q-${key}">${title}${choices}</section>`;
    }

    function renderModule(step) {
      const m = step.m;
      const module = MODULES[m];
      const complete = moduleComplete(m);
      const next = flow[state.step + 1];
      const nextLabel = next.type === "results" ? "See my results" : next.type === "hold" ? "Finish section" : "Next";
      const label = mode === "workshop" ? `Section ${step.sectionIndex + 1} of ${SECTIONS.length}: ${SECTIONS[step.sectionIndex].name}` : `Module ${activeModules().indexOf(m) + 1} of ${activeModules().length}`;
      const required = module.questions.filter(scored).length;
      body.innerHTML = `
        ${progressHeader(label)}
        <div class="fr-module"><h2 id="fr-dialog-title">${esc(module.fullTitle)}</h2><p>${esc(module.description)}</p></div>
        ${module.questions.map((q, qi) => renderQuestion(m, q, qi)).join("")}
        <nav class="fr-nav" aria-label="Assessment navigation">
          <button class="fr-button fr-back" type="button" data-action="back">Back</button>
          <button class="fr-button" type="button" data-action="next" ${complete ? "" : "disabled"}>${nextLabel}</button>
        </nav>
        ${complete ? "" : `<p class="fr-hint">Answer all ${required} rated questions to continue.</p>`}`;
    }

    function coachingLink(subject) {
      if (BOOKING_URL) return BOOKING_URL;
      return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
    }

    function resultPayload(report) {
      return {
        code, mode,
        name: state.name, email: state.email,
        felt: state.felt, score: report.totalPct, gap: report.gap,
        profile: report.profile.label, summary: report.profile.summary, next: report.profile.next,
        assignmentTitle: MODULES[report.lowest.m].title, assignment: MODULES[report.lowest.m].assignment,
        coachingUrl: coachingLink(`Coaching: ${MODULES[report.lowest.m].title}`),
        frameworkUrl: coachingLink("The Venture Validation Framework"),
        modules: report.scores.map(({ m, pct }) => ({ title: MODULES[m].title, fullTitle: MODULES[m].fullTitle, pct })),
        strengths: report.strongest.map(({ m }) => MODULES[m].title),
        focus: report.focus.map(({ m }) => MODULES[m].title),
        why: state.answers["0-3"] || "", missing: state.answers["2-3"] || "",
        retake: mode === "workshop",
        submittedAt: new Date().toISOString()
      };
    }
    function send(payload) {
      if (!RESULTS_ENDPOINT) return Promise.resolve(false);
      return fetch(RESULTS_ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
        .then(() => true).catch(() => false);
    }

    function renderResults(notice = "") {
      const mods = activeModules();
      const scores = mods.map((m) => ({ m, pct: moduleScore(m) })).filter((s) => s.pct !== null);
      const totalPct = Math.round(scores.reduce((t, s) => t + s.pct, 0) / scores.length);
      const profile = PROFILES.find((p) => totalPct >= p.min);
      const sorted = [...scores].sort((a, b) => a.pct - b.pct);
      const lowest = sorted[0];
      const focus = sorted.slice(0, 2);
      const strongest = sorted.slice(-2).reverse();
      const diff = totalPct - state.felt;
      let gap;
      if (diff < -5) gap = `You felt ${state.felt}% ready. You scored ${totalPct}%. That ${Math.abs(diff)}-point gap is your missing piece, and it tells you exactly where to focus.`;
      else if (diff > 5) gap = `You felt ${state.felt}% ready. You scored ${totalPct}%. You may be more ready than you give yourself credit for.`;
      else gap = `You felt ${state.felt}% ready. You scored ${totalPct}%. You know yourself well, and that's a founder skill.`;

      const report = { totalPct, gap, profile, lowest, focus, strongest, scores };
      if (!state.sent) { send(resultPayload(report)); state.sent = true; save(); }

      const rows = scores.map(({ m, pct }) => `<div class="fr-score-row"><div class="fr-score-head"><span>${esc(MODULES[m].fullTitle)}</span><span>${pct}%</span></div><div class="fr-score-track"><span style="width:${pct}%"></span></div></div>`).join("");
      const missing = state.answers["2-3"];
      const why = state.answers["0-3"];
      const reflections = (why || missing) ? `<section class="fr-breakdown"><h3>In your words</h3>${why ? `<p class="fr-reflection"><span>I want to build this because</span>${esc(why)}</p>` : ""}${missing ? `<p class="fr-reflection"><span>My missing 30%</span>${esc(missing)}</p>` : ""}</section>` : "";
      const retake = mode === "workshop"
        ? `<section class="fr-result-block"><h3>In 30 days</h3><p>Retake the assessment after your 30-day founder experiment. It adds two modules we didn't cover today: Leadership and Daily Rhythm.</p></section>`
        : "";
      const emailNote = RESULTS_ENDPOINT
        ? `<p class="fr-sent" role="status">Your full report is on its way to ${esc(state.email)}.</p>`
        : "";

      body.innerHTML = `
        <p class="fr-eyebrow">${esc(state.name ? `${state.name}, your founder readiness profile` : "Your founder readiness profile")}</p>
        <h1 class="fr-title" id="fr-dialog-title">${profile.label}</h1>
        <div class="fr-result-score"><strong>${totalPct}%</strong><span>overall readiness</span></div>
        <p class="fr-gap">${gap}</p>
        <p class="fr-copy">${profile.summary}</p>
        <section class="fr-result-block"><h3>Your first assignment: ${esc(MODULES[lowest.m].title)}</h3><p>${esc(MODULES[lowest.m].assignment)}</p></section>
        <div class="fr-cta">
          <a class="fr-button" href="${coachingLink(`Coaching: ${MODULES[lowest.m].title}`)}" target="_blank" rel="noopener">Work with Missy on ${esc(MODULES[lowest.m].title)}</a>
          <a class="fr-button fr-back" href="${coachingLink("The Venture Validation Framework")}" target="_blank" rel="noopener">Validate the rest of your venture</a>
        </div>
        <p class="fr-copy fr-next">${profile.next}</p>
        ${emailNote}
        <section class="fr-breakdown"><h3>Readiness by dimension</h3>${rows}</section>
        <div class="fr-highlights"><section><h3>Your strengths</h3>${strongest.map(({ m }) => `<p>${esc(MODULES[m].title)}</p>`).join("")}</section><section><h3>Focus areas</h3>${focus.map(({ m }) => `<p>${esc(MODULES[m].title)}</p>`).join("")}</section></div>
        ${reflections}
        ${retake}
        <p class="fr-quote">"The biggest risk in entrepreneurship is not that your startup fails. The biggest risk is becoming disconnected from yourself while trying to build it."</p>
        <nav class="fr-nav" aria-label="Results actions"><button class="fr-button fr-back" type="button" data-action="retake">Start over</button></nav>`;
    }

    function render(message = "") {
      const step = flow[state.step];
      if (step.type === "details") renderDetails(message);
      else if (step.type === "checkin") renderCheckin();
      else if (step.type === "hold") renderHold(step, message);
      else if (step.type === "module") renderModule(step);
      else renderResults(message);
      body.scrollTop = 0;
    }

    function go(delta) {
      let i = state.step + delta;
      // skip holds already opened when moving backward
      while (delta < 0 && i > 0 && flow[i].type === "hold" && state.unlocked[flow[i].id]) i -= 1;
      state.step = Math.max(0, Math.min(flow.length - 1, i));
      save();
      render();
    }
    function advance() {
      let i = state.step + 1;
      while (i < flow.length && flow[i].type === "hold" && state.unlocked[flow[i].id]) i += 1;
      state.step = Math.min(flow.length - 1, i);
      save();
      render();
    }

    function close() {
      overlay.hidden = true;
      document.body.style.overflow = "";
      renderGate();
      launchButton.focus();
    }

    launchButton.addEventListener("click", () => {
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      renderGate();
    });

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) close();
    });

    body.addEventListener("submit", (event) => {
      const form = event.target.dataset.form;
      if (!form) return;
      event.preventDefault();
      const data = new FormData(event.target);
      if (form === "access") {
        const entered = String(data.get("code") || "").trim().toLowerCase();
        const match = Object.keys(CODES).find((k) => k.toLowerCase() === entered);
        if (!match) { renderGate("That code didn't work. Check it and try again."); return; }
        code = match;
        mode = CODES[match];
        flow = buildFlow();
        state = load() || freshState();
        if (state.step >= flow.length) state.step = 0;
        render();
      } else if (form === "unlock") {
        const step = flow[state.step];
        const word = String(data.get("word") || "").trim().toLowerCase();
        if (word !== String(UNLOCK_WORDS[step.id]).toLowerCase()) { renderHold(step, "Not quite. Check the word on screen and try again."); return; }
        state.unlocked[step.id] = true;
        advance();
      } else if (form === "details") {
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        state.name = name;
        state.email = email;
        if (!name) { renderDetails("Add your first name to continue."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { renderDetails("Enter a valid email so we can send your report."); return; }
        advance();
      }
    });

    body.addEventListener("input", (event) => {
      const field = event.target.closest(".fr-text");
      if (!field) return;
      state.answers[field.dataset.question] = field.value;
      save();
    });

    body.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control || control.disabled) return;
      const { action } = control.dataset;
      if (action === "felt") {
        state.felt = Number(control.dataset.value);
        save();
        renderCheckin();
      } else if (action === "answer") {
        const scrollTop = body.scrollTop;
        state.answers[control.dataset.question] = Number(control.dataset.value);
        save();
        render();
        body.scrollTop = scrollTop;
      } else if (action === "back") {
        go(-1);
      } else if (action === "next") {
        advance();
      } else if (action === "retake") {
        const { name, email } = state;
        state = { ...freshState(), name, email, step: 1 };
        save();
        render();
      }
    });

    renderGate();
    body.innerHTML = "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
