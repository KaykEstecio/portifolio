// ===== ACCESSIBILITY ENHANCEMENTS =====

class AccessibilityManager {
    constructor() {
        this.settings = {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            keyboardNav: true,
            screenReader: false
        };
        this.currentFocus = null;
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupColorContrast();
        this.setupTextResizing();
        this.setupMotionReduction();
        this.setupAccessibilityPanel();
        this.detectUserPreferences();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Escape':
                    this.handleEscapeKey(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    this.handleArrowNavigation(e);
                    break;
            }
        });

        // Focus indicators
        document.addEventListener('focusin', (e) => {
            this.currentFocus = e.target;
            this.showFocusIndicator(e.target);
        });

        document.addEventListener('focusout', (e) => {
            this.hideFocusIndicator(e.target);
        });
    }

    setupAriaLabels() {
        // Add ARIA labels to interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                const text = element.textContent || element.title || element.placeholder;
                if (text) {
                    element.setAttribute('aria-label', text.trim());
                }
            }
        });

        // Add ARIA roles to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (!section.getAttribute('role')) {
                section.setAttribute('role', 'region');
            }
            
            const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading && !section.getAttribute('aria-labelledby')) {
                const headingId = heading.id || `heading-${Date.now()}`;
                heading.id = headingId;
                section.setAttribute('aria-labelledby', headingId);
            }
        });

        // Add ARIA to navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Navegação principal');
        }

        // Add ARIA to main content
        const main = document.querySelector('main') || document.querySelector('section[id="home"]');
        if (main) {
            main.setAttribute('role', 'main');
        }

        // Add ARIA to footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    setupSkipLinks() {
        // Add skip links for keyboard navigation
        const skipLinksHTML = `
            <div class="skip-links" role="navigation" aria-label="Links de atalho">
                <a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>
                <a href="#navigation" class="skip-link">Ir para a navegação</a>
                <a href="#contact" class="skip-link">Ir para o contato</a>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', skipLinksHTML);

        // Add main content id if not present
        const mainContent = document.querySelector('main, section[id="home"]');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    setupFocusManagement() {
        // Trap focus in modals and dialogs
        const modals = document.querySelectorAll('[role="dialog"], .modal');
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                this.trapFocus(e, modal);
            });
        });

        // Manage focus for dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.setupAriaForNewElements(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupScreenReaderSupport() {
        // Announce dynamic content changes
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'announcer';
        document.body.appendChild(announcer);

        // Make announcer globally available
        window.announceToScreenReader = (message) => {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        };

        // Detect screen reader
        this.detectScreenReader();
    }

    setupColorContrast() {
        // High contrast mode toggle
        const highContrastToggle = document.createElement('button');
        highContrastToggle.setAttribute('aria-label', 'Alternar modo de alto contraste');
        highContrastToggle.className = 'accessibility-toggle';
        highContrastToggle.innerHTML = '🌓';
        highContrastToggle.title = 'Alto Contraste';

        highContrastToggle.addEventListener('click', () => {
            this.toggleHighContrast();
        });

        document.body.appendChild(highContrastToggle);
    }

    setupTextResizing() {
        // Text size controls
        const textResizer = document.createElement('div');
        textResizer.className = 'text-resizer';
        textResizer.setAttribute('role', 'toolbar');
        textResizer.setAttribute('aria-label', 'Controles de tamanho de texto');

        textResizer.innerHTML = `
            <button class="text-size-btn" data-size="decrease" aria-label="Diminuir texto">A-</button>
            <button class="text-size-btn" data-size="normal" aria-label="Tamanho normal de texto">A</button>
            <button class="text-size-btn" data-size="increase" aria-label="Aumentar texto">A+</button>
        `;

        textResizer.querySelectorAll('.text-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeTextSize(btn.dataset.size);
            });
        });

        document.body.appendChild(textResizer);
    }

    setupMotionReduction() {
        // Reduced motion toggle
        const motionToggle = document.createElement('button');
        motionToggle.setAttribute('aria-label', 'Alternar movimento reduzido');
        motionToggle.className = 'accessibility-toggle';
        motionToggle.innerHTML = '⏸️';
        motionToggle.title = 'Movimento Reduzido';

        motionToggle.addEventListener('click', () => {
            this.toggleReducedMotion();
        });

        document.body.appendChild(motionToggle);
    }

    setupAccessibilityPanel() {
        // Main accessibility panel
        const panelHTML = `
            <div id="accessibilityPanel" class="accessibility-panel" role="dialog" aria-labelledby="accessibility-title" aria-hidden="true">
                <div class="panel-header">
                    <h3 id="accessibility-title">Acessibilidade</h3>
                    <button class="panel-close" aria-label="Fechar painel de acessibilidade" onclick="accessibilityManager.togglePanel()">×</button>
                </div>
                <div class="panel-content">
                    <div class="accessibility-option">
                        <label>
                            <input type="checkbox" id="highContrast" onchange="accessibilityManager.toggleHighContrast()">
                            <span>Alto Contraste</span>
                        </label>
                    </div>
                    <div class="accessibility-option">
                        <label>
                            <input type="checkbox" id="largeText" onchange="accessibilityManager.toggleLargeText()">
                            <span>Texto Grande</span>
                        </label>
                    </div>
                    <div class="accessibility-option">
                        <label>
                            <input type="checkbox" id="reducedMotion" onchange="accessibilityManager.toggleReducedMotion()">
                            <span>Movimento Reduzido</span>
                        </label>
                    </div>
                    <div class="accessibility-option">
                        <label>
                            <input type="checkbox" id="keyboardHints" checked onchange="accessibilityManager.toggleKeyboardHints()">
                            <span>Dicas de Teclado</span>
                        </label>
                    </div>
                </div>
            </div>
            <button id="accessibilityTrigger" class="accessibility-trigger" aria-label="Abrir painel de acessibilidade" onclick="accessibilityManager.togglePanel()">
                <span aria-hidden="true">♿</span>
                <span class="sr-only">Acessibilidade</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    detectUserPreferences() {
        // Detect user's accessibility preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersReducedMotion) {
            this.toggleReducedMotion();
        }

        if (prefersHighContrast) {
            this.toggleHighContrast();
        }

        // Check for screen reader
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    this.settings.screenReader = true;
                }
            };
        }
    }

    detectScreenReader() {
        // Simple screen reader detection
        const testElement = document.createElement('div');
        testElement.setAttribute('aria-live', 'polite');
        testElement.className = 'sr-only';
        testElement.textContent = 'Screen reader test';
        document.body.appendChild(testElement);

        setTimeout(() => {
            if (testElement.offsetHeight === 0) {
                this.settings.screenReader = true;
            }
            document.body.removeChild(testElement);
        }, 100);
    }

    handleTabNavigation(e) {
        // Enhanced tab navigation
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex <= 0) {
                e.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex >= focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[0].focus();
            }
        }
    }

    handleEscapeKey(e) {
        // Close modals and panels on Escape
        const openModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        const openPanel = document.querySelector('.accessibility-panel:not([aria-hidden="true"])');
        
        if (openModal) {
            openModal.setAttribute('aria-hidden', 'true');
            this.returnFocus();
        }
        
        if (openPanel) {
            this.togglePanel();
        }
    }

    handleActivation(e) {
        // Handle Enter/Space activation for custom elements
        if (e.target.classList.contains('custom-interactive')) {
            e.preventDefault();
            e.target.click();
        }
    }

    handleArrowNavigation(e) {
        // Arrow key navigation for menus and lists
        if (e.target.closest('[role="menu"], [role="listbox"], [role="tablist"]')) {
            e.preventDefault();
            const items = e.target.closest('[role="menu"], [role="listbox"], [role="tablist"]').querySelectorAll('[role="menuitem"], [role="option"], [role="tab"]');
            const currentIndex = Array.from(items).indexOf(e.target);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % items.length;
            } else {
                nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            }
            
            items[nextIndex].focus();
        }
    }

    trapFocus(e, container) {
        // Trap focus within a container
        const focusableElements = this.getFocusableElements(container);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    getFocusableElements(container = document) {
        const selectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];
        
        return container.querySelectorAll(selectors.join(', '));
    }

    showFocusIndicator(element) {
        element.classList.add('focused');
        element.style.outline = '2px solid #0066ff';
        element.style.outlineOffset = '2px';
    }

    hideFocusIndicator(element) {
        element.classList.remove('focused');
        element.style.outline = '';
        element.style.outlineOffset = '';
    }

    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        document.documentElement.classList.toggle('high-contrast', this.settings.highContrast);
        
        const checkbox = document.getElementById('highContrast');
        if (checkbox) checkbox.checked = this.settings.highContrast;
        
        this.saveSettings();
        window.announceToScreenReader(`Modo de alto contraste ${this.settings.highContrast ? 'ativado' : 'desativado'}`);
    }

    toggleLargeText() {
        this.settings.largeText = !this.settings.largeText;
        document.documentElement.classList.toggle('large-text', this.settings.largeText);
        
        const checkbox = document.getElementById('largeText');
        if (checkbox) checkbox.checked = this.settings.largeText;
        
        this.saveSettings();
        window.announceToScreenReader(`Texto grande ${this.settings.largeText ? 'ativado' : 'desativado'}`);
    }

    toggleReducedMotion() {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        document.documentElement.classList.toggle('reduced-motion', this.settings.reducedMotion);
        
        const checkbox = document.getElementById('reducedMotion');
        if (checkbox) checkbox.checked = this.settings.reducedMotion;
        
        this.saveSettings();
        window.announceToScreenReader(`Movimento reduzido ${this.settings.reducedMotion ? 'ativado' : 'desativado'}`);
    }

    toggleKeyboardHints() {
        this.settings.keyboardNav = !this.settings.keyboardNav;
        document.documentElement.classList.toggle('keyboard-hints', this.settings.keyboardNav);
        
        const checkbox = document.getElementById('keyboardHints');
        if (checkbox) checkbox.checked = this.settings.keyboardNav;
        
        this.saveSettings();
    }

    changeTextSize(size) {
        const root = document.documentElement;
        
        switch (size) {
            case 'decrease':
                root.style.fontSize = '14px';
                break;
            case 'normal':
                root.style.fontSize = '16px';
                break;
            case 'increase':
                root.style.fontSize = '18px';
                break;
        }
        
        window.announceToScreenReader(`Tamanho do texto alterado para ${size}`);
    }

    togglePanel() {
        const panel = document.getElementById('accessibilityPanel');
        const trigger = document.getElementById('accessibilityTrigger');
        const isVisible = panel.getAttribute('aria-hidden') === 'false';
        
        panel.setAttribute('aria-hidden', isVisible);
        trigger.setAttribute('aria-expanded', !isVisible);
        
        if (!isVisible) {
            panel.querySelector('button').focus();
        } else {
            trigger.focus();
        }
    }

    saveSettings() {
        localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            
            // Apply saved settings
            if (this.settings.highContrast) {
                document.documentElement.classList.add('high-contrast');
            }
            if (this.settings.largeText) {
                document.documentElement.classList.add('large-text');
            }
            if (this.settings.reducedMotion) {
                document.documentElement.classList.add('reduced-motion');
            }
        }
    }

    setupAriaForNewElements(element) {
        // Setup ARIA for dynamically added elements
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                element.setAttribute('aria-label', 'Botão interativo');
            }
        }
        
        if (element.classList.contains('modal') || element.getAttribute('role') === 'dialog') {
            element.setAttribute('aria-modal', 'true');
            element.setAttribute('aria-hidden', 'true');
        }
    }

    returnFocus() {
        if (this.currentFocus && typeof this.currentFocus.focus === 'function') {
            this.currentFocus.focus();
        }
    }
}

