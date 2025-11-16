# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer au projet ! Ce document explique comment participer au développement.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Workflow Git](#workflow-git)
- [Standards de code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)

---

## 🌟 Code de conduite

- Soyez respectueux et professionnel
- Acceptez les critiques constructives
- Focalisez sur ce qui est meilleur pour le projet
- Montrez de l'empathie envers les autres contributeurs

---

## 💡 Comment contribuer

### Signaler un bug

1. Vérifier qu'il n'existe pas déjà dans les issues
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure :
   - Description claire du problème
   - Étapes de reproduction
   - Comportement attendu vs observé
   - Environnement (OS, Node version, navigateur)
   - Logs pertinents

### Proposer une fonctionnalité

1. Créer une issue avec le template "Feature Request"
2. Expliquer :
   - Le problème que ça résout
   - La solution proposée
   - Les alternatives considérées
3. Attendre la discussion et l'approbation

### Contribuer du code

1. Fork le repository
2. Créer une branche depuis `main`
3. Faire vos modifications
4. Tester localement
5. Soumettre une Pull Request

---

## 🔄 Workflow Git

### 1. Fork et Clone

```bash
# Fork sur GitHub, puis :
git clone https://github.com/VOTRE-USERNAME/bonne-pratiques-dev.git
cd bonne-pratiques-dev
git remote add upstream https://github.com/Dimi3grn/Projet-Dev.git
```

### 2. Créer une branche

**Convention de nommage** :

```bash
# Nouvelle fonctionnalité
git checkout -b feat/description-courte

# Correction de bug
git checkout -b fix/description-bug

# Refactoring
git checkout -b refactor/description

# Documentation
git checkout -b docs/description

# Maintenance
git checkout -b chore/description
```

**Exemples** :
- `feat/add-ticket-priority`
- `fix/chat-message-order`
- `refactor/improve-error-handling`
- `docs/update-readme`

### 3. Développer

```bash
# Faire vos modifications
# ...

# Vérifier la qualité du code
npm run lint
npm run format:check

# Lancer les tests
npm test
```

### 4. Commit

**Format des messages** :

```
type: description courte (max 50 caractères)

Description détaillée si nécessaire (max 72 caractères par ligne)

- Point 1
- Point 2

Fixes #123
```

**Types de commit** :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactoring (pas de changement fonctionnel)
- `docs`: Documentation uniquement
- `style`: Formatage, point-virgules, etc.
- `test`: Ajout ou modification de tests
- `chore`: Maintenance (dépendances, config, etc.)
- `perf`: Amélioration de performance

**Exemples** :

```bash
git commit -m "feat: add ticket priority field

- Add priority enum (low, medium, high)
- Update ticket creation form
- Add priority badge in ticket list
- Update database schema

Closes #45"
```

```bash
git commit -m "fix: sort chat messages chronologically

Messages were displayed in random order.
Now sorted by createdAt timestamp.

Fixes #67"
```

### 5. Push et Pull Request

```bash
# Push vers votre fork
git push origin feat/ma-fonctionnalite

# Créer une PR sur GitHub
```

**Checklist PR** :
- [ ] Description claire des changements
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Lint et format passent
- [ ] Pas de régression
- [ ] < 400 lignes de code modifié

---

## 📏 Standards de code

### Conventions de nommage

```javascript
// Variables et fonctions : camelCase
const userName = 'John';
function getUserById(id) { }

// Booléens : is, has, can
const isAuthenticated = true;
const hasPermission = false;

// Constantes : UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = '/api';

// Classes : PascalCase
class UserService { }
class TicketManager { }

// Fichiers : kebab-case
// auth-service.js
// ticket-controller.js
```

### Structure du code

**Principe KISS** : Gardez les fonctions simples

```javascript
// ✅ BON : Une fonction, une responsabilité
function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

function sendWelcomeEmail(email) {
  // ...
}

// ❌ MAUVAIS : Trop de responsabilités
function validateAndSendEmail(email) {
  if (EMAIL_REGEX.test(email)) {
    // send email...
  }
}
```

**Principe DRY** : Pas de duplication

