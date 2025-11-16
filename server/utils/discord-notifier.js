// Module de notifications Discord via Webhook
// Envoie des notifications automatiques pour les événements importants
// Auteur: Votre Nom & Collaborateur
// Utilise l'API Webhook de Discord pour poster des messages enrichis

import { config } from '../config/config.js';
import { logger } from './logger.js';

class DiscordNotifier {
  constructor() {
    this.webhookUrl = config.discordWebhookUrl;
    this.enabled = !!this.webhookUrl;

    if (!this.enabled) {
      logger.warn('Discord webhook not configured, notifications disabled');
    } else {
      logger.info('Discord notifications enabled');
    }
  }

  // Envoie un message au webhook Discord
  async sendWebhook(payload) {
    if (!this.enabled) {
      logger.debug('Discord webhook disabled, skipping notification');
      return;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Discord API returned ${response.status}: ${response.statusText}`);
      }

      logger.debug('Discord notification sent successfully');
    } catch (error) {
      logger.error('Failed to send Discord notification', {
        error: error.message,
      });
    }
  }

  // Notification pour un nouveau ticket
  async notifyNewTicket(ticket, user) {
    const categoryEmojis = {
      technical: '🔧',
      billing: '💳',
      account: '👤',
      other: '❓',
    };

    const priorityColors = {
      low: 0x10b981, // Vert
      medium: 0xf59e0b, // Orange
      high: 0xef4444, // Rouge
    };

    await this.sendWebhook({
      embeds: [
        {
          title: '🎫 Nouveau Ticket Créé',
          description: ticket.title,
          color: priorityColors[ticket.priority] || 0x6366f1,
          fields: [
            {
              name: '📂 Catégorie',
              value: `${categoryEmojis[ticket.category] || '📋'} ${ticket.category}`,
              inline: true,
            },
            {
              name: '⚡ Priorité',
              value: ticket.priority.toUpperCase(),
              inline: true,
            },
            {
              name: '📊 Statut',
              value: '🟢 Ouvert',
              inline: true,
            },
            {
              name: '👤 Client',
              value: user.email,
              inline: false,
            },
            {
              name: '📝 Description',
              value: ticket.description.substring(0, 200) + (ticket.description.length > 200 ? '...' : ''),
              inline: false,
            },
          ],
          footer: {
            text: `Ticket ID: ${ticket.id}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    logger.info('Discord notification sent for new ticket', {
      ticketId: ticket.id,
    });
  }

  // Notification pour un changement de statut
  async notifyStatusChange(ticket, oldStatus, newStatus, user) {
    const statusEmojis = {
      open: '🟢',
      'in-progress': '🟡',
      closed: '⚫',
    };

    const statusColors = {
      open: 0x3b82f6, // Bleu
      'in-progress': 0xf59e0b, // Orange
      closed: 0x10b981, // Vert
    };

    await this.sendWebhook({
      embeds: [
        {
          title: '🔄 Statut de Ticket Modifié',
          description: ticket.title,
          color: statusColors[newStatus] || 0x6366f1,
          fields: [
            {
              name: '📊 Ancien Statut',
              value: `${statusEmojis[oldStatus]} ${oldStatus}`,
              inline: true,
            },
            {
              name: '📊 Nouveau Statut',
              value: `${statusEmojis[newStatus]} ${newStatus}`,
              inline: true,
            },
            {
              name: '👤 Modifié par',
              value: user.email,
              inline: false,
            },
          ],
          footer: {
            text: `Ticket ID: ${ticket.id}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    logger.info('Discord notification sent for status change', {
      ticketId: ticket.id,
      oldStatus,
      newStatus,
    });
  }

  // Notification pour un nouveau message
  async notifyNewMessage(ticket, message, user) {
    const isAdmin = user.role === 'admin';

    await this.sendWebhook({
      embeds: [
        {
          title: `💬 Nouveau Message ${isAdmin ? '(Admin)' : '(Client)'}`,
          description: ticket.title,
          color: isAdmin ? 0xec4899 : 0x6366f1,
          fields: [
            {
              name: isAdmin ? '👨‍💼 Admin' : '👤 Client',
              value: user.email,
              inline: true,
            },
            {
              name: '📊 Statut du Ticket',
              value: ticket.status,
              inline: true,
            },
            {
              name: '💬 Message',
              value: message.content.substring(0, 300) + (message.content.length > 300 ? '...' : ''),
              inline: false,
            },
          ],
          footer: {
            text: `Ticket ID: ${ticket.id}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    logger.info('Discord notification sent for new message', {
      ticketId: ticket.id,
      userId: user.id,
    });
  }

  // Notification pour un nouvel utilisateur inscrit
  async notifyNewUser(user) {
    await this.sendWebhook({
      embeds: [
        {
          title: '👤 Nouvel Utilisateur Inscrit',
          description: `Un nouveau compte a été créé`,
          color: 0x10b981,
          fields: [
            {
              name: '📧 Email',
              value: user.email,
              inline: true,
            },
            {
              name: '🔑 Rôle',
              value: user.role === 'admin' ? '👨‍💼 Admin' : '👤 Client',
              inline: true,
            },
          ],
          footer: {
            text: `User ID: ${user.id}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    logger.info('Discord notification sent for new user', {
      userId: user.id,
    });
  }

  // Notification de statistiques quotidiennes (optionnel)
  async notifyDailyStats(stats) {
    await this.sendWebhook({
      embeds: [
        {
          title: '📊 Statistiques Quotidiennes',
          description: 'Résumé de l\'activité du système',
          color: 0x8b5cf6,
          fields: [
            {
              name: '🎫 Total Tickets',
              value: stats.totalTickets.toString(),
              inline: true,
            },
            {
              name: '🟢 Tickets Ouverts',
              value: stats.openTickets.toString(),
              inline: true,
            },
            {
              name: '⚫ Tickets Fermés',
              value: stats.closedTickets.toString(),
              inline: true,
            },
            {
              name: '👥 Utilisateurs',
              value: stats.totalUsers.toString(),
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    });

    logger.info('Discord daily stats notification sent');
  }
}

// Export du singleton
export const discordNotifier = new DiscordNotifier();

