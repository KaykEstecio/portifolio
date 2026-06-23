// ===== INNOVATIONS JAVASCRIPT =====

// DOM Elements
const toggle3DBtn = document.getElementById('toggle3D');
const toggleVoiceBtn = document.getElementById('toggleVoice');
const toggleRealtimeBtn = document.getElementById('toggleRealtime');
const toggleWASMBtn = document.getElementById('toggleWASM');
const toggleARBtn = document.getElementById('toggleAR');

// 3D Elements
const canvas3D = document.getElementById('canvas3D');
const controlBtns = document.querySelectorAll('.control-btn');

// Voice Elements
const startVoiceBtn = document.getElementById('startVoice');
const stopVoiceBtn = document.getElementById('stopVoice');
const voiceResult = document.getElementById('voiceResult');

// Realtime Elements
const lastUpdate = document.getElementById('lastUpdate');
const latency = document.getElementById('latency');
const eventsList = document.getElementById('eventsList');

// WASM Elements
const demoWASMBtn = document.getElementById('demoWASM');

// AR Elements
const enableARBtn = document.getElementById('enableAR');

// Global variables
let isRecording = false;
let recognition = null;
let animationId = null;
let websocket = null;

// Initialize Innovations
document.addEventListener('DOMContentLoaded', function() {
    initInnovations();
});

function initInnovations() {
    setupEventListeners();
    initialize3D();
    initializeVoice();
    initializeRealtime();
    initializeWASM();
    initializeAR();
}

function setupEventListeners() {
    // 3D Controls
    if (toggle3DBtn) {
        toggle3DBtn.addEventListener('click', toggle3D);
    }
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', handle3DControl);
    });
    
    // Voice Controls
    if (toggleVoiceBtn) {
        toggleVoiceBtn.addEventListener('click', toggleVoice);
    }
    
    if (startVoiceBtn) {
        startVoiceBtn.addEventListener('click', startVoiceRecognition);
    }
    
    if (stopVoiceBtn) {
        stopVoiceBtn.addEventListener('click', stopVoiceRecognition);
    }
    
    // Realtime Controls
    if (toggleRealtimeBtn) {
        toggleRealtimeBtn.addEventListener('click', toggleRealtime);
    }
    
    // WASM Controls
    if (toggleWASMBtn) {
        toggleWASMBtn.addEventListener('click', toggleWASM);
    }
    
    if (demoWASMBtn) {
        demoWASMBtn.addEventListener('click', demoWASM);
    }
    
    // AR Controls
    if (toggleARBtn) {
        toggleARBtn.addEventListener('click', toggleAR);
    }
    
    if (enableARBtn) {
        enableARBtn.addEventListener('click', enableAR);
    }
}

// ===== 3D VISUALIZATION =====
function initialize3D() {
    if (!canvas3D) return;
    
    const ctx = canvas3D.getContext('2d');
    if (!ctx) return;
    
    // Simple 3D cube visualization
    let rotation = 0;
    let zoom = 1;
    
    function draw3DCube() {
        ctx.clearRect(0, 0, canvas3D.width, canvas3D.height);
        
        // Simple 3D cube projection
        const size = 50 * zoom;
        const centerX = canvas3D.width / 2;
        const centerY = canvas3D.height / 2;
        
        // Calculate rotated vertices
        const vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        
        const rotatedVertices = vertices.map(vertex => {
            const [x, y, z] = vertex;
            const cosR = Math.cos(rotation);
            const sinR = Math.sin(rotation);
            
            // Rotate around Y axis
            const newX = x * cosR - z * sinR;
            const newZ = x * sinR + z * cosR;
            
            // Project to 2D
            const scale = 200 / (200 + newZ);
            const projX = centerX + newX * size * scale;
            const projY = centerY + y * size * scale;
            
            return [projX, projY];
        });
        
        // Draw edges
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;
        
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ];
        
        edges.forEach(edge => {
            const [start, end] = edge;
            ctx.beginPath();
            ctx.moveTo(rotatedVertices[start][0], rotatedVertices[start][1]);
            ctx.lineTo(rotatedVertices[end][0], rotatedVertices[end][1]);
            ctx.stroke();
        });
        
        // Draw vertices
        ctx.fillStyle = '#ffffff';
        rotatedVertices.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex[0], vertex[1], 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        rotation += 0.02;
        animationId = requestAnimationFrame(draw3DCube);
    }
    
    draw3DCube();
}

