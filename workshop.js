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
      .hero .fr-assessment:focus-visible,.workshop-feature a:focus-visible,.workshop-feature summary:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
      .workshop-feature{width:100%;margin-top:clamp(48px,7vw,72px);padding:clamp(24px,4vw,36px);border:1px solid var(--line);border-left:3px solid var(--gold-500);border-radius:8px;background:rgba(255,255,255,.025);text-align:left;scroll-margin-top:24px}
      .workshop-feature-label{margin:0 0 12px;color:var(--gold-300);font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
      .workshop-feature h2{margin:0 0 12px;color:var(--cream-100);font-family:'Fraunces',serif;font-size:clamp(1.5rem,3vw,2rem);font-weight:500;line-height:1.2}
      .workshop-feature p:not(.workshop-feature-label){margin:0;color:var(--cream-100);font-size:14px;line-height:1.7}
      .workshop-feature a{margin-top:20px;opacity:1;animation:none}
      .workshop-details summary{display:inline-flex;margin-top:20px;opacity:1;animation:none;list-style:none}
      .workshop-feature .workshop-partner-link:not([hidden]){display:block;width:max-content;max-width:100%}
      .workshop-feature .workshop-partner-link[hidden]{display:none}
      .workshop-details summary::-webkit-details-marker{display:none}
      .workshop-details summary .workshop-less,.workshop-details[open] summary .workshop-more{display:none}
      .workshop-details[open] summary .workshop-less{display:inline}
      .workshop-details:not([open]) + .workshop-waitlist-section .workshop-waitlist-intro{display:none}
      .workshop-expanded{margin-top:24px;padding-top:24px;border-top:1px solid var(--line)}
      .workshop-expanded h3,.workshop-waitlist-section h3{margin:24px 0 12px;color:var(--cream-100);font-family:'Fraunces',serif;font-size:22px;font-weight:500}
      .workshop-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0}
      .workshop-cards article{padding:16px;border:1px solid var(--line);border-radius:8px}
      .workshop-cards h4{margin:0 0 10px;color:var(--gold-300);font-family:'Fraunces',serif;font-size:17px;font-weight:500}
      .workshop-feature .workshop-cards p{font-size:13px}
      .workshop-feature .workshop-waitlist{display:inline-block;width:auto;margin-top:16px;text-decoration:none}
      .workshop-feature p.workshop-helper:not(.workshop-feature-label){margin-top:10px;font-size:12px}
      @media(max-width:600px){.workshop-cards{grid-template-columns:1fr}}
      .workshop-sponsor{display:flex;align-items:center;gap:14px;margin-top:24px;padding-top:20px;border-top:1px solid var(--line)}
      .workshop-feature .workshop-sponsor p{font-size:12px}
      .workshop-feature .workshop-sponsor a{display:inline-flex;margin:0}
      .workshop-sponsor img{display:block;width:96px;height:auto}
    `;
    document.head.append(style);

    const section = document.createElement("section");
    section.className = "workshop-feature";
    section.id = "workshop-series";
    section.setAttribute("aria-labelledby", "workshop-feature-title");
    section.innerHTML = `
      <div class="workshop-feature-content">
        <div>
          <p class="workshop-feature-label">Workshop series</p>
          <h2 id="workshop-feature-title">Spilling the Tea on Becoming a Successful Founder</h2>
          <p>Building with Cowgirl Grit: a quarterly workshop series for aspiring and first-time female founders. Join the waitlist for dates.</p>
          <details class="workshop-details">
            <summary class="cta"><span class="workshop-more">Learn more</span><span class="workshop-less">Show less</span> <span aria-hidden="true">&rarr;</span></summary>
            <div class="workshop-expanded">
              <p>Most first-time founders commit their savings and years of their lives before they know whether they're ready. Find out first.</p>
              <h3>The Workshops</h3>
              <p>Three hands-on sessions. Each one stands alone, and together they take you from "should I?" to "here's my proof."</p>
              <div class="workshop-cards">
                <article><h4>Are You Ready?</h4><p>Check yourself against the six readiness dimensions with a private assessment.</p></article>
                <article><h4>Idea to Proof</h4><p>Prototype your idea with AI tools and design a real market test.</p></article>
                <article><h4>Don't Ride Alone</h4><p>Find the co-founders, advisors and partners who make a startup last.</p></article>
              </div>
            </div>
          </details>
          <a class="cta workshop-partner-link" href="/spillingthetea#partner" hidden>Sponsor or host a workshop <span aria-hidden="true">&rarr;</span></a>
          <div class="workshop-waitlist-section">
            <div class="workshop-waitlist-intro">
              <h3>Join the waitlist</h3>
              <p>Be first to hear about dates. Tell me what you need most, and get an early-bird code when you finish.</p>
            </div>
            <a class="submit-btn workshop-waitlist" href="https://forms.gle/45ULw6hv8pnh3Yb98" target="_blank" rel="noopener noreferrer">Join the waitlist (3-minute survey) <span aria-hidden="true">&rarr;</span></a>
            <p class="workshop-helper">Finish the survey and get an early-bird code.</p>
          </div>
        </div>
      </div>
      <div class="workshop-sponsor">
        <p>Sponsored by</p>
        <a href="https://cowgirltea.com/our-story/" target="_blank" rel="noopener noreferrer" aria-label="Cowgirl Tea"><img src="/images/cowgirl-tea-logo.png" alt="" width="374" height="186"></a>
      </div>`;
    portfolio.before(section);
    const details = section.querySelector(".workshop-details");
    const openFromLink = () => {
      if (window.location.hash === "#workshop-series") {
        details.open = true;
        section.scrollIntoView();
      }
    };
    window.addEventListener("hashchange", openFromLink);
    document.querySelectorAll('a[href="#workshop-series"]').forEach((link) => {
      link.addEventListener("click", () => { details.open = true; });
    });
    openFromLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
