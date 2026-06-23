import { projects } from "../data/projects.js";

function projectTemplate(project, index) {
  const stack = project.stack.map((technology) => `<li>${technology}</li>`).join("");
  return `<article class="project-card"><p class="project-index">${String(index + 1).padStart(2, "0")}</p><div class="project-main"><h3>${project.title}</h3><p class="project-summary">${project.summary}</p><ul class="project-stack" aria-label="Tecnologias utilizadas">${stack}</ul></div><div class="project-details"><dl><div><dt>Foco</dt><dd>${project.focus}</dd></div><div><dt>Aprendizado</dt><dd>${project.learning}</dd></div><div><dt>Status</dt><dd>${project.status}</dd></div></dl><a class="project-link" href="${project.repository}" target="_blank" rel="noopener noreferrer" aria-label="Ver código do projeto ${project.title} no GitHub">Ver código <span aria-hidden="true">↗</span></a></div></article>`;
}

export function renderProjects() {
  const container = document.querySelector("[data-projects-list]");
  if (container) container.innerHTML = projects.map(projectTemplate).join("");
}
