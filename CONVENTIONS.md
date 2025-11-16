# Conventions d'équipe

> Document établi en collaboration pour maintenir la cohérence du code.

## 📋 Table des matières

- [Nommage](#nommage)
- [Structure du projet](#structure-du-projet)
- [Formatage & Linting](#formatage--linting)
- [Git Workflow](#git-workflow)
- [Logs](#logs)
- [Tests](#tests)
- [Sécurité](#sécurité)

---

## Nommage

### Variables et fonctions
- **camelCase** pour les variables et fonctions
- Noms explicites et descriptifs
- Fonctions commencent par un **verbe** : `getUserById()`, `createTicket()`, `validateEmail()`

```javascript
// ✅ BON
const userEmail = 'user@example.com';
function calculateTotalPrice() { }

// ❌ MAUVAIS
const e = 'user@example.com';
function calc() { }
```

### Booléens
- Préfixe : `is`, `has`, `can`, `should`

```javascript
const isAuthenticated = true;
const hasPermission = false;
const canEditTicket = true;
```

### Constantes
- **UPPER_SNAKE_CASE** pour les constantes globales

```javascript
const MAX_TICKET_TITLE_LENGTH = 100;
const API_BASE_URL = '/api/v1';
const DEFAULT_TIMEOUT_MS = 5000;
```

### Classes et types
- **PascalCase** pour les classes

```javascript
class TicketManager { }
class AuthService { }
```

### Fichiers et dossiers
- **kebab-case** pour les fichiers : `ticket-service.js`, `auth-middleware.js`
- Dossiers en minuscules : `controllers/`, `services/`, `utils/`

### Unités dans les noms
- Toujours indiquer l'unité pour les valeurs temporelles ou monétaires

```javascript
const timeoutMs = 3000;
const delaySeconds = 5;
const priceEUR = 29.99;
```

---

## Structure du projet

```
ticket-management-system/
├── server/
│   ├── index.js              # Point d'entrée
│   ├── config/               # Configuration
│   ├── controllers/          # Logique des routes
│   ├── services/             # Logique métier
│   ├── middleware/           # Middlewares Express
│   ├── utils/                # Utilitaires
│   └── storage/              # Persistance des données
├── public/
│   ├── index.html            # Page de connexion
│   ├── client.html           # Interface client
│   ├── admin.html            # Interface admin
│   ├── css/                  # Styles
│   └── js/                   # JavaScript frontend
├── docs/                     # Documentation
├── tests/                    # Tests
└── [fichiers config]         # .eslintrc, .prettierrc, etc.
```

---

## Formatage & Linting

### Prettier
- **Obligatoire** avant chaque commit
- Configuration dans `.prettierrc.json`
- Commande : `npm run format`

### ESLint
- **Obligatoire** - aucune erreur tolérée
- Configuration dans `.eslintrc.json`
- Commande : `npm run lint`

### Pre-commit
- Exécuter : `npm run precommit` avant chaque commit
- Le CI bloquera si non conforme

---

## Git Workflow

### Branches
- **Nommage** : `type/description-courte`
  - `feat/add-ticket-creation`
  - `fix/auth-token-expiration`
  - `refactor/improve-logger`
  - `chore/update-dependencies`

### Commits
- Messages clairs et descriptifs
- Format : `type: description`
  - `feat: add ticket filtering by category`
  - `fix: resolve authentication bug on refresh`
  - `docs: update README with setup instructions`

### Pull Requests
- **< 300-400 lignes** de code modifié
- Description claire avec :
  - Objectif
  - Changements effectués
  - Tests réalisés
  - Screenshots si UI
- Lier les issues concernées
- Review obligatoire avant merge

---

## Logs

### Niveaux de logs
- **DEBUG** : informations de développement
- **INFO** : événements normaux importants
- **WARN** : situations anormales mais gérables
- **ERROR** : erreurs nécessitant attention
- **CRITICAL** : erreurs bloquantes

### Format des logs
Chaque log doit contenir :
```javascript
{
  timestamp: '2025-01-15T10:30:00.000Z',
  level: 'INFO',
  component: 'TicketService',
  message: 'Ticket created successfully',
  context: { ticketId: 'abc-123', userId: 'user-456' }
}
```

### Règles
- ✅ Messages clairs et actionnables
- ✅ Contexte utile pour le débogage
- ❌ **JAMAIS** de données sensibles (mots de passe, tokens, emails complets)
- ❌ Pas de logs excessifs en production

```javascript
// ✅ BON
logger.info('User authenticated', { userId: user.id, role: user.role });

// ❌ MAUVAIS
logger.info('User logged in', { password: user.password, token: jwt });
```

---

## Tests

### Stratégie
- **Tests unitaires** : logique métier critique
- **Tests d'intégration** : flux importants (création ticket, auth)
- **Test de non-régression** : après chaque bug corrigé

### Nommage des tests
```javascript
// Format: should_ExpectedBehavior_When_StateUnderTest
test('should_ReturnError_When_EmailIsInvalid', () => { });
test('should_CreateTicket_When_DataIsValid', () => { });
```

### Couverture
- Minimum **70%** pour les services critiques
- 100% pour les utilitaires de validation

---

## Sécurité

### Validation des entrées
- **Toujours** valider côté serveur
- Sanitiser les données utilisateur
- Limites de taille strictes

### Secrets
- **Jamais** de secrets dans le code
- Utiliser `.env` (exclu du Git)
- Variables d'environnement en production

### Authentification
- Tokens JWT avec expiration
- Mots de passe hashés (bcrypt)
- Rate limiting sur les endpoints sensibles

### Principe du moindre privilège
- Permissions strictes par rôle
- Validation des autorisations à chaque requête

### Logs sécurisés
- ❌ Pas de mots de passe
- ❌ Pas de tokens complets
- ❌ Pas d'emails complets (masquer : `u***@example.com`)

---

## Révision du code

### Checklist du reviewer
- [ ] Code respecte les conventions de nommage
- [ ] Pas de duplication (DRY)
- [ ] Fonctions simples et focalisées (KISS)
- [ ] Gestion d'erreurs appropriée
- [ ] Logs utiles et sécurisés
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation à jour
- [ ] Pas de secrets exposés

---

**Note** : Ces conventions sont vivantes et peuvent évoluer. Toute modification doit être discutée et approuvée par l'équipe.

*Dernière mise à jour : Janvier 2025*
*Contributeurs : Dimitri & ChatGPT (Documentation)*

