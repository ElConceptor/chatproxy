import express from 'express';
import axios from 'axios';

const router = express.Router();

// Configuration de l'API OpenAI
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY n\'est pas définie dans les variables d\'environnement');
}

/**
 * POST /api/chat
 * Endpoint principal pour recevoir les requêtes de Qualtrics
 * et les transmettre à ChatGPT
 */
router.post('/', async (req, res) => {
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
    res.json({
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
});

/**
 * GET /api/chat
 * Endpoint pour vérifier la disponibilité du service
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Service de chat disponible',
    hasApiKey: !!OPENAI_API_KEY
  });
});

export { router as chatRouter };

