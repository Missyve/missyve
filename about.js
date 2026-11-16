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
      .about-credentials li{padding:10px 0;border-bottom:1px solid var(--line)}
      .about-credentials a{color:inherit;text-decoration:none}
      .about-credentials a:hover{text-decoration:underline}
      .about-credentials a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .about h2{margin:0 0 16px;color:var(--cream-100);font-family:'Hanken Grotesk',sans-serif;font-size:clamp(1.6rem,2.7vw,2rem);line-height:1.12}
      .about-subhead,.about-copy p{margin:0 0 16px;color:var(--cream-100);font-size:14px;line-height:1.7}
      .about-subhead{color:var(--gold-300);font-weight:600}
      .about-actions{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:24px}
      .about-contact{display:flex;align-items:center;gap:16px}
      .about-contact .social{margin:0;opacity:1;animation:none}
      .about-contact .social a{width:28px;height:28px}
      .about-contact .social a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .about-button{display:inline-block;width:auto;margin:0;text-align:center;text-decoration:none}
      .about-primary{padding:14px 22px;transition:background .2s ease,transform .2s ease,box-shadow .2s ease}
      .about-primary:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(198,161,91,.25)}
      .about-secondary{background:transparent;border:1px solid var(--gold-500);color:var(--cream-100)}
      .about-secondary:hover:not(:disabled){background:rgba(198,161,91,.15)}
      .about-button:focus-visible,.about-copy a:focus-visible,.about-credentials a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .about-copy a{color:var(--gold-300)}
      .about-content .portfolio{max-width:100%;border-top:0;text-align:left}
      .about-content .portfolio-links{justify-content:flex-start;flex-wrap:wrap}
      @media(max-width:600px){.about-layout{grid-template-columns:1fr}.about-portrait{margin:auto}.about-actions{align-items:flex-start;flex-direction:column}}
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
            <li><a href="https://www.forbes.com/advisor/business/ai/lovable-review/?" target="_blank" rel="noopener noreferrer">Quoted in Forbes Advisor, 2026 <span aria-hidden="true">&rarr;</span></a></li>
            <li>SXSW Startup Mentor</li>
            <li><a href="https://fiesta.community" target="_blank" rel="noopener noreferrer">FIESTA</a> Board Advisor</li>
          </ul>
        </div>
        <div class="about-content">
          <h2 id="about-title">Meet Melissa (Missy) Wood</h2>
          <p class="about-subhead">Founder of Curaite | Creator of the Venture Validation Framework™</p>
          <div class="about-copy">
            <p>Award-winning serial entrepreneur with 30 years in entrepreneurship, including work with startups acquired by Apple and Google. My recent startup, Curaite, reached 3,400 users in 3 weeks, and now I help first-time founders validate fast, build smart, and bring the right people with them. I'm an official SXSW Startup Mentor and a FIESTA Board Advisor, leading FIESTA's expansion to Round Rock.</p>
          </div>
          <div class="about-actions">
            <a class="submit-btn about-button about-primary" href="/speaking">Book me to speak <span aria-hidden="true">&rarr;</span></a>
            <a class="submit-btn about-button about-secondary" href="https://calendly.com/melissawood-missyve/30min" target="_blank" rel="noopener noreferrer">Book 30 minutes</a>
            <div class="about-contact"></div>
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
    section.querySelector(".about-content").append(portfolio);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
