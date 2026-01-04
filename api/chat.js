/**
 * Proxy serverless Qualtrics → ChatGPT
 * Capture les appels et les envoie à OpenAI
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Configuration
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const DEFAULT_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
const DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '500');
const TIMEOUT_MS = 25000;

/**
 * Appel à l'API OpenAI
 */
async function callOpenAI(messages, model, temperature, maxTokens) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.error?.message || `OpenAI API error: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw { status: 504, message: 'Timeout: La requête a pris trop de temps' };
    }
    
    throw error;
  }
}

/**
 * Construire les messages pour OpenAI
 */
function buildMessages(message, conversationHistory, systemPrompt) {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  if (conversationHistory && Array.isArray(conversationHistory)) {
    messages.push(...conversationHistory);
  }

  messages.push({ role: 'user', content: message });

  return messages;
}

/**
 * Handler serverless Vercel
 */
export default async function handler(req, res) {
  // OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}).end();
  }

  // GET (health check)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      hasApiKey: !!OPENAI_API_KEY
    });
  }

  // POST (chat)
  if (req.method === 'POST') {
    try {
      const { message, conversationHistory, systemPrompt } = req.body;

      // Validation
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          error: 'Le champ "message" est requis'
        });
      }

      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          error: 'OPENAI_API_KEY manquante'
        });
      }

      // Construire les messages
      const messages = buildMessages(message, conversationHistory, systemPrompt);

      // Appel à OpenAI
      const openAIResponse = await callOpenAI(
        messages,
        DEFAULT_MODEL,
        DEFAULT_TEMPERATURE,
        DEFAULT_MAX_TOKENS
      );

      // Extraire la réponse
      const aiResponse = openAIResponse.choices?.[0]?.message?.content;

      if (!aiResponse) {
        return res.status(500).json({
          error: 'Aucune réponse reçue de l\'API ChatGPT'
        });
      }

      // Retourner la réponse
      return res.status(200).json({
        success: true,
        response: aiResponse,
        usage: openAIResponse.usage,
        model: openAIResponse.model
      });

    } catch (error) {
      console.error('Erreur:', error);

      if (error.status) {
        return res.status(error.status).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erreur interne du serveur',
        message: error.message || 'Erreur inconnue'
      });
    }
  }

  // Méthode non supportée
  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).json({
    error: 'Méthode non autorisée'
  });
}
