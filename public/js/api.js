// Module API - Gère toutes les communications avec le backend
// Centralise les appels HTTP et la gestion des tokens

const API_BASE_URL = '/api';

// Classe pour gérer les appels API
class API {
  // Récupère le token JWT du localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Sauvegarde le token JWT
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Supprime le token JWT
  removeToken() {
    localStorage.removeItem('token');
  }

  // Récupère les données utilisateur du localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Sauvegarde les données utilisateur
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Supprime les données utilisateur
  removeUser() {
    localStorage.removeItem('user');
  }

  // Effectue une requête HTTP
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Ajouter le token si disponible
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ========== AUTH ==========

  // Connexion utilisateur
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(data.data.token);
    this.setUser(data.data.user);
    return data.data;
  }

  // Inscription utilisateur
  async register(email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role: 'client' }),
    });

    this.setToken(data.data.token);
    this.setUser(data.data.user);
    return data.data;
  }

  // Déconnexion utilisateur
  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = '/';
  }

  // ========== TICKETS ==========

  // Crée un nouveau ticket
  async createTicket(ticketData) {
    const data = await this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
    return data.data;
  }

  // Récupère les tickets de l'utilisateur
  async getTickets() {
    const data = await this.request('/tickets');
    return data.data;
  }

  // Récupère un ticket par ID
  async getTicket(ticketId) {
    const data = await this.request(`/tickets/${ticketId}`);
    return data.data;
  }

  // Met à jour le statut d'un ticket
  async updateTicketStatus(ticketId, status) {
    const data = await this.request(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return data.data;
  }

  // Récupère les statistiques (admin)
  async getStatistics() {
    const data = await this.request('/tickets/stats/overview');
    return data.data;
  }

  // ========== CHAT ==========

  // Récupère les messages d'un ticket
  async getMessages(ticketId) {
    const data = await this.request(`/chat/${ticketId}/messages`);
    return data.data;
  }

  // Envoie un message
  async sendMessage(ticketId, content) {
    const data = await this.request(`/chat/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return data.data;
  }
}

// Export de l'instance API
const api = new API();

