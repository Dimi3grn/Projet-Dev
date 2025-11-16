/**
 * Contrôleur de gestion des tickets
 * Gère toutes les routes liées aux tickets
 *
 * @author Collaborateur
 */

import express from 'express';
import { ticketService } from '../services/ticket-service.js';
import { authenticate, requireAdmin } from '../middleware/auth-middleware.js';

const router = express.Router();

/**
 * POST /api/tickets
 * Crée un nouveau ticket (client uniquement)
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const ticketData = req.body;
    const ticket = ticketService.createTicket(ticketData, req.user.id);

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets
 * Récupère les tickets
 * - Client : ses propres tickets
 * - Admin : tous les tickets
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    let tickets;

    if (req.user.role === 'admin') {
      tickets = ticketService.getAllTickets(req.user.role);
    } else {
      tickets = ticketService.getUserTickets(req.user.id);
    }

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets/:id
 * Récupère un ticket par ID
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const ticket = ticketService.getTicketById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tickets/:id/status
 * Met à jour le statut d'un ticket (admin uniquement)
 */
router.patch('/:id/status', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await ticketService.updateTicketStatus(
      req.params.id,
      status,
      req.user.id,
      req.user.role
    );

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tickets/stats/overview
 * Récupère les statistiques (admin uniquement)
 */
router.get('/stats/overview', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const stats = ticketService.getStatistics(req.user.role);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

