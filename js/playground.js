// ===== PLAYGROUND JAVASCRIPT =====

// DOM Elements
const codeEditor = document.getElementById('pythonCode');
const outputPanel = document.getElementById('outputPanel');
const outputContent = document.getElementById('outputContent');
const runCodeBtn = document.getElementById('runCode');
const clearCodeBtn = document.getElementById('clearCode');
const copyOutputBtn = document.getElementById('copyOutput');
const memoryStatus = document.getElementById('memoryStatus');
const executionTime = document.getElementById('executionTime');

// Code examples
const codeExamples = {
    hello: `# Olá Mundo em Python
print("Olá, Mundo!")
print("Bem-vindo ao Playground de Kayk Estécio!")`,
    
    api: `# API FastAPI Básica
from fastapi import FastAPI
from typing import Dict

app = FastAPI()

@app.get("/")
async def read_root() -> Dict[str, str]:
    return {"message": "API funcionando!"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}`,
    
    data: `# Manipulação de Dados
import json
import datetime

# Dados de exemplo
dados = {
    "nome": "Kayk Estécio",
    "cargo": "Desenvolvedor Python",
    "habilidades": ["FastAPI", "Redis", "SQLModel"],
    "data_criacao": datetime.datetime.now().isoformat()
}

# Processamento
dados_formatados = json.dumps(dados, indent=2, ensure_ascii=False)
print("Dados processados:")
print(dados_formatados)`,
    
    file: `# Operações com Arquivos
import os
import json

# Criar arquivo de configuração
config = {
    "database": "postgresql://localhost:5432/mydb",
    "redis": "redis://localhost:6379",
    "debug": True
}

# Salvar configuração
with open('config.json', 'w') as f:
    json.dump(config, f, indent=2)

print("Arquivo de configuração criado!")
print(f"Tamanho: {os.path.getsize('config.json')} bytes")`
};

// Initialize Playground
document.addEventListener('DOMContentLoaded', function() {
    initPlayground();
});

function initPlayground() {
    if (!codeEditor) return;
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup tabs
    setupTabs();
    
    // Setup examples
    setupExamples();
    
    // Setup snippets
    setupSnippets();
    
    // Update line numbers
    updateLineNumbers();
    
    // Initial code
    codeEditor.value = codeExamples.hello;
    updateLineNumbers();
}

function setupEventListeners() {
    // Run code
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', executeCode);
    }
    
    // Clear code
    if (clearCodeBtn) {
        clearCodeBtn.addEventListener('click', clearCode);
    }
    
    // Copy output
    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', copyOutput);
    }
    
    // Code input events
    if (codeEditor) {
        codeEditor.addEventListener('input', updateLineNumbers);
        codeEditor.addEventListener('scroll', syncLineNumbers);
        
        // Tab support
        codeEditor.addEventListener('keydown', handleTabKey);
    }
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show/hide panels
            const tabName = this.dataset.tab;
            if (tabName === 'python') {
                codeEditor.parentElement.style.display = 'flex';
                outputPanel.style.display = 'none';
            } else if (tabName === 'output') {
                codeEditor.parentElement.style.display = 'none';
                outputPanel.style.display = 'flex';
            }
        });
    });
}

function setupExamples() {
    const exampleBtns = document.querySelectorAll('.example-btn');
    
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const example = this.dataset.example;
            if (codeExamples[example]) {
                codeEditor.value = codeExamples[example];
                updateLineNumbers();
                
                // Show Python tab
                const pythonTab = document.querySelector('[data-tab="python"]');
                if (pythonTab) {
                    pythonTab.click();
                }
                
                // Visual feedback
                showNotification('Exemplo carregado!', 'success');
            }
        });
    });
}

function setupSnippets() {
    const copyBtns = document.querySelectorAll('.copy-snippet');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.parentElement.querySelector('code').textContent;
            copyToClipboard(code);
            
            // Visual feedback
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 1000);
        });
    });
}

function updateLineNumbers() {
    const lineNumbers = document.querySelector('.line-numbers');
    if (!lineNumbers) return;
    
    const lines = codeEditor.value.split('\n');
    const lineCount = lines.length;
    
    let numbers = '';
    for (let i = 1; i <= lineCount; i++) {
        numbers += i + '\n';
    }
    
    lineNumbers.textContent = numbers;
}

