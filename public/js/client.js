/**
 * Interface client - Gestion des tickets
 *
 * @author Votre Nom & Collaborateur
 */

// Protection de la page
protectPage('client');

const user = api.getUser();
let currentTicketId = null;
let tickets = [];

// Éléments DOM
const userEmailEl = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const createTicketBtn = document.getElementById('create-ticket-btn');
const createTicketForm = document.getElementById('create-ticket-form');
const cancelCreateBtn = document.getElementById('cancel-create-btn');
const ticketForm = document.getElementById('ticket-form');
const ticketsContainer = document.getElementById('tickets-container');
const chatModal = document.getElementById('chat-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const sendMessageBtn = document.getElementById('send-message-btn');
const messageInput = document.getElementById('message-input');

/**
 * Initialise la page
 */
function init() {
  userEmailEl.textContent = user.email;
  loadTickets();
}

/**
 * Charge les tickets de l'utilisateur
 */
async function loadTickets() {
  try {
    tickets = await api.getTickets();
    renderTickets();
  } catch (error) {
    showAlert(error.message);
  }
}

/**
 * Affiche les tickets
 */
function renderTickets() {
  if (tickets.length === 0) {
    ticketsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p>Vous n'avez pas encore de tickets</p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">
          Créez votre premier ticket pour obtenir de l'aide
        </p>
      </div>
    `;
    return;
  }

  const ticketsHtml = tickets
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
  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return;
  }

  // Afficher les infos du ticket
  document.getElementById('modal-ticket-title').textContent = ticket.title;
  document.getElementById('modal-ticket-status').innerHTML = `
    ${getStatusBadge(ticket.status)} • ${getCategoryBadge(ticket.category)} • ${formatDate(ticket.createdAt)}
  `;

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
        <p style="font-size: 0.875rem;">Commencez la conversation !</p>
      </div>
    `;
    return;
  }

  const messagesHtml = messages
    .map((message) => {
      const isClient = message.senderRole === 'client';
      return `
      <div class="message ${isClient ? 'message-client' : 'message-admin'}">
        <div class="message-header">
          ${isClient ? 'Vous' : 'Support'}
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

// ========== EVENT LISTENERS ==========

logoutBtn.addEventListener('click', () => {
  api.logout();
});

createTicketBtn.addEventListener('click', () => {
  createTicketForm.classList.remove('hidden');
  createTicketBtn.classList.add('hidden');
});

cancelCreateBtn.addEventListener('click', () => {
  createTicketForm.classList.add('hidden');
  createTicketBtn.classList.remove('hidden');
  ticketForm.reset();
});

ticketForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const ticketData = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
  };

  try {
    await api.createTicket(ticketData);
    showAlert('Ticket créé avec succès !', 'success');
    ticketForm.reset();
    createTicketForm.classList.add('hidden');
    createTicketBtn.classList.remove('hidden');
    await loadTickets();
  } catch (error) {
    showAlert(error.message);
  }
});

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

// Initialiser
init();

