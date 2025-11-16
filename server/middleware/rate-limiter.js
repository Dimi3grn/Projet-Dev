/**
 * Middleware de rate limiting
 * Protège contre les abus et attaques par force brute
 *
 * @author Collaborateur
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
      },
    });
  },
});

