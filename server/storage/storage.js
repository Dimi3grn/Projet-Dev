// Couche de persistance des données en mémoire
// En production, remplacer par une vraie base de données
// Utilise le pattern Singleton pour garantir une seule instance

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { persistence } from './persistence.js';
import { discordNotifier } from '../utils/discord-notifier.js';

class Storage {
  constructor() {
    if (Storage.instance) {
      return Storage.instance;
    }

    this.users = new Map();
    this.tickets = new Map();
    this.messages = new Map();
    this.isInitialized = false;

    // Charge les données au démarrage
    this.initialize();
    Storage.instance = this;
  }

  // Initialise le storage en chargeant les données existantes
  async initialize() {
    try {
      const data = await persistence.loadAll();
      
      // Charge les données si elles existent
      if (data.users.size > 0) {
        this.users = data.users;
        logger.info('Users loaded from persistence', { count: this.users.size });
      }
      
      if (data.tickets.size > 0) {
        this.tickets = data.tickets;
        logger.info('Tickets loaded from persistence', { count: this.tickets.size });
      }
      
      if (data.messages.size > 0) {
        this.messages = data.messages;
        logger.info('Messages loaded from persistence', { count: this.messages.size });
      }

      // Initialise l'admin par défaut si aucun utilisateur n'existe
      if (this.users.size === 0) {
        await this.initializeDefaultAdmin();
      }

      this.isInitialized = true;
      logger.info('Storage initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize storage', { error: error.message });
      // En cas d'erreur, initialise quand même l'admin
      await this.initializeDefaultAdmin();
      this.isInitialized = true;
    }
  }

  // Sauvegarde toutes les données après chaque modification
  async saveData() {
    try {
      await persistence.saveAll(this.users, this.tickets, this.messages);
    } catch (error) {
      logger.error('Failed to save data', { error: error.message });
    }
  }

  // Initialise le compte admin par défaut au démarrage
  async initializeDefaultAdmin() {
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash(config.adminPassword, 10);

    this.users.set(adminId, {
      id: adminId,
      email: config.adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    logger.info('Default admin account initialized', {
      email: config.adminEmail,
    });

    // Sauvegarde l'admin
    await this.saveData();
  }

  // ========== USERS ==========

  // Crée un nouvel utilisateur (hash le mot de passe avec bcrypt)
  async createUser(userData) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
      id: userId,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'client',
      createdAt: new Date().toISOString(),
    };

    this.users.set(userId, user);
    logger.info('User created', { userId, email: user.email, role: user.role });

    // Sauvegarde les données
    await this.saveData();

    // Notification Discord
    const { password: _, ...userWithoutPassword } = user;
    await discordNotifier.notifyNewUser(userWithoutPassword);

    // Retourne sans le mot de passe
    return userWithoutPassword;
  }

  // Trouve un utilisateur par email
  findUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email) || null;
  }

  // Trouve un utilisateur par ID
  findUserById(userId) {
    return this.users.get(userId) || null;
  }

  // ========== TICKETS ==========

  // Crée un nouveau ticket avec statut "open" par défaut
  async createTicket(ticketData) {
    const ticketId = uuidv4();
    const ticket = {
      id: ticketId,
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category,
      status: 'open',
      priority: ticketData.priority || 'medium',
      userId: ticketData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tickets.set(ticketId, ticket);
    logger.info('Ticket created', { ticketId, userId: ticket.userId, category: ticket.category });

    // Sauvegarde les données
    await this.saveData();

    // Notification Discord
    const user = this.findUserById(ticket.userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      await discordNotifier.notifyNewTicket(ticket, userWithoutPassword);
    }

    return ticket;
  }

  // Récupère tous les tickets d'un utilisateur (triés par date)
  getTicketsByUserId(userId) {
    return Array.from(this.tickets.values())
      .filter((ticket) => ticket.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Récupère tous les tickets (pour l'admin)
  getAllTickets() {
    return Array.from(this.tickets.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Récupère un ticket par ID
  getTicketById(ticketId) {
    return this.tickets.get(ticketId) || null;
  }

  // Met à jour le statut d'un ticket (open, in-progress, closed)
  async updateTicketStatus(ticketId, status, userId) {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) {
      return null;
    }

    const oldStatus = ticket.status;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    this.tickets.set(ticketId, ticket);

    logger.info('Ticket status updated', { ticketId, status });
    
    // Sauvegarde les données
    await this.saveData();

    // Notification Discord
    if (userId) {
      const user = this.findUserById(userId);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        await discordNotifier.notifyStatusChange(ticket, oldStatus, status, userWithoutPassword);
      }
    }
    
    return ticket;
  }

  // ========== MESSAGES ==========

  // Ajoute un message à un ticket
  async addMessage(messageData) {
    const messageId = uuidv4();
    const message = {
      id: messageId,
      ticketId: messageData.ticketId,
      userId: messageData.userId,
      content: messageData.content,
      createdAt: new Date().toISOString(),
    };

    if (!this.messages.has(messageData.ticketId)) {
      this.messages.set(messageData.ticketId, []);
    }

    this.messages.get(messageData.ticketId).push(message);
    logger.debug('Message added', { messageId, ticketId: message.ticketId });

    // Sauvegarde les données
    await this.saveData();

    // Notification Discord
    const ticket = this.getTicketById(messageData.ticketId);
    const user = this.findUserById(messageData.userId);
    if (ticket && user) {
      const { password: _, ...userWithoutPassword } = user;
      await discordNotifier.notifyNewMessage(ticket, message, userWithoutPassword);
    }

    return message;
  }

  // Récupère tous les messages d'un ticket (triés chronologiquement)
  getMessagesByTicketId(ticketId) {
    return this.messages.get(ticketId) || [];
  }

  // Récupère les statistiques pour le dashboard admin
  getStatistics() {
    const tickets = Array.from(this.tickets.values());
    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter((t) => t.status === 'open').length,
      closedTickets: tickets.filter((t) => t.status === 'closed').length,
      totalUsers: this.users.size - 1, // Exclut l'admin
    };
  }
}

// Export du singleton
export const storage = new Storage();

