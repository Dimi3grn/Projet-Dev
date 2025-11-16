/**
 * Interface admin - Dashboard et gestion des tickets
 *
 * @author Collaborateur
 */

// Protection de la page
protectPage('admin');

const user = api.getUser();
let currentTicketId = null;
let allTickets = [];
let filteredTickets = [];

// Éléments DOM
const userEmailEl = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const ticketsContainer = document.getElementById('tickets-container');
const filterStatus = document.getElementById('filter-status');
const filterCategory = document.getElementById('filter-category');
const chatModal = document.getElementById('chat-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const sendMessageBtn = document.getElementById('send-message-btn');
const messageInput = document.getElementById('message-input');
const statusSelect = document.getElementById('status-select');

/**
 * Initialise la page
 */
function init() {
  userEmailEl.textContent = user.email;
  loadStatistics();
  loadTickets();
}

/**
 * Charge les statistiques
 */
async function loadStatistics() {
  try {
    const stats = await api.getStatistics();
    document.getElementById('total-tickets').textContent = stats.totalTickets;
    document.getElementById('open-tickets').textContent = stats.openTickets;
    document.getElementById('closed-tickets').textContent = stats.closedTickets;
    document.getElementById('total-users').textContent = stats.totalUsers;
  } catch (error) {
    showAlert(error.message);
  }
}

/**
 * Charge tous les tickets
 */
async function loadTickets() {
  try {
    allTickets = await api.getTickets();
    applyFilters();
  } catch (error) {
    showAlert(error.message);
  }
}

/**
 * Applique les filtres
 */
function applyFilters() {
  const statusFilter = filterStatus.value;
  const categoryFilter = filterCategory.value;

  filteredTickets = allTickets.filter((ticket) => {
    const matchStatus = !statusFilter || ticket.status === statusFilter;
    const matchCategory = !categoryFilter || ticket.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  renderTickets();
}

/**
 * Affiche les tickets
 */
function renderTickets() {
  if (filteredTickets.length === 0) {
    ticketsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p>Aucun ticket trouvé</p>
      </div>
    `;
    return;
  }

  const ticketsHtml = filteredTickets
    .map(
      (ticket) => `
    <div class="ticket-card" data-ticket-id="${ticket.id}">
      <div class="ticket-header">
        <div>
          <h3 class="ticket-title">${escapeHtml(ticket.title)}</h3>
          <div class="ticket-meta">
            ${getStatusBadge(ticket.status)}
            ${getCategoryBadge(ticket.category)}
            <span>${formatDate(ticket.createdAt)}</span>
          </div>
        </div>
      </div>
      <p class="ticket-description">${escapeHtml(ticket.description)}</p>
    </div>
  `
    )
    .join('');

  ticketsContainer.innerHTML = `<div class="tickets-grid">${ticketsHtml}</div>`;

  // Ajouter les événements de clic
  document.querySelectorAll('.ticket-card').forEach((card) => {
    card.addEventListener('click', () => {
      const ticketId = card.dataset.ticketId;
      openTicketChat(ticketId);
    });
  });
}

/**
 * Ouvre le chat d'un ticket
 * @param {string} ticketId - ID du ticket
 */
async function openTicketChat(ticketId) {
  currentTicketId = ticketId;
  const ticket = allTickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return;
  }

  // Afficher les infos du ticket
  document.getElementById('modal-ticket-title').textContent = ticket.title;
  document.getElementById('modal-ticket-info').innerHTML = `
    ${getCategoryBadge(ticket.category)} • Créé ${formatDate(ticket.createdAt)}
  `;

  // Sélectionner le statut actuel
  statusSelect.value = ticket.status;

  // Afficher le modal
  chatModal.classList.remove('hidden');

  // Charger les messages
  await loadMessages();
}

/**
 * Charge les messages d'un ticket
 */
async function loadMessages() {
  try {
    const messages = await api.getMessages(currentTicketId);
    renderMessages(messages);
  } catch (error) {
    showAlert(error.message);
  }
}

/**
 * Affiche les messages
 * @param {Array} messages - Liste des messages
 */
function renderMessages(messages) {
  const chatMessages = document.getElementById('chat-messages');

  if (messages.length === 0) {
    chatMessages.innerHTML = `
      <div class="empty-state">
        <p>Aucun message pour le moment</p>
        <p style="font-size: 0.875rem;">Soyez le premier à répondre !</p>
      </div>
    `;
    return;
  }

  const messagesHtml = messages
    .map((message) => {
      const isAdmin = message.senderRole === 'admin';
      return `
      <div class="message ${isAdmin ? 'message-admin' : 'message-client'}">
        <div class="message-header">
          ${isAdmin ? 'Vous (Support)' : 'Client'}
        </div>
        <div class="message-content">${escapeHtml(message.content)}</div>
        <div class="message-time">${formatTime(message.createdAt)}</div>
      </div>
    `;
    })
    .join('');

  chatMessages.innerHTML = messagesHtml;

  // Scroll vers le bas
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Envoie un message
 */
async function sendMessage() {
  const content = messageInput.value.trim();

  if (!content) {
    return;
  }

  try {
    await api.sendMessage(currentTicketId, content);
    messageInput.value = '';
    await loadMessages();
  } catch (error) {
    showAlert(error.message);
  }
}

/**
 * Met à jour le statut d'un ticket
 */
async function updateTicketStatus() {
  const newStatus = statusSelect.value;

  try {
    await api.updateTicketStatus(currentTicketId, newStatus);
    showAlert('Statut mis à jour avec succès !', 'success');
    await loadTickets();
    await loadStatistics();
  } catch (error) {
    showAlert(error.message);
  }
}

// ========== EVENT LISTENERS ==========

logoutBtn.addEventListener('click', () => {
  api.logout();
});

filterStatus.addEventListener('change', applyFilters);
filterCategory.addEventListener('change', applyFilters);

closeModalBtn.addEventListener('click', () => {
  chatModal.classList.add('hidden');
  currentTicketId = null;
});

sendMessageBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

statusSelect.addEventListener('change', updateTicketStatus);

// Initialiser
init();

