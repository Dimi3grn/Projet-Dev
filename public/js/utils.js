// Utilitaires frontend
// Fonctions réutilisables pour l'interface

// Formate une date en format lisible
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'À l\'instant';
  }
  if (diffMins < 60) {
    return `Il y a ${diffMins} min`;
  }
  if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  }
  if (diffDays < 7) {
    return `Il y a ${diffDays}j`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Formate l'heure d'un message
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Affiche un message d'alerte
function showAlert(message, type = 'error') {
  const container = document.getElementById('alert-container');
  if (!container) {
    return;
  }

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  container.innerHTML = '';
  container.appendChild(alert);

  // Auto-masquer après 5 secondes
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Récupère le badge HTML pour un statut
function getStatusBadge(status) {
  const labels = {
    open: 'Ouvert',
    'in-progress': 'En cours',
    closed: 'Fermé',
  };

  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// Récupère le badge HTML pour une catégorie
function getCategoryBadge(category) {
  const labels = {
    technical: 'Technique',
    billing: 'Facturation',
    account: 'Compte',
    other: 'Autre',
  };

  return `<span class="badge badge-${category}">${labels[category] || category}</span>`;
}

// Vérifie si l'utilisateur est authentifié
function isAuthenticated() {
  return !!api.getToken();
}

// Redirige vers la page appropriée selon le rôle
function redirectToDashboard() {
  const user = api.getUser();
  if (!user) {
    window.location.href = '/';
    return;
  }

  if (user.role === 'admin') {
    window.location.href = '/admin.html';
  } else {
    window.location.href = '/client.html';
  }
}

// Protège une page (nécessite authentification)
function protectPage(requiredRole = null) {
  if (!isAuthenticated()) {
    window.location.href = '/';
    return;
  }

  const user = api.getUser();
  if (requiredRole && user.role !== requiredRole) {
    redirectToDashboard();
  }
}

// Échappe les caractères HTML pour éviter XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Tronque un texte à une longueur maximale
function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
