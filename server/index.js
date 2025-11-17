// Point d'entrée principal du serveur
// Initialise Express et configure tous les middlewares

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { rateLimiter } from './middleware/rate-limiter.js';
import authRoutes from './controllers/auth-controller.js';
import ticketRoutes from './controllers/ticket-controller.js';
import chatRoutes from './controllers/chat-controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour simplifier le dev
}));
app.use(cors());
app.use(rateLimiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Logs des requêtes
app.use((req, _res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Démarrage du serveur
app.listen(config.port, () => {
  logger.info('Server started successfully', {
    port: config.port,
    environment: config.nodeEnv,
    nodeVersion: process.version,
  });
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.critical('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.critical('Unhandled rejection', { reason });
  process.exit(1);
});

