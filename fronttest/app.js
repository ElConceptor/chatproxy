// Configuration
let conversationHistory = [];
// URL par défaut - Changez cette valeur pour utiliser votre déploiement Vercel
// Exemple: const API_URL = 'https://votre-projet.vercel.app/api/chat';
const API_URL = 'http://localhost:3000/api/chat';

// Éléments DOM
const statusBar = document.getElementById('statusBar');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');
const testConnectionButton = document.getElementById('testConnectionButton');
const apiUrlInput = document.getElementById('apiUrl');
const systemPromptInput = document.getElementById('systemPrompt');
const infoPanel = document.getElementById('infoPanel');
const responseInfo = document.getElementById('responseInfo');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkConnection();
    setupEventListeners();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    clearButton.addEventListener('click', clearHistory);
    testConnectionButton.addEventListener('click', checkConnection);
}

// Vérifier la connexion au serveur
async function checkConnection() {
    updateStatus('Vérification de la connexion...', 'loading');
    
    try {
        const apiUrl = apiUrlInput.value || API_URL;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'ok') {
            if (data.hasApiKey) {
                updateStatus('✅ Connecté - API Key configurée', 'connected');
            } else {
                updateStatus('⚠️ Connecté - API Key manquante', 'error');
            }
        } else {
            updateStatus('❌ Erreur de connexion', 'error');
        }
    } catch (error) {
        updateStatus('❌ Impossible de se connecter au serveur', 'error');
        console.error('Erreur de connexion:', error);
    }
}

// Mettre à jour le statut
function updateStatus(text, status) {
    statusText.textContent = text;
    statusIndicator.className = 'status-indicator';
    
    if (status === 'connected') {
        statusIndicator.classList.add('connected');
    } else if (status === 'error') {
        statusIndicator.classList.add('error');
    }
}

// Envoyer un message
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    sendButton.disabled = true;
    sendButton.classList.add('loading');
    messageInput.disabled = true;
    
    // Afficher le message de l'utilisateur
    addMessage('user', message);
    messageInput.value = '';
    
    try {
        const apiUrl = apiUrlInput.value || API_URL;
        const systemPrompt = systemPromptInput.value.trim();
        
        const requestBody = {
            message: message,
            conversationHistory: conversationHistory
        };
        
        if (systemPrompt) {
            requestBody.systemPrompt = systemPrompt;
        }
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Afficher la réponse de l'assistant
            addMessage('assistant', data.response);
            
            // Mettre à jour l'historique
            conversationHistory.push({
                role: 'user',
                content: message
            });
            conversationHistory.push({
                role: 'assistant',
                content: data.response
            });
            
            // Afficher les informations de la réponse
            showResponseInfo(data);
            
            // Mettre à jour le statut
            updateStatus('✅ Message envoyé avec succès', 'connected');
        } else {
            // Afficher l'erreur
            const errorMessage = data.error || 'Erreur inconnue';
            addMessage('error', `Erreur: ${errorMessage}`);
            updateStatus('❌ Erreur lors de l\'envoi', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        addMessage('error', `Erreur de connexion: ${error.message}`);
        updateStatus('❌ Erreur de connexion', 'error');
    } finally {
        // Réactiver le bouton
        sendButton.disabled = false;
        sendButton.classList.remove('loading');
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// Ajouter un message à la conversation
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString('fr-FR');
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Effacer l'historique
function clearHistory() {
    conversationHistory = [];
    chatMessages.innerHTML = `
        <div class="message system-message">
            <div class="message-content">
                <strong>Système:</strong> Historique effacé. Vous pouvez commencer une nouvelle conversation.
            </div>
        </div>
    `;
    updateStatus('✅ Historique effacé', 'connected');
}

// Afficher les informations de la réponse
function showResponseInfo(data) {
    if (data.usage || data.model) {
        infoPanel.style.display = 'block';
        responseInfo.textContent = JSON.stringify({
            model: data.model,
            usage: data.usage,
            timestamp: new Date().toISOString()
        }, null, 2);
    }
}

