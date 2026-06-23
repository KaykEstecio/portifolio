// ===== PROJECTS FUNCTIONALITY =====

// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const searchInput = document.querySelector('.project-search');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initProjectFilters();
    initProjectSearch();
    initProjectAnimations();
    initProjectModal();
    initProjectStats();
});

// ===== PROJECT FILTERS =====
function initProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    projectCards.forEach((card, index) => {
        const categories = card.dataset.category.split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            card.style.display = 'block';
            // Stagger animation
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 100);
        } else {
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update project count
    updateProjectCount();
}

// ===== PROJECT SEARCH =====
function initProjectSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        searchProjects(searchTerm);
    }, 300));
}

function searchProjects(searchTerm) {
    let visibleCount = 0;
    
    projectCards.forEach((card, index) => {
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const techTags = Array.from(card.querySelectorAll('.tech-tag'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');
        
        const searchableText = `${title} ${description} ${techTags}`;
        const isVisible = searchableText.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }, visibleCount * 100);
            visibleCount++;
        } else {
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0);
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>Nenhum projeto encontrado</h3>
                <p>Tente usar termos diferentes ou limpar a busca</p>
                <button class="btn btn-secondary clear-search">Limpar busca</button>
            </div>
        `;
        noResultsMsg.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
        `;
        
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.appendChild(noResultsMsg);
        
        // Add clear search functionality
        noResultsMsg.querySelector('.clear-search').addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchProjects('');
            }
        });
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// ===== PROJECT ANIMATIONS =====
function initProjectAnimations() {
    // Add hover effects to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-lift');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-lift');
        });
        
        // Add click animation
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.project-link')) {
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300);
            }
        });
    });
    
    // Animate tech tags on hover
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// ===== PROJECT MODAL =====
function initProjectModal() {
    // Create modal element
    const modal = createProjectModal();
    document.body.appendChild(modal);
    
    // Add click events to project cards for modal
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.project-link')) {
                const projectData = extractProjectData(this);
                openProjectModal(projectData);
            }
        });
    });
    
    // Close modal events
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            closeProjectModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
}

function createProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <div class="modal-icon"></div>
                <h2 class="modal-title"></h2>
            </div>
            <div class="modal-body">
                <div class="modal-description"></div>
                <div class="modal-tech-stack">
                    <h3>Tecnologias Utilizadas</h3>
                    <div class="modal-tech-tags"></div>
                </div>
                <div class="modal-features">
                    <h3>Funcionalidades</h3>
                    <ul class="modal-features-list"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-primary modal-github" target="_blank">
                    <i class="fab fa-github"></i>
                    Ver no GitHub
                </a>
                <button class="btn btn-secondary modal-close-btn">
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        border: 1px solid var(--border-color);
    `;
    
    return modal;
}

function extractProjectData(card) {
    const title = card.querySelector('.project-title').textContent;
    const description = card.querySelector('.project-description').textContent;
    const techTags = Array.from(card.querySelectorAll('.tech-tag'))
        .map(tag => tag.textContent);
    const githubLink = card.querySelector('.project-link').href;
    const icon = card.querySelector('.project-icon i').className;
    
    // Project-specific data
    const projectData = {
        title,
        description,
        techTags,
        githubLink,
        icon,
        features: getProjectFeatures(title)
    };
    
    return projectData;
}

function getProjectFeatures(title) {
    const features = {
        'BookMarket': [
            'Sistema completo de e-commerce para livros',
            'Painel administrativo com controle total',
            'Gestão de estoque em tempo real',
            'Autenticação JWT com criptografia bcrypt',
            'Sistema de pagamentos integrado',
            'Notificações por email simuladas',
            'Interface responsiva e moderna'
        ],
        'Encurtador de URL': [
            'Encurtamento de URLs com códigos únicos',
            'Cache Redis para redirecionamento rápido',
            'Estatísticas detalhadas de acesso',
            'Interface web moderna e intuitiva',
            'Sistema de expiração de links (TTL)',
            'API RESTful documentada',
            'Containerização com Docker'
        ],
        'API de Cadastro': [
            'API RESTful completa para usuários',
            'Operações CRUD implementadas',
            'Validação robusta com Pydantic',
            'Documentação automática com Swagger',
            'Banco de dados SQLite',
            'Segurança em endpoints',
            'Código limpo e organizado'
        ],
        'Sabor Novo': [
            'API para gestão de restaurantes',
            'Controle de pedidos e clientes',
            'Sistema de cardápio digital',
            'Gestão de mesas e reservas',
            'Integração com sistemas de pagamento',
            'Relatórios e analytics',
            'Arquitetura escalável'
        ]
    };
    
    return features[title] || ['Projeto em desenvolvimento', 'Funcionalidades sendo implementadas'];
}

function openProjectModal(projectData) {
    const modal = document.querySelector('.project-modal');
    const modalIcon = modal.querySelector('.modal-icon');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalTechTags = modal.querySelector('.modal-tech-tags');
    const modalFeaturesList = modal.querySelector('.modal-features-list');
    const modalGithub = modal.querySelector('.modal-github');
    
    // Populate modal
    modalIcon.innerHTML = `<i class="${projectData.icon}"></i>`;
    modalIcon.style.cssText = `
        font-size: 3rem;
        color: var(--primary-color);
        text-align: center;
        margin-bottom: 1rem;
    `;
    
    modalTitle.textContent = projectData.title;
    modalDescription.textContent = projectData.description;
    
    // Add tech tags
    modalTechTags.innerHTML = '';
    projectData.techTags.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        modalTechTags.appendChild(tag);
    });
    
    // Add features
    modalFeaturesList.innerHTML = '';
    projectData.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        li.style.cssText = `
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        `;
        modalFeaturesList.appendChild(li);
    });
    
    // Set GitHub link
    modalGithub.href = projectData.githubLink;
    
    // Show modal
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.querySelector('.modal-content').style.transform = 'scale(1)';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.querySelector('.project-modal');
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// ===== PROJECT STATS =====
function initProjectStats() {
    // Animate project statistics
    const stats = {
        total: projectCards.length,
        categories: {
            api: document.querySelectorAll('[data-category*="api"]').length,
            web: document.querySelectorAll('[data-category*="web"]').length,
            tool: document.querySelectorAll('[data-category*="tool"]').length
        }
    };
    
    // Update project count
    updateProjectCount();
    
    // Add stats to page (optional)
    addProjectStats(stats);
}

function updateProjectCount() {
    const visibleCards = Array.from(projectCards).filter(card => 
        card.style.display !== 'none'
    );
    
    let countElement = document.querySelector('.project-count');
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.className = 'project-count';
        countElement.style.cssText = `
            text-align: center;
            margin-bottom: 2rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        `;
        
        const projectsSection = document.querySelector('.projects');
        const sectionHeader = projectsSection.querySelector('.section-header');
        sectionHeader.appendChild(countElement);
    }
    
    countElement.textContent = `${visibleCards.length} projeto${visibleCards.length !== 1 ? 's' : ''} encontrado${visibleCards.length !== 1 ? 's' : ''}`;
}

function addProjectStats(stats) {
    // This function can be used to add a stats section
    // Implementation depends on design requirements
    console.log('Project Stats:', stats);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .project-modal .modal-header {
        text-align: center;
        padding: 2rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .project-modal .modal-body {
        padding: 2rem;
    }
    
    .project-modal .modal-footer {
        padding: 2rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.3s ease;
        z-index: 1;
    }
    
    .modal-close:hover {
        color: var(--text-primary);
    }
    
    .modal-tech-stack {
        margin: 2rem 0;
    }
    
    .modal-tech-stack h3,
    .modal-features h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .modal-tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .clicked {
        animation: pulse 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .project-modal .modal-content {
            width: 95%;
            max-height: 95vh;
        }
        
        .project-modal .modal-body,
        .project-modal .modal-header,
        .project-modal .modal-footer {
            padding: 1rem;
        }
        
        .modal-tech-tags {
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);
