(() => {
  const ACCESS_CODE = "femmefounders26";
  // ---------------------------------------------------------------------------
  // CONFIG: edit these to run a workshop
  // ---------------------------------------------------------------------------
  // Each access code sets a mode. "workshop" = gated sections you open live.
  // "self" = self-paced, all 10 modules, no holds. Add more codes as needed.
  const CODES = { [ACCESS_CODE]: "workshop" };
  const UNLOCK_WORDS = { why: "why", reality: "reality", mindset: "mindset", capacity: "capacity", people: "support", sustainability: "sustain", results: "ready" };
  // Optional: where coaching buttons go. Leave blank to use email.
  const BOOKING_URL = "";
  const CONTACT_EMAIL = "melissa@missyve.co";
  // Your Google Apps Script web app URL (see apps-script.gs). It saves each
  // finished assessment to your Google Sheet and emails the report to the
  // founder. Leave blank and results stay on the device only.
  const RESULTS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxtnhckqHy2eyVJnMOYl1WR-jOjqzd4e7VxL5EtvUtJiMjiAJ8tT4NK-0Jb28gV2_bIsQ/exec";

  const LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  const L = (id, text) => ({ id, type: "likert", text, scored: true, required: true });
  const T = (id, text, placeholder = "") => ({ id, type: "text", text, placeholder, scored: false, required: false });
  const options = (values) => values.map(([label, value, score = null]) => ({ label, value, score }));
  const choice = (id, text, values, extra = {}) => ({ id, type: "choice", text, options: options(values), scored: false, required: true, ...extra });
  const scoredChoice = (id, text, values) => ({ id, type: "choice", text, options: options(values), scored: true, required: true });
  const account = (id, name, text) => ({ id, type: "capacity", account: name, text, scored: true, required: true });

  const SECTIONS = [
    {
      id: "why", name: "WHY", title: "Why this? Why you? Why now?", description: "Your why has to survive your real life.",
      questions: [
        L("why-q1", "Last month, I explained to someone close to me why I want to build this, and my reason held up to their questions."),
        L("why-q2", "In the last month, I used a strength, skill, or lived experience of mine to make progress on this problem."),
        L("why-q3", "In the last month, I made room for this work without pretending my real-life responsibilities would disappear."),
        T("why-timing", "What happened in your life or work in the last month that makes now feel like the time to build this? If nothing changed, say so."),
        T("why-sentence", "Finish the sentence: I want to build this because…", "Name the problem and why it matters. Avoid generic answers like money, freedom, or being your own boss."),
        T("why-reflection", "What from this section belongs in your missing 30%?")
      ]
    },
    {
      id: "reality", name: "REALITY", title: "What happens when life doesn't cooperate?", description: "You don't control the timeline.",
      questions: [
        T("reality-protect", "What won't you sacrifice?", "Think about what you actually protected last month."),
        L("reality-q1", "Last month, I made a real tradeoff to create room for this work, and I can name what I gave up."),
        L("reality-q2", "Last month, I talked with the people affected by this plan about what it asks of our time, money, or responsibilities."),
        T("reality-q3", "Think of the last time life paused or disrupted a plan you cared about. What did you actually do next?", "Share only what you're comfortable with."),
        T("reality-reflection", "What from this section belongs in your missing 30%?")
      ]
    },
    {
      id: "mindset", name: "MINDSET", title: "70% is enough to start when you know what's missing.", description: "What don't you know about yourself yet?",
      questions: [
        L("mindset-q1", "Last month, when I hit something I didn't know how to do, I named what I didn't know and took a concrete step to learn it."),
        L("mindset-q2", "Last month, I asked for feedback on something I was avoiding and stayed open long enough to hear it."),
        L("mindset-q3", "Last month, I noticed an assumption or blind spot in how I was approaching this and changed what I did next."),
        T("mindset-missing", "What's in your missing 30%? Name up to three things.", "Write the thing you'd least like to admit."),
      ]
    },
    {
      id: "capacity", name: "CAPACITY", title: "Capacity is five accounts, not one.", description: "You can be rich in one and bankrupt in another.",
      questions: [
        account("capacity-time", "Time", "Looking at last month, how much usable time did you actually have for building after work, care, and life commitments?"),
        account("capacity-energy", "Energy", "Last month, how much energy did you actually have left for founder work after your existing responsibilities?"),
        account("capacity-money", "Money", "Based on last month's income and expenses, how much financial room did you have to work on this without risking essentials?"),
        account("capacity-emotional", "Emotional bandwidth", "Last month, how much room did you have for uncertainty, setbacks, and difficult decisions?"),
        account("capacity-people", "People who depend on you", "Last month, how workable was your plan for meeting their needs while building?"),
        choice("capacity-hours", "How many hours did you actually spend on your venture last month?", [["0–10", "0-10"], ["11–40", "11-40"], ["41–80", "41-80"], ["81–120", "81-120"], ["120+", "120+"]]),
        choice("capacity-runway", "At your current personal expenses, how many months could you cover essentials with no income?", [["Less than 1", "lt-1"], ["1–3", "1-3"], ["4–6", "4-6"], ["7–12", "7-12"], ["12+", "12+"]]),
        choice("capacity-owner", "When work shows up with no clear owner, who takes it?", [["I take it by default", "me-default"], ["I choose to take it", "me-choice"], ["We decide together", "together"], ["Someone else takes it", "someone-else"], ["It stays unowned", "unowned"], ["This hasn't happened", "not-happened"]]),
        T("capacity-reflection", "What from this section belongs in your missing 30%?")
      ]
    },
    {
      id: "people", name: "PEOPLE + SUPPORT", title: "Who's coming with you, and have you validated the relationship?", description: "Your missing 30% is a team sport.",
      partnerStatus: choice("partner-status", "Do you have a co-founder or key partner with equity or a defined role?", [["Yes", "yes"], ["Not yet", "not-yet"]]),
      partnerWithPartner: [
        scoredChoice("partner-equity", "Does equity follow role and actual contribution, not friendship, hours, or intention?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]]),
        scoredChoice("partner-roles", "Have you defined each person's role in writing?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]]),
        scoredChoice("partner-leadership", "Have you defined what leadership looks like for each role?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]]),
        scoredChoice("partner-growth", "Have you agreed on what happens if someone doesn't grow into their role?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]]),
        scoredChoice("partner-vesting", "Is there a vesting schedule, and do you know how it protects you if someone steps back?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]]),
        scoredChoice("partner-fit", "Have you validated that this person is truly a good fit, not just someone you trust?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]]),
        scoredChoice("partner-accountability", "How did you hold them accountable to commitments last month?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1], ["Not applicable", "na", null]])
      ],
      partnerSolo: [
        scoredChoice("partner-fit-solo", "Have you validated that the people you plan to bring in are the right fit, not just people you trust?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1]]),
        scoredChoice("partner-needs-solo", "Have you defined what you'll need from a co-founder or key partner before bringing one in?", [["Yes", "yes", 5], ["Partly", "partly", 3], ["Not yet", "not-yet", 1]])
      ],
      supportMap: ["Co-founder", "Advisor", "Mentor", "Peer founder", "Accountability partner", "Home support", "Truth-teller"].map((seat) => choice(`support-${seat.toLowerCase().replace(/[^a-z]+/g, "-")}`, `${seat}: is this seat filled, partly filled, or empty?`, [["Filled", "filled", 5], ["Partly filled", "partly", 3], ["Empty", "empty", 1]], { scoreMap: true })),
      reflection: T("people-reflection", "What from this section belongs in your missing 30%?")
    },
    {
      id: "sustainability", name: "SUSTAINABILITY", title: "Can you build this without destroying yourself?", description: "The founder is infrastructure, not a flexible resource. Failure is data, not identity.",
      questions: [
        L("sustain-sleep", "Last month, I protected the sleep I need often enough to function well."),
        L("sustain-energy", "Last month, I noticed when my energy was dropping and adjusted my workload or recovery before I hit a wall."),
        L("sustain-boundaries", "Last month, I held a boundary on my time or availability when work tried to expand into it."),
        L("sustain-delegation", "Last month, I asked for help or handed off work someone else could own instead of carrying it all myself."),
        L("sustain-resilience", "After a setback last month, I looked for evidence about what to change in the path rather than treating it as evidence about my worth."),
        T("sustain-care", "Who takes care of you?", "Who specifically showed up for you last month, and what did they do?"),
        T("sustain-reflection", "What from this section belongs in your missing 30%?")
      ]
    }
  ];

  const RETAKE_MODULES = [
    { id: "leadership", title: "Leadership", fullTitle: "Leadership & Decision-Making", questions: [
      L("leadership-q1", "Last month, when I had incomplete information, I made a decision and acted without waiting for certainty."),
      L("leadership-q2", "Last month, I followed through on a commitment and owned it when I didn't."),
      L("leadership-q3", "Last month, I used my values to make or explain a difficult decision.")
    ] },
    { id: "daily-rhythm", title: "Daily Rhythm", fullTitle: "Building a Founder Rhythm", questions: [
      L("rhythm-q1", "Last month, I used a regular reflection practice to decide what to do next."),
      L("rhythm-q2", "Last month, I acknowledged a small win instead of immediately moving the goalposts."),
      L("rhythm-q3", "Last month, I made time to learn something and applied it.")
    ] }
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
      .fr-code{min-width:0;flex:1;padding:13px 14px;border:1px solid rgba(198,161,91,.38);border-radius:6px;background:rgba(255,255,255,.04);color:#F5F0E3;font:inherit;font-size:16px}
      .fr-code::placeholder{color:#B9B2A0}
      .fr-error{min-height:1.4em;margin:10px 0 0;color:#E3CD9A;font-size:12px;text-align:left}
      .fr-button{border:1px solid #C6A15B;border-radius:6px;padding:12px 18px;background:#C6A15B;color:#0A1220;font:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:background .2s ease,border-color .2s ease}
      .fr-button:hover:not(:disabled){background:#E3CD9A;border-color:#E3CD9A}
      .fr-button:disabled{border-color:rgba(198,161,91,.18);background:rgba(198,161,91,.13);color:#B9B2A0;cursor:not-allowed}
      .fr-progress-label{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;color:#B9B2A0;font-size:12px}
      .fr-progress-track{height:4px;overflow:hidden;background:rgba(245,240,227,.13)}
      .fr-progress-fill{height:100%;background:#C6A15B;transition:width .3s ease}
      .fr-slider-label{display:flex;justify-content:space-between;gap:12px;margin:22px 0 8px;color:#F5F0E3;font-size:13px;font-weight:600}
      .fr-slider-label output{color:#E3CD9A;font-variant-numeric:tabular-nums}
      .fr-slider{width:100%;height:28px;margin:0;accent-color:#C6A15B;cursor:pointer}
      .fr-slider-limits{margin:0;color:#B9B2A0;font-size:11px;font-weight:400}
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
  @media(max-width:520px){.fr-overlay{padding:10px}.fr-panel{max-height:calc(100vh - 20px)}.fr-top{padding:14px 18px}.fr-content{padding:22px 18px}.fr-form{flex-direction:column}.fr-form .fr-button{width:100%}.fr-options{gap:4px}.fr-choice{min-height:70px;padding:7px 2px;font-size:9px}.fr-question{padding:16px}.fr-module{padding:18px}.fr-highlights{gap:14px}.fr-footer-row{gap:16px}.modal-overlay{align-items:flex-start;overflow-y:auto;padding:max(16px,env(safe-area-inset-top)) 16px max(16px,env(safe-area-inset-bottom))}.modal{max-height:calc(100dvh - 32px);overflow-y:auto;margin:auto 0}.field input,.field textarea{font-size:16px}}
      .fr-pct{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:8px}
      .fr-pct-choice{min-height:56px}
      .fr-pct-choice b{margin:0;font-size:15px}
      .fr-choice-list{display:grid;gap:8px}
      .fr-choice-row{min-height:48px;padding:12px 16px;text-align:left;font-size:13px}
      .fr-text{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid rgba(198,161,91,.3);border-radius:6px;background:rgba(255,255,255,.04);color:#F5F0E3;font:inherit;font-size:16px;line-height:1.5;resize:vertical}
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
    let code = null;
    let mode = "self";
    let flow = [];
    let state = null;
    let attemptStore = { schemaVersion: 3, currentAttemptId: null, attempts: [] };

    function newId() {
      return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    function storageKey() { return `fr-attempts-v3-${code}`; }
    function readAttemptStore() {
      try {
        const parsed = JSON.parse(localStorage.getItem(storageKey()) || "null");
        if (parsed?.schemaVersion === 3 && Array.isArray(parsed.attempts)) return parsed;
      } catch (e) { /* storage unavailable or invalid */ }
      return { schemaVersion: 3, currentAttemptId: null, attempts: [] };
    }
    function freshState({ name = "", email = "", retake = false, baselinePct = null } = {}) {
      return {
        attemptId: newId(), createdAt: new Date().toISOString(), step: 0, answers: {}, unlocked: {},
        startingNumber: null, baselinePct, retake, sent: false, name, email, completedAt: null, scorePct: null
      };
    }
    function save() {
      if (!state) return;
      const index = attemptStore.attempts.findIndex((attempt) => attempt.attemptId === state.attemptId);
      if (index < 0) attemptStore.attempts.push(state);
      else attemptStore.attempts[index] = state;
      attemptStore.currentAttemptId = state.attemptId;
      try { localStorage.setItem(storageKey(), JSON.stringify(attemptStore)); } catch (e) { /* storage unavailable */ }
    }
    function buildFlow() {
      const steps = [{ type: "details" }, { type: "checkin" }];
      SECTIONS.forEach((section) => {
        steps.push({ type: "hold", id: section.id });
        steps.push({ type: "section", id: section.id });
      });
      if (state?.retake) RETAKE_MODULES.forEach((module) => steps.push({ type: "retakeModule", id: module.id }));
      steps.push({ type: "hold", id: "results" });
      steps.push({ type: "results" });
      return steps;
    }
    function sectionQuestions(section) {
      if (section.id !== "people") return section.questions;
      const partnerQuestions = state.answers["partner-status"] === "yes" ? section.partnerWithPartner : section.partnerSolo;
      return [section.partnerStatus, ...partnerQuestions, ...section.supportMap, section.reflection];
    }
    function findQuestion(id) {
      for (const section of SECTIONS) {
        const match = sectionQuestions(section).find((question) => question.id === id);
        if (match) return match;
      }
      for (const module of RETAKE_MODULES) {
        const match = module.questions.find((question) => question.id === id);
        if (match) return match;
      }
      return null;
    }
    function answerScore(question) {
      const answer = state.answers[question.id];
      if (answer === undefined || answer === null || answer === "") return null;
      if (question.type === "likert" || question.type === "capacity") return Number(answer);
      if (question.type === "choice" && question.scored) {
        return question.options.find((option) => option.value === answer)?.score ?? null;
      }
      return null;
    }
    function averageScore(questions) {
      const scores = questions.map(answerScore).filter((score) => score !== null);
      return scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length / 5 * 100) : null;
    }
    function supportMapScore(section) {
      return averageScore(section.supportMap.map((question) => ({ ...question, scored: true, type: "choice" })));
    }
    function sectionScore(section) {
      const questions = sectionQuestions(section).filter((question) => question.scored);
      return averageScore(questions) ?? (section.id === "people" ? supportMapScore(section) : null);
    }
    function retakeModuleScore(module) {
      return averageScore(module.questions);
    }
    function questionComplete(question) {
      if (!question.required) return true;
      const answer = state.answers[question.id];
      if (question.type === "multi") return Array.isArray(answer) && answer.length > 0;
      return answer !== undefined && answer !== null && answer !== "";
    }
    function sectionComplete(section) {
      return sectionQuestions(section).every(questionComplete);
    }
    function beginAttempt(options = {}) {
      state = freshState(options);
      attemptStore.attempts.push(state);
      attemptStore.currentAttemptId = state.attemptId;
      flow = buildFlow();
      save();
    }

    function renderGate(message = "") {
      body.innerHTML = `
        <div class="fr-gate">
          <p class="fr-eyebrow">Private assessment</p>
          <h1 class="fr-title" id="fr-dialog-title">Founder Readiness</h1>
          <p class="fr-copy">Enter your access code to begin. Your answers are saved, so you can pick up where you left off.</p>
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
      const baseline = state.baselinePct === null ? "" : `<p class="fr-hint">Your last completed score of ${state.baselinePct}% is saved as this retake's baseline.</p>`;
      body.innerHTML = `
        ${progressHeader("Before we begin")}
        <div class="fr-module"><h2 id="fr-dialog-title">How ready do you feel?</h2><p>Go with your gut. As a percentage, how ready do you feel to be a founder right now? You'll see how this compares to your score at the end.</p></div>
        ${baseline}
        <label class="fr-slider-label" for="fr-starting-number"><span>Your starting number</span><output id="fr-starting-output">${state.startingNumber === null ? "Choose 0–100%" : `${state.startingNumber}%`}</output></label>
        <input class="fr-slider" id="fr-starting-number" type="range" min="0" max="100" step="5" value="${state.startingNumber ?? 50}" aria-label="Starting readiness percentage">
        <div class="fr-slider-label fr-slider-limits"><span>0%</span><span>100%</span></div>
        <nav class="fr-nav" aria-label="Assessment navigation">
          <button class="fr-button fr-back" type="button" data-action="back">Back</button>
          <button class="fr-button" type="button" data-action="next" ${state.startingNumber === null ? "disabled" : ""}>Continue</button>
        </nav>`;
    }

    function renderHold(step, message = "") {
      const isResults = step.id === "results";
      const section = isResults ? null : SECTIONS.find((item) => item.id === step.id);
      const title = isResults ? "Your results are next" : `Next: ${section.name}`;
      const copy = isResults
        ? "Hold here. We'll reveal results together at the end. Enter the word on screen when it's time."
        : "Hold here. We'll open this section together when we get to it. Enter the word on screen to continue.";
      const label = isResults ? "All sections complete" : `Section ${SECTIONS.indexOf(section) + 1} of ${SECTIONS.length}`;
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

    function renderQuestion(question, index) {
      const selected = state.answers[question.id];
      const title = `<h3 class="fr-question-title" id="fr-q-${esc(question.id)}"><span class="fr-number">${index + 1}</span>${esc(question.text)}</h3>`;
      if (question.type === "text") {
        return `<section class="fr-question" aria-labelledby="fr-q-${esc(question.id)}">${title}<textarea class="fr-text" data-question="${esc(question.id)}" rows="3" placeholder="${esc(question.placeholder)}">${esc(selected || "")}</textarea>${question.placeholder ? `<p class="fr-hint fr-hint-left">${esc(question.placeholder)}</p>` : ""}<p class="fr-hint fr-hint-left">Optional. Your answer is included in your report.</p></section>`;
      }
      if (question.type === "capacity") {
        const levels = ["Almost none", "Very little", "Some", "Enough", "Plenty"];
        return `<section class="fr-question" aria-labelledby="fr-q-${esc(question.id)}">${title}<div class="fr-options">${levels.map((label, i) => `<button class="fr-choice" type="button" data-action="answer" data-question="${esc(question.id)}" data-value="${i + 1}" aria-pressed="${selected === i + 1}"><b>${i + 1}</b>${label}</button>`).join("")}</div></section>`;
      }
      if (question.type === "multi") {
        const selectedValues = Array.isArray(selected) ? selected : [];
        return `<section class="fr-question" aria-labelledby="fr-q-${esc(question.id)}">${title}<div class="fr-choice-list">${question.options.map((option) => `<button class="fr-choice fr-choice-row" type="button" data-action="multi" data-question="${esc(question.id)}" data-value="${esc(option.value)}" aria-pressed="${selectedValues.includes(option.value)}">${esc(option.label)}</button>`).join("")}</div></section>`;
      }
      if (question.type === "choice") {
        return `<section class="fr-question" aria-labelledby="fr-q-${esc(question.id)}">${title}<div class="fr-choice-list">${question.options.map((option) => `<button class="fr-choice fr-choice-row" type="button" data-action="answer" data-question="${esc(question.id)}" data-value="${esc(option.value)}" aria-pressed="${selected === option.value}">${esc(option.label)}</button>`).join("")}</div></section>`;
      }
      if (question.type === "likert") {
        return `<section class="fr-question" aria-labelledby="fr-q-${esc(question.id)}">${title}<div class="fr-options">${LABELS.map((label, i) => `<button class="fr-choice" type="button" data-action="answer" data-question="${esc(question.id)}" data-value="${i + 1}" aria-pressed="${selected === i + 1}" aria-label="${i + 1}, ${label}"><b>${i + 1}</b>${label}</button>`).join("")}</div></section>`;
      }
      return "";
    }

    function renderModule(step) {
      const isSection = step.type === "section";
      const section = isSection ? SECTIONS.find((item) => item.id === step.id) : null;
      const module = isSection ? null : RETAKE_MODULES.find((item) => item.id === step.id);
      const questions = isSection ? sectionQuestions(section) : module.questions;
      const complete = isSection ? sectionComplete(section) : questions.every(questionComplete);
      const next = flow[state.step + 1];
      const nextLabel = next.type === "results" ? "See my results" : next.type === "hold" ? "Finish section" : "Next";
      const label = isSection ? `Section ${SECTIONS.indexOf(section) + 1} of ${SECTIONS.length}: ${section.name}` : `30-day retake: ${module.title}`;
      const scoredCount = questions.filter((question) => question.scored).length;
      body.innerHTML = `
        ${progressHeader(label)}
        <div class="fr-module"><h2 id="fr-dialog-title">${esc(isSection ? section.name : module.fullTitle)}</h2><p>${esc(isSection ? section.description : "This module was not covered in the workshop. Answer based on what you actually did last month.")}</p></div>
        ${questions.map(renderQuestion).join("")}
        <nav class="fr-nav" aria-label="Assessment navigation">
          <button class="fr-button fr-back" type="button" data-action="back">Back</button>
          <button class="fr-button" type="button" data-action="next" ${complete ? "" : "disabled"}>${nextLabel}</button>
        </nav>
        ${complete ? "" : `<p class="fr-hint">Complete the ${scoredCount} scored questions and required selections to continue.</p>`}`;
    }

    function bookingLink() {
      return BOOKING_URL || `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Founder readiness session")}`;
    }
    function frameworkLink() {
      return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("The Venture Validation Framework")}`;
    }
    function answerLabel(question, value) {
      if (question.type === "multi") return question.options.filter((option) => value?.includes(option.value)).map((option) => option.label);
      if (question.type === "choice") return question.options.find((option) => option.value === value)?.label ?? value;
      return value;
    }
    function answerRecord(question) {
      const value = state.answers[question.id];
      if (value === undefined || value === "" || value === null) return null;
      return { id: question.id, type: question.type, question: question.text, answer: answerLabel(question, value) };
    }
    function calculateReport() {
      const sectionScores = SECTIONS.map((section) => ({ id: section.id, title: section.name, pct: sectionScore(section) }));
      const retakeScores = state.retake ? RETAKE_MODULES.map((module) => ({ id: module.id, title: module.title, pct: retakeModuleScore(module) })) : [];
      const dimensions = [...sectionScores, ...retakeScores].filter((item) => item.pct !== null);
      const totalPct = Math.round(sectionScores.reduce((sum, item) => sum + item.pct, 0) / sectionScores.length);
      const sorted = [...sectionScores].sort((a, b) => a.pct - b.pct);
      const profile = PROFILES.find((item) => totalPct >= item.min);
      const capacitySection = SECTIONS.find((section) => section.id === "capacity");
      const capacityAccounts = capacitySection.questions.filter((question) => question.type === "capacity").map((question) => ({
        id: question.id, name: question.account, score: state.answers[question.id] ?? null
      }));
      const lowestCapacity = [...capacityAccounts].filter((item) => item.score !== null).sort((a, b) => a.score - b.score)[0] || null;
      const people = SECTIONS.find((section) => section.id === "people");
      const partnerQuestions = sectionQuestions(people).filter((question) => question.scored);
      const partnerGaps = partnerQuestions.filter((question) => {
        const value = state.answers[question.id];
        return value !== undefined && value !== "na" && value !== "yes";
      }).map((question) => ({ id: question.id, question: question.text, answer: answerLabel(question, state.answers[question.id]) }));
      const supportMap = people.supportMap.map((question) => ({ seat: question.text.split(":")[0], status: answerLabel(question, state.answers[question.id]) || "" }));
      const sectionAnswers = SECTIONS.map((section) => ({
        id: section.id,
        title: section.name,
        scorePct: sectionScore(section),
        answers: sectionQuestions(section).map(answerRecord).filter(Boolean)
      }));
      const reflections = Object.fromEntries(SECTIONS.map((section) => {
        const reflectionQuestion = section.id === "mindset"
          ? { id: "mindset-missing" }
          : section.id === "people" ? section.reflection : section.questions.find((question) => question.id.endsWith("-reflection"));
        return [section.id, state.answers[reflectionQuestion.id] || ""];
      }));
      const focus = [...sorted].slice(0, 2);
      const strengths = [...sorted].slice(-2).reverse();
      const gapFromStarting = totalPct - state.startingNumber;
      const gapFromBaseline = state.baselinePct === null ? null : totalPct - state.baselinePct;
      return {
        totalPct, profile, dimensions, sectionScores, retakeScores, focus, strengths,
        capacityAccounts, lowestCapacity, partnerStatus: state.answers["partner-status"] || "",
        partnerGaps, supportMap, emptySupportSeats: supportMap.filter((seat) => seat.status === "Empty").map((seat) => seat.seat),
        sectionAnswers, reflections, firstAssignment: state.answers["mindset-missing"] || "",
        gapFromStarting, gapFromBaseline
      };
    }
    function resultPayload(report) {
      const capacitySection = SECTIONS.find((section) => section.id === "capacity");
      const peopleSection = SECTIONS.find((section) => section.id === "people");
      return {
        schemaVersion: 3,
        attemptId: state.attemptId,
        mode: state.retake ? "retake" : "workshop",
        name: state.name,
        email: state.email,
        startingNumberPct: state.startingNumber,
        baselineScorePct: state.baselinePct,
        finalScorePct: report.totalPct,
        gapFromStartingNumberPct: report.gapFromStarting,
        gapFromBaselinePct: report.gapFromBaseline,
        profile: { label: report.profile.label, summary: report.profile.summary, nextStep: report.profile.next },
        sectionScores: report.sectionScores,
        sectionAnswers: report.sectionAnswers,
        retakeModuleScores: report.retakeScores,
        strengths: report.strengths.map((item) => item.title),
        focusAreas: report.focus.map((item) => item.title),
        capacity: {
          inventory: report.capacityAccounts,
          constraint: report.lowestCapacity,
          hoursLastMonth: answerLabel(capacitySection.questions.find((question) => question.id === "capacity-hours"), state.answers["capacity-hours"]),
          runwayMonths: answerLabel(capacitySection.questions.find((question) => question.id === "capacity-runway"), state.answers["capacity-runway"]),
          unownedWorkResponse: answerLabel(capacitySection.questions.find((question) => question.id === "capacity-owner"), state.answers["capacity-owner"]),
          homework: "30-Day Experiment: Live the schedule your audit says you'll need for 30 days before committing years."
        },
        partner: {
          status: report.partnerStatus,
          validationAnswers: sectionQuestions(peopleSection).filter((question) => question.scored).map(answerRecord).filter(Boolean),
          unvalidatedItems: report.partnerGaps
        },
        supportMap: report.supportMap,
        emptySupportSeats: report.emptySupportSeats,
        sectionReflections: report.reflections,
        firstAssignment: report.firstAssignment,
        retakeModuleAnswers: state.retake ? RETAKE_MODULES.map((module) => ({ id: module.id, title: module.title, answers: module.questions.map(answerRecord).filter(Boolean) })) : [],
        bookingUrl: bookingLink(),
        frameworkUrl: frameworkLink(),
        submittedAt: new Date().toISOString(),
        completedAt: state.completedAt
      };
    }
    function send(payload) {
      if (!RESULTS_ENDPOINT) return Promise.resolve(false);
      return fetch(RESULTS_ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
        .then(() => true).catch(() => false);
    }

    function renderResults() {
      const report = calculateReport();
      state.scorePct = report.totalPct;
      if (!state.completedAt) state.completedAt = new Date().toISOString();
      if (!state.sent) {
        state.sent = true;
        save();
        send(resultPayload(report));
      }
      const rows = report.dimensions.map((item) => `<div class="fr-score-row"><div class="fr-score-head"><span>${esc(item.title)}</span><span>${item.pct}%</span></div><div class="fr-score-track"><span style="width:${item.pct}%"></span></div></div>`).join("");
      const reflections = report.sectionAnswers.map((section) => {
        const items = section.answers.filter((item) => item.id.endsWith("reflection") || item.id === "mindset-missing" || item.id === "why-sentence" || item.id === "why-timing" || item.id === "reality-protect" || item.id === "reality-q3" || item.id === "sustain-care");
        return items.length ? `<section class="fr-result-block"><h3>${esc(section.title)}</h3>${items.map((item) => `<p class="fr-reflection"><span>${esc(item.question)}</span>${esc(Array.isArray(item.answer) ? item.answer.join(", ") : item.answer)}</p>`).join("")}</section>` : "";
      }).join("");
      const emptySeats = report.emptySupportSeats.length ? report.emptySupportSeats.join(", ") : "None";
      const partnerGaps = report.partnerGaps.length ? report.partnerGaps.map((item) => `<p class="fr-reflection"><span>${esc(item.question)}</span>${esc(item.answer)}</p>`).join("") : "No unvalidated partner items reported.";
      const startingGap = report.gapFromStarting >= 0 ? `+${report.gapFromStarting}` : `${report.gapFromStarting}`;
      const baseline = state.baselinePct === null ? "" : `<p class="fr-copy">Change from your previous score baseline (${state.baselinePct}%): ${report.gapFromBaseline >= 0 ? "+" : ""}${report.gapFromBaseline} points.</p>`;
      const dimensionsLabel = state.retake ? "Six workshop sections plus retake modules" : "Six workshop sections";
      const assignment = report.firstAssignment || "Choose one item from your missing 30% and make it your first concrete step.";
      const emailNote = RESULTS_ENDPOINT ? `<p class="fr-sent" role="status">Your full report is on its way to ${esc(state.email)}.</p>` : "";
      const retakeCopy = state.retake
        ? "Your 30-day retake includes Leadership and Daily Rhythm, the two modules not covered in the workshop."
        : `Retake in 30 days with tonight's ${report.totalPct}% score as your baseline. The retake adds Leadership and Daily Rhythm.`;
      body.innerHTML = `
        <p class="fr-eyebrow">${esc(state.name)}, your founder readiness profile</p>
        <h1 class="fr-title" id="fr-dialog-title">${esc(report.profile.label)}</h1>
        <div class="fr-result-score"><strong>${report.totalPct}%</strong><span>overall readiness</span></div>
        <p class="fr-gap">Starting number: ${state.startingNumber}%. Final score: ${report.totalPct}%. Gap: ${startingGap} points.</p>
        ${baseline}
        <p class="fr-copy">${esc(report.profile.summary)}</p>
        <section class="fr-result-block"><h3>Your first assignment: missing 30%</h3><p>${esc(assignment)}</p></section>
        ${report.lowestCapacity ? `<section class="fr-result-block"><h3>Capacity constraint</h3><p>${esc(report.lowestCapacity.name)} (${report.lowestCapacity.score}/5)</p></section>` : ""}
        <section class="fr-result-block"><h3>Gaps to fill before you launch</h3><p>${esc(emptySeats)}</p></section>
        <section class="fr-result-block"><h3>Co-founder / partner items to validate</h3>${partnerGaps}</section>
        <section class="fr-result-block"><h3>30-Day Experiment</h3><p>Live the schedule your audit says you'll need for 30 days before committing years.</p></section>
        <div class="fr-cta">
          <a class="fr-button" href="${esc(bookingLink())}" target="_blank" rel="noopener">Book a session</a>
          <a class="fr-button fr-back" href="${esc(frameworkLink())}" target="_blank" rel="noopener">Get the Venture Validation Framework</a>
        </div>
        <p class="fr-copy fr-next">${esc(report.profile.next)}</p>
        ${emailNote}
        <section class="fr-breakdown"><h3>Readiness by dimension: ${dimensionsLabel}</h3>${rows}</section>
        <div class="fr-highlights"><section><h3>Your strengths</h3>${report.strengths.map((item) => `<p>${esc(item.title)}</p>`).join("")}</section><section><h3>Focus areas</h3>${report.focus.map((item) => `<p>${esc(item.title)}</p>`).join("")}</section></div>
        ${reflections}
        <section class="fr-result-block"><h3>In 30 days</h3><p>${esc(retakeCopy)}</p></section>
        <p class="fr-quote">"The biggest risk in entrepreneurship is not that your startup fails. The biggest risk is becoming disconnected from yourself while trying to build it."</p>
        <nav class="fr-nav" aria-label="Results actions"><button class="fr-button fr-back" type="button" data-action="retake">${state.retake ? "Start another attempt" : "Begin 30-day retake"}</button></nav>`;
    }

    function render(message = "") {
      const step = flow[state.step];
      if (step.type === "details") renderDetails(message);
      else if (step.type === "checkin") renderCheckin();
      else if (step.type === "hold") renderHold(step, message);
      else if (step.type === "section" || step.type === "retakeModule") renderModule(step);
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
        attemptStore = readAttemptStore();
        const current = attemptStore.attempts.find((attempt) => attempt.attemptId === attemptStore.currentAttemptId);
        if (current) {
          state = JSON.parse(JSON.stringify(current));
          flow = buildFlow();
        } else {
          beginAttempt();
        }
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

    body.addEventListener("input", (event) => {
      const slider = event.target.closest(".fr-slider");
      if (!slider) return;
      state.startingNumber = Number(slider.value);
      body.querySelector("#fr-starting-output").textContent = `${state.startingNumber}%`;
      body.querySelector('[data-action="next"]').disabled = false;
      save();
    });

    body.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control || control.disabled) return;
      const { action } = control.dataset;
      if (action === "answer") {
        const scrollTop = body.scrollTop;
        const question = findQuestion(control.dataset.question);
        const numeric = question?.type === "likert" || question?.type === "capacity";
        state.answers[control.dataset.question] = numeric ? Number(control.dataset.value) : control.dataset.value;
        save();
        render();
        body.scrollTop = scrollTop;
      } else if (action === "multi") {
        const current = Array.isArray(state.answers[control.dataset.question]) ? state.answers[control.dataset.question] : [];
        const value = control.dataset.value;
        let selected = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
        if (value === "none" && selected.includes("none")) selected = ["none"];
        else if (value !== "none") selected = selected.filter((item) => item !== "none");
        state.answers[control.dataset.question] = selected;
        save();
        render();
      } else if (action === "back") {
        go(-1);
      } else if (action === "next") {
        advance();
      } else if (action === "retake") {
        const { name, email } = state;
        const baselinePct = calculateReport().totalPct;
        beginAttempt({ name, email, retake: true, baselinePct });
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
