# Architecture du Système de Gestion de Tickets

> Document d'architecture technique - Version 1.0  
> Auteurs : Votre Nom & Collaborateur

## 📐 Vue d'ensemble

Ce document décrit l'architecture du système de gestion de tickets, ses composants, leurs interactions et les décisions de conception.

## 🎯 Objectifs architecturaux

1. **Simplicité** : Architecture claire et facile à comprendre
2. **Maintenabilité** : Code organisé en couches bien définies
3. **Scalabilité** : Structure permettant l'évolution future
4. **Sécurité** : Protection des données et des accès
5. **Performance** : Réponses rapides et efficaces

## 🏛 Architecture globale

### Pattern : Architecture en couches (Layered Architecture)

```
┌─────────────────────────────────────────┐
│          Frontend (Vanilla JS)          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Auth   │  │ Client  │  │  Admin  │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────┬───────────────────────┘
                  │ HTTP/JSON
                  │ REST API
┌─────────────────▼───────────────────────┐
│         Backend (Node.js/Express)       │
│  ┌──────────────────────────────────┐   │
│  │     Controllers (Routes)         │   │
│  │  ┌────────┐ ┌────────┐ ┌──────┐ │   │
│  │  │  Auth  │ │ Ticket │ │ Chat │ │   │
│  │  └────────┘ └────────┘ └──────┘ │   │
│  └──────────────┬───────────────────┘   │
│  ┌──────────────▼───────────────────┐   │
│  │        Middleware Layer          │   │
│  │  • Authentication                │   │
│  │  • Error Handling                │   │
│  │  • Rate Limiting                 │   │
│  └──────────────┬───────────────────┘   │
│  ┌──────────────▼───────────────────┐   │
│  │       Services (Business)        │   │
│  │  ┌────────┐ ┌────────┐ ┌──────┐ │   │
│  │  │  Auth  │ │ Ticket │ │ Chat │ │   │
│  │  └────────┘ └────────┘ └──────┘ │   │
│  └──────────────┬───────────────────┘   │
│  ┌──────────────▼───────────────────┐   │
│  │       Storage (Data Layer)       │   │
│  │  • Users                         │   │
│  │  • Tickets                       │   │
│  │  • Messages                      │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 🔧 Composants Backend

### 1. Point d'entrée (`server/index.js`)

**Responsabilité** : Initialisation et configuration du serveur

- Configuration d'Express
- Enregistrement des middlewares globaux
- Montage des routes
- Gestion des erreurs non capturées
- Démarrage du serveur

**Décisions de conception** :
- Séparation de la configuration et de la logique métier
- Gestion centralisée des erreurs fatales
- Logs structurés dès le démarrage

### 2. Configuration (`server/config/`)

**Responsabilité** : Centralisation de toute la configuration

```javascript
// config.js
export const config = {
  port: 3000,
  jwtSecret: '...',
  // ...
}
```

**Avantages** :
- ✅ Une seule source de vérité
- ✅ Validation au démarrage
- ✅ Facile à tester
- ✅ Pas de valeurs en dur dans le code

### 3. Controllers (`server/controllers/`)

**Responsabilité** : Gestion des routes HTTP et validation des requêtes

**Principe** : Thin controllers
- Validation minimale des entrées
- Appel des services appropriés
- Formatage des réponses
- Pas de logique métier

**Exemple** :
```javascript
router.post('/tickets', authenticate, async (req, res, next) => {
  try {
    const ticket = ticketService.createTicket(req.body, req.user.id);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});
```

### 4. Services (`server/services/`)

**Responsabilité** : Logique métier et règles de gestion

**Principe** : Fat services
- Toute la logique métier
- Validation approfondie
- Orchestration des opérations
- Indépendants du transport (HTTP, CLI, etc.)

**Services disponibles** :
- `AuthService` : Authentification et autorisation
- `TicketService` : Gestion des tickets
- `ChatService` : Gestion des messages

**Avantages** :
- ✅ Réutilisabilité
- ✅ Testabilité
- ✅ Séparation des préoccupations

### 5. Middleware (`server/middleware/`)

**Responsabilité** : Logique transversale

**Middlewares implémentés** :

#### `auth-middleware.js`
- Vérification des tokens JWT
- Extraction des informations utilisateur
- Contrôle des rôles (admin/client)

#### `error-handler.js`
- Capture toutes les erreurs
- Formatage uniforme des réponses d'erreur
- Logs appropriés selon la gravité
- Masquage des détails en production

#### `rate-limiter.js`
- Protection contre les abus
- Limite de requêtes par IP
- Fenêtre glissante

### 6. Storage (`server/storage/`)

**Responsabilité** : Persistance des données

**Implémentation actuelle** : In-memory (Map)

```javascript
class Storage {
  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.messages = new Map();
  }
}
```

**Pattern** : Singleton
- Une seule instance partagée
- État cohérent dans toute l'application

**Migration future** : 
- Interface stable permettant de passer à une vraie DB
- Remplacer `Map` par MongoDB, PostgreSQL, etc.
- Aucun changement dans les services

### 7. Utilitaires (`server/utils/`)

**Responsabilité** : Fonctions réutilisables

#### `logger.js`
- Logs structurés avec niveaux
- Sanitization automatique des données sensibles
- Colorisation pour le développement

#### `validators.js`
- Validation des emails
- Validation des mots de passe
- Validation des tickets et messages
- Sanitization des entrées

#### `errors.js`
- Classes d'erreurs personnalisées
- Hiérarchie d'erreurs typées
- Codes HTTP appropriés

## 🎨 Composants Frontend

### Architecture modulaire

```
public/
├── index.html          # Page de connexion
├── client.html         # Interface client
├── admin.html          # Interface admin
├── css/
│   └── styles.css      # Styles globaux
└── js/
    ├── api.js          # Communication backend
    ├── utils.js        # Utilitaires frontend
    ├── auth.js         # Logique d'authentification
    ├── client.js       # Logique interface client
    └── admin.js        # Logique interface admin
