/**
 * Middleware d'authentification et autorisation
 * Vérifie les tokens JWT et les permissions
 *
 * @author Votre Nom
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

// Vérifie qu'un token JWT valide est présent dans les headers
// Attache les infos utilisateur à req.user
export function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attache les infos utilisateur à la requête
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    logger.debug('User authenticated', { userId: req.user.id, role: req.user.role });
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
}

// Vérifie que l'utilisateur a le rôle admin
export function requireAdmin(req, _res, next) {
  if (!req.user) {
    return next(new AuthenticationError('Authentication required'));
  }

  if (req.user.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', {
      userId: req.user.id,
      role: req.user.role,
      path: req.path,
    });
    return next(new AuthorizationError('Admin access required'));
  }

  next();
}

// Vérifie que l'utilisateur a le rôle client
export function requireClient(req, _res, next) {
  if (!req.user) {
    return next(new AuthenticationError('Authentication required'));
  }

  if (req.user.role !== 'client') {
    return next(new AuthorizationError('Client access required'));
  }

  next();
}

