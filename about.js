(() => {
  function init() {
    const hero = document.querySelector("main.hero");
    const portfolio = hero && hero.querySelector(".portfolio");
    const assessment = hero && hero.querySelector(".fr-assessment");
    if (!hero || !portfolio || !assessment) {
      console.error("About section could not be added: homepage elements not found.");
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      .about{width:100%;margin-top:clamp(48px,7vw,72px);padding-top:clamp(32px,5vw,48px);text-align:left;scroll-margin-top:24px}
      .about-layout{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);align-items:stretch;gap:clamp(24px,5vw,48px)}
      .about-content{display:flex;flex-direction:column;align-items:flex-start}
      .about-portrait{width:100%;max-width:320px}
      .about-photo{width:100%;aspect-ratio:4/5;overflow:hidden;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.025);display:flex;align-items:center;justify-content:center}
      .about-photo img{width:100%;height:100%;object-fit:cover}
      .about-photo img[hidden]{display:none}
      .about-placeholder{padding:24px;color:var(--cream-300);font-size:13px;text-align:center;line-height:1.6}
      .about-placeholder[hidden]{display:none}
      .about-credentials{list-style:none;padding:0;margin:16px 0 0;color:var(--gold-300);font-size:10px;font-weight:600;letter-spacing:.14em;line-height:1.6;text-transform:uppercase}
      .about-credentials li{padding:10px 0}
      .about-credentials a{color:inherit;text-decoration:none}
      .about-credentials a:hover{text-decoration:underline}
      .about-credentials a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .about h2{margin:0 0 16px;color:var(--cream-100);font-family:'Hanken Grotesk',sans-serif;font-size:clamp(1.6rem,2.7vw,2rem);line-height:1.12}
      .about-subhead,.about-copy p{margin:0 0 16px;color:var(--cream-100);font-size:14px;line-height:1.7}
      .about-subhead{color:var(--gold-300);font-weight:600}
      .about-engagements-label{margin:8px 0 8px;color:var(--gold-300);font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
      .about-engagements-copy{margin:0;color:var(--cream-100);font-size:13px;line-height:1.7}
      .about-actions{display:flex;align-items:center;flex-wrap:wrap;gap:20px;margin-top:24px}
      .about-contact{display:flex;align-items:center;gap:16px}
      .about-contact .social{margin:0;opacity:1;animation:none}
      .about-contact .social a{width:28px;height:28px}
      .about-contact .social a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .about-button{display:inline-block;width:auto;margin:0;text-align:center;text-decoration:none}
      .about-primary{padding:14px 22px;transition:background .2s ease,transform .2s ease,box-shadow .2s ease}
      .about-primary:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(189,146,80,.25)}
      .about-button:focus-visible,.about-copy a:focus-visible,.about-credentials a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .about-copy a{color:var(--gold-300)}
      .hero .portfolio{max-width:none;margin-top:clamp(64px,8vw,96px);padding-top:clamp(48px,6vw,72px);text-align:center}
      .portfolio .portfolio-label{margin:0 0 clamp(44px,5vw,56px);color:var(--cream-100);font-family:'Hanken Grotesk',sans-serif;font-size:clamp(1.6rem,2.7vw,2rem);font-weight:700;letter-spacing:normal;line-height:1.12;text-transform:none}
      .portfolio-links{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:start;gap:clamp(16px,3vw,32px)}
      .portfolio-links a{height:100%;min-width:0;text-align:center}
      .portfolio-links .mark{width:64px;height:64px}
      .portfolio-links .name{font-size:14px;font-weight:600}
      .portfolio-role{color:var(--gold-300);font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
      .portfolio-description{color:rgba(245,240,227,.7);font-size:12px;line-height:1.5}
      .speaking-dialog{width:calc(100% - 32px);max-width:520px;max-height:calc(100dvh - 32px);padding:36px 32px 30px;border:1px solid var(--line);border-radius:10px;background:var(--navy-800);color:var(--cream-100);box-shadow:0 24px 60px rgba(0,0,0,.45)}
      .speaking-dialog::backdrop{background:rgba(0,0,0,.72)}
      .speaking-dialog .field select{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:6px;background:var(--navy-800);color:var(--cream-100);font:inherit;font-size:16px}
      .speaking-dialog .field input,.speaking-dialog .field textarea{font-size:16px}
      .speaking-dialog :focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .speaking-dialog [hidden]{display:none}
      .speaking-dialog .form-error a{color:var(--gold-300)}
      @media(min-width:601px){.about-portrait{display:flex;flex-direction:column}.about-contact{margin-top:auto;padding-top:8px}.about-contact .social{display:flex}.about-actions{margin-top:auto;padding-top:24px}}
      @media(max-width:520px){.speaking-dialog{padding:32px 20px 24px}}
      @media(max-width:600px){.about-layout{grid-template-columns:1fr}.about-portrait{margin:auto}.about-actions{align-items:flex-start;flex-direction:column}.portfolio-links{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(prefers-reduced-motion:reduce){.about-primary{transition:none}.about-primary:hover{transform:none}}
    `;
    document.head.append(style);

    const section = document.createElement("section");
    section.className = "about";
    section.id = "about";
    section.setAttribute("aria-labelledby", "about-title");
    section.innerHTML = `
      <div class="about-layout">
        <div class="about-portrait">
          <div class="about-photo">
            <img src="/images/melissa-wood.jpg" alt="Melissa Wood, Founder of Curaite" width="768" height="956">
            <span class="about-placeholder" hidden>Headshot coming soon</span>
          </div>
          <ul class="about-credentials">
            <li><a href="https://www.forbes.com/advisor/business/ai/lovable-review/" target="_blank" rel="noopener noreferrer">Quoted in Forbes Advisor, 2026 <span aria-hidden="true">&rarr;</span></a></li>
          </ul>
          <div class="about-contact"></div>
        </div>
        <div class="about-content">
          <h2 id="about-title">Hi! I'm Melissa (Missy) Wood</h2>
          <p class="about-subhead">Founder of Curaite | SXSW Startup Mentor | FIESTA Board Advisor</p>
          <div class="about-copy">
            <p>I’m a serial entrepreneur with 30 years in startups, including work with companies acquired by Apple and Google. My most recent, Curaite, reached 3,400 users in its first 3 weeks.</p>
            <p>I’m a GRITS girl: Girl Raised in the South. I learned early to work hard, show up for people, and keep going when it gets tough.</p>
            <p>I created the Venture Validation Framework™ to give first-time founders honest answers early, so they can validate fast, bring the right people with them, and build with that same grit.</p>
          </div>
          <p class="about-engagements-label">Recent speaking engagements</p>
          <p class="about-engagements-copy">SXSW · FIESTA · Austin Tech Week, Women in Tech Kickoff · University of Illinois MBA · Creative Collective Founders Night · BBB AI Made Practical Conference</p>
          <div class="about-actions">
            <button class="submit-btn about-button about-primary" type="button" aria-haspopup="dialog">Book me to speak <span aria-hidden="true">&rarr;</span></button>
            <a class="submit-btn about-button about-secondary" href="https://calendly.com/melissawood-missyve/virtual-coffee-with-melissa?back=1&amp;month=2026-11" target="_blank" rel="noopener noreferrer">Book Virtual Chat</a>
          </div>
        </div>
      </div>`;
    const photo = section.querySelector(".about-photo img");
    const placeholder = section.querySelector(".about-placeholder");
    photo.addEventListener("error", () => {
      photo.hidden = true;
      placeholder.hidden = false;
    });
    const footer = hero.querySelector(".fr-footer");
    const social = footer && footer.querySelector(".social");
    const footerRow = footer && footer.querySelector(".fr-footer-row");
    const contactLabel = footer && footer.querySelector(".fr-contact-label");
    if (social && footerRow && contactLabel) {
      section.querySelector(".about-contact").append(social);
      footerRow.remove();
      contactLabel.remove();
    } else {
      console.error("Could not move the footer contact links to the About section.");
    }
    portfolio.before(section);
    const portfolioLabel = portfolio.querySelector(".portfolio-label");
    if (portfolioLabel) {
      const heading = document.createElement("h2");
      heading.className = portfolioLabel.className;
      heading.id = "portfolio-title";
      heading.textContent = "Ventures";
      portfolioLabel.replaceWith(heading);
      portfolio.setAttribute("role", "region");
      portfolio.setAttribute("aria-labelledby", heading.id);
    } else {
      console.error("Portfolio title could not be updated: label not found.");
    }
    const companies = [
      { host: "curaite.events", role: "Founder", description: "AI event discovery app with 3,400+ users in its first 3 weeks of launch." },
      { host: "thefridgeschedule.com", role: "Founder", description: "The AI family calendar families love and even teens will use." },
      { host: "formus.ai", role: "Founder", description: "AI platform that streamlined home renovation workflows." },
      { host: "intruckmba.com", role: "Co-founder", description: "Podcast and workshops for tradesmen going out on their own." }
    ];
    for (const company of companies) {
      const link = Array.from(portfolio.querySelectorAll(".portfolio-links a")).find((item) => new URL(item.href).hostname === company.host);
      if (!link) {
        console.error(`Portfolio tile not found: ${company.host}`);
        continue;
      }
      link.href = `https://${company.host}/`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const name = link.querySelector(".name").textContent;
      link.setAttribute("aria-label", `${name}, ${company.role}. ${company.description}`);
      link.title = company.description;
      const role = document.createElement("span");
      role.className = "portfolio-role";
      role.textContent = company.role;
      const description = document.createElement("span");
      description.className = "portfolio-description";
      description.textContent = company.description;
      link.append(role, description);
    }

    const dialog = document.createElement("dialog");
    dialog.className = "speaking-dialog";
    dialog.setAttribute("aria-labelledby", "speaking-dialog-title");
    dialog.innerHTML = `
      <button class="modal-close" type="button" aria-label="Close speaking request">&times;</button>
      <h2 class="modal-title" id="speaking-dialog-title">Book Melissa to speak</h2>
      <div class="speaking-form-content">
        <p class="modal-eyebrow">Speaking inquiry</p>
        <form id="speakingForm">
          <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name" maxlength="200" required autofocus></label>
          <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" maxlength="254" required></label>
          <label class="field"><span>Organization</span><input type="text" name="organization" autocomplete="organization" maxlength="200" required></label>
          <label class="field"><span>Event date (optional)</span><input type="date" name="eventDate"></label>
          <label class="field"><span>Expected audience size (optional)</span><select name="audience"><option value="">Select an audience size</option><option>Under 25</option><option>25 to 50</option><option>50 to 100</option><option>100+</option></select></label>
          <label class="field"><span>Format</span><select name="format" required><option value="">Select a format</option><option>Keynote</option><option>Workshop</option><option>Fireside Chat</option><option>Panel</option><option>Class Lecture</option><option>Not sure yet</option></select></label>
          <label class="field"><span>Anything else I should know (optional)</span><textarea name="notes" rows="4" maxlength="5000"></textarea></label>
          <input type="text" name="_honey" tabindex="-1" autocomplete="off" hidden>
          <input type="hidden" name="_subject" value="Speaking request from MissyVe">
          <button type="submit" class="submit-btn">Send request</button>
          <p class="form-error" role="alert"></p>
        </form>
      </div>
      <div class="modal-success" role="status" tabindex="-1" hidden>
        <p class="success-title">Request sent</p>
        <p class="success-text">Thank you. I'll be in touch soon.</p>
      </div>`;
    document.body.append(dialog);
    const speakingButton = section.querySelector(".about-primary");
    speakingButton.addEventListener("click", () => {
      if (!dialog.open) {
        const confirmation = dialog.querySelector(".modal-success");
        if (!confirmation.hidden) {
          confirmation.hidden = true;
          dialog.querySelector(".speaking-form-content").hidden = false;
        }
        dialog.showModal();
      }
    });
    dialog.querySelector(".modal-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener("close", () => speakingButton.focus());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
