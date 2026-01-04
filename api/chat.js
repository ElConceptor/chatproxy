import axios from 'axios';

// Configuration de l'API OpenAI
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Fonction helper pour gérer CORS
function setCorsHeaders(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Gérer les requêtes OPTIONS (preflight)
function handleOptions(res) {
  setCorsHeaders(res);
  res.status(200).end();
}

export default async function handler(req, res) {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return handleOptions(res);
  }

  setCorsHeaders(res);

  // Gérer les requêtes GET
  if (req.method === 'GET') {
    return res.json({
      status: 'ok',
      message: 'Service de chat disponible',
      hasApiKey: !!OPENAI_API_KEY
    });
  }

  // Gérer les requêtes POST
  if (req.method === 'POST') {
    try {
      const { message, conversationHistory, systemPrompt } = req.body;

      // Validation de la requête
      if (!message) {
        return res.status(400).json({
          error: 'Le champ "message" est requis'
        });
      }

      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          error: 'Configuration du serveur incomplète: OPENAI_API_KEY manquante'
        });
      }

      // Construction des messages pour l'API OpenAI
      const messages = [];

      // Ajouter le prompt système si fourni
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }

      // Ajouter l'historique de conversation si fourni
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages.push(...conversationHistory);
      }

      // Ajouter le message actuel
      messages.push({
        role: 'user',
        content: message
      });

      // Appel à l'API OpenAI
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: messages,
          temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
          max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500')
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 secondes de timeout
        }
      );

      // Extraire la réponse
      const aiResponse = response.data.choices[0]?.message?.content;

      if (!aiResponse) {
        return res.status(500).json({
          error: 'Aucune réponse reçue de l\'API ChatGPT'
        });
      }

      // Retourner la réponse formatée pour Qualtrics
      return res.json({
        success: true,
        response: aiResponse,
        usage: response.data.usage,
        model: response.data.model
      });

    } catch (error) {
      console.error('Erreur lors de l\'appel à ChatGPT:', error);

      // Gestion des erreurs spécifiques
      if (error.response) {
        // Erreur de l'API OpenAI
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.error?.message || 'Erreur de l\'API OpenAI';

        return res.status(statusCode).json({
          error: errorMessage,
          details: error.response.data?.error
        });
      } else if (error.request) {
        // Pas de réponse du serveur
        return res.status(503).json({
          error: 'Service temporairement indisponible. Impossible de contacter l\'API ChatGPT'
        });
      } else {
        // Erreur de configuration
        return res.status(500).json({
          error: 'Erreur interne du serveur',
          message: error.message
        });
      }
    }
  }

  // Méthode non supportée
  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).json({
    error: 'Méthode non autorisée'
  });
}

