/**
 * Contrôleur d'authentification
 * Gère les routes d'inscription et de connexion
 *
 * @author Votre Nom & Collaborateur
 */

import express from 'express';
import { authService } from '../services/auth-service.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    logger.info('Registration attempt', { email });

    const result = await authService.register(email, password, role);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    logger.info('Login attempt', { email });

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

