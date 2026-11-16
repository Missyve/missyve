(() => {
  function init() {
    const hero = document.querySelector("main.hero");
    const assessment = hero && hero.querySelector(".fr-assessment");
    if (!hero || !assessment) {
      console.error("Speaking navigation could not be added: homepage elements not found.");
      return;
    }
    const style = document.createElement("style");
    style.textContent = `
      .speaking-nav{margin-top:24px}
      .speaking-nav a{color:var(--cream-100);font-size:12px;text-decoration:none;border-bottom:1px solid var(--line);padding-bottom:3px}
      .speaking-nav a:hover{color:var(--gold-300);border-color:var(--gold-500)}
      .speaking-nav a:focus-visible{outline:2px solid var(--gold-300);outline-offset:3px}
    `;
    document.head.append(style);
    const nav = document.createElement("nav");
    nav.className = "speaking-nav";
    nav.setAttribute("aria-label", "Main navigation");
    nav.innerHTML = '<a href="/speaking">Speaking</a>';
    assessment.before(nav);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
