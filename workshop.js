(() => {
  function init() {
    const hero = document.querySelector("main.hero");
    const portfolio = hero && hero.querySelector(".portfolio");
    if (!hero || !portfolio) {
      console.error("Workshop feature could not be added: homepage portfolio not found.");
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      html,body,.page{background:#000}
      .hero .headline{margin-bottom:24px;opacity:1;animation:none}
      .home-subhead{max-width:640px;margin:0;color:rgba(245,240,227,.8);font-family:'Inter',sans-serif;font-size:clamp(17px,2.2vw,21px);line-height:1.55;text-align:center}
      .hero .fr-assessment{display:inline-flex;width:auto;align-items:center;justify-content:center;gap:8px;margin:24px 0 0;padding:12px 20px;opacity:1;animation:none}
      .hero .fr-assessment:focus-visible,.workshop-feature a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .workshop-feature{width:100%;margin-top:clamp(48px,7vw,72px);padding:clamp(24px,4vw,36px);border:1px solid var(--line);border-left:3px solid #C9897B;border-radius:8px;background:rgba(255,255,255,.025);text-align:left}
      .workshop-feature-label{margin:0 0 12px;color:var(--gold-300);font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
      .workshop-feature h2{margin:0 0 12px;color:var(--cream-100);font-family:'Fraunces',serif;font-size:clamp(1.5rem,3vw,2rem);font-weight:500;line-height:1.2}
      .workshop-feature p:not(.workshop-feature-label){margin:0;color:var(--cream-100);font-size:14px;line-height:1.7}
      .workshop-feature a{margin-top:20px;opacity:1;animation:none}
      .workshop-sponsor{display:flex;align-items:center;gap:14px;margin-top:24px;padding-top:20px;border-top:1px solid var(--line)}
      .workshop-feature .workshop-sponsor p{font-size:12px}
      .workshop-feature .workshop-sponsor a{display:inline-flex;margin:0}
      .workshop-sponsor img{display:block;width:96px;height:auto}
    `;
    document.head.append(style);

    const section = document.createElement("section");
    section.className = "workshop-feature";
    section.setAttribute("aria-labelledby", "workshop-feature-title");
    section.innerHTML = `
      <div class="workshop-feature-content">
        <div>
          <p class="workshop-feature-label">Workshop series</p>
          <h2 id="workshop-feature-title">Spilling the Tea On Becoming a Successful Founder</h2>
          <p>Building with Cowgirl Grit: a quarterly workshop series for aspiring and first-time female founders. Join the waitlist for dates.</p>
          <a class="cta" href="/spillingthetea">Learn more <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
      <div class="workshop-sponsor">
        <p>Sponsored by</p>
        <a href="https://cowgirltea.com/our-story/" target="_blank" rel="noopener noreferrer" aria-label="Cowgirl Tea"><img src="/images/cowgirl-tea-logo.png" alt="" width="374" height="186"></a>
      </div>`;
    portfolio.before(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