function syncLineNumbers() {
    const lineNumbers = document.querySelector('.line-numbers');
    if (lineNumbers) {
        lineNumbers.scrollTop = codeEditor.scrollTop;
    }
}

function handleTabKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const value = codeEditor.value;
        
        // Insert 4 spaces for tab
        codeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
        
        // Restore cursor position
        codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
        
        updateLineNumbers();
    }
}

async function executeCode() {
    if (!codeEditor.value.trim()) {
        showNotification('Digite algum código para executar!', 'error');
        return;
    }
    
    // Show loading state
    runCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando...';
    runCodeBtn.disabled = true;
    
    // Switch to output tab
    const outputTab = document.querySelector('[data-tab="output"]');
    if (outputTab) {
        outputTab.click();
    }
    
    const startTime = performance.now();
    
    try {
        // Simulate Python execution (in real implementation, this would call a backend API)
        const result = await simulatePythonExecution(codeEditor.value);
        
        const endTime = performance.now();
        const executionTimeMs = (endTime - startTime).toFixed(2);
        
        // Update execution time
        if (executionTime) {
            executionTime.textContent = `${executionTimeMs}s`;
        }
        
        // Update memory usage (simulated)
        const memoryUsage = Math.floor(Math.random() * 50 + 20);
        if (memoryStatus) {
            memoryStatus.textContent = `${memoryUsage} MB`;
        }
        
        // Display result
        displayOutput(result, 'success');
        
    } catch (error) {
        displayOutput(`Erro: ${error.message}`, 'error');
    } finally {
        // Reset button state
        runCodeBtn.innerHTML = '<i class="fas fa-play"></i> Executar';
        runCodeBtn.disabled = false;
    }
}

async function simulatePythonExecution(code) {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simple Python simulation for basic operations
    const lines = code.split('\n');
    const outputs = [];
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('print(')) {
            // Extract string from print statement
            const match = trimmedLine.match(/print\((.*)\)/);
            if (match) {
                try {
                    // Simple eval for print statements (be careful in production!)
                    const result = eval(match[1]);
                    outputs.push(String(result));
                } catch (e) {
                    outputs.push(`Error: ${e.message}`);
                }
            }
        } else if (trimmedLine && !trimmedLine.startsWith('#')) {
            // For non-print statements, just echo them
            outputs.push(`> ${trimmedLine}`);
        }
    }
    
    return outputs.join('\n');
}

function displayOutput(content, type = 'info') {
    if (!outputContent) return;
    
    outputContent.innerHTML = '';
    
    if (type === 'error') {
        outputContent.innerHTML = `<div class="error-output">${escapeHtml(content)}</div>`;
    } else if (type === 'success') {
        outputContent.innerHTML = `<div class="success-output">${escapeHtml(content)}</div>`;
    } else {
        outputContent.innerHTML = `<div class="info-output">${escapeHtml(content)}</div>`;
    }
}

function clearCode() {
    if (codeEditor) {
        codeEditor.value = '';
        updateLineNumbers();
        
        // Switch to Python tab
        const pythonTab = document.querySelector('[data-tab="python"]');
        if (pythonTab) {
            pythonTab.click();
        }
        
        showNotification('Código limpo!', 'info');
    }
}

function copyOutput() {
    if (!outputContent) return;
    
    const text = outputContent.textContent;
    copyToClipboard(text);
    
    showNotification('Saída copiada!', 'success');
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `playground-notification ${type}`;
    notification.textContent = message;
    
    // Add styles
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
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    .error-output {
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
        padding: 8px;
        border-radius: 4px;
        border-left: 4px solid #ff4444;
    }
    
    .success-output {
        color: #00cc66;
        background: rgba(0, 204, 102, 0.1);
        padding: 8px;
        border-radius: 4px;
        border-left: 4px solid #00cc66;
    }
    
    .info-output {
        color: var(--text-primary);
        background: var(--bg-tertiary);
        padding: 8px;
        border-radius: 4px;
        border-left: 4px solid var(--accent-color);
    }
    
    .playground-notification {
        font-family: var(--font-primary);
    }
`;
document.head.appendChild(style);
