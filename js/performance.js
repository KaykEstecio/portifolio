// ===== PERFORMANCE OPTIMIZATION =====

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            fcp: 0,
            lcp: 0,
            fid: 0,
            cls: 0,
            ttfb: 0
        };
        this.init();
    }

    init() {
        this.measureCoreWebVitals();
        this.optimizeImages();
        this.setupLazyLoading();
        this.setupServiceWorker();
        this.setupResourceHints();
        this.setupIntersectionObserver();
        this.setupDebouncing();
        this.setupThrottling();
        this.setupMemoryManagement();
    }

    measureCoreWebVitals() {
        // First Contentful Paint (FCP)
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                    console.log('FCP:', entry.startTime);
                }
            }
        });
        observer.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.processingStart && entry.startTime) {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    console.log('FID:', this.metrics.fid);
                }
            }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.cls = clsValue;
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Time to First Byte (TTFB)
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
                console.log('TTFB:', this.metrics.ttfb);
            }
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" to images below the fold
            if (img.getBoundingClientRect().top > window.innerHeight) {
                img.loading = 'lazy';
            }

            // Add error handling
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.warn('Image failed to load:', img.src);
            });

            // Add fade-in effect
            img.addEventListener('load', () => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease-in';
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            });
        });
    }

    setupLazyLoading() {
        // Lazy load images and sections
        const lazyElements = document.querySelectorAll('img[data-lazy], section[data-lazy]');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.tagName === 'IMG') {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-lazy');
                    } else {
                        element.classList.add('loaded');
                    }
                    
                    lazyObserver.unobserve(element);
                }
            });
        }, {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }

    setupServiceWorker() {
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    setupResourceHints() {
        // DNS prefetch for external resources
        const externalDomains = [
            'fonts.googleapis.com',
            'cdnjs.cloudflare.com',
            'github.com',
            'linkedin.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // Preload critical resources
        const criticalResources = [
            { href: '/css/style.css', as: 'style' },
            { href: '/js/main.js', as: 'script' },
            { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.type) link.type = resource.type;
            document.head.appendChild(link);
        });
    }

    setupIntersectionObserver() {
        // Observe sections for animations
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Track section visibility
                    if (window.trackInteraction) {
                        window.trackInteraction('section_visible', {
                            section: entry.target.id,
                            visible: true,
                            timestamp: Date.now()
                        });
                    }
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    setupDebouncing() {
        // Debounce scroll events
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;

        window.onscroll = (e) => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) {
                    originalScrollHandler(e);
                }
                
                // Track scroll depth
                if (window.trackInteraction) {
                    window.trackInteraction('scroll', {
                        depth: window.scrollY,
                        maxDepth: document.body.scrollHeight - window.innerHeight,
                        percentage: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                    });
                }
            }, 16); // ~60fps
        };

        // Debounce resize events
        let resizeTimeout;
        const originalResizeHandler = window.onresize;

        window.onresize = (e) => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (originalResizeHandler) {
                    originalResizeHandler(e);
                }
                
                // Track resize
                if (window.trackInteraction) {
                    window.trackInteraction('resize', {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        device: this.getDeviceType()
                    });
                }
            }, 250);
        };
    }

    setupThrottling() {
        // Throttle mouse move events
        let mouseMoveThrottle = false;
        
        document.addEventListener('mousemove', (e) => {
            if (mouseMoveThrottle) return;
            
            mouseMoveThrottle = true;
            requestAnimationFrame(() => {
                // Track mouse movement
                if (window.trackInteraction) {
                    window.trackInteraction('mouse_move', {
                        x: e.clientX,
                        y: e.clientY,
                        page: window.location.pathname
                    });
                }
                
                mouseMoveThrottle = false;
            });
        });
    }

    setupMemoryManagement() {
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                const used = memory.usedJSHeapSize / 1024 / 1024;
                const total = memory.totalJSHeapSize / 1024 / 1024;
                
                if (used > 50) { // Alert if using more than 50MB
                    console.warn(`High memory usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
                    
                    // Trigger garbage collection
                    if (window.gc) {
                        window.gc();
                    }
                }
            }, 10000); // Check every 10 seconds
        }

        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        const isLowEnd = this.isLowEndDevice();
        
        if (isLowEnd) {
            document.documentElement.style.setProperty('--transition-fast', '0.1s ease');
            document.documentElement.style.setProperty('--transition-normal', '0.2s ease');
            
            // Disable particle animations
            const particles = document.querySelector('.particles');
            if (particles) {
                particles.style.display = 'none';
            }
        }
    }

    isLowEndDevice() {
        // Check for low-end device indicators
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const isLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return isSlowConnection || isLowMemory || isLowCores;
    }

    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            console.log(`DOM content loaded: ${domContentLoaded}ms`);
            
            // Track performance metrics
            if (window.trackInteraction) {
                window.trackInteraction('page_performance', {
                    loadTime,
                    domContentLoaded,
                    fcp: this.metrics.fcp,
                    lcp: this.metrics.lcp,
                    fid: this.metrics.fid,
                    cls: this.metrics.cls,
                    ttfb: this.metrics.ttfb
                });
            }
        });
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            
            if (window.trackInteraction) {
                window.trackInteraction('javascript_error', {
                    message: e.error.message,
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno,
                    stack: e.error.stack
                });
            }
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            
            if (window.trackInteraction) {
                window.trackInteraction('promise_rejection', {
                    reason: e.reason,
                    stack: e.reason?.stack
                });
            }
        });
    }

    cleanup() {
        // Clean up observers and event listeners
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.lazyObserver) {
            this.lazyObserver.disconnect();
        }
    }

    // Public API
    getMetrics() {
        return { ...this.metrics };
    }

    optimizePage() {
        this.optimizeAnimations();
        this.setupPerformanceMonitoring();
        this.setupErrorHandling();
    }
}

// Service Worker for caching
const serviceWorkerCode = `
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/css/animations.css',
    '/js/main.js',
    '/js/database.js',
    '/js/router.js',
    '/images/',
    '/fonts/'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
`;

// Create service worker file
const swBlob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
const swUrl = URL.createObjectURL(swBlob);

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.performanceOptimizer.optimizePage();
    
    // Make globally available
    window.getPerformanceMetrics = () => window.performanceOptimizer.getMetrics();
});
