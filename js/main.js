import { initNavigation } from "./navigation.js";
import { renderProjects } from "./projects.js";

document.documentElement.classList.add("reveal-ready");
initNavigation();
renderProjects();
document.querySelector("[data-current-year]").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".section-heading, .about-copy, .tech-group, .project-card, .education-item, .contact-copy");
revealElements.forEach((element) => element.setAttribute("data-reveal", ""));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
