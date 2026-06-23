// ===== DEMOS JAVASCRIPT =====

// DOM Elements
const demoBtns = document.querySelectorAll('.demo-btn');
const demoDocsBtns = document.querySelectorAll('.demo-docs');
const tryEndpointBtns = document.querySelectorAll('.try-endpoint');
const shortenBtn = document.getElementById('shorten-btn');
const shortenUrlInput = document.getElementById('shorten-url');
const shortenResult = document.getElementById('shorten-result');
const demoTabs = document.querySelectorAll('.demo-tab');
const usersDemoPanel = document.getElementById('users-demo-panel');

// Demo data
const demoEndpoints = {
    bookmarket: {
        base: 'https://api.bookmarket.example.com',
        endpoints: {
            '/api/books': {
                method: 'GET',
                description: 'Lista todos os livros',
                response: {
                    "books": [
                        {
                            "id": 1,
                            "title": "Clean Code",
                            "author": "Robert C. Martin",
                            "year": 2008,
                            "available": true
                        },
                        {
                            "id": 2,
                            "title": "Design Patterns",
                            "author": "Gang of Four",
                            "year": 1994,
                            "available": true
                        }
                    ],
                    "total": 2,
                    "page": 1
                }
            }
        }
    },
    shortener: {
        base: 'https://shorten.example.com',
        shorten: function(url) {
            // Simulate URL shortening
            const shortCode = Math.random().toString(36).substring(2, 8);
            return {
                original: url,
                short: `https://short.ly/${shortCode}`,
                clicks: Math.floor(Math.random() * 1000),
                created: new Date().toISOString()
            };
        }
    },
    users: {
        base: 'https://api.users.example.com',
        endpoints: {
            list: {
                method: 'GET',
                description: 'Lista todos os usuários',
                response: {
                    "users": [
                        {
                            "id": 1,
                            "name": "João Silva",
                            "email": "joao@example.com",
                            "role": "admin",
                            "created_at": "2024-01-15T10:30:00Z"
                        },
                        {
                            "id": 2,
                            "name": "Maria Santos",
                            "email": "maria@example.com",
                            "role": "user",
                            "created_at": "2024-02-20T14:15:00Z"
                        }
                    ],
                    "total": 2
                }
            },
            create: {
                method: 'POST',
                description: 'Cria um novo usuário',
                body: {
                    "name": "Nome do Usuário",
                    "email": "email@example.com",
                    "password": "senha123",
                    "role": "user"
                },
                response: {
                    "message": "Usuário criado com sucesso!",
                    "user": {
                        "id": 3,
                        "name": "Nome do Usuário",
                        "email": "email@example.com",
                        "role": "user",
                        "created_at": new Date().toISOString()
                    }
                }
            },
            update: {
                method: 'PUT',
                description: 'Atualiza um usuário existente',
                body: {
                    "name": "Nome Atualizado",
                    "email": "novo@example.com",
                    "role": "admin"
                },
                response: {
                    "message": "Usuário atualizado com sucesso!",
                    "user": {
                        "id": 1,
                        "name": "Nome Atualizado",
                        "email": "novo@example.com",
                        "role": "admin",
                        "updated_at": new Date().toISOString()
                    }
                }
            }
        }
    }
};

// Initialize Demos
document.addEventListener('DOMContentLoaded', function() {
    initDemos();
});

function initDemos() {
    setupDemoButtons();
    setupDocsButtons();
    setupEndpoints();
    setupUrlShortener();
    setupUserDemoTabs();
}

function setupDemoButtons() {
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const demo = this.dataset.demo;
            showDemoNotification(`Iniciando demo ${demo}...`, 'info');
            
            // Simulate demo startup
            setTimeout(() => {
                showDemoNotification(`Demo ${demo} pronta!`, 'success');
            }, 1000);
        });
    });
}

function setupDocsButtons() {
    demoDocsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const docs = this.dataset.docs;
            showDemoNotification(`Abrindo documentação de ${docs}...`, 'info');
            
            // Simulate docs opening
            setTimeout(() => {
                showDemoNotification(`Documentação aberta em nova aba!`, 'success');
            }, 500);
        });
    });
}

function setupEndpoints() {
    tryEndpointBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const endpoint = this.dataset.endpoint;
            const demo = this.closest('.demo-card').querySelector('.demo-btn').dataset.demo;
            
            if (demo === 'bookmarket' && demoEndpoints.bookmarket) {
                await testBookmarketEndpoint(endpoint);
            }
        });
    });
}

async function testBookmarketEndpoint(endpoint) {
    const responseDiv = document.getElementById('bookmarket-response');
    if (!responseDiv) return;
    
    // Show loading
    responseDiv.innerHTML = '<div class="loading-response">⏳ Testando endpoint...</div>';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
    
    const endpointData = demoEndpoints.bookmarket.endpoints[endpoint];
    if (endpointData) {
        // Format response
        const formattedResponse = formatApiResponse(endpointData);
        responseDiv.innerHTML = `
            <div class="response-success">
                <div class="response-header">
                    <span class="method-badge ${endpointData.method.toLowerCase()}">${endpointData.method}</span>
                    <span class="endpoint-url">${endpoint}</span>
                </div>
                <div class="response-description">${endpointData.description}</div>
                <div class="response-body">
                    <pre>${JSON.stringify(endpointData.response, null, 2)}</pre>
                </div>
            </div>
        `;
    }
}

