// ===== ENHANCED HEADER JAVASCRIPT =====

class EnhancedHeader {
    constructor() {
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.searchResults = [];
        this.isDarkTheme = false;
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupSearch();
        this.setupThemeToggle();
        this.setupProgressIndicator();
        this.setupMobileMenu();
        this.setupCTAButton();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
    }

    setupScrollEffects() {
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            const navbar = document.getElementById('navbar');
            
            if (!navbar) return;

            // Add scrolled class
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
                this.isScrolled = true;
            } else {
                navbar.classList.remove('scrolled');
                this.isScrolled = false;
            }

            // Hide/show on scroll
            if (scrollY > this.lastScrollY && scrollY > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }

            this.lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('navSearch');
        if (!searchInput) return;

        let searchTimeout;
        const searchResultsContainer = this.createSearchResultsContainer();

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                this.hideSearchResults();
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                this.performSearch(searchInput.value.trim());
            }
        });

        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search') && !e.target.closest('.search-results')) {
                this.hideSearchResults();
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            this.handleSearchKeyboard(e);
        });
    }

    createSearchResultsContainer() {
        const container = document.createElement('div');
        container.className = 'search-results';
        container.innerHTML = `
            <div class="search-results-header">
                <span>Resultados da busca</span>
                <button class="search-close" onclick="enhancedHeader.hideSearchResults()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results-list"></div>
        `;
        
        document.body.appendChild(container);
        return container;
    }

    async performSearch(query) {
        try {
            // Track search
            if (window.trackInteraction) {
                window.trackInteraction('search', {
                    query: query,
                    source: 'header'
                });
            }

            // Simulate search results
            const results = await this.searchContent(query);
            this.displaySearchResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.displaySearchError();
        }
    }

    async searchContent(query) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const sections = [
            { id: 'inovacoes', title: 'Inovações', icon: 'fa-rocket', description: 'Tecnologias emergentes' },
            { id: 'dashboard', title: 'Dashboard', icon: 'fa-chart-line', description: 'Analytics em tempo real' },
            { id: 'testemunhos', title: 'Testemunhos', icon: 'fa-comments', description: 'Feedback de clientes' },
            { id: 'demos', title: 'Demos', icon: 'fa-play-circle', description: 'Demonstrações ao vivo' },
            { id: 'playground', title: 'Playground', icon: 'fa-code', description: 'Teste código Python' },
            { id: 'blog', title: 'Blog', icon: 'fa-blog', description: 'Artigos técnicos' },
            { id: 'projetos', title: 'Projetos', icon: 'fa-project-diagram', description: 'Meus trabalhos' },
            { id: 'contato', title: 'Contato', icon: 'fa-envelope', description: 'Entre em contato' }
        ];

        return sections.filter(section => 
            section.title.toLowerCase().includes(query.toLowerCase()) ||
            section.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    displaySearchResults(results, query) {
        const container = document.querySelector('.search-results');
        const list = document.querySelector('.search-results-list');
        
        if (!container || !list) return;

        if (results.length === 0) {
            list.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum resultado encontrado para "${query}"</p>
                </div>
            `;
        } else {
            list.innerHTML = results.map(result => `
                <a href="#${result.id}" class="search-result-item" onclick="enhancedHeader.selectSearchResult('${result.id}')">
                    <div class="search-result-icon">
                        <i class="fas ${result.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${this.highlightMatch(result.title, query)}</div>
                        <div class="search-result-description">${this.highlightMatch(result.description, query)}</div>
                    </div>
                </a>
            `).join('');
        }

        container.classList.add('visible');
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    displaySearchError() {
        const list = document.querySelector('.search-results-list');
        if (!list) return;

        list.innerHTML = `
            <div class="search-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro na busca. Tente novamente.</p>
            </div>
        `;
    }

    hideSearchResults() {
        const container = document.querySelector('.search-results');
        if (container) {
            container.classList.remove('visible');
        }
        
        const searchInput = document.getElementById('navSearch');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    selectSearchResult(sectionId) {
        this.hideSearchResults();
        
        // Navigate to section
        if (window.navigateTo) {
            window.navigateTo(sectionId);
        } else {
            window.location.hash = sectionId;
        }
    }

    handleSearchKeyboard(e) {
        const container = document.querySelector('.search-results');
        if (!container || !container.classList.contains('visible')) return;

        const items = container.querySelectorAll('.search-result-item');
        let currentIndex = -1;

        // Find current focused item
        items.forEach((item, index) => {
            if (item.classList.contains('focused')) {
                currentIndex = index;
            }
        });

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                this.focusSearchResult(items, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                this.focusSearchResult(items, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0 && items[currentIndex]) {
                    items[currentIndex].click();
                }
                break;
            case 'Escape':
                this.hideSearchResults();
                break;
        }
    }

    focusSearchResult(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('focused', i === index);
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = this.isDarkTheme ? 'light' : 'dark';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);

            // Track theme change
            if (window.trackInteraction) {
                window.trackInteraction('theme_change', {
                    from: this.isDarkTheme ? 'dark' : 'light',
                    to: newTheme
                });
            }
        });
    }

    setTheme(theme) {
        this.isDarkTheme = theme === 'dark';
        const themeToggle = document.getElementById('themeToggle');
        
        if (this.isDarkTheme) {
            document.documentElement.classList.add('dark-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            document.documentElement.classList.remove('dark-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }

    setupProgressIndicator() {
        const progressBar = document.getElementById('navProgress');
        if (!progressBar) return;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateProgress);
        });

        updateProgress();
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Track menu toggle
            if (window.trackInteraction) {
                window.trackInteraction('mobile_menu_toggle', {
                    action: isOpen ? 'close' : 'open'
                });
            }
        });

        // Close menu on link click
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    setupCTAButton() {
        const ctaButton = document.getElementById('navCTA');
        if (!ctaButton) return;

        ctaButton.addEventListener('click', () => {
            // Track CTA click
            if (window.trackInteraction) {
                window.trackInteraction('cta_click', {
                    location: 'header',
                    text: ctaButton.textContent.trim()
                });
            }

            // Navigate to contact or open modal
            if (window.navigateTo) {
                window.navigateTo('contato');
            } else {
                window.location.hash = 'contato';
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('navSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Ctrl/Cmd + / for accessibility
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                const accessibilityTrigger = document.getElementById('accessibilityTrigger');
                if (accessibilityTrigger) {
                    accessibilityTrigger.click();
                }
            }

            // Escape to close search
            if (e.key === 'Escape') {
                this.hideSearchResults();
            }
        });
    }

    setupAccessibility() {
        // Add ARIA labels dynamically
        const searchInput = document.getElementById('navSearch');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Buscar no site');
            searchInput.setAttribute('aria-expanded', 'false');
        }

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Alternar tema claro/escuro');
        }

        const ctaButton = document.getElementById('navCTA');
        if (ctaButton) {
            ctaButton.setAttribute('aria-label', 'Entrar em contato para contratação');
        }

        // Announce search results to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'search-announcer';
        document.body.appendChild(announcer);

        window.announceSearchResults = (count, query) => {
            announcer.textContent = `Encontrados ${count} resultados para "${query}"`;
        };
    }

    // Public methods
    getScrollPosition() {
        return {
            scrollY: window.scrollY,
            isScrolled: this.isScrolled,
            progress: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        };
    }

    getCurrentTheme() {
        return this.isDarkTheme ? 'dark' : 'light';
    }

    highlightSection(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Search results styles
const searchStyles = `
    <style>
    .search-results {
        position: fixed;
        top: 70px;
        right: 20px;
        width: 350px;
        max-height: 400px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1002;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .search-results.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-tertiary);
    }
    
    .search-close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: var(--transition-fast);
    }
    
    .search-close:hover {
        background: var(--accent-color);
        color: var(--text-primary);
    }
    
    .search-results-list {
        max-height: 350px;
        overflow-y: auto;
    }
    
    .search-result-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        text-decoration: none;
        color: var(--text-primary);
        transition: var(--transition-fast);
        border-bottom: 1px solid var(--border-color);
    }
    
    .search-result-item:hover,
    .search-result-item.focused {
        background: var(--bg-tertiary);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-icon {
        width: 40px;
        height: 40px;
        background: var(--accent-color);
        color: var(--text-primary);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
    }
    
    .search-result-content {
        flex: 1;
        min-width: 0;
    }
    
    .search-result-title {
        font-weight: 600;
        margin-bottom: 4px;
        font-size: 0.95rem;
    }
    
    .search-result-description {
        color: var(--text-secondary);
        font-size: 0.85rem;
        line-height: 1.4;
    }
    
    .search-result-title mark,
    .search-result-description mark {
        background: var(--accent-color);
        color: var(--text-primary);
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: 600;
    }
    
    .search-no-results,
    .search-error {
        text-align: center;
        padding: var(--spacing-xl);
        color: var(--text-secondary);
    }
    
    .search-no-results i,
    .search-error i {
        font-size: 2rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
    }
    
    .search-no-results p,
    .search-error p {
        margin: 0;
        font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
        .search-results {
            top: 60px;
            right: 10px;
            left: 10px;
            width: auto;
        }
    }
    </style>
`;

// Initialize enhanced header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add search styles
    document.head.insertAdjacentHTML('beforeend', searchStyles);
    
    // Initialize enhanced header
    window.enhancedHeader = new EnhancedHeader();
    
    // Make globally available
    window.hideSearchResults = () => window.enhancedHeader.hideSearchResults();
    window.selectSearchResult = (id) => window.enhancedHeader.selectSearchResult(id);
});
