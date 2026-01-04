import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour Qualtrics
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes depuis Qualtrics et les origines spécifiées
    const allowedOrigins = [
      'https://*.qualtrics.com',
      'https://qualtrics.com',
      process.env.ALLOWED_ORIGIN
    ].filter(Boolean);
    
    // En développement, autoriser toutes les origines
    if (process.env.NODE_ENV === 'development' || !origin) {
      return callback(null, true);
    }
    
    // Vérifier si l'origine est autorisée
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
    
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Routes API
app.use('/api/chat', chatRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur proxy démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api/chat`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

