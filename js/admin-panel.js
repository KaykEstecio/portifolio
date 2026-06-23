// ===== ADMIN PANEL JAVASCRIPT =====

class AdminPanel {
    constructor() {
        this.isVisible = false;
        this.stats = null;
        this.init();
    }

    init() {
        this.createAdminPanel();
        this.setupEventListeners();
        this.loadStats();
    }

    createAdminPanel() {
        // Create admin panel HTML
        const adminHTML = `
            <div id="adminPanel" class="admin-panel">
                <div class="admin-header">
                    <h3>📊 Painel de Administração</h3>
                    <button class="admin-toggle" id="adminToggle">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="admin-content">
                    <div class="admin-tabs">
                        <button class="admin-tab active" data-tab="dashboard">Dashboard</button>
                        <button class="admin-tab" data-tab="visitors">Visitantes</button>
                        <button class="admin-tab" data-tab="interactions">Interações</button>
                        <button class="admin-tab" data-tab="contacts">Contatos</button>
                        <button class="admin-tab" data-tab="settings">Configurações</button>
                    </div>
                    
                    <div class="admin-panels">
                        <!-- Dashboard Panel -->
                        <div class="admin-panel-content active" id="dashboardPanel">
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-icon">👥</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="totalVisitors">0</div>
                                        <div class="stat-label">Visitantes Totais</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">📈</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="todayVisitors">0</div>
                                        <div class="stat-label">Visitantes Hoje</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">⚡</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="totalInteractions">0</div>
                                        <div class="stat-label">Interações Totais</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">📊</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="engagementRate">0%</div>
                                        <div class="stat-label">Taxa de Engajamento</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="charts-section">
                                <div class="chart-container">
                                    <h4>Visitantes Últimos 7 Dias</h4>
                                    <canvas id="visitorsChart" width="400" height="200"></canvas>
                                </div>
                                <div class="chart-container">
                                    <h4>Top Páginas</h4>
                                    <div id="topPagesList"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Visitors Panel -->
                        <div class="admin-panel-content" id="visitorsPanel">
                            <div class="table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Data</th>
                                            <th>Página</th>
                                            <th>Dispositivo</th>
                                            <th>Browser</th>
                                            <th>Localização</th>
                                        </tr>
                                    </thead>
                                    <tbody id="visitorsTableBody">
                                        <tr><td colspan="6" class="loading">Carregando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Interactions Panel -->
                        <div class="admin-panel-content" id="interactionsPanel">
                            <div class="table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Data</th>
                                            <th>Tipo</th>
                                            <th>Página</th>
                                            <th>Dados</th>
                                        </tr>
                                    </thead>
                                    <tbody id="interactionsTableBody">
                                        <tr><td colspan="5" class="loading">Carregando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Contacts Panel -->
                        <div class="admin-panel-content" id="contactsPanel">
                            <div class="table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Data</th>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Mensagem</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="contactsTableBody">
                                        <tr><td colspan="7" class="loading">Carregando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Settings Panel -->
                        <div class="admin-panel-content" id="settingsPanel">
                            <div class="settings-section">
                                <h4>Configurações Gerais</h4>
                                <div class="setting-item">
                                    <label>Modo de Manutenção</label>
                                    <input type="checkbox" id="maintenanceMode">
                                </div>
                                <div class="setting-item">
                                    <label>Analytics em Tempo Real</label>
                                    <input type="checkbox" id="realtimeAnalytics" checked>
                                </div>
                                <div class="setting-item">
                                    <label>Modo Debug</label>
                                    <input type="checkbox" id="debugMode">
                                </div>
                            </div>
                            
                            <div class="settings-section">
                                <h4>Gerenciamento de Dados</h4>
                                <div class="setting-actions">
                                    <button class="setting-btn" id="exportData">
                                        <i class="fas fa-download"></i>
                                        Exportar Dados
                                    </button>
                                    <button class="setting-btn" id="clearOldData">
                                        <i class="fas fa-trash"></i>
                                        Limpar Dados Antigos
                                    </button>
                                    <button class="setting-btn danger" id="clearAllData">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        Limpar Todos os Dados
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Admin Toggle Button -->
            <button class="admin-trigger" id="adminTrigger" title="Abrir Painel Admin">
                <i class="fas fa-cog"></i>
            </button>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', adminHTML);
    }

    setupEventListeners() {
        // Admin trigger
        const adminTrigger = document.getElementById('adminTrigger');
        const adminToggle = document.getElementById('adminToggle');
        const adminPanel = document.getElementById('adminPanel');

        if (adminTrigger) {
            adminTrigger.addEventListener('click', () => this.togglePanel());
        }

        if (adminToggle) {
            adminToggle.addEventListener('click', () => this.togglePanel());
        }

        // Tab switching
        const tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Settings actions
        document.getElementById('exportData')?.addEventListener('click', () => this.exportData());
        document.getElementById('clearOldData')?.addEventListener('click', () => this.clearOldData());
        document.getElementById('clearAllData')?.addEventListener('click', () => this.clearAllData());

        // Settings checkboxes
        document.getElementById('maintenanceMode')?.addEventListener('change', (e) => this.updateSetting('maintenanceMode', e.target.checked));
        document.getElementById('realtimeAnalytics')?.addEventListener('change', (e) => this.updateSetting('realtimeAnalytics', e.target.checked));
        document.getElementById('debugMode')?.addEventListener('change', (e) => this.updateSetting('debugMode', e.target.checked));

        // Keyboard shortcut (Ctrl+Shift+A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }

    togglePanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (!adminPanel) return;

        this.isVisible = !this.isVisible;
        adminPanel.classList.toggle('visible', this.isVisible);

        if (this.isVisible) {
            this.loadStats();
            this.loadVisitors();
            this.loadInteractions();
            this.loadContacts();
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        const tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update panels
        const panels = document.querySelectorAll('.admin-panel-content');
        panels.forEach(panel => {
            panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(tabName + 'Panel');
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // Load data for specific tab
        switch (tabName) {
            case 'visitors':
                this.loadVisitors();
                break;
            case 'interactions':
                this.loadInteractions();
                break;
            case 'contacts':
                this.loadContacts();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    async loadStats() {
        if (!window.portfolioDB) return;

        try {
            const stats = await window.portfolioDB.getVisitorStats();
            this.stats = stats;

            // Update dashboard stats
            document.getElementById('totalVisitors').textContent = stats.totalVisitors;
            document.getElementById('todayVisitors').textContent = stats.todayVisitors;
            document.getElementById('totalInteractions').textContent = stats.totalInteractions;
            document.getElementById('engagementRate').textContent = 
                stats.totalVisitors > 0 ? 
                ((stats.totalInteractions / stats.totalVisitors) * 100).toFixed(1) + '%' : '0%';

            // Draw charts
            this.drawVisitorsChart();
            this.displayTopPages(stats.topPages);

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async loadVisitors() {
        if (!window.portfolioDB) return;

        try {
            const visitors = await window.portfolioDB.getAll('visitors');
            const tbody = document.getElementById('visitorsTableBody');
            
            if (!tbody) return;

            tbody.innerHTML = visitors.slice(0, 50).map(visitor => `
                <tr>
                    <td>${visitor.id}</td>
                    <td>${new Date(visitor.timestamp).toLocaleString('pt-BR')}</td>
                    <td>${visitor.page || '/'}</td>
                    <td>${visitor.device || 'Unknown'}</td>
                    <td>${visitor.browser || 'Unknown'}</td>
                    <td>${visitor.location?.city || 'Unknown'}, ${visitor.location?.country || 'Unknown'}</td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading visitors:', error);
        }
    }

    async loadInteractions() {
        if (!window.portfolioDB) return;

        try {
            const interactions = await window.portfolioDB.getAll('interactions');
            const tbody = document.getElementById('interactionsTableBody');
            
            if (!tbody) return;

            tbody.innerHTML = interactions.slice(0, 50).map(interaction => `
                <tr>
                    <td>${interaction.id}</td>
                    <td>${new Date(interaction.timestamp).toLocaleString('pt-BR')}</td>
                    <td><span class="interaction-type ${interaction.type}">${interaction.type}</span></td>
                    <td>${interaction.page || '/'}</td>
                    <td>${JSON.stringify(interaction.data || {}).substring(0, 50)}...</td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading interactions:', error);
        }
    }

    async loadContacts() {
        if (!window.portfolioDB) return;

        try {
            const contacts = await window.portfolioDB.getAll('contacts');
            const tbody = document.getElementById('contactsTableBody');
            
            if (!tbody) return;

            tbody.innerHTML = contacts.map(contact => `
                <tr>
                    <td>${contact.id}</td>
                    <td>${new Date(contact.timestamp).toLocaleString('pt-BR')}</td>
                    <td>${contact.name || 'N/A'}</td>
                    <td>${contact.email || 'N/A'}</td>
                    <td>${(contact.message || '').substring(0, 100)}...</td>
                    <td><span class="status-badge ${contact.status}">${contact.status}</span></td>
                    <td>
                        <button class="action-btn" onclick="adminPanel.updateContactStatus(${contact.id}, 'read')">Ler</button>
                        <button class="action-btn" onclick="adminPanel.updateContactStatus(${contact.id}, 'responded')">Respondido</button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    async loadSettings() {
        if (!window.portfolioDB) return;

        try {
            const maintenanceMode = await window.portfolioDB.getSetting('maintenanceMode');
            const realtimeAnalytics = await window.portfolioDB.getSetting('realtimeAnalytics');
            const debugMode = await window.portfolioDB.getSetting('debugMode');

            document.getElementById('maintenanceMode').checked = maintenanceMode || false;
            document.getElementById('realtimeAnalytics').checked = realtimeAnalytics !== false;
            document.getElementById('debugMode').checked = debugMode || false;

        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    drawVisitorsChart() {
        const canvas = document.getElementById('visitorsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Generate sample data for last 7 days
        const days = [];
        const visitors = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            visitors.push(Math.floor(Math.random() * 50) + 10);
        }

        // Simple bar chart
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const barWidth = (width - padding * 2) / days.length;
        const maxVisitors = Math.max(...visitors);

        ctx.clearRect(0, 0, width, height);

        // Draw bars
        visitors.forEach((count, index) => {
            const barHeight = (count / maxVisitors) * (height - padding * 2);
            const x = padding + index * barWidth + barWidth * 0.1;
            const y = height - padding - barHeight;

            // Bar gradient
            const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
            gradient.addColorStop(0, '#0066ff');
            gradient.addColorStop(1, '#0052cc');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth * 0.8, barHeight);

            // Value label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(count, x + barWidth * 0.4, y - 5);

            // Day label
            ctx.fillStyle = '#a0a0a0';
            ctx.fillText(days[index], x + barWidth * 0.4, height - 10);
        });
    }

    displayTopPages(topPages) {
        const container = document.getElementById('topPagesList');
        if (!container) return;

        container.innerHTML = topPages.map(page => `
            <div class="top-page-item">
                <div class="page-name">${page.page}</div>
                <div class="page-count">${page.count} visitas</div>
            </div>
        `).join('');
    }

    async updateContactStatus(contactId, status) {
        if (!window.portfolioDB) return;

        try {
            const contact = await window.portfolioDB.get('contacts', contactId);
            if (contact) {
                contact.status = status;
                await window.portfolioDB.update('contacts', contact);
                this.loadContacts(); // Reload contacts table
                this.showNotification(`Status do contato atualizado para: ${status}`, 'success');
            }
        } catch (error) {
            console.error('Error updating contact status:', error);
            this.showNotification('Erro ao atualizar status do contato', 'error');
        }
    }

    async updateSetting(key, value) {
        if (!window.portfolioDB) return;

        try {
            await window.portfolioDB.saveSetting(key, value);
            this.showNotification(`Configuração '${key}' atualizada`, 'success');
        } catch (error) {
            console.error('Error updating setting:', error);
            this.showNotification('Erro ao atualizar configuração', 'error');
        }
    }

    async exportData() {
        if (!window.portfolioDB) return;

        try {
            const data = await window.portfolioDB.exportData();
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('Dados exportados com sucesso!', 'success');

        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Erro ao exportar dados', 'error');
        }
    }

    async clearOldData() {
        if (!confirm('Tem certeza que deseja limpar dados antigos (últimos 90 dias)?')) return;

        try {
            await window.portfolioDB.clearOldData(90);
            this.loadStats();
            this.showNotification('Dados antigos limpos com sucesso!', 'success');

        } catch (error) {
            console.error('Error clearing old data:', error);
            this.showNotification('Erro ao limpar dados antigos', 'error');
        }
    }

    async clearAllData() {
        if (!confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados. Esta ação não pode ser desfeita. Continuar?')) return;

        try {
            // Clear all object stores
            const stores = ['visitors', 'interactions', 'projects', 'contacts', 'analytics', 'settings'];
            
            for (const storeName of stores) {
                const allData = await window.portfolioDB.getAll(storeName);
                for (const item of allData) {
                    await window.portfolioDB.delete(storeName, item.id);
                }
            }

            this.loadStats();
            this.showNotification('Todos os dados foram limpos!', 'success');

        } catch (error) {
            console.error('Error clearing all data:', error);
            this.showNotification('Erro ao limpar dados', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00cc66' : '#0066ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            font-family: var(--font-primary);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize admin panel
let adminPanel;

document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    window.adminPanel = adminPanel;
});
