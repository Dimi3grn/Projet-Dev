/**
 * Configuration centralisée de l'application
 * Charge les variables d'environnement et expose les configurations
 *
 * @author Votre Nom
 */

import dotenv from 'dotenv';

dotenv.config();

// Récupère une variable d'environnement ou utilise la valeur par défaut
// Lance une erreur si la variable n'existe pas et n'a pas de défaut
function getEnvVariable(key, defaultValue = null) {
  const value = process.env[key] || defaultValue;
  if (value === null) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  // Serveur
  port: parseInt(getEnvVariable('PORT', '3000'), 10),
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),

  // Sécurité
  jwtSecret: getEnvVariable('JWT_SECRET', 'dev-secret-change-in-production'),
  jwtExpiresIn: getEnvVariable('JWT_EXPIRES_IN', '24h'),

  // Rate limiting
  rateLimitWindowMs: parseInt(getEnvVariable('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  rateLimitMaxRequests: parseInt(getEnvVariable('RATE_LIMIT_MAX_REQUESTS', '100'), 10),

  // Admin par défaut
  adminEmail: getEnvVariable('ADMIN_EMAIL', 'admin@support.com'),
  adminPassword: getEnvVariable('ADMIN_PASSWORD', 'Admin123!'),

  // Discord Webhook (optionnel)
  discordWebhookUrl: getEnvVariable('DISCORD_WEBHOOK_URL', ''),

  // Logs
  logLevel: getEnvVariable('LOG_LEVEL', 'info'),
};