function setupUrlShortener() {
    if (!shortenBtn || !shortenUrlInput || !shortenResult) return;
    
    shortenBtn.addEventListener('click', async function() {
        const url = shortenUrlInput.value.trim();
        
        if (!url) {
            showDemoNotification('Digite uma URL para encurtar!', 'error');
            return;
        }
        
        if (!isValidUrl(url)) {
            showDemoNotification('URL inválida!', 'error');
            return;
        }
        
        // Show loading
        shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        shortenBtn.disabled = true;
        
        // Simulate shortening
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        const result = demoEndpoints.shortener.shorten(url);
        
        // Display result
        shortenResult.innerHTML = `
            <div class="shorten-result-content">
                <div class="result-item">
                    <span class="result-label">Original:</span>
                    <a href="${result.original}" target="_blank" class="result-link">${result.original}</a>
                </div>
                <div class="result-item">
                    <span class="result-label">Encurtada:</span>
                    <a href="${result.short}" target="_blank" class="result-link short-url">${result.short}</a>
                    <button class="copy-result" data-copy="${result.short}">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="result-stats">
                    <span class="stat">📊 ${result.clicks} cliques</span>
                    <span class="stat">📅 ${new Date(result.created).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
        `;
        
        // Setup copy buttons
        setupCopyButtons();
        
        // Reset button
        shortenBtn.innerHTML = '<i class="fas fa-compress"></i> Encurtar';
        shortenBtn.disabled = false;
        
        showDemoNotification('URL encurtada com sucesso!', 'success');
    });
    
    // Enter key support
    shortenUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            shortenBtn.click();
        }
    });
}

function setupUserDemoTabs() {
    if (!demoTabs || !usersDemoPanel) return;
    
    demoTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            demoTabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            showUserDemoPanel(tabName);
        });
    });
}

function showUserDemoPanel(tabName) {
    const endpointData = demoEndpoints.users.endpoints[tabName];
    
    if (!endpointData) {
        usersDemoPanel.innerHTML = '<div class="panel-placeholder">Operação não encontrada...</div>';
        return;
    }
    
    let content = `
        <div class="endpoint-info">
            <div class="method-badge ${endpointData.method.toLowerCase()}">${endpointData.method}</div>
            <div class="endpoint-description">${endpointData.description}</div>
        </div>
    `;
    
    if (endpointData.body) {
        content += `
            <div class="request-body">
                <h4>Request Body:</h4>
                <pre>${JSON.stringify(endpointData.body, null, 2)}</pre>
            </div>
        `;
    }
    
    content += `
        <div class="response-example">
            <h4>Response Example:</h4>
            <pre>${JSON.stringify(endpointData.response, null, 2)}</pre>
        </div>
    `;
    
    usersDemoPanel.innerHTML = content;
}

function setupCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-result');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.dataset.copy;
            copyToClipboard(text);
            
            // Visual feedback
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 1000);
        });
    });
}

function formatApiResponse(endpointData) {
    return `
        <div class="api-response">
            <div class="response-meta">
                <span class="method ${endpointData.method.toLowerCase()}">${endpointData.method}</span>
                <span class="status success">200 OK</span>
                <span class="response-time">${(Math.random() * 500 + 100).toFixed(0)}ms</span>
            </div>
            <div class="response-data">
                <pre>${JSON.stringify(endpointData.response, null, 2)}</pre>
            </div>
        </div>
    `;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showDemoNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `demo-notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
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

// Add CSS for demos
const demoStyles = document.createElement('style');
demoStyles.textContent = `
    .loading-response {
        padding: 12px;
        text-align: center;
        color: var(--text-muted);
        font-style: italic;
    }
    
    .response-success {
        border-left: 4px solid #00cc66;
    }
    
    .response-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .method-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .method-badge.get {
        background: #00cc66;
        color: var(--text-primary);
    }
    
    .method-badge.post {
        background: #ff6600;
        color: var(--text-primary);
    }
    
    .method-badge.put {
        background: #0066ff;
        color: var(--text-primary);
    }
    
    .endpoint-url {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--text-primary);
        background: var(--bg-tertiary);
        padding: 4px 8px;
        border-radius: 4px;
    }
    
    .response-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 12px;
    }
    
    .response-body {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 12px;
        overflow-x: auto;
    }
    
    .response-body pre {
        margin: 0;
        color: var(--text-primary);
        font-size: 0.8rem;
        line-height: 1.4;
    }
    
    .shorten-result-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .result-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .result-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .result-link {
        color: var(--accent-color);
        text-decoration: none;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        word-break: break-all;
    }
    
    .result-link:hover {
        color: var(--text-primary);
    }
    
    .short-url {
        color: #00cc66;
        font-weight: 600;
    }
    
    .result-stats {
        display: flex;
        gap: 16px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid var(--border-color);
    }
    
    .stat {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .copy-result {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 8px;
        transition: var(--transition-fast);
    }
    
    .copy-result:hover {
        background: var(--accent-color);
        color: var(--text-primary);
        border-color: var(--accent-color);
    }
    
    .endpoint-info {
        margin-bottom: 16px;
    }
    
    .request-body, .response-example {
        margin-top: 16px;
    }
    
    .request-body h4, .response-example h4 {
        color: var(--text-primary);
        margin-bottom: 8px;
        font-size: 1rem;
    }
    
    .request-body pre, .response-example pre {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 12px;
        overflow-x: auto;
        margin: 0;
        color: var(--text-primary);
        font-size: 0.8rem;
        line-height: 1.4;
    }
    
    .demo-notification {
        font-family: var(--font-primary);
    }
`;
document.head.appendChild(demoStyles);