```javascript
// ✅ BON : Fonction réutilisable
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR');
}

const date1 = formatDate(ticket.createdAt);
const date2 = formatDate(message.createdAt);

// ❌ MAUVAIS : Code dupliqué
const date1 = new Date(ticket.createdAt).toLocaleDateString('fr-FR');
const date2 = new Date(message.createdAt).toLocaleDateString('fr-FR');
```

### Documentation

**JSDoc obligatoire** pour les fonctions publiques :

```javascript
/**
 * Crée un nouveau ticket
 * @param {Object} ticketData - Données du ticket
 * @param {string} ticketData.title - Titre du ticket
 * @param {string} ticketData.description - Description
 * @param {string} userId - ID de l'utilisateur créateur
 * @returns {Object} Ticket créé
 * @throws {ValidationError} Si les données sont invalides
 */
function createTicket(ticketData, userId) {
  // ...
}
```

### Gestion d'erreurs

```javascript
// ✅ BON : Erreurs typées et explicites
if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email format');
}

// ❌ MAUVAIS : Erreur générique
if (!isValidEmail(email)) {
  throw new Error('Error');
}
```

---

## 🧪 Tests

### Écrire des tests

**Nommage** :

```javascript
test('should_ExpectedBehavior_When_StateUnderTest', () => {
  // Arrange
  const input = { ... };
  
  // Act
  const result = functionToTest(input);
  
  // Assert
  assert.strictEqual(result, expected);
});
```

**Exemples** :

```javascript
test('should_ReturnError_When_EmailIsInvalid', () => {
  const result = validateEmail('invalid-email');
  assert.strictEqual(result, false);
});

test('should_CreateTicket_When_DataIsValid', () => {
  const ticket = createTicket(validData, userId);
  assert.ok(ticket.id);
  assert.strictEqual(ticket.status, 'open');
});
```

### Lancer les tests

```bash
# Tous les tests
npm test

# Avec coverage
npm run test:coverage

# Mode watch
npm run test:watch
```

### Couverture

- **Minimum 70%** pour les services critiques
- **100%** pour les utilitaires (validators, formatters)
- Ajouter un test de non-régression après chaque bug

---

## 📚 Documentation

### Quand documenter

- ✅ Nouvelle fonctionnalité → Mettre à jour README
- ✅ Changement d'architecture → Mettre à jour ARCHITECTURE.md
- ✅ Nouvelle convention → Mettre à jour CONVENTIONS.md
- ✅ API publique → Documenter avec JSDoc
- ✅ Bug complexe → Créer un bug report

### Format

**README.md** : Vue d'ensemble, installation, usage  
**ARCHITECTURE.md** : Design, patterns, décisions  
**CONVENTIONS.md** : Standards de code, workflow  
**JSDoc** : Documentation inline du code

---

## 🔍 Review de code

### Pour les contributeurs

- Demander une review explicitement
- Répondre aux commentaires rapidement
- Être ouvert aux suggestions
- Ne pas prendre les critiques personnellement

### Pour les reviewers

- Être constructif et respectueux
- Expliquer le "pourquoi" des suggestions
- Approuver rapidement si tout est OK
- Bloquer si problème critique

**Checklist review** :
- [ ] Code respecte les conventions
- [ ] Pas de duplication (DRY)
- [ ] Fonctions simples (KISS)
- [ ] Gestion d'erreurs appropriée
- [ ] Tests ajoutés
- [ ] Documentation à jour
- [ ] Pas de secrets exposés
- [ ] Performance acceptable

---

## 🎯 Priorités

### High Priority
- 🔴 Bugs critiques (sécurité, perte de données)
- 🔴 Régression de fonctionnalités existantes

### Medium Priority
- 🟡 Bugs non critiques
- 🟡 Améliorations de performance
- 🟡 Nouvelles fonctionnalités approuvées

### Low Priority
- 🟢 Refactoring
- 🟢 Documentation
- 🟢 Optimisations mineures

---

## 📞 Contact

- **Issues** : Pour bugs et features
- **Discussions** : Pour questions générales
- **Email** : Pour sujets sensibles

---

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet meilleur ! 🎉

Chaque contribution, petite ou grande, est précieuse.

---

**Happy coding! 🚀**

