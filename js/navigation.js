const mobileBreakpoint = window.matchMedia("(max-width: 760px)");

export function initNavigation() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")];

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };
  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
  };

  toggle.addEventListener("click", () => toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu());
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); toggle.focus(); } });
  document.addEventListener("click", (event) => {
    if (mobileBreakpoint.matches && menu.classList.contains("is-open") && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  mobileBreakpoint.addEventListener("change", (event) => { if (!event.matches) closeMenu(); });

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${visible.target.id}`));
    }, { rootMargin: "-35% 0px -55%", threshold: [0, 0.2, 0.6] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
}
