(() => {
  const ACCESS_CODE = "femmefounders26";
  const LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  const MODULES = [
    {
      title: "Why Found?",
      fullTitle: "Why Do You Want to Be a Founder?",
      description: "Understanding your core motivation is the foundation of everything. Founders who know their why outlast those who don't.",
      questions: [
        "I can clearly articulate a specific problem I want to solve, and it matters deeply to me personally.",
        "My desire to build a company comes from an internal drive rather than external pressures like status or financial gain.",
        "I have a clear personal definition of what success looks like beyond revenue or valuation."
      ]
    },
    {
      title: "Reality Check",
      fullTitle: "Understanding the Founder Reality",
      description: "Entrepreneurship is an emotional rollercoaster. Honest self-awareness about what it actually demands is not optional.",
      questions: [
        "I've genuinely considered what I'm willing to sacrifice: time, income, relationships, and feel at peace with those tradeoffs.",
        "I can tolerate long periods of uncertainty and ambiguity without being paralyzed.",
        "The people closest to me understand and support my entrepreneurial ambitions."
      ]
    },
    {
      title: "Mindset",
      fullTitle: "Mindset Shifts for Entrepreneurship",
      description: "The right mental frameworks separate founders who adapt from those who quit. You don't need to feel ready to begin.",
      questions: [
        "When I fail or receive criticism, I view it as data to learn from, not a reflection of my worth.",
        "I can take meaningful action despite feeling uncertain or unqualified.",
        "I consistently choose progress and iteration over waiting for the perfect moment."
      ]
    },
    {
      title: "Capacity",
      fullTitle: "Commitment & Capacity",
      description: "Wanting to be a founder isn't enough. Do you actually have the time, energy, and financial runway to pursue this?",
      questions: [
        "I have a realistic understanding of the financial runway I need and a clear plan to sustain myself.",
        "I can honestly commit significant time per week to building, and I know what I'd stop doing to make room.",
        "I want the outcome enough to endure the difficult, unglamorous work of getting there."
      ]
    },
    {
      title: "Support Systems",
      fullTitle: "Founder Support Systems",
      description: "No founder builds alone. The quality of your support network directly impacts your odds of success.",
      questions: [
        "I have at least one mentor or advisor who has been through the entrepreneurial journey and can provide guidance.",
        "I'm part of, or actively building, a peer community of other founders or aspiring entrepreneurs.",
        "I have someone who holds me accountable to my commitments and gives me honest, direct feedback."
      ]
    },
    {
      title: "Co-Founder Fit",
      fullTitle: "Co-Founder Alignment",
      description: "Co-founder breakups kill more startups than bad ideas. Whether solo or paired, clarity here is essential.",
      questions: [
        "I've had explicit conversations about values, roles, equity, and expectations with any potential co-founders.",
        "I know how I handle conflict and have a clear process for navigating disagreement with a partner.",
        "I can build and lead effectively even if I'm currently doing this alone."
      ]
    },
    {
      title: "Well-Being",
      fullTitle: "Founder Well-Being & Sustainability",
      description: "The founder is the company's most important asset. Neglecting yourself is not a badge of honor; it's a liability.",
      questions: [
        "I have consistent habits, including sleep, movement, and nutrition, that give me the energy to perform at my best.",
        "I know my warning signs for burnout and have strategies to recover before it becomes a crisis.",
        "I can set and hold boundaries around my time and energy, even when things get hectic."
      ]
    },
    {
      title: "Resilience",
      fullTitle: "Resilience & Failure",
      description: "Things will go wrong. Your ability to recover and keep moving is more important than avoiding failure.",
      questions: [
        "I have real examples from my life where I bounced back from a significant setback and grew from it.",
        "I can treat failure as data and reflect on what went wrong without spiraling into self-blame.",
        "I can maintain forward momentum even when results are disappointing or timelines slip."
      ]
    },
    {
      title: "Leadership",
      fullTitle: "Leadership & Decision-Making",
      description: "Founders are decision-making machines. Leading yourself and others under uncertainty is a learnable skill.",
      questions: [
        "I can make decisions quickly with incomplete information; I don't wait for certainty before acting.",
        "I hold myself accountable to my commitments and can model that accountability for others.",
        "My values are clear enough that I can use them as a filter when making hard calls under pressure."
      ]
    },
    {
      title: "Daily Rhythm",
      fullTitle: "Building a Founder Rhythm",
      description: "Entrepreneurship is a marathon, not a sprint. The daily and weekly rhythms you build now will sustain you for years.",
      questions: [
        "I have a regular reflection practice, like journaling or weekly reviews, that helps me stay intentional.",
        "I celebrate small wins and milestones; I don't just keep moving the goalposts without acknowledgment.",
        "I actively invest in my own learning and development on a consistent, ongoing basis."
      ]
    }
  ];

  const PROFILES = [
    {
      min: 85,
      label: "Primed to Launch",
      summary: "You demonstrate exceptional readiness across nearly all founder dimensions. Your self-awareness, mindset, and foundational habits position you strongly for the entrepreneurial journey ahead.",
      next: "You're ready. Focus on validating your riskiest assumptions, talking to customers, and taking the first concrete step toward building."
    },
    {
      min: 70,
      label: "Ready Founder",
      summary: "You have solid foundations across most areas of founder readiness. A few gaps remain, but none are disqualifying. With intentional work over the next 60 days, you can close them.",
      next: "Identify your two lowest-scoring modules and spend 30 days building deliberate habits in those specific areas before fully launching."
    },
    {
      min: 55,
      label: "Emerging Founder",
      summary: "You have real entrepreneurial potential, but there are meaningful gaps between where you are and where the journey will demand you be. The good news: every one of these areas is learnable.",
      next: "Focus on your three lowest-scoring modules. Find a mentor, join a founder community, and consider a 30-day founder experiment to start building momentum."
    },
    {
      min: 40,
      label: "Aspiring Founder",
      summary: "You're drawn to entrepreneurship but haven't yet built the inner infrastructure the journey truly demands. This isn't a no; it's a not yet, and here's exactly what to work on.",
      next: "Before pursuing your idea, invest in your mindset and support systems. Work through this workshop module by module and build your foundation over the next 90 days."
    },
    {
      min: 0,
      label: "Early Explorer",
      summary: "You're at the very beginning of your founder readiness journey. The most important thing you can do right now is deepen your self-awareness and get honest about your motivations.",
      next: "Work through this workshop module by module with genuine reflection. Find a community of aspiring founders and give yourself 90 days of intentional preparation."
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
      .fr-home-break{width:100%;max-width:420px;height:clamp(24px,4vw,32px);margin-top:clamp(32px,5vw,48px);flex:none;border-top:1px solid var(--line)}
      .fr-footer{display:flex;width:100%;flex-direction:column;align-items:center;gap:12px}
      .fr-contact-label{margin:0;color:#B9B2A0;font-size:11px}
      .fr-footer-row{display:flex;align-items:center;justify-content:center;gap:clamp(18px,3vw,34px);flex-wrap:wrap}
      .fr-footer .fr-contact{margin:0;flex-direction:row;align-items:center;gap:8px}
      .fr-footer .social{margin:0}
      .fr-copyright{margin:0;color:#B9B2A0;font-size:10px}
      @media(min-width:768px){.page{align-items:flex-start;padding-top:clamp(48px,8vh,88px);padding-bottom:32px}main.hero{width:100%}}
      @media(max-width:520px){.fr-overlay{padding:10px}.fr-panel{max-height:calc(100vh - 20px)}.fr-top{padding:14px 18px}.fr-content{padding:22px 18px}.fr-form{flex-direction:column}.fr-form .fr-button{width:100%}.fr-options{gap:4px}.fr-choice{min-height:70px;padding:7px 2px;font-size:9px}.fr-question{padding:16px}.fr-module{padding:18px}.fr-highlights{gap:14px}.fr-footer-row{gap:16px}}
      @media(prefers-reduced-motion:reduce){.fr-progress-fill,.fr-button{transition:none}}
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
    const state = { currentModule: 0, answers: {}, completed: false };

    function getModuleScores() {
      return MODULES.map((module) => ({
        module,
        score: module.questions.reduce((total, question, index) => total + (state.answers[`${MODULES.indexOf(module)}-${index}`] || 0), 0)
      }));
    }

    function renderGate(message = "") {
      body.innerHTML = `
        <div class="fr-gate">
          <p class="fr-eyebrow">Private assessment</p>
          <h1 class="fr-title" id="fr-dialog-title">Founder Readiness</h1>
          <p class="fr-copy">Enter your access code to begin a 30-question reflection across 10 dimensions of founder readiness. Your answers stay in this browser session.</p>
          <form class="fr-form" data-form="access">
            <input class="fr-code" type="password" name="code" autocomplete="off" placeholder="Access code" aria-label="Access code" required>
            <button class="fr-button" type="submit">Continue</button>
          </form>
          <p class="fr-error" role="alert">${message}</p>
        </div>`;
      body.querySelector("input").focus();
    }

    function renderQuiz() {
      const module = MODULES[state.currentModule];
      const isComplete = module.questions.every((_, index) => state.answers[`${state.currentModule}-${index}`] !== undefined);
      const progress = Math.round((state.currentModule / MODULES.length) * 100);
      const questions = module.questions.map((question, questionIndex) => {
        const answerKey = `${state.currentModule}-${questionIndex}`;
        const selected = state.answers[answerKey];
        const choices = LABELS.map((label, index) => {
          const value = index + 1;
          return `<button class="fr-choice" type="button" data-action="answer" data-question="${answerKey}" data-value="${value}" aria-pressed="${selected === value}" aria-label="${value}, ${label}"><b>${value}</b>${label}</button>`;
        }).join("");
        return `<section class="fr-question" aria-labelledby="fr-question-${questionIndex}"><h3 class="fr-question-title" id="fr-question-${questionIndex}"><span class="fr-number">${questionIndex + 1}</span>${question}</h3><div class="fr-options" aria-label="Choose a response">${choices}</div></section>`;
      }).join("");

      body.innerHTML = `
        <p class="fr-eyebrow">Module ${state.currentModule + 1} of ${MODULES.length}</p>
        <div class="fr-progress-label"><span>${module.title}</span><span>${progress}% complete</span></div>
        <div class="fr-progress-track" role="progressbar" aria-label="Assessment progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div class="fr-progress-fill" style="width:${progress}%"></div></div>
        <div class="fr-module"><p class="fr-eyebrow">Dimension ${state.currentModule + 1}</p><h2 id="fr-dialog-title">${module.fullTitle}</h2><p>${module.description}</p></div>
        ${questions}
        <nav class="fr-nav" aria-label="Assessment navigation">
          ${state.currentModule > 0 ? '<button class="fr-button fr-back" type="button" data-action="back">&larr; Back</button>' : ""}
          <button class="fr-button" type="button" data-action="next" ${isComplete ? "" : "disabled"}>${state.currentModule === MODULES.length - 1 ? "See my results" : "Next module"} &rarr;</button>
        </nav>
        ${isComplete ? "" : '<p class="fr-hint">Answer all 3 questions to continue.</p>'}`;
    }

    function renderResults() {
      const moduleScores = getModuleScores();
      const totalScore = moduleScores.reduce((total, item) => total + item.score, 0);
      const totalPct = Math.round((totalScore / 150) * 100);
      const profile = PROFILES.find((item) => totalPct >= item.min);
      const sorted = [...moduleScores].sort((a, b) => a.score - b.score);
      const weakest = sorted.slice(0, 3);
      const strongest = sorted.slice(-2).reverse();
      const rows = moduleScores.map(({ module, score }) => {
        const percent = Math.round((score / 15) * 100);
        return `<div class="fr-score-row"><div class="fr-score-head"><span>${module.fullTitle}</span><span>${percent}%</span></div><div class="fr-score-track"><span style="width:${percent}%"></span></div></div>`;
      }).join("");

      body.innerHTML = `
        <p class="fr-eyebrow">Your founder readiness profile</p>
        <h1 class="fr-title" id="fr-dialog-title">${profile.label}</h1>
        <div class="fr-result-score"><strong>${totalPct}%</strong><span>overall readiness</span></div>
        <p class="fr-copy">${profile.summary}</p>
        <section class="fr-result-block"><h3>Your next step</h3><p>${profile.next}</p></section>
        <section class="fr-breakdown"><h3>Readiness by dimension</h3>${rows}</section>
        <div class="fr-highlights"><section><h3>Your strengths</h3>${strongest.map(({ module }) => `<p>${module.title}</p>`).join("")}</section><section><h3>Focus areas</h3>${weakest.map(({ module }) => `<p>${module.title}</p>`).join("")}</section></div>
        <p class="fr-quote">"The biggest risk in entrepreneurship is not that your startup fails. The biggest risk is becoming disconnected from yourself while trying to build it."</p>
        <nav class="fr-nav" aria-label="Results actions"><button class="fr-button fr-back" type="button" data-action="retake">Retake assessment</button></nav>`;
    }

    function render() {
      if (state.completed) renderResults();
      else renderQuiz();
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
      if (event.target.dataset.form !== "access") return;
      event.preventDefault();
      const code = new FormData(event.target).get("code").trim();
      if (code !== ACCESS_CODE) {
        renderGate("That code didn't work. Check it and try again.");
        return;
      }
      if (state.completed) renderResults();
      else renderQuiz();
    });

    body.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control) return;
      const { action } = control.dataset;
      if (action === "answer") {
        state.answers[control.dataset.question] = Number(control.dataset.value);
        renderQuiz();
      } else if (action === "back" && state.currentModule > 0) {
        state.currentModule -= 1;
        renderQuiz();
      } else if (action === "next") {
        if (state.currentModule === MODULES.length - 1) {
          state.completed = true;
          renderResults();
        } else {
          state.currentModule += 1;
          renderQuiz();
          body.scrollTop = 0;
        }
      } else if (action === "retake") {
        state.answers = {};
        state.currentModule = 0;
        state.completed = false;
        renderQuiz();
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
