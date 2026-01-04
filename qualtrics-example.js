/**
 * Exemple de code JavaScript pour utiliser le proxy ChatGPT dans Qualtrics
 * 
 * Instructions :
 * 1. Remplacez 'http://localhost:3000' par l'URL de votre serveur proxy en production
 * 2. Ajoutez ce code dans l'éditeur JavaScript de votre question Qualtrics
 * 3. Adaptez le code selon vos besoins
 */

Qualtrics.SurveyEngine.addOnload(function() {
    // URL de votre serveur proxy
    const PROXY_URL = 'http://localhost:3000/api/chat';
    
    // Éléments de l'interface (ajustez selon votre formulaire)
    const questionContainer = this.questionId;
    const inputField = jQuery('#QR\\~' + questionContainer + '\\~1'); // Ajustez le sélecteur
    const submitButton = jQuery('#NextButton');
    const responseContainer = jQuery('<div id="chat-response"></div>');
    
    // Ajouter le conteneur de réponse
    jQuery(this.questionContainer).append(responseContainer);
    
    // Fonction pour envoyer un message à ChatGPT
    function sendMessage(message, systemPrompt = null) {
        // Afficher un indicateur de chargement
        responseContainer.html('<p>Envoi en cours...</p>');
        
        fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                systemPrompt: systemPrompt || 'Vous êtes un assistant utile et professionnel pour un formulaire Qualtrics.',
                conversationHistory: [] // Vous pouvez stocker l'historique si nécessaire
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Afficher la réponse
                responseContainer.html(`<div style="padding: 10px; background-color: #f0f0f0; border-radius: 5px; margin-top: 10px;">
                    <strong>Réponse:</strong><br>
                    ${data.response}
                </div>`);
            } else {
                throw new Error(data.error || 'Erreur inconnue');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            responseContainer.html(`<div style="padding: 10px; background-color: #ffebee; border-radius: 5px; margin-top: 10px; color: #c62828;">
                <strong>Erreur:</strong> ${error.message}
            </div>`);
        });
    }
    
    // Exemple 1: Envoyer un message lors du clic sur un bouton
    const chatButton = jQuery('<button type="button" style="margin-top: 10px;">Poser une question</button>');
    chatButton.click(function() {
        const message = inputField.val();
        if (message && message.trim()) {
            sendMessage(message);
        } else {
            alert('Veuillez entrer un message');
        }
    });
    jQuery(this.questionContainer).append(chatButton);
    
    // Exemple 2: Envoyer automatiquement lors de la saisie (avec délai)
    let typingTimer;
    inputField.on('input', function() {
        clearTimeout(typingTimer);
        const message = jQuery(this).val();
        
        if (message && message.length > 10) { // Envoyer seulement si plus de 10 caractères
            typingTimer = setTimeout(function() {
                sendMessage(message, 'Vous êtes un assistant qui aide à compléter un formulaire.');
            }, 1000); // Attendre 1 seconde après la fin de la frappe
        }
    });
    
    // Exemple 3: Utiliser la réponse pour remplir automatiquement un champ
    function sendMessageAndFillField(message, targetFieldId) {
        sendMessage(message);
        // Note: Vous devrez adapter cette partie pour attendre la réponse
        // et remplir le champ cible
    }
});

/**
 * Exemple d'utilisation avec historique de conversation
 */
function sendMessageWithHistory(message, history) {
    const PROXY_URL = 'http://localhost:3000/api/chat';
    
    return fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            conversationHistory: history,
            systemPrompt: 'Vous êtes un assistant conversationnel pour un formulaire Qualtrics.'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return data.response;
        } else {
            throw new Error(data.error);
        }
    });
}