function handle3DControl(e) {
    const action = e.dataset.action;
    
    switch (action) {
        case 'rotate':
            // Rotation is already happening automatically
            showInnovationNotification('Rotação já ativa!', 'info');
            break;
        case 'zoom':
            zoom = zoom === 1 ? 1.5 : 1;
            showInnovationNotification(`Zoom: ${zoom === 1 ? 'Normal' : 'Ampliado'}`, 'info');
            break;
        case 'reset':
            zoom = 1;
            rotation = 0;
            showInnovationNotification('Visualização resetada!', 'success');
            break;
    }
}

function toggle3D() {
    if (!toggle3DBtn) return;
    
    const isActive = toggle3DBtn.classList.contains('active');
    
    if (isActive) {
        toggle3DBtn.classList.remove('active');
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        showInnovationNotification('Visualização 3D pausada', 'info');
    } else {
        toggle3DBtn.classList.add('active');
        initialize3D();
        showInnovationNotification('Visualização 3D ativada!', 'success');
    }
}

// ===== VOICE SEARCH =====
function initializeVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        displayVoiceResult(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showInnovationNotification('Erro no reconhecimento de voz', 'error');
    };
    
    recognition.onend = function() {
        stopVoiceRecognition();
    };
}

function startVoiceRecognition() {
    if (!recognition) {
        showInnovationNotification('Reconhecimento de voz não suportado', 'error');
        return;
    }
    
    if (isRecording) return;
    
    isRecording = true;
    recognition.start();
    
    if (startVoiceBtn) startVoiceBtn.disabled = true;
    if (stopVoiceBtn) stopVoiceBtn.disabled = false;
    
    showInnovationNotification('Ouvindo...', 'info');
}

function stopVoiceRecognition() {
    if (!recognition || !isRecording) return;
    
    isRecording = false;
    recognition.stop();
    
    if (startVoiceBtn) startVoiceBtn.disabled = false;
    if (stopVoiceBtn) stopVoiceBtn.disabled = true;
    
    showInnovationNotification('Parado', 'info');
}

function displayVoiceResult(transcript) {
    if (!voiceResult) return;
    
    voiceResult.innerHTML = `
        <div class="voice-transcript">
            <i class="fas fa-microphone"></i>
            <span>"${transcript}"</span>
        </div>
        <div class="voice-actions">
            <button class="voice-action-btn" onclick="searchProjects('${transcript}')">
                <i class="fas fa-search"></i>
                Buscar Projetos
            </button>
            <button class="voice-action-btn" onclick="searchSkills('${transcript}')">
                <i class="fas fa-code"></i>
                Buscar Habilidades
            </button>
        </div>
    `;
}

function searchProjects(query) {
    showInnovationNotification(`Buscando projetos: "${query}"`, 'info');
    // Implement project search logic
}

function searchSkills(query) {
    showInnovationNotification(`Buscando habilidades: "${query}"`, 'info');
    // Implement skills search logic
}

function toggleVoice() {
    if (!toggleVoiceBtn) return;
    
    const isActive = toggleVoiceBtn.classList.contains('active');
    
    if (isActive) {
        toggleVoiceBtn.classList.remove('active');
        showInnovationNotification('Busca por voz desativada', 'info');
    } else {
        toggleVoiceBtn.classList.add('active');
        showInnovationNotification('Busca por voz ativada!', 'success');
    }
}

// ===== REALTIME UPDATES =====
function initializeRealtime() {
    // Simulate WebSocket connection
    simulateRealtimeConnection();
    
    // Update latency
    setInterval(updateLatency, 3000);
    
    // Add random events
    setInterval(addRandomEvent, 8000);
}

function simulateRealtimeConnection() {
    if (lastUpdate) {
        lastUpdate.textContent = 'Agora';
    }
    
    if (latency) {
        latency.textContent = '12ms';
    }
}

function updateLatency() {
    if (!latency) return;
    
    const randomLatency = 8 + Math.floor(Math.random() * 20);
    latency.textContent = `${randomLatency}ms`;
}

