/**
 * Contrôleur de gestion du chat
 * Gère les routes de messagerie des tickets
 *
 * @author Votre Nom
 */

import express from 'express';
import { chatService } from '../services/chat-service.js';
import { authenticate } from '../middleware/auth-middleware.js';

const router = express.Router();

/**
 * POST /api/chat/:ticketId/messages
 * Ajoute un message à un ticket
 */
router.post('/:ticketId/messages', authenticate, async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;

    const message = chatService.addMessage(
      ticketId,
      req.user.id,
      req.user.role,
      content
    );

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/:ticketId/messages
 * Récupère tous les messages d'un ticket
 */
router.get('/:ticketId/messages', authenticate, async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const messages = chatService.getMessages(
      ticketId,
      req.user.id,
      req.user.role
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

