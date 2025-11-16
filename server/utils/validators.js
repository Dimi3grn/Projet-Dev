/**
 * Fonctions de validation des données
 * Centralise toutes les règles de validation
 *
 * @author Collaborateur
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_TICKET_TITLE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;

// Valide un email avec une regex
export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

// Valide un mot de passe (longueur minimale)
// Retourne { isValid: boolean, error: string }
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// Valide les données d'un ticket (titre, description, catégorie)
// Retourne { isValid: boolean, errors: string[] }
export function validateTicketData(ticketData) {
  const errors = [];

  if (!ticketData.title || typeof ticketData.title !== 'string') {
    errors.push('Title is required');
  } else if (ticketData.title.length > MAX_TICKET_TITLE_LENGTH) {
    errors.push(`Title must not exceed ${MAX_TICKET_TITLE_LENGTH} characters`);
  }

  if (!ticketData.description || typeof ticketData.description !== 'string') {
    errors.push('Description is required');
  }

  if (!ticketData.category || typeof ticketData.category !== 'string') {
    errors.push('Category is required');
  }

  const validCategories = ['technical', 'billing', 'account', 'other'];
  if (ticketData.category && !validCategories.includes(ticketData.category)) {
    errors.push('Invalid category');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Valide un message de chat (non vide, longueur max)
// Retourne { isValid: boolean, error: string }
export function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }

  if (message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// Sanitize une chaîne pour éviter les injections XSS
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().replace(/[<>]/g, '');
}

