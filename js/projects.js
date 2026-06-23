import { projects } from "../data/projects.js";

function stackTemplate(stack) {
  return stack.map((technology) => `<li>${technology}</li>`).join("");
}

function featuredProjectTemplate(project) {
  return `
    <article class="featured-project">
      <div class="featured-project-media">
        <img src="${project.image}" alt="${project.imageAlt}" loading="lazy">
      </div>
      <div class="featured-project-content">
        <p class="project-type">${project.type}</p>
        <h3>${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <dl class="project-evidence">
          <div><dt>Problema</dt><dd>${project.problem}</dd></div>
          <div><dt>Decisão técnica</dt><dd>${project.decision}</dd></div>
        </dl>
        <ul class="project-stack" aria-label="Tecnologias utilizadas">${stackTemplate(project.stack)}</ul>
        <div class="project-footer">
          <span class="project-status">${project.status}</span>
          <a class="project-link" href="${project.repository}" target="_blank" rel="noopener noreferrer">Ver código <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </article>
  `;
}

function secondaryProjectTemplate(project, index) {
  return `
    <article class="secondary-project">
      <div class="secondary-project-header">
        <p class="project-index">${String(index + 1).padStart(2, "0")}</p>
        <p class="project-type">${project.type}</p>
      </div>
      <h3>${project.title}</h3>
      <p class="project-summary">${project.summary}</p>
      <dl class="project-evidence">
        <div><dt>Problema</dt><dd>${project.problem}</dd></div>
        <div><dt>Decisão técnica</dt><dd>${project.decision}</dd></div>
      </dl>
      <ul class="project-stack" aria-label="Tecnologias utilizadas">${stackTemplate(project.stack)}</ul>
      <div class="project-footer">
        <span class="project-status">${project.status}</span>
        <a class="project-link" href="${project.repository}" target="_blank" rel="noopener noreferrer">Ver código <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `;
}

export function renderProjects() {
  const container = document.querySelector("[data-projects-list]");
  if (!container) return;
  const featured = projects.find((project) => project.featured);
  const secondary = projects.filter((project) => !project.featured);
  container.innerHTML = `
    ${featured ? featuredProjectTemplate(featured) : ""}
    <div class="secondary-projects">${secondary.map(secondaryProjectTemplate).join("")}</div>
    <a class="all-projects-link" href="https://github.com/KaykEstecio?tab=repositories" target="_blank" rel="noopener noreferrer">Explorar outros projetos no GitHub <span aria-hidden="true">↗</span></a>
  `;
}
