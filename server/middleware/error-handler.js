/**
 * Middleware de gestion centralisée des erreurs
 * Capture toutes les erreurs et renvoie une réponse appropriée
 *
 * @author Votre Nom & Collaborateur
 */

import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

// Middleware de gestion d'erreurs Express
// Capture toutes les erreurs et renvoie une réponse appropriée
export function errorHandler(err, req, res, _next) {
  // Log l'erreur avec contexte
  const logContext = {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
  };

  if (err.statusCode >= 500) {
    logger.error('Server error occurred', logContext);
  } else {
    logger.warn('Client error occurred', logContext);
  }

  // Erreur opérationnelle connue
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(err.errors && { errors: err.errors }),
        timestamp: err.timestamp,
      },
    });
  }

  // Erreur inconnue - ne pas exposer les détails
  logger.critical('Unexpected error', logContext);
  return res.status(500).json({
    success: false,
    error: {
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    },
  });
}

