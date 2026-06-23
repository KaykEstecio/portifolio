import { projects } from "../data/projects.js";

function listTemplate(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function projectActionTemplate(url, label, placeholderLabel) {
  if (!url) {
    return `<span class="project-link project-link-disabled" aria-disabled="true">${placeholderLabel}</span>`;
  }

  return `<a class="project-link" href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
}

function projectDetailsTemplate(project) {
  return `
    <dl class="project-details">
      <div><dt>Problema</dt><dd>${project.problem}</dd></div>
      <div><dt>Solução</dt><dd>${project.solution}</dd></div>
      <div><dt>O que implementei</dt><dd><ul>${listTemplate(project.implemented)}</ul></dd></div>
      <div><dt>Resultado</dt><dd>${project.result}</dd></div>
    </dl>
  `;
}

function projectStackTemplate(project) {
  return `<ul class="project-stack" aria-label="Tecnologias utilizadas">${listTemplate(project.stack)}</ul>`;
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
        ${projectDetailsTemplate(project)}
        <div class="project-tech-block">
          <p class="project-detail-label">Tecnologias</p>
          ${projectStackTemplate(project)}
        </div>
        <div class="project-footer">
          <span class="project-status">${project.status}</span>
          <div class="project-actions">
            ${projectActionTemplate(project.repository, "GitHub", "GitHub em breve")}
            ${projectActionTemplate(project.deploy, "Deploy", "Deploy em breve")}
          </div>
        </div>
      </div>
    </article>
  `;
}

function secondaryProjectTemplate(project, index) {
  return `
    <article class="secondary-project">
      <div class="secondary-project-header">
        <p class="project-index">${String(index + 2).padStart(2, "0")}</p>
        <p class="project-type">${project.type}</p>
      </div>
      <h3>${project.title}</h3>
      ${projectDetailsTemplate(project)}
      <div class="project-tech-block">
        <p class="project-detail-label">Tecnologias</p>
        ${projectStackTemplate(project)}
      </div>
      <div class="project-footer">
        <span class="project-status">${project.status}</span>
        <div class="project-actions">
          ${projectActionTemplate(project.repository, "GitHub", "GitHub em breve")}
          ${projectActionTemplate(project.deploy, "Deploy", "Deploy em breve")}
        </div>
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
