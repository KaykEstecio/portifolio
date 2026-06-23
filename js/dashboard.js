// ===== DASHBOARD JAVASCRIPT =====

// DOM Elements
const refreshBtn = document.getElementById('refreshAnalytics');
const toggleAIBtn = document.getElementById('toggleAI');
const toggleToolsBtn = document.getElementById('toggleTools');
const exportBtn = document.getElementById('exportMetrics');
const engagementChart = document.getElementById('engagementChart');

// Metrics elements
const visitorsToday = document.getElementById('visitorsToday');
const engagementRate = document.getElementById('engagementRate');
const avgTime = document.getElementById('avgTime');
const conversions = document.getElementById('conversions');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    setupEventListeners();
    initializeMetrics();
    initializeChart();
    startRealTimeUpdates();
}

function setupEventListeners() {
    // Refresh analytics
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAnalytics);
    }
    
    // Toggle AI features
    if (toggleAIBtn) {
        toggleAIBtn.addEventListener('click', toggleAIFeatures);
    }
    
    // Toggle tools
    if (toggleToolsBtn) {
        toggleToolsBtn.addEventListener('click', toggleTools);
    }
    
    // Export metrics
    if (exportBtn) {
        exportBtn.addEventListener('click', exportMetrics);
    }
}

function initializeMetrics() {
    // Simulate real-time metrics
    updateMetrics();
    
    // Update every 5 seconds
    setInterval(updateMetrics, 5000);
}

function updateMetrics() {
    // Simulate realistic metric changes
    const baseVisitors = 247;
    const baseEngagement = 78.5;
    const baseTime = '4m 32s';
    const baseConversions = 12;
    
    // Add some randomness
    const visitors = baseVisitors + Math.floor(Math.random() * 10 - 5);
    const engagement = Math.min(95, baseEngagement + (Math.random() * 4 - 2));
    const timeVariation = Math.random() * 30 - 15;
    const timeMinutes = 4 + Math.floor(timeVariation / 60);
    const timeSeconds = 32 + (timeVariation % 60);
    const conversions = baseConversions + Math.floor(Math.random() * 3);
    
    // Update DOM
    if (visitorsToday) visitorsToday.textContent = visitors;
    if (engagementRate) engagementRate.textContent = engagement.toFixed(1) + '%';
    if (avgTime) avgTime.textContent = `${timeMinutes}m ${timeSeconds}s`;
    if (conversions) conversions.textContent = conversions;
}

function initializeChart() {
    if (!engagementChart) return;
    
    const ctx = engagementChart.getContext('2d');
    if (!ctx) return;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, '#0066ff');
    gradient.addColorStop(1, '#0052cc');
    
    // Sample data
    const data = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        values: [45, 62, 78, 85, 72, 68]
    };
    
    // Simple line chart
    drawLineChart(ctx, data, gradient);
}

function drawLineChart(ctx, data, gradient) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate points
    const maxValue = Math.max(...data.values);
    const xStep = (width - padding * 2) / (data.labels.length - 1);
    const yScale = (height - padding * 2) / maxValue;
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    data.values.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (value * yScale);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    data.values.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (value * yScale);
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0066ff';
        ctx.fill();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
        const x = padding + index * xStep;
        const y = height - 5;
        ctx.fillText(label, x, y);
    });
}

function refreshAnalytics() {
    if (!refreshBtn) return;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;
    
    // Simulate refresh
    setTimeout(() => {
        updateMetrics();
        updateChart();
        
        // Reset button
        refreshBtn.innerHTML = '<i class="fas fa-sync"></i>';
        refreshBtn.disabled = false;
        
        showDashboardNotification('Analytics atualizadas!', 'success');
    }, 1500);
}

function toggleAIFeatures() {
    if (!toggleAIBtn) return;
    
    const isActive = toggleAIBtn.classList.contains('active');
    
    if (isActive) {
        toggleAIBtn.classList.remove('active');
        showDashboardNotification('Insights IA desativados', 'info');
    } else {
        toggleAIBtn.classList.add('active');
        showDashboardNotification('Insights IA ativados', 'success');
        
        // Simulate AI processing
        setTimeout(() => {
            showDashboardNotification('Análise IA concluída!', 'success');
        }, 2000);
    }
}

function toggleTools() {
    if (!toggleToolsBtn) return;
    
    const isActive = toggleToolsBtn.classList.contains('active');
    
    if (isActive) {
        toggleToolsBtn.classList.remove('active');
        showDashboardNotification('Ferramentas ocultas', 'info');
    } else {
        toggleToolsBtn.classList.add('active');
        showDashboardNotification('Ferramentas expandidas', 'success');
    }
}

function exportMetrics() {
    if (!exportBtn) return;
    
    // Show loading state
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    exportBtn.disabled = true;
    
    // Simulate export
    setTimeout(() => {
        const metrics = {
            visitors: visitorsToday?.textContent,
            engagement: engagementRate?.textContent,
            avgTime: avgTime?.textContent,
            conversions: conversions?.textContent,
            timestamp: new Date().toISOString()
        };
        
        // Create and download JSON
        const dataStr = JSON.stringify(metrics, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `kayk-estecio-metrics-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        // Reset button
        exportBtn.innerHTML = '<i class="fas fa-download"></i>';
        exportBtn.disabled = false;
        
        showDashboardNotification('Métricas exportadas!', 'success');
    }, 1000);
}

function startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        // Random visitor increment
        if (Math.random() > 0.7) {
            const currentVisitors = parseInt(visitorsToday?.textContent || '0');
            if (visitorsToday) {
                visitorsToday.textContent = currentVisitors + 1;
            }
        }
        
        // Random engagement update
        if (Math.random() > 0.8) {
            updateMetrics();
        }
    }, 8000 + Math.random() * 4000); // 8-12 seconds interval
}

function showDashboardNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00cc66' : '#0066ff'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-family: var(--font-primary);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for dashboard
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .dashboard-notification {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .ai-toggle.active, .tools-toggle.active {
        background: #00cc66;
        color: var(--text-primary);
    }
    
    .refresh-btn:disabled, .ai-toggle:disabled, .tools-toggle:disabled, .export-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(dashboardStyles);
