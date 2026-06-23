// ===== ENHANCED INTERACTIONS JAVASCRIPT =====

class InteractionManager {
    constructor() {
        this.isInteracting = false;
        this.cursorPosition = { x: 0, y: 0 };
        this.particles = [];
        this.init();
    }

    init() {
        this.setupCursorEffects();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupScrollEffects();
        this.setupParallaxEffects();
        this.setupMagneticEffects();
        this.setupRippleEffects();
        this.setupGlowEffects();
        this.setupTextAnimations();
        this.setupCardInteractions();
        this.setupFormInteractions();
        this.setupButtonInteractions();
        this.setupImageInteractions();
        this.setupBackgroundEffects();
    }

    setupCursorEffects() {
        // Custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);

        document.addEventListener('mousemove', (e) => {
            this.cursorPosition.x = e.clientX;
            this.cursorPosition.y = e.clientY;

            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Cursor effects on interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, a, .card, .interactive')) {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });

        // Hide cursor on mobile
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        }
    }

    setupHoverEffects() {
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll('.card, .project-card, .demo-card, .testimonial-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addCardHoverEffect(card, e);
            });

            card.addEventListener('mousemove', (e) => {
                this.updateCardHoverEffect(card, e);
            });

            card.addEventListener('mouseleave', () => {
                this.removeCardHoverEffect(card);
            });
        });

        // Text hover effects
        const textElements = document.querySelectorAll('h1, h2, h3, .hero-title, .section-title');
        textElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addTextGlowEffect(element);
            });

            element.addEventListener('mouseleave', () => {
                this.removeTextGlowEffect(element);
            });
        });
    }

    addCardHoverEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.classList.add('card-hover');
    }

    updateCardHoverEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }

    removeCardHoverEffect(card) {
        card.classList.remove('card-hover');
    }

    addTextGlowEffect(element) {
        element.style.textShadow = `
            0 0 10px rgba(0, 102, 255, 0.5),
            0 0 20px rgba(0, 102, 255, 0.3),
            0 0 30px rgba(0, 102, 255, 0.1)
        `;
        element.style.transform = 'scale(1.02)';
    }

    removeTextGlowEffect(element) {
        element.style.textShadow = '';
        element.style.transform = '';
    }

    setupClickEffects() {
        // Click ripple effects
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
            
            // Track click interactions
            if (window.trackInteraction) {
                window.trackInteraction('click', {
                    x: e.clientX,
                    y: e.clientY,
                    target: e.target.tagName,
                    className: e.target.className
                });
            }
        });

        // Enhanced button clicks
        const buttons = document.querySelectorAll('button, .btn, .nav-link');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createButtonEffect(e);
            });
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    createButtonEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'button-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;

            // Parallax effects
            this.updateParallaxElements(scrollY);

            // Fade in elements
            this.updateScrollAnimations(scrollY);

            // Progress indicators
            this.updateProgressIndicators(scrollY, documentHeight);

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateParallaxElements(scrollY) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateScrollAnimations(scrollY) {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible && !element.classList.contains('animated')) {
                element.classList.add('animated');
                this.triggerAnimation(element);
            }
        });
    }

    triggerAnimation(element) {
        const animation = element.dataset.animate;
        element.style.animation = `${animation} 0.6s ease-out forwards`;
    }

    updateProgressIndicators(scrollY, documentHeight) {
        const progress = (scrollY / (documentHeight - window.innerHeight)) * 100;
        
        // Update circular progress indicators
        const circles = document.querySelectorAll('.progress-circle');
        circles.forEach(circle => {
            const circumference = 2 * Math.PI * 45; // radius = 45
            const offset = circumference - (progress / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });
    }

    setupParallaxEffects() {
        // Mouse parallax for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;

                const x = (clientX - innerWidth / 2) / innerWidth;
                const y = (clientY - innerHeight / 2) / innerHeight;

                const parallaxElements = heroSection.querySelectorAll('[data-mouse-parallax]');
                parallaxElements.forEach(element => {
                    const speed = element.dataset.mouseParallax || 0.1;
                    const moveX = x * speed * 100;
                    const moveY = y * speed * 100;
                    
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        }
    }

    setupMagneticEffects() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 100;
                const strength = Math.max(0, 1 - distance / maxDistance);

                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;

                element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.05})`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }

    setupRippleEffects() {
        // Enhanced ripple for interactive elements
        const rippleElements = document.querySelectorAll('[data-ripple]');
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'material-ripple';
                
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                element.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    setupGlowEffects() {
        // Glow effects on hover
        const glowElements = document.querySelectorAll('[data-glow]');
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow-active');
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow-active');
            });
        });
    }

    setupTextAnimations() {
        // Animated text typing
        const textElements = document.querySelectorAll('[data-typing]');
        textElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';

            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text[index];
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        });

        // Text reveal animations
        const revealElements = document.querySelectorAll('[data-reveal]');
        revealElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';

            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.className = 'reveal-char';
                element.appendChild(span);
            });
        });
    }

    setupCardInteractions() {
        // 3D card flip effects
        const flipCards = document.querySelectorAll('[data-flip]');
        flipCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });

        // Card stack effects
        const cardStacks = document.querySelectorAll('.card-stack');
        cardStacks.forEach(stack => {
            const cards = stack.querySelectorAll('.card');
            
            cards.forEach((card, index) => {
                card.style.zIndex = cards.length - index;
                card.addEventListener('click', () => {
                    // Move clicked card to top
                    cards.forEach(c => c.style.zIndex = parseInt(c.style.zIndex || 0) - 1);
                    card.style.zIndex = 1000;
                });
            });
        });
    }

    setupFormInteractions() {
        // Enhanced form inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Floating labels
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Input validation effects
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const isValid = input.checkValidity();
        
        if (isValid) {
            input.parentElement.classList.add('valid');
            input.parentElement.classList.remove('invalid');
        } else {
            input.parentElement.classList.add('invalid');
            input.parentElement.classList.remove('valid');
        }
    }

    setupButtonInteractions() {
        // Enhanced button states
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            // Loading state
            button.addEventListener('click', function() {
                if (this.dataset.loading) {
                    this.classList.add('loading');
                    this.disabled = true;
                    
                    const originalText = this.textContent;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
                    
                    setTimeout(() => {
                        this.classList.remove('loading');
                        this.disabled = false;
                        this.textContent = originalText;
                    }, 2000);
                }
            });

            // Success state
            button.addEventListener('animationend', (e) => {
                if (e.animationName === 'success-pulse') {
                    button.classList.remove('success');
                }
            });
        });
    }

    setupImageInteractions() {
        // Image zoom on hover
        const images = document.querySelectorAll('[data-zoom]');
        images.forEach(image => {
            image.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
                image.style.zIndex = '10';
            });

            image.addEventListener('mouseleave', () => {
                image.style.transform = '';
                image.style.zIndex = '';
            });

            // Image lightbox
            image.addEventListener('click', () => {
                this.createLightbox(image.src, image.alt);
            });
        });
    }

    createLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.remove();
            }
        });

        // Close on escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    setupBackgroundEffects() {
        // Particle background
        this.createParticleBackground();

        // Gradient animation
        this.createGradientAnimation();

        // Mouse trail effect
        this.createMouseTrail();
    }

    createParticleBackground() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 102, 255, ${particle.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    createGradientAnimation() {
        const gradient = document.createElement('div');
        gradient.className = 'animated-gradient';
        document.body.appendChild(gradient);
    }

    createMouseTrail() {
        let mouseTrail = [];
        const maxTrailLength = 20;

        document.addEventListener('mousemove', (e) => {
            mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (mouseTrail.length > maxTrailLength) {
                mouseTrail.shift();
            }

            this.updateMouseTrail(mouseTrail);
        });
    }

    updateMouseTrail(trail) {
        // Remove old trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());

        // Create new trail elements
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            trailElement.style.left = point.x + 'px';
            trailElement.style.top = point.y + 'px';
            trailElement.style.opacity = (index / trail.length) * 0.5;
            trailElement.style.width = trailElement.style.height = (index / trail.length) * 10 + 2 + 'px';
            
            document.body.appendChild(trailElement);
        });
    }

    // Public methods
    addInteraction(element, type, handler) {
        switch (type) {
            case 'hover':
                element.addEventListener('mouseenter', handler);
                element.addEventListener('mouseleave', handler);
                break;
            case 'click':
                element.addEventListener('click', handler);
                break;
            case 'scroll':
                element.addEventListener('scroll', handler);
                break;
        }
    }

    triggerEffect(element, effect) {
        element.classList.add(effect);
        setTimeout(() => {
            element.classList.remove(effect);
        }, 1000);
    }
}

// Interaction styles
const interactionStyles = `
    <style>
    /* Custom Cursor */
    .custom-cursor {
        width: 8px;
        height: 8px;
        background: #0066ff;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
    }
    
    .cursor-follower {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(0, 102, 255, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.3s ease;
    }
    
    .custom-cursor.hover,
    .cursor-follower.hover {
        transform: scale(2);
        background: rgba(0, 102, 255, 0.8);
        border-color: rgba(0, 102, 255, 0.8);
    }
    
    /* Card Hover Effects */
    .card-hover {
        position: relative;
        overflow: hidden;
    }
    
    .card-hover::before {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 102, 255, 0.1) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: width 0.5s, height 0.5s;
    }
    
    .card-hover:hover::before {
        width: 300px;
        height: 300px;
    }
    
    /* Ripple Effects */
    .ripple-effect {
        position: fixed;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 102, 255, 0.6) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple-expand 1s ease-out forwards;
        z-index: 9998;
    }
    
    @keyframes ripple-expand {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .button-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: button-ripple-expand 0.6s ease-out forwards;
    }
    
    @keyframes button-ripple-expand {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    /* Material Ripple */
    .material-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: material-ripple-expand 0.6s ease-out forwards;
    }
    
    @keyframes material-ripple-expand {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    /* Glow Effects */
    .glow-active {
        box-shadow: 0 0 20px rgba(0, 102, 255, 0.6),
                    0 0 40px rgba(0, 102, 255, 0.4),
                    0 0 60px rgba(0, 102, 255, 0.2);
    }
    
    /* Text Animations */
    .reveal-char {
        display: inline-block;
        opacity: 0;
        animation: reveal-char 0.5s ease-out forwards;
    }
    
    @keyframes reveal-char {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Card Flip */
    .card.flipped {
        transform: rotateY(180deg);
    }
    
    /* Lightbox */
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: lightbox-fade-in 0.3s ease-out;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    @keyframes lightbox-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Mouse Trail */
    .mouse-trail {
        position: fixed;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 102, 255, 0.6) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9997;
        animation: mouse-trail-fade 0.5s ease-out forwards;
    }
    
    @keyframes mouse-trail-fade {
        from {
            opacity: 0.6;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.5);
        }
    }
    
    /* Animated Gradient */
    .animated-gradient {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #001122, #003366, #0066ff, #003366, #001122);
        background-size: 400% 400%;
        animation: gradient-shift 15s ease infinite;
        opacity: 0.03;
        pointer-events: none;
        z-index: 0;
    }
    
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    /* Form States */
    .focused {
        transform: translateY(-2px);
    }
    
    .valid {
        border-color: #00cc66 !important;
    }
    
    .invalid {
        border-color: #ff4444 !important;
    }
    
    /* Button States */
    .loading {
        position: relative;
        pointer-events: none;
    }
    
    .success {
        animation: success-pulse 0.6s ease-out;
    }
    
    @keyframes success-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower,
        .mouse-trail {
            display: none;
        }
        
        .animated-gradient {
            display: none;
        }
    }
    </style>
`;

// Initialize interaction manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add interaction styles
    document.head.insertAdjacentHTML('beforeend', interactionStyles);
    
    // Initialize interaction manager
    window.interactionManager = new InteractionManager();
    
    // Make globally available
    window.triggerEffect = (element, effect) => window.interactionManager.triggerEffect(element, effect);
    window.addInteraction = (element, type, handler) => window.interactionManager.addInteraction(element, type, handler);
});
