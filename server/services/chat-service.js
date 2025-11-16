/**
 * Service de gestion du chat
 * Gère les messages entre clients et admins
 *
 * @author Votre Nom
 */

import { storage } from '../storage/storage.js';
import { logger } from '../utils/logger.js';
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
} from '../utils/errors.js';
import { validateMessage, sanitizeString } from '../utils/validators.js';

class ChatService {
  // Ajoute un message à un ticket (validation + vérification permissions)
  addMessage(ticketId, userId, userRole, content) {
    // Validation du message
    const validation = validateMessage(content);
    if (!validation.isValid) {
      throw new ValidationError(validation.error);
    }

    // Vérifier que le ticket existe
    const ticket = storage.getTicketById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    // Vérifier les permissions
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new AuthorizationError('Access denied to this ticket');
    }

    // Sanitize et créer le message
    const sanitizedContent = sanitizeString(content);
    const message = storage.addMessage({
      ticketId,
      userId,
      content: sanitizedContent,
    });

    logger.info('Message added to ticket', {
      messageId: message.id,
      ticketId,
      userId,
    });

    return message;
  }

  // Récupère tous les messages d'un ticket (avec infos utilisateur enrichies)
  getMessages(ticketId, userId, userRole) {
    // Vérifier que le ticket existe
    const ticket = storage.getTicketById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    // Vérifier les permissions
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new AuthorizationError('Access denied to this ticket');
    }

    const messages = storage.getMessagesByTicketId(ticketId);

    // Enrichir les messages avec les infos utilisateur
    const enrichedMessages = messages.map((message) => {
      const user = storage.findUserById(message.userId);
      return {
        ...message,
        senderRole: user ? user.role : 'unknown',
        senderEmail: user ? user.email : 'unknown',
      };
    });

    logger.debug('Retrieved ticket messages', {
      ticketId,
      count: enrichedMessages.length,
    });

    return enrichedMessages;
  }
}

export const chatService = new ChatService();

