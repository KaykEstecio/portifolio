// ===== ROUTER JAVASCRIPT =====

class PortfolioRouter {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentSection = null;
        this.history = [];
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupRoutes();
        this.setupNavigation();
        this.setupHistoryAPI();
        this.setup404Handling();
        this.setupPreloading();
    }

    setupRoutes() {
        // Define routes
        this.routes.set('/', {
            section: 'home',
            title: 'Kayk Estécio - Desenvolvedor Python Backend',
            description: 'Especializado em APIs RESTful e sistemas escaláveis com Python'
        });

        this.routes.set('/sobre', {
            section: 'about',
            title: 'Sobre - Kayk Estécio',
            description: 'Conheça mais sobre minha trajetória e habilidades'
        });

        this.routes.set('/habilidades', {
            section: 'skills',
            title: 'Habilidades - Kayk Estécio',
            description: 'Minhas competências técnicas em desenvolvimento Python'
        });

        this.routes.set('/inovacoes', {
            section: 'innovations',
            title: 'Inovações - Kayk Estécio',
            description: 'Tecnologias emergentes e experiências imersivas'
        });

        this.routes.set('/dashboard', {
            section: 'dashboard',
            title: 'Dashboard - Kayk Estécio',
            description: 'Painel administrativo com analytics em tempo real'
        });

        this.routes.set('/testemunhos', {
            section: 'testimonials',
            title: 'Testemunhos - Kayk Estécio',
            description: 'Feedback de clientes e colegas sobre meu trabalho'
        });

        this.routes.set('/demos', {
            section: 'demos',
            title: 'Demonstrações - Kayk Estécio',
            description: 'Experimente minhas APIs e projetos em tempo real'
        });

        this.routes.set('/playground', {
            section: 'playground',
            title: 'Playground - Kayk Estécio',
            description: 'Teste código Python e explore minhas habilidades'
        });

        this.routes.set('/blog', {
            section: 'blog',
            title: 'Blog - Kayk Estécio',
            description: 'Artigos técnicos sobre desenvolvimento Python e backend'
        });

        this.routes.set('/projetos', {
            section: 'projects',
            title: 'Projetos - Kayk Estécio',
            description: 'Meus projetos destacados em Python backend'
        });

        this.routes.set('/contato', {
            section: 'contact',
            title: 'Contato - Kayk Estécio',
            description: 'Entre em contato para oportunidades de colaboração'
        });
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                const sectionId = href.substring(1);
                this.navigateToSection(sectionId);
            }
        });

        // Handle initial route
        this.handleInitialRoute();
    }

    setupHistoryAPI() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.navigateToSection(e.state.section, false);
            }
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }

    setup404Handling() {
        // Handle 404 errors
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'A' && e.target.href.includes(window.location.origin)) {
                this.handle404(e.target.href);
            }
        }, true);
    }

    setupPreloading() {
        // Preload critical sections
        const criticalSections = ['home', 'about', 'projects', 'contact'];
        criticalSections.forEach(section => {
            this.preloadSection(section);
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.substring(1);
        if (hash && this.routes.has(hash)) {
            this.navigateToSection(hash, false);
        } else {
            // Default to home
            this.navigateToSection('home', false);
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && this.routes.has(hash)) {
            this.navigateToSection(hash, false);
        }
    }

    navigateToSection(sectionId, updateHistory = true) {
        if (this.isTransitioning || this.currentSection === sectionId) {
            return;
        }

        this.isTransitioning = true;
        const route = this.routes.get(sectionId);
        
        if (!route) {
            this.handle404(sectionId);
            return;
        }

        // Track navigation
        if (window.trackInteraction) {
            window.trackInteraction('navigation', {
                from: this.currentSection,
                to: sectionId,
                trigger: 'manual'
            });
        }

        // Update current section
        this.currentSection = sectionId;
        this.currentRoute = route;

        // Update URL and history
        if (updateHistory) {
            const newUrl = `#${sectionId}`;
            window.history.pushState(
                { section: sectionId },
                route.title,
                newUrl
            );
        }

        // Update page metadata
        this.updatePageMetadata(route);

        // Show loading state
        this.showLoadingState();

        // Smooth scroll to section
        this.scrollToSection(sectionId)
            .then(() => {
                this.hideLoadingState();
                this.updateActiveNavigation(sectionId);
                this.onSectionLoad(sectionId);
                this.isTransitioning = false;
            })
            .catch(() => {
                this.hideLoadingState();
                this.isTransitioning = false;
            });
    }

    scrollToSection(sectionId) {
        return new Promise((resolve, reject) => {
            const section = document.getElementById(sectionId);
            if (!section) {
                reject(new Error(`Section ${sectionId} not found`));
                return;
            }

            // Calculate scroll position with header offset
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 60;
            const sectionTop = section.offsetTop - headerHeight - 20;

            // Smooth scroll
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });

            // Wait for scroll to complete
            const checkScroll = () => {
                if (Math.abs(window.scrollY - sectionTop) < 5) {
                    resolve();
                } else {
                    requestAnimationFrame(checkScroll);
                }
            };

            requestAnimationFrame(checkScroll);

            // Fallback timeout
            setTimeout(() => resolve(), 1000);
        });
    }

    updatePageMetadata(route) {
        // Update title
        document.title = route.title;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = route.description;
        }

        // Update Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle) ogTitle.content = route.title;
        if (ogDescription) ogDescription.content = route.description;

        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = `${window.location.origin}${window.location.pathname}#${sectionId}`;
        }
    }

    updateActiveNavigation(sectionId) {
        // Update navigation active state
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Update mobile menu
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    onSectionLoad(sectionId) {
        // Trigger custom event for section load
        const event = new CustomEvent('sectionLoad', {
            detail: { section: sectionId, route: this.routes.get(sectionId) }
        });
        document.dispatchEvent(event);

        // Initialize section-specific features
        this.initializeSectionFeatures(sectionId);

        // Add to history
        this.history.push({
            section: sectionId,
            timestamp: Date.now()
        });

        // Limit history size
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
    }

    initializeSectionFeatures(sectionId) {
        switch (sectionId) {
            case 'playground':
                if (window.initPlayground) {
                    setTimeout(() => window.initPlayground(), 100);
                }
                break;
            case 'demos':
                if (window.initDemos) {
                    setTimeout(() => window.initDemos(), 100);
                }
                break;
            case 'dashboard':
                if (window.initDashboard) {
                    setTimeout(() => window.initDashboard(), 100);
                }
                break;
            case 'innovations':
                if (window.initInnovations) {
                    setTimeout(() => window.initInnovations(), 100);
                }
                break;
        }
    }

    showLoadingState() {
        const loadingIndicator = document.getElementById('routeLoading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }

    hideLoadingState() {
        const loadingIndicator = document.getElementById('routeLoading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    handle404(path) {
        console.warn(`Route not found: ${path}`);
        
        // Track 404
        if (window.trackInteraction) {
            window.trackInteraction('404_error', {
                path: path,
                referrer: document.referrer,
                userAgent: navigator.userAgent
            });
        }

        // Show 404 message or redirect to home
        this.navigateToSection('home', false);
    }

    preloadSection(sectionId) {
        // Preload section content for faster navigation
        const section = document.getElementById(sectionId);
        if (section) {
            // Force browser to render section
            section.style.display = 'block';
            section.offsetHeight; // Trigger reflow
            section.style.display = '';
        }
    }

    // Public API methods
    getCurrentSection() {
        return this.currentSection;
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getHistory() {
        return [...this.history];
    }

    navigate(path) {
        // External navigation
        if (path.startsWith('http')) {
            window.open(path, '_blank');
            return;
        }

        // Internal navigation
        const sectionId = path.startsWith('#') ? path.substring(1) : path;
        this.navigateToSection(sectionId);
    }

    back() {
        if (this.history.length > 1) {
            const previousSection = this.history[this.history.length - 2];
            this.navigateToSection(previousSection.section, false);
        }
    }

    forward() {
        // Implementation for forward navigation if needed
        console.log('Forward navigation not implemented');
    }
}

// Loading indicator
const loadingHTML = `
    <div id="routeLoading" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-color), #0052cc);
        z-index: 10001;
        display: none;
        animation: loadingPulse 1.5s ease-in-out infinite;
    "></div>
    
    <style>
    @keyframes loadingPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    </style>
`;

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add loading indicator
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    
    // Initialize router
    window.portfolioRouter = new PortfolioRouter();
    
    // Make router globally available
    window.navigateTo = (path) => window.portfolioRouter.navigate(path);
    window.getCurrentSection = () => window.portfolioRouter.getCurrentSection();
    window.getCurrentRoute = () => window.portfolioRouter.getCurrentRoute();
});
