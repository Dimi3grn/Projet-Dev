/**
 * Module de persistance des données dans des fichiers JSON
 * Permet de sauvegarder et charger les données entre les redémarrages
 *
 * @author Votre Nom & Collaborateur
 * @note Utilise fs/promises pour des opérations asynchrones non-bloquantes
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier où seront stockés les fichiers de données
const DATA_DIR = path.join(__dirname, '../../data');

// Chemins des fichiers de données
const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  tickets: path.join(DATA_DIR, 'tickets.json'),
  messages: path.join(DATA_DIR, 'messages.json'),
};

class Persistence {
  constructor() {
    this.ensureDataDirectory();
  }

  // Crée le dossier data s'il n'existe pas
  async ensureDataDirectory() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      logger.debug('Data directory ensured', { path: DATA_DIR });
    } catch (error) {
      logger.error('Failed to create data directory', { error: error.message });
      throw error;
    }
  }

  // Convertit une Map en objet pour la sérialisation JSON
  mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // Convertit un objet en Map après désérialisation JSON
  objectToMap(obj) {
    const map = new Map();
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, value);
    }
    return map;
  }

  // Sauvegarde les données dans un fichier JSON
  async save(type, data) {
    try {
      const filePath = FILES[type];
      if (!filePath) {
        throw new Error(`Unknown data type: ${type}`);
      }

      // Convertit Map en objet si nécessaire
      let dataToSave = data;
      if (data instanceof Map) {
        dataToSave = this.mapToObject(data);
      }

      // Écrit dans le fichier avec indentation pour lisibilité
      await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf8');
      logger.debug(`Data saved to ${type}.json`, { recordCount: Object.keys(dataToSave).length });
    } catch (error) {
      logger.error(`Failed to save ${type} data`, { error: error.message });
      throw error;
    }
  }

  // Charge les données depuis un fichier JSON
  async load(type) {
    try {
      const filePath = FILES[type];
      if (!filePath) {
        throw new Error(`Unknown data type: ${type}`);
      }

      // Vérifie si le fichier existe
      try {
        await fs.access(filePath);
      } catch {
        // Fichier n'existe pas, retourne une Map vide
        logger.debug(`No existing ${type}.json file, starting fresh`);
        return new Map();
      }

      // Lit et parse le fichier
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Convertit l'objet en Map
      const map = this.objectToMap(data);
      logger.info(`Data loaded from ${type}.json`, { recordCount: map.size });

      return map;
    } catch (error) {
      logger.error(`Failed to load ${type} data`, { error: error.message });
      // En cas d'erreur, retourne une Map vide plutôt que de crasher
      return new Map();
    }
  }

  // Sauvegarde toutes les données (users, tickets, messages)
  async saveAll(users, tickets, messages) {
    try {
      await Promise.all([
        this.save('users', users),
        this.save('tickets', tickets),
        this.save('messages', messages),
      ]);
      logger.info('All data saved successfully');
    } catch (error) {
      logger.error('Failed to save all data', { error: error.message });
      throw error;
    }
  }

  // Charge toutes les données
  async loadAll() {
    try {
      const [users, tickets, messages] = await Promise.all([
        this.load('users'),
        this.load('tickets'),
        this.load('messages'),
      ]);

      logger.info('All data loaded successfully', {
        users: users.size,
        tickets: tickets.size,
        messageGroups: messages.size,
      });

      return { users, tickets, messages };
    } catch (error) {
      logger.error('Failed to load all data', { error: error.message });
      throw error;
    }
  }
}

// Export du singleton
export const persistence = new Persistence();