```

### Principe : Vanilla JS modulaire

**Pourquoi pas de framework ?**
- Démonstration des bases solides
- Compréhension du fonctionnement sous-jacent
- Pas de dépendances lourdes
- Performance optimale

### Module API (`api.js`)

**Responsabilité** : Centralisation des appels backend

**Pattern** : Classe singleton

```javascript
class API {
  async request(endpoint, options) {
    // Gestion centralisée des requêtes
  }
  
  async login(email, password) { }
  async createTicket(data) { }
  // ...
}

const api = new API();
```

**Avantages** :
- ✅ DRY : pas de duplication des appels
- ✅ Gestion centralisée des tokens
- ✅ Gestion uniforme des erreurs
- ✅ Facile à mocker pour les tests

### Module Utils (`utils.js`)

**Responsabilité** : Fonctions utilitaires réutilisables

- Formatage des dates
- Affichage des alertes
- Génération de badges
- Protection XSS (escapeHtml)

## 🔐 Sécurité

### Authentification

**Flow JWT** :

```
1. Client → POST /api/auth/login {email, password}
2. Server → Vérifie credentials
3. Server → Génère JWT signé
4. Server → Retourne {user, token}
5. Client → Stocke token (localStorage)
6. Client → Envoie token dans Authorization header
7. Server → Vérifie signature JWT
8. Server → Extrait userId, role
9. Server → Autorise la requête
```

**Sécurité du token** :
- Signé avec secret fort
- Expiration configurable (24h par défaut)
- Contient uniquement les infos nécessaires
- Vérifié à chaque requête protégée

### Protection des données

**Mots de passe** :
- Hashés avec bcrypt (10 rounds)
- Jamais stockés en clair
- Jamais retournés dans les réponses

**Validation** :
- Côté serveur obligatoire
- Sanitization des entrées utilisateur
- Limites de taille strictes

**Rate Limiting** :
- 100 requêtes / 15 minutes par IP
- Protection contre brute force
- Logs des tentatives excessives

## 📊 Flux de données

### Création d'un ticket

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Backend │
└────┬────┘                                    └────┬────┘
     │                                              │
     │ 1. POST /api/tickets                         │
     │    {title, description, category}            │
     ├─────────────────────────────────────────────>│
     │                                              │
     │                              2. authenticate │
     │                              (verify JWT)    │
     │                                              │
     │                              3. validateData │
     │                              (validators)    │
     │                                              │
     │                              4. createTicket │
     │                              (service)       │
     │                                              │
     │                              5. storage.save │
     │                                              │
     │                              6. log event    │
     │                                              │
     │ 7. 201 Created                               │
     │    {success: true, data: ticket}             │
     │<─────────────────────────────────────────────┤
     │                                              │
     │ 8. Update UI                                 │
     │                                              │
```