function addRandomEvent() {
    if (!eventsList) return;
    
    const events = [
        'Novo visitante',
        'Demo acessada',
        'Mensagem recebida',
        'Projeto visualizado',
        'Contato iniciado'
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    const time = new Date().toLocaleTimeString('pt-BR');
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
        <span class="event-time">${time}</span>
        <span class="event-type">${event}</span>
    `;
    
    eventsList.insertBefore(eventItem, eventsList.firstChild);
    
    // Keep only last 5 events
    while (eventsList.children.length > 5) {
        eventsList.removeChild(eventsList.lastChild);
    }
}

function toggleRealtime() {
    if (!toggleRealtimeBtn) return;
    
    const isActive = toggleRealtimeBtn.classList.contains('active');
    
    if (isActive) {
        toggleRealtimeBtn.classList.remove('active');
        showInnovationNotification('Updates em tempo real desativados', 'info');
    } else {
        toggleRealtimeBtn.classList.add('active');
        showInnovationNotification('Updates em tempo real ativados!', 'success');
    }
}

// ===== WEBASSEMBLY =====
function initializeWASM() {
    // Simulate WASM initialization
    console.log('WebAssembly initialized');
}

function demoWASM() {
    if (!demoWASMBtn) return;
    
    demoWASMBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    demoWASMBtn.disabled = true;
    
    // Simulate WASM processing
    setTimeout(() => {
        const startTime = performance.now();
        
        // Simulate heavy computation
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i);
        }
        
        const endTime = performance.now();
        const processingTime = (endTime - startTime).toFixed(2);
        
        showInnovationNotification(`WASM: Processado em ${processingTime}ms`, 'success');
        
        demoWASMBtn.innerHTML = '<i class="fas fa-play"></i> Testar Performance';
        demoWASMBtn.disabled = false;
    }, 2000);
}

function toggleWASM() {
    if (!toggleWASMBtn) return;
    
    const isActive = toggleWASMBtn.classList.contains('active');
    
    if (isActive) {
        toggleWASMBtn.classList.remove('active');
        showInnovationNotification('WebAssembly desativado', 'info');
    } else {
        toggleWASMBtn.classList.add('active');
        showInnovationNotification('WebAssembly ativado!', 'success');
    }
}

// ===== AUGMENTED REALITY =====
function initializeAR() {
    // Check for WebXR support
    if (!navigator.xr) {
        console.log('WebXR not supported');
        return;
    }
}

async function enableAR() {
    if (!navigator.xr) {
        showInnovationNotification('WebXR não suportado neste dispositivo', 'error');
        return;
    }
    
    try {
        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        
        if (isSupported) {
            showInnovationNotification('Iniciando experiência AR...', 'info');
            
            // Request AR session
            const session = await navigator.xr.requestSession('immersive-ar');
            
            showInnovationNotification('Experiência AR iniciada!', 'success');
            
        } else {
            showInnovationNotification('AR não suportado', 'error');
        }
    } catch (error) {
        console.error('AR error:', error);
        showInnovationNotification('Erro ao iniciar AR', 'error');
    }
}

function toggleAR() {
    if (!toggleARBtn) return;
    
    const isActive = toggleARBtn.classList.contains('active');
    
    if (isActive) {
        toggleARBtn.classList.remove('active');
        showInnovationNotification('Realidade Aumentada desativada', 'info');
    } else {
        toggleARBtn.classList.add('active');
        showInnovationNotification('Realidade Aumentada ativada!', 'success');
    }
}

// ===== NOTIFICATIONS =====
function showInnovationNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `innovation-notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for innovations
const innovationsStyles = document.createElement('style');
innovationsStyles.textContent = `
    .innovation-notification {
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
    
    .voice-transcript {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        margin-bottom: var(--spacing-sm);
    }
    
    .voice-transcript i {
        color: var(--accent-color);
        font-size: 1.2rem;
    }
    
    .voice-transcript span {
        color: var(--text-primary);
        font-size: 1rem;
        font-style: italic;
    }
    
    .voice-actions {
        display: flex;
        gap: var(--spacing-sm);
    }
    
    .voice-action-btn {
        background: var(--accent-color);
        color: var(--text-primary);
        border: none;
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 0.9rem;
        transition: var(--transition-fast);
    }
    
    .voice-action-btn:hover {
        background: #0052cc;
        transform: translateY(-2px);
    }
    
    .toggle-3d.active, .toggle-voice.active, .toggle-realtime.active, .toggle-wasm.active, .toggle-ar.active {
        background: #00cc66;
        color: var(--text-primary);
    }
`;
document.head.appendChild(innovationsStyles);
