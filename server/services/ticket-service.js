/**
 * Service de gestion des tickets
 * Contient toute la logique métier liée aux tickets
 *
 * @author Collaborateur
 */

import { storage } from '../storage/storage.js';
import { logger } from '../utils/logger.js';
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
} from '../utils/errors.js';
import { validateTicketData, sanitizeString } from '../utils/validators.js';

class TicketService {
  // Crée un nouveau ticket (validation + sanitization + création)
  createTicket(ticketData, userId) {
    // Validation des données
    const validation = validateTicketData(ticketData);
    if (!validation.isValid) {
      throw new ValidationError('Invalid ticket data', validation.errors);
    }

    // Sanitize les données
    const sanitizedData = {
      title: sanitizeString(ticketData.title),
      description: sanitizeString(ticketData.description),
      category: ticketData.category,
      priority: ticketData.priority || 'medium',
      userId,
    };

    const ticket = storage.createTicket(sanitizedData);

    logger.info('Ticket created successfully', {
      ticketId: ticket.id,
      userId,
      category: ticket.category,
    });

    return ticket;
  }

  // Récupère les tickets d'un utilisateur
  getUserTickets(userId) {
    const tickets = storage.getTicketsByUserId(userId);
    logger.debug('Retrieved user tickets', { userId, count: tickets.length });
    return tickets;
  }

  // Récupère tous les tickets (admin uniquement)
  getAllTickets(userRole) {
    if (userRole !== 'admin') {
      throw new AuthorizationError('Admin access required');
    }

    const tickets = storage.getAllTickets();
    logger.debug('Retrieved all tickets', { count: tickets.length });
    return tickets;
  }

  // Récupère un ticket par ID (avec vérification des permissions)
  getTicketById(ticketId, userId, userRole) {
    const ticket = storage.getTicketById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    // Vérifier les permissions
    if (userRole !== 'admin' && ticket.userId !== userId) {
      throw new AuthorizationError('Access denied to this ticket');
    }

    return ticket;
  }

  // Met à jour le statut d'un ticket (admin uniquement)
  async updateTicketStatus(ticketId, status, userId, userRole) {
    // Seul l'admin peut changer le statut
    if (userRole !== 'admin') {
      throw new AuthorizationError('Only admins can update ticket status');
    }

    const validStatuses = ['open', 'in-progress', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status', [`Status must be one of: ${validStatuses.join(', ')}`]);
    }

    const ticket = await storage.updateTicketStatus(ticketId, status, userId);

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    logger.info('Ticket status updated', { ticketId, status });
    return ticket;
  }

  // Récupère les statistiques des tickets (admin uniquement)
  getStatistics(userRole) {
    if (userRole !== 'admin') {
      throw new AuthorizationError('Admin access required');
    }

    return storage.getStatistics();
  }
}

export const ticketService = new TicketService();