### Chat en temps réel (polling)

**Note** : Implémentation actuelle utilise le polling. Pour une vraie application, utiliser WebSockets.

```
Client (polling toutes les 3s)
  ↓
GET /api/chat/:ticketId/messages
  ↓
Récupère nouveaux messages
  ↓
Met à jour l'interface
```

## 🚀 Évolutions futures

### Court terme
- [ ] WebSockets pour le chat temps réel
- [ ] Pagination des tickets
- [ ] Upload de fichiers joints
- [ ] Notifications push

### Moyen terme
- [ ] Base de données réelle (PostgreSQL)
- [ ] Cache Redis
- [ ] Tests automatisés (Jest)
- [ ] CI/CD (GitHub Actions)

### Long terme
- [ ] Microservices
- [ ] Recherche full-text (Elasticsearch)
- [ ] Analytics et reporting
- [ ] API publique avec rate limiting avancé

## 📝 Décisions architecturales

### ADR-001 : In-memory storage

**Contexte** : Besoin de persistance simple pour le MVP

**Décision** : Utiliser des Map JavaScript en mémoire

**Conséquences** :
- ✅ Simple à implémenter
- ✅ Pas de dépendance externe
- ✅ Parfait pour le développement
- ❌ Données perdues au redémarrage
- ❌ Pas scalable en production

**Migration** : Interface stable permet de remplacer facilement

### ADR-002 : JWT pour l'authentification

**Contexte** : Besoin d'authentification stateless

**Décision** : Utiliser JWT avec signature HMAC

**Conséquences** :
- ✅ Stateless (pas de session serveur)
- ✅ Scalable horizontalement
- ✅ Standard industrie
- ❌ Impossible de révoquer avant expiration
- ❌ Taille du token

**Mitigation** : Expiration courte (24h)

### ADR-003 : Vanilla JS pour le frontend

**Contexte** : Projet pédagogique sur les bonnes pratiques

**Décision** : Pas de framework frontend

**Conséquences** :
- ✅ Compréhension des fondamentaux
- ✅ Pas de dépendances lourdes
- ✅ Performance optimale
- ❌ Plus de code à écrire
- ❌ Pas de réactivité automatique

**Justification** : Focus sur les principes, pas les outils

## 🔍 Patterns utilisés

| Pattern | Où | Pourquoi |
|---------|-----|----------|
| **Singleton** | Storage, Logger | Instance unique partagée |
| **Factory** | Error classes | Création d'erreurs typées |
| **Middleware** | Express | Logique transversale |
| **Service Layer** | Services | Séparation logique métier |
| **Repository** | Storage | Abstraction de la persistance |
| **DTO** | API responses | Format uniforme des données |

## 📚 Références

- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

*Document maintenu par l'équipe de développement*  
*Dernière mise à jour : Janvier 2025*

