// ===== ANALYTICS DASHBOARD JAVASCRIPT =====

class AnalyticsDashboard {
    constructor() {
        this.isVisible = false;
        this.realTimeData = {
            currentVisitors: 0,
            activeUsers: 0,
            pageViews: 0,
            bounceRate: 0,
            avgSessionDuration: 0,
            topPages: [],
            events: []
        };
        this.init();
    }

    init() {
        this.createDashboard();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.loadHistoricalData();
    }

    createDashboard() {
        const dashboardHTML = `
            <div id="analyticsDashboard" class="analytics-dashboard">
                <div class="analytics-header">
                    <h2>📊 Analytics Dashboard</h2>
                    <div class="analytics-controls">
                        <button class="analytics-btn active" data-period="realtime">Tempo Real</button>
                        <button class="analytics-btn" data-period="today">Hoje</button>
                        <button class="analytics-btn" data-period="week">7 Dias</button>
                        <button class="analytics-btn" data-period="month">30 Dias</button>
                        <button class="analytics-toggle" id="analyticsToggle">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="analytics-content">
                    <!-- Real-time Metrics -->
                    <div class="analytics-section" id="realtimeSection">
                        <h3>📈 Métricas em Tempo Real</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-icon">👥</div>
                                <div class="metric-content">
                                    <div class="metric-value" id="currentVisitors">0</div>
                                    <div class="metric-label">Visitantes Ativos</div>
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon">⏱️</div>
                                <div class="metric-content">
                                    <div class="metric-value" id="avgSessionDuration">0s</div>
                                    <div class="metric-label">Duração Média</div>
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon">📄</div>
                                <div class="metric-content">
                                    <div class="metric-value" id="pageViews">0</div>
                                    <div class="metric-label">Visualizações</div>
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon">🔄</div>
                                <div class="metric-content">
                                    <div class="metric-value" id="bounceRate">0%</div>
                                    <div class="metric-label">Taxa de Rejeição</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Live Events Feed -->
                        <div class="events-feed">
                            <h4>🔥 Atividade Recente</h4>
                            <div class="events-list" id="eventsList">
                                <div class="no-events">Nenhuma atividade recente</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Top Pages -->
                    <div class="analytics-section" id="topPagesSection">
                        <h3>🏆 Páginas Mais Visitadas</h3>
                        <div class="top-pages-list" id="topPagesList">
                            <div class="loading">Carregando...</div>
                        </div>
                    </div>
                    
                    <!-- Device Analytics -->
                    <div class="analytics-section" id="deviceSection">
                        <h3>📱 Dispositivos</h3>
                        <div class="device-stats">
                            <div class="device-item">
                                <div class="device-icon">💻</div>
                                <div class="device-info">
                                    <div class="device-name">Desktop</div>
                                    <div class="device-bar">
                                        <div class="device-progress" id="desktopProgress" style="width: 0%"></div>
                                    </div>
                                    <div class="device-percent" id="desktopPercent">0%</div>
                                </div>
                            </div>
                            <div class="device-item">
                                <div class="device-icon">📱</div>
                                <div class="device-info">
                                    <div class="device-name">Mobile</div>
                                    <div class="device-bar">
                                        <div class="device-progress" id="mobileProgress" style="width: 0%"></div>
                                    </div>
                                    <div class="device-percent" id="mobilePercent">0%</div>
                                </div>
                            </div>
                            <div class="device-item">
                                <div class="device-icon">📱</div>
                                <div class="device-info">
                                    <div class="device-name">Tablet</div>
                                    <div class="device-bar">
                                        <div class="device-progress" id="tabletProgress" style="width: 0%"></div>
                                    </div>
                                    <div class="device-percent" id="tabletPercent">0%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Performance Metrics -->
                    <div class="analytics-section" id="performanceSection">
                        <h3>⚡ Performance</h3>
                        <div class="performance-metrics">
                            <div class="perf-metric">
                                <div class="perf-label">FCP</div>
                                <div class="perf-value" id="fcpValue">-</div>
                                <div class="perf-status" id="fcpStatus">-</div>
                            </div>
                            <div class="perf-metric">
                                <div class="perf-label">LCP</div>
                                <div class="perf-value" id="lcpValue">-</div>
                                <div class="perf-status" id="lcpStatus">-</div>
                            </div>
                            <div class="perf-metric">
                                <div class="perf-label">FID</div>
                                <div class="perf-value" id="fidValue">-</div>
                                <div class="perf-status" id="fidStatus">-</div>
                            </div>
                            <div class="perf-metric">
                                <div class="perf-label">CLS</div>
                                <div class="perf-value" id="clsValue">-</div>
                                <div class="perf-status" id="clsStatus">-</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Export Options -->
                    <div class="analytics-section">
                        <h3>📤 Exportar Dados</h3>
                        <div class="export-options">
                            <button class="export-btn" id="exportCSV">
                                <i class="fas fa-file-csv"></i>
                                Exportar CSV
                            </button>
                            <button class="export-btn" id="exportJSON">
                                <i class="fas fa-file-code"></i>
                                Exportar JSON
                            </button>
                            <button class="export-btn" id="exportPDF">
                                <i class="fas fa-file-pdf"></i>
                                Exportar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }

    setupEventListeners() {
        // Toggle dashboard
        const toggleBtn = document.getElementById('analyticsToggle');
        const dashboard = document.getElementById('analyticsDashboard');
        
        if (toggleBtn && dashboard) {
            toggleBtn.addEventListener('click', () => {
                this.toggleDashboard();
            });
        }

        // Period buttons
        const periodBtns = document.querySelectorAll('.analytics-btn[data-period]');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPeriod(e.target.dataset.period);
            });
        });

        // Export buttons
        document.getElementById('exportCSV')?.addEventListener('click', () => this.exportData('csv'));
        document.getElementById('exportJSON')?.addEventListener('click', () => this.exportData('json'));
        document.getElementById('exportPDF')?.addEventListener('click', () => this.exportData('pdf'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.toggleDashboard();
            }
        });
    }

    toggleDashboard() {
        const dashboard = document.getElementById('analyticsDashboard');
        const toggleBtn = document.getElementById('analyticsToggle');
        
        this.isVisible = !this.isVisible;
        dashboard.classList.toggle('visible', this.isVisible);
        
        if (toggleBtn) {
            toggleBtn.innerHTML = this.isVisible ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-chart-line"></i>';
        }

        // Track dashboard usage
        if (window.trackAnalytics) {
            window.trackAnalytics('dashboard_toggle', {
                action: this.isVisible ? 'open' : 'close',
                timestamp: new Date().toISOString()
            });
        }
    }

    switchPeriod(period) {
        // Update active button
        document.querySelectorAll('.analytics-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`)?.classList.add('active');

