/**
 * Service d'authentification
 * Gère l'inscription, la connexion et la génération de tokens
 *
 * @author Votre Nom
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage/storage.js';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
} from '../utils/errors.js';
import { isValidEmail, validatePassword } from '../utils/validators.js';

class AuthService {
  // Inscrit un nouvel utilisateur (validation + création + génération token)
  async register(email, password, role = 'client') {
    // Validation de l'email
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.error);
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = storage.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    // Créer l'utilisateur
    const user = await storage.createUser({ email, password, role });

    // Générer le token
    const token = this.generateToken(user);

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    return { user, token };
  }

  // Connecte un utilisateur (vérification email + mot de passe)
  async login(email, password) {
    // Validation basique
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Trouver l'utilisateur
    const user = storage.findUserByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn('Failed login attempt', { email });
      throw new AuthenticationError('Invalid credentials');
    }

    // Générer le token
    const token = this.generateToken(user);

    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    return { user: userWithoutPassword, token };
  }

  // Génère un token JWT signé avec expiration
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  // Vérifie un token JWT et retourne le payload
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();

