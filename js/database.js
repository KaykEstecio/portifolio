// ===== DATABASE JAVASCRIPT =====

// Database Manager for Portfolio
class PortfolioDatabase {
    constructor() {
        this.dbName = 'kaykPortfolioDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('visitors')) {
                    const visitorsStore = db.createObjectStore('visitors', { keyPath: 'id', autoIncrement: true });
                    visitorsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    visitorsStore.createIndex('sessionId', 'sessionId', { unique: false });
                }

                if (!db.objectStoreNames.contains('interactions')) {
                    const interactionsStore = db.createObjectStore('interactions', { keyPath: 'id', autoIncrement: true });
                    interactionsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    interactionsStore.createIndex('type', 'type', { unique: false });
                    interactionsStore.createIndex('visitorId', 'visitorId', { unique: false });
                }

                if (!db.objectStoreNames.contains('projects')) {
                    const projectsStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
                    projectsStore.createIndex('name', 'name', { unique: true });
                    projectsStore.createIndex('category', 'category', { unique: false });
                    projectsStore.createIndex('views', 'views', { unique: false });
                }

                if (!db.objectStoreNames.contains('contacts')) {
                    const contactsStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
                    contactsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    contactsStore.createIndex('email', 'email', { unique: false });
                    contactsStore.createIndex('status', 'status', { unique: false });
                }

