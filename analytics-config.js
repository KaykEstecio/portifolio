// ===== ANALYTICS CONFIGURATION =====

// Analytics Configuration
const ANALYTICS_CONFIG = {
    // Google Analytics 4
    GA4: {
        MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
        ENABLED: true,
        DEBUG: false,
        CUSTOM_DIMENSIONS: {
            VISITOR_TYPE: 'custom_dimension_1',
            INTERACTION_TYPE: 'custom_dimension_2',
            DEVICE_TYPE: 'custom_dimension_3',
            SESSION_DURATION: 'custom_dimension_4'
        },
        CUSTOM_METRICS: {
            ENGAGEMENT_SCORE: 'custom_metric_1',
            SCROLL_DEPTH: 'custom_metric_2',
            TIME_ON_PAGE: 'custom_metric_3'
        }
    },

    // Hotjar
    HOTJAR: {
        ENABLED: true,
        SITE_ID: 'XXXXXXXXXX', // Replace with your Hotjar Site ID
        SCRIPT_VERSION: 6
    },

    // Microsoft Clarity
    CLARITY: {
        ENABLED: true,
        PROJECT_ID: 'XXXXXXXXXX' // Replace with your Clarity Project ID
    },

    // Meta Pixel
    META_PIXEL: {
        ENABLED: true,
        PIXEL_ID: 'XXXXXXXXXX' // Replace with your Meta Pixel ID
    },

    // LinkedIn Insight Tag
    LINKEDIN: {
        ENABLED: true,
        PARTNER_ID: 'XXXXXXXXXX' // Replace with your LinkedIn Partner ID
    },

    // Custom Analytics Endpoint
    CUSTOM_ENDPOINT: {
        ENABLED: false,
        URL: 'https://your-analytics-api.com/events', // Replace with your endpoint
        HEADERS: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // Replace with your API key
        }
    },

    // Local Storage
    LOCAL_STORAGE: {
        ENABLED: true,
        PREFIX: 'portfolio_analytics_',
        MAX_EVENTS: 100,
        SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
    },

    // Performance Tracking
    PERFORMANCE: {
        ENABLED: true,
        CORE_WEB_VITALS: true,
        RESOURCE_TIMING: true,
        USER_TIMING: true
    },

    // Privacy Settings
    PRIVACY: {
        RESPECT_DO_NOT_TRACK: true,
        ANONYMIZE_IP: false,
        COOKIE_CONSENT: true,
        GDPR_COMPLIANT: true
    },

    // Events Configuration
    EVENTS: {
        PAGE_VIEW: 'page_view',
        SCROLL_DEPTH: 'scroll_depth',
        TIME_ON_PAGE: 'time_on_page',
        OUTBOUND_CLICK: 'outbound_click',
        FORM_SUBMISSION: 'form_submission',
        DOWNLOAD_CLICK: 'download_click',
        VIDEO_PLAY: 'video_play',
        VIDEO_COMPLETE: 'video_complete',
        SEARCH_QUERY: 'search_query',
        SOCIAL_SHARE: 'social_share',
        ERROR_OCCURRED: 'error_occurred',
        ENGAGEMENT_PAUSED: 'engagement_paused',
        ENGAGEMENT_RESUMED: 'engagement_resumed'
    },

    // Categories
    CATEGORIES: {
        NAVIGATION: 'Navigation',
        CONTENT: 'Content',
        USER_INTERACTION: 'User Interaction',
        PERFORMANCE: 'Performance',
        ERROR: 'Error',
        CONVERSION: 'Conversion',
        SOCIAL: 'Social',
        SEARCH: 'Search'
    }
};

// Initialize analytics configuration
window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;

// Auto-configuration helper
function configureAnalytics(config = {}) {
    // Merge user config with defaults
    const finalConfig = {
        ...ANALYTICS_CONFIG,
        ...config
    };

    // Update global config
    window.ANALYTICS_CONFIG = finalConfig;

    // Re-initialize analytics if already loaded
    if (window.portfolioAnalytics) {
        console.log('Analytics configuration updated');
        // You might want to re-initialize some components here
    }

    return finalConfig;
}

// Get current configuration
function getAnalyticsConfig() {
    return window.ANALYTICS_CONFIG || ANALYTICS_CONFIG;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ANALYTICS_CONFIG,
        configureAnalytics,
        getAnalyticsConfig
    };
}

// Development helper
if (typeof window !== 'undefined') {
    // Add analytics configuration to window for easy access
    window.configureAnalytics = configureAnalytics;
    window.getAnalyticsConfig = getAnalyticsConfig;
    
    // Development mode detection
    const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname === '0.0.0.0' ||
                       window.location.protocol === 'file:';
    
    if (isDevelopment) {
        console.log('📊 Analytics Configuration Loaded');
        console.log('🔧 To configure analytics, call: configureAnalytics({');
        console.log('   GA4: { MEASUREMENT_ID: "G-YOUR_ID" }');
        console.log('   HOTJAR: { SITE_ID: "YOUR_ID" }');
        console.log('   CLARITY: { PROJECT_ID: "YOUR_ID" }');
        console.log('   META_PIXEL: { PIXEL_ID: "YOUR_ID" }');
        console.log('   LINKEDIN: { PARTNER_ID: "YOUR_ID" }');
        console.log('})');
        console.log('');
        console.log('📋 Current configuration:');
        console.table(getAnalyticsConfig());
    }
}