// Accessibility styles
const accessibilityStyles = `
    <style>
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    .skip-links {
        position: fixed;
        top: -40px;
        left: 0;
        right: 0;
        z-index: 10000;
        background: var(--accent-color);
        display: flex;
        justify-content: center;
        transition: top 0.3s ease;
    }
    
    .skip-links:focus-within {
        top: 0;
    }
    
    .skip-link {
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        font-weight: 600;
    }
    
    .skip-link:focus {
        background: var(--text-primary);
        color: var(--accent-color);
    }
    
    .accessibility-trigger {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--accent-color);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9998;
        font-size: 1.2rem;
        box-shadow: var(--shadow-lg);
        transition: var(--transition-fast);
    }
    
    .accessibility-trigger:hover {
        background: #0052cc;
        transform: scale(1.1);
    }
    
    .accessibility-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 100vh;
        background: var(--card-bg);
        border-right: 2px solid var(--accent-color);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }
    
    .accessibility-panel[aria-hidden="false"] {
        transform: translateX(0);
    }
    
    .panel-header {
        background: var(--bg-tertiary);
        padding: var(--spacing-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
    }
    
    .panel-close {
        background: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: var(--spacing-xs);
    }
    
    .panel-content {
        padding: var(--spacing-md);
    }
    
    .accessibility-option {
        margin-bottom: var(--spacing-md);
    }
    
    .accessibility-option label {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        cursor: pointer;
        color: var(--text-primary);
        font-size: 1rem;
    }
    
    .accessibility-option input[type="checkbox"] {
        width: 20px;
        height: 20px;
        accent-color: var(--accent-color);
    }
    
    .text-resizer {
        position: fixed;
        top: 80px;
        right: 20px;
        display: flex;
        gap: var(--spacing-xs);
        z-index: 9997;
    }
    
    .text-size-btn {
        background: var(--accent-color);
        color: white;
        border: none;
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition-fast);
    }
    
    .text-size-btn:hover {
        background: #0052cc;
    }
    
    .high-contrast {
        filter: contrast(1.5);
    }
    
    .high-contrast * {
        border-color: #000 !important;
    }
    
    .large-text {
        font-size: 1.2em !important;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .keyboard-hints [data-tooltip]:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        background: var(--text-primary);
        color: var(--bg-primary);
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 1000;
    }
    
    .focused {
        outline: 2px solid var(--accent-color) !important;
        outline-offset: 2px !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    </style>
`;

// Initialize accessibility manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add accessibility styles
    document.head.insertAdjacentHTML('beforeend', accessibilityStyles);
    
    // Initialize accessibility manager
    window.accessibilityManager = new AccessibilityManager();
    window.accessibilityManager.loadSettings();
});
