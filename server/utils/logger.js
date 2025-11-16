/**
 * Système de logging centralisé
 * Fournit des logs structurés avec différents niveaux
 *
 * @author Votre Nom & Collaborateur
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4,
};

const LOG_COLORS = {
  DEBUG: '\x1b[36m',    // Cyan
  INFO: '\x1b[32m',     // Vert
  WARN: '\x1b[33m',     // Jaune
  ERROR: '\x1b[31m',    // Rouge
  CRITICAL: '\x1b[35m', // Magenta
  RESET: '\x1b[0m',
};

class Logger {
  constructor(minLevel = 'INFO') {
    this.minLevel = LOG_LEVELS[minLevel] || LOG_LEVELS.INFO;
  }

  // Formate et affiche un log avec niveau, message et contexte
  log(level, message, context = {}) {
    if (LOG_LEVELS[level] < this.minLevel) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.sanitizeContext(context),
    };

    const color = LOG_COLORS[level] || LOG_COLORS.RESET;
    const formattedMessage = `${color}[${logEntry.timestamp}] ${level}: ${message}${LOG_COLORS.RESET}`;

    console.log(formattedMessage, Object.keys(context).length > 0 ? context : '');
  }

  // Sanitize le contexte pour éviter de logger des données sensibles (mots de passe, tokens, etc.)
  sanitizeContext(context) {
    const sensitiveKeys = ['password', 'token', 'secret', 'authorization'];
    const sanitized = { ...context };

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  debug(message, context) {
    this.log('DEBUG', message, context);
  }

  info(message, context) {
    this.log('INFO', message, context);
  }

  warn(message, context) {
    this.log('WARN', message, context);
  }

  error(message, context) {
    this.log('ERROR', message, context);
  }

  critical(message, context) {
    this.log('CRITICAL', message, context);
  }
}

export const logger = new Logger(process.env.LOG_LEVEL || 'INFO');