                if (!db.objectStoreNames.contains('analytics')) {
                    const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
                    analyticsStore.createIndex('date', 'date', { unique: false });
                    analyticsStore.createIndex('type', 'type', { unique: false });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    const settingsStore = db.createObjectStore('settings', { keyPath: 'key', autoIncrement: false });
                }
            };
        });
    }

    // Generic CRUD operations
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName, indexName = null, value = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            let request;

            if (indexName && value) {
                const index = store.index(indexName);
                request = index.getAll(value);
            } else {
                request = store.getAll();
            }

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Specific methods for portfolio data
    async trackVisitor(visitorData) {
        const data = {
            ...visitorData,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        return this.add('visitors', data);
    }

    async trackInteraction(interactionData) {
        const data = {
            ...interactionData,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
        return this.add('interactions', data);
    }

    async getVisitorStats() {
        const visitors = await this.getAll('visitors');
        const interactions = await this.getAll('interactions');
        
        const today = new Date().toDateString();
        const todayVisitors = visitors.filter(v => new Date(v.timestamp).toDateString() === today);
        const todayInteractions = interactions.filter(i => new Date(i.timestamp).toDateString() === today);

        return {
            totalVisitors: visitors.length,
            todayVisitors: todayVisitors.length,
            totalInteractions: interactions.length,
            todayInteractions: todayInteractions.length,
            averageTime: this.calculateAverageTime(interactions),
            topPages: this.getTopPages(interactions)
        };
    }

    async incrementProjectViews(projectId) {
        const project = await this.get('projects', projectId);
        if (project) {
            project.views = (project.views || 0) + 1;
            project.lastViewed = new Date().toISOString();
            return this.update('projects', project);
        }
    }

    async saveContact(contactData) {
        const data = {
            ...contactData,
            timestamp: new Date().toISOString(),
            status: 'pending',
            sessionId: this.generateSessionId()
        };
        return this.add('contacts', data);
    }

    async getAnalyticsData(type, days = 30) {
        const analytics = await this.getAll('analytics');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return analytics.filter(a => 
            a.type === type && new Date(a.date) >= cutoffDate
        );
    }

    async saveSetting(key, value) {
        const data = { key, value, timestamp: new Date().toISOString() };
        return this.add('settings', data);
    }

    async getSetting(key) {
        const settings = await this.getAll('settings');
        const setting = settings.find(s => s.key === key);
        return setting ? setting.value : null;
    }

    // Utility methods
    generateSessionId() {
        let sessionId = sessionStorage.getItem('portfolio_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('portfolio_session_id', sessionId);
        }
        return sessionId;
    }

    calculateAverageTime(interactions) {
        if (interactions.length < 2) return 0;
        
        const sessionTimes = {};
        interactions.forEach(interaction => {
            if (!sessionTimes[interaction.sessionId]) {
                sessionTimes[interaction.sessionId] = [];
            }
            sessionTimes[interaction.sessionId].push(new Date(interaction.timestamp));
        });

        const sessionDurations = Object.values(sessionTimes).map(times => {
            if (times.length < 2) return 0;
            const start = times[0];
            const end = times[times.length - 1];
            return (end - start) / 1000; // Convert to seconds
        });

        const totalDuration = sessionDurations.reduce((sum, duration) => sum + duration, 0);
        return Math.round(totalDuration / sessionDurations.length);
    }

    getTopPages(interactions) {
        const pageCounts = {};
        interactions.forEach(interaction => {
            const page = interaction.page || 'unknown';
            pageCounts[page] = (pageCounts[page] || 0) + 1;
        });

        return Object.entries(pageCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([page, count]) => ({ page, count }));
    }

    async exportData() {
        const visitors = await this.getAll('visitors');
        const interactions = await this.getAll('interactions');
        const projects = await this.getAll('projects');
        const contacts = await this.getAll('contacts');
        const analytics = await this.getAll('analytics');

        return {
            visitors,
            interactions,
            projects,
            contacts,
            analytics,
            exportDate: new Date().toISOString(),
            version: this.version
        };
    }

    async clearOldData(days = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const stores = ['visitors', 'interactions', 'analytics'];
        
        for (const storeName of stores) {
            const data = await this.getAll(storeName);
            const oldData = data.filter(item => new Date(item.timestamp) < cutoffDate);
            
            for (const item of oldData) {
                await this.delete(storeName, item.id);
            }
        }
    }
}

// Initialize database
let portfolioDB;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        portfolioDB = new PortfolioDatabase();
        await portfolioDB.init();
        
        // Track initial visitor
        await trackInitialVisitor();
        
        // Initialize real-time updates
        initializeRealTimeUpdates();
        
        console.log('Portfolio Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});

// Track initial visitor
async function trackInitialVisitor() {
    if (!portfolioDB) return;
    
    const visitorData = {
        page: window.location.pathname,
        entryPoint: document.referrer || 'direct',
        device: getDeviceType(),
        browser: getBrowserInfo(),
        location: await getUserLocation()
    };
    
    await portfolioDB.trackVisitor(visitorData);
}

// Track user interactions
async function trackInteraction(type, data = {}) {
    if (!portfolioDB) return;
    
    const interactionData = {
        type,
        page: window.location.pathname,
        ...data
    };
    
    await portfolioDB.trackInteraction(interactionData);
}

// Get device type
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

// Get browser info
function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
}

// Get user location (simulated for privacy)
async function getUserLocation() {
    // In production, you might want to use a geolocation API
    // For now, return simulated data
    return {
        country: 'Brazil',
        city: 'São Paulo',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

// Initialize real-time updates
function initializeRealTimeUpdates() {
    // Update visitor count every 30 seconds
    setInterval(async () => {
        if (portfolioDB) {
            const stats = await portfolioDB.getVisitorStats();
            updateUIWithStats(stats);
        }
    }, 30000);

    // Track page views
    window.addEventListener('beforeunload', async () => {
        await trackInteraction('page_leave', {
            timeOnPage: performance.now()
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        maxScroll = Math.max(maxScroll, scrollPercent);
    });

    window.addEventListener('beforeunload', async () => {
        await trackInteraction('scroll_depth', { maxScroll });
    });
}

// Update UI with stats
function updateUIWithStats(stats) {
    // Update dashboard metrics if available
    const visitorsElement = document.getElementById('visitorsToday');
    if (visitorsElement) {
        visitorsElement.textContent = stats.todayVisitors;
    }

    const engagementElement = document.getElementById('engagementRate');
    if (engagementElement && stats.totalVisitors > 0) {
        const rate = ((stats.totalInteractions / stats.totalVisitors) * 100).toFixed(1);
        engagementElement.textContent = `${rate}%`;
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }));
}

// Export database functions for global use
window.portfolioDB = portfolioDB;
window.trackInteraction = trackInteraction;
window.updateUIWithStats = updateUIWithStats;