        // Load data for period
        this.loadPeriodData(period);

        // Track period change
        if (window.trackAnalytics) {
            window.trackAnalytics('period_change', {
                period,
                timestamp: new Date().toISOString()
            });
        }
    }

    startRealTimeUpdates() {
        // Update metrics every 5 seconds
        setInterval(() => {
            if (this.isVisible) {
                this.updateRealTimeMetrics();
            }
        }, 5000);

        // Listen for analytics events
        window.addEventListener('analyticsUpdate', (e) => {
            if (this.isVisible) {
                this.handleAnalyticsEvent(e.detail);
            }
        });
    }

    updateRealTimeMetrics() {
        // Simulate real-time data updates
        const variation = () => Math.floor(Math.random() * 10) - 5;
        
        this.realTimeData.currentVisitors = Math.max(1, this.realTimeData.currentVisitors + variation());
        this.realTimeData.pageViews += Math.floor(Math.random() * 3);
        this.realTimeData.avgSessionDuration = Math.max(30, this.realTimeData.avgSessionDuration + variation());
        this.realTimeData.bounceRate = Math.max(20, Math.min(80, this.realTimeData.bounceRate + variation()));

        this.updateRealTimeDisplay();
    }

    updateRealTimeDisplay() {
        document.getElementById('currentVisitors').textContent = this.realTimeData.currentVisitors;
        document.getElementById('pageViews').textContent = this.realTimeData.pageViews;
        document.getElementById('avgSessionDuration').textContent = this.realTimeData.avgSessionDuration + 's';
        document.getElementById('bounceRate').textContent = this.realTimeData.bounceRate + '%';
    }

    handleAnalyticsEvent(eventData) {
        // Add event to real-time feed
        this.realTimeData.events.unshift({
            ...eventData,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 events
        if (this.realTimeData.events.length > 10) {
            this.realTimeData.events = this.realTimeData.events.slice(0, 10);
        }

        this.updateEventsFeed();
    }

    updateEventsFeed() {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;

        if (this.realTimeData.events.length === 0) {
            eventsList.innerHTML = '<div class="no-events">Nenhuma atividade recente</div>';
            return;
        }

        eventsList.innerHTML = this.realTimeData.events.map(event => `
            <div class="event-item">
                <div class="event-icon">${this.getEventIcon(event.eventName)}</div>
                <div class="event-content">
                    <div class="event-name">${this.formatEventName(event.eventName)}</div>
                    <div class="event-time">${this.formatTime(event.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getEventIcon(eventName) {
        const icons = {
            'page_view': '👁️',
            'outbound_click': '🔗',
            'form_submission': '📝',
            'scroll_depth': '📜',
            'engagement_paused': '⏸️',
            'engagement_resumed': '▶️',
            'search_query': '🔍',
            'social_share': '📤',
            'download_click': '⬇️'
        };
        return icons[eventName] || '📊';
    }

    formatEventName(eventName) {
        const names = {
            'page_view': 'Visualização de Página',
            'outbound_click': 'Clique Externo',
            'form_submission': 'Envio de Formulário',
            'scroll_depth': 'Profundidade de Scroll',
            'engagement_paused': 'Engajamento Pausado',
            'engagement_resumed': 'Engajamento Retomado',
            'search_query': 'Busca Realizada',
            'social_share': 'Compartilhamento',
            'download_click': 'Download'
        };
        return names[eventName] || eventName;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Agora pouco';
        } else if (diff < 3600000) { // Less than 1 hour
            return `${Math.floor(diff / 60000)} min atrás`;
        } else {
            return date.toLocaleTimeString('pt-BR');
        }
    }

    loadHistoricalData() {
        // Load data from local storage
        const storedData = localStorage.getItem('portfolio_analytics_historical');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                this.updateDeviceStats(data.devices || {});
                this.updateTopPages(data.topPages || []);
                this.updatePerformanceMetrics(data.performance || {});
            } catch (error) {
                console.error('Error loading historical data:', error);
            }
        }
    }

    loadPeriodData(period) {
        // Simulate loading different period data
        const multipliers = {
            realtime: 1,
            today: 1,
            week: 7,
            month: 30
        };

        const multiplier = multipliers[period] || 1;
        
        this.realTimeData.currentVisitors = Math.floor(Math.random() * 50 * multiplier) + 10;
        this.realTimeData.pageViews = Math.floor(Math.random() * 200 * multiplier) + 50;
        this.realTimeData.avgSessionDuration = Math.floor(Math.random() * 180 * multiplier) + 60;
        this.realTimeData.bounceRate = Math.floor(Math.random() * 40 * multiplier) + 20;

        this.updateRealTimeDisplay();
        this.updateDeviceStats({});
        this.updateTopPages([]);
    }

    updateDeviceStats(devices) {
        // Simulate device distribution
        const desktop = 45 + Math.floor(Math.random() * 20);
        const mobile = 35 + Math.floor(Math.random() * 15);
        const tablet = 20 + Math.floor(Math.random() * 10);

        document.getElementById('desktopProgress').style.width = desktop + '%';
        document.getElementById('desktopPercent').textContent = desktop + '%';
        
        document.getElementById('mobileProgress').style.width = mobile + '%';
        document.getElementById('mobilePercent').textContent = mobile + '%';
        
        document.getElementById('tabletProgress').style.width = tablet + '%';
        document.getElementById('tabletPercent').textContent = tablet + '%';
    }

    updateTopPages(pages) {
        const topPagesList = document.getElementById('topPagesList');
        if (!topPagesList) return;

        // Simulate top pages data
        const simulatedPages = [
            { url: '#home', title: 'Home', views: 245 },
            { url: '#projetos', title: 'Projetos', views: 189 },
            { url: '#demos', title: 'Demos', views: 156 },
            { url: '#playground', title: 'Playground', views: 134 },
            { url: '#contato', title: 'Contato', views: 98 }
        ];

        topPagesList.innerHTML = simulatedPages.map((page, index) => `
            <div class="top-page-item">
                <div class="page-rank">#${index + 1}</div>
                <div class="page-info">
                    <div class="page-title">${page.title}</div>
                    <div class="page-url">${page.url}</div>
                </div>
                <div class="page-views">${page.views}</div>
            </div>
        `).join('');
    }

    updatePerformanceMetrics(performance) {
        // Simulate Core Web Vitals
        const fcp = 800 + Math.floor(Math.random() * 1200);
        const lcp = 1200 + Math.floor(Math.random() * 1800);
        const fid = 50 + Math.floor(Math.random() * 150);
        const cls = (Math.random() * 0.2).toFixed(3);

        this.updateMetricDisplay('fcp', fcp, 'good');
        this.updateMetricDisplay('lcp', lcp, 'needs-improvement');
        this.updateMetricDisplay('fid', fid, 'good');
        this.updateMetricDisplay('cls', cls, 'good');
    }

    updateMetricDisplay(metric, value, status) {
        const valueEl = document.getElementById(metric + 'Value');
        const statusEl = document.getElementById(metric + 'Status');
        
        if (valueEl) valueEl.textContent = this.formatMetricValue(metric, value);
        if (statusEl) statusEl.textContent = this.formatStatus(status);
    }

    formatMetricValue(metric, value) {
        switch (metric) {
            case 'fcp':
            case 'lcp':
                return (value / 1000).toFixed(1) + 's';
            case 'fid':
                return value + 'ms';
            case 'cls':
                return value;
            default:
                return value;
        }
    }

    formatStatus(status) {
        const statusMap = {
            'good': '✅ Bom',
            'needs-improvement': '⚠️ Melhorar',
            'poor': '❌ Ruim'
        };
        return statusMap[status] || status;
    }

    exportData(format) {
        // Get current analytics data
        const data = {
            exportDate: new Date().toISOString(),
            metrics: this.realTimeData,
            config: window.getAnalyticsConfig?.()
        };

        switch (format) {
            case 'csv':
                this.exportToCSV(data);
                break;
            case 'json':
                this.exportToJSON(data);
                break;
            case 'pdf':
                this.exportToPDF(data);
                break;
        }

        // Track export event
        if (window.trackAnalytics) {
            window.trackAnalytics('data_export', {
                format,
                timestamp: new Date().toISOString()
            });
        }
    }

    exportToCSV(data) {
        const csv = this.convertToCSV(data);
        this.downloadFile(csv, 'analytics-export.csv', 'text/csv');
    }

    exportToJSON(data) {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'analytics-export.json', 'application/json');
    }

    exportToPDF(data) {
        // Simple PDF export (would need a PDF library for full implementation)
        const html = `
            <html>
                <head>
                    <title>Analytics Export</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #0066ff; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Analytics Export - ${new Date().toLocaleDateString('pt-BR')}</h1>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </body>
            </html>
        `;
        
        this.downloadFile(html, 'analytics-export.html', 'text/html');
    }

    convertToCSV(data) {
        const headers = ['Métrica', 'Valor', 'Data'];
        const rows = [
            ['Visitantes Ativos', data.metrics.currentVisitors, new Date().toLocaleDateString('pt-BR')],
            ['Visualizações', data.metrics.pageViews, new Date().toLocaleDateString('pt-BR')],
            ['Duração Média', data.metrics.avgSessionDuration + 's', new Date().toLocaleDateString('pt-BR')],
            ['Taxa de Rejeição', data.metrics.bounceRate + '%', new Date().toLocaleDateString('pt-BR')]
        ];

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csvContent;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Analytics Dashboard Styles
const dashboardStyles = `
    <style>
    .analytics-dashboard {
        position: fixed;
        top: 0;
        right: -500px;
        width: 500px;
        height: 100vh;
        background: var(--card-bg);
        border-left: 2px solid var(--accent-color);
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
        z-index: 10002;
        transition: right 0.3s ease;
        overflow-y: auto;
    }
    
    .analytics-dashboard.visible {
        right: 0;
    }
    
    .analytics-header {
        background: var(--bg-tertiary);
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    .analytics-header h2 {
        color: var(--text-primary);
        margin: 0;
        font-size: 1.2rem;
    }
    
    .analytics-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--spacing-sm);
    }
    
    .analytics-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: var(--transition-fast);
        font-size: 0.9rem;
    }
    
    .analytics-btn.active {
        background: var(--accent-color);
        color: var(--text-primary);
        border-color: var(--accent-color);
    }
    
    .analytics-btn:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
    
    .analytics-toggle {
        background: var(--accent-color);
        border: none;
        color: var(--text-primary);
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-fast);
    }
    
    .analytics-toggle:hover {
        background: #0052cc;
        transform: scale(1.1);
    }
    
    .analytics-content {
        padding: var(--spacing-md);
    }
    
    .analytics-section {
        margin-bottom: var(--spacing-lg);
    }
    
    .analytics-section h3 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
        font-size: 1.1rem;
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
    }
    
    .metric-card {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        transition: var(--transition-fast);
    }
    
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .metric-icon {
        font-size: 2rem;
        min-width: 50px;
        text-align: center;
    }
    
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1;
    }
    
    .metric-label {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 4px;
    }
    
    .events-feed {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
    }
    
    .events-feed h4 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
    }
    
    .event-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        border-bottom: 1px solid var(--border-color);
        transition: var(--transition-fast);
    }
    
    .event-item:hover {
        background: var(--bg-primary);
    }
    
    .event-item:last-child {
        border-bottom: none;
    }
    
    .event-icon {
        font-size: 1.2rem;
        min-width: 30px;
    }
    
    .event-content {
        flex: 1;
    }
    
    .event-name {
        color: var(--text-primary);
        font-weight: 500;
        margin-bottom: 2px;
    }
    
    .event-time {
        color: var(--text-secondary);
        font-size: 0.8rem;
    }
    
    .no-events {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
        padding: var(--spacing-lg);
    }
    
    .top-pages-list {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
    }
    
    .top-page-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        border-bottom: 1px solid var(--border-color);
        transition: var(--transition-fast);
    }
    
    .top-page-item:hover {
        background: var(--bg-primary);
    }
    
    .top-page-item:last-child {
        border-bottom: none;
    }
    
    .page-rank {
        background: var(--accent-color);
        color: var(--text-primary);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.8rem;
    }
    
    .page-info {
        flex: 1;
    }
    
    .page-title {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .page-url {
        color: var(--text-secondary);
        font-size: 0.8rem;
    }
    
    .page-views {
        background: var(--bg-primary);
        color: var(--accent-color);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .device-stats {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
    }
    
    .device-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
    }
    
    .device-item:last-child {
        margin-bottom: 0;
    }
    
    .device-icon {
        font-size: 2rem;
        min-width: 50px;
        text-align: center;
    }
    
    .device-info {
        flex: 1;
    }
    
    .device-name {
        color: var(--text-primary);
        font-weight: 500;
        margin-bottom: var(--spacing-xs);
    }
    
    .device-bar {
        background: var(--bg-primary);
        height: 8px;
        border-radius: var(--radius-sm);
        overflow: hidden;
        margin-bottom: var(--spacing-xs);
    }
    
    .device-progress {
        height: 100%;
        background: var(--accent-color);
        transition: width 0.5s ease;
    }
    
    .device-percent {
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-align: right;
    }
    
    .performance-metrics {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
    }
    
    .perf-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm);
        border-bottom: 1px solid var(--border-color);
    }
    
    .perf-metric:last-child {
        border-bottom: none;
    }
    
    .perf-label {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .perf-value {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .perf-status {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .export-options {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }
    
    .export-btn {
        background: var(--accent-color);
        color: var(--text-primary);
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        transition: var(--transition-fast);
        font-size: 0.9rem;
    }
    
    .export-btn:hover {
        background: #0052cc;
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        .analytics-dashboard {
            width: 100%;
            right: -100%;
        }
        
        .analytics-dashboard.visible {
            right: 0;
        }
        
        .metrics-grid {
            grid-template-columns: 1fr;
        }
        
        .analytics-controls {
            flex-direction: column;
            gap: var(--spacing-sm);
        }
        
        .export-options {
            flex-direction: column;
        }
    }
    </style>
`;

// Initialize analytics dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add dashboard styles
    document.head.insertAdjacentHTML('beforeend', dashboardStyles);
    
    // Initialize analytics dashboard
    window.analyticsDashboard = new AnalyticsDashboard();
    
    // Make globally available
    window.toggleAnalyticsDashboard = () => window.analyticsDashboard.toggleDashboard();
});
