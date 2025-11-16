# 🎫 Système de Gestion de Tickets

> Projet réalisé dans le cadre du module "Bonnes pratiques DEV - Introduction aux bonnes pratiques & débogage"

Un système complet de gestion de tickets d'aide avec chat en temps réel, développé en JavaScript vanilla (frontend) et Node.js (backend).

## 👥 Équipe

- **Dimitri** - Développement complet (backend, frontend, architecture, sécurité)
- **ChatGPT** - Documentation technique (README, guides, commentaires)

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Discord](#discord)
- [Architecture](#architecture)
- [Bonnes pratiques appliquées](#bonnes-pratiques-appliquées)
- [Documentation](#documentation)
- [Contribution](#contribution)

## ✨ Fonctionnalités

### Pour les clients
- ✅ Création de compte et authentification sécurisée
- ✅ Création de tickets avec catégorisation
- ✅ Suivi de l'état des tickets (ouvert, en cours, fermé)
- ✅ Chat en temps réel avec le support
- ✅ Historique complet des conversations

### Pour les administrateurs
- ✅ Dashboard avec statistiques en temps réel
- ✅ Visualisation de tous les tickets
- ✅ Filtrage par statut et catégorie
- ✅ Réponse aux tickets via chat
- ✅ Mise à jour du statut des tickets

## 🛠 Technologies

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express** - Framework web minimaliste
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage sécurisé des mots de passe
- **Helmet** - Sécurité HTTP
- **express-rate-limit** - Protection contre les abus

### Frontend
- **HTML5/CSS3** - Interface moderne et responsive
- **JavaScript Vanilla** - Pas de framework, code pur
- **Fetch API** - Communication avec le backend

### Outils de qualité
- **ESLint** - Linter JavaScript
- **Prettier** - Formateur de code
- **dotenv** - Gestion des variables d'environnement

## 📦 Installation

### Prérequis
- Node.js v18 ou supérieur
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/Dimi3grn/Projet-Dev
cd ticket-management-system
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifier le fichier `.env` selon vos besoins :
```env
PORT=3000
JWT_SECRET=votre-secret-jwt-super-securise
ADMIN_EMAIL=admin@support.com
ADMIN_PASSWORD=Admin123!
```

4. **Lancer le serveur**
```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

5. **Accéder à l'application**
Ouvrir votre navigateur à : `http://localhost:3000`

## 🚀 Utilisation

### Compte administrateur par défaut
- **Email** : `admin@support.com`
- **Mot de passe** : `Admin123!`

### Créer un compte client
1. Aller sur la page d'accueil
2. Cliquer sur "S'inscrire"
3. Entrer votre email et mot de passe
4. Vous serez redirigé vers votre dashboard

### Créer un ticket (Client)
1. Se connecter avec un compte client
2. Cliquer sur "Créer un nouveau ticket"
3. Remplir le formulaire (titre, catégorie, description)
4. Soumettre le ticket
5. Cliquer sur le ticket pour ouvrir le chat

### Gérer les tickets (Admin)
1. Se connecter avec le compte admin
2. Voir les statistiques dans le dashboard
3. Filtrer les tickets par statut/catégorie
4. Cliquer sur un ticket pour répondre
5. Changer le statut du ticket si nécessaire

## 💬 Discord

Rejoignez notre serveur Discord pour suivre les notifications en temps réel et échanger avec l'équipe !

Rejoindre Discord : (https://discord.gg/fyVDcKmKKR)

### 🔔 Notifications automatiques

Le système envoie des notifications Discord pour :
- 🎫 **Nouveaux tickets** - Alerte instantanée avec détails
- 💬 **Nouveaux messages** - Notification client/admin
- 🔄 **Changements de statut** - Suivi en temps réel
- 👤 **Nouveaux utilisateurs** - Inscription

### ⚙️ Configuration

Pour activer les notifications Discord :

1. **Créer un webhook** dans votre salon Discord (Paramètres → Intégrations → Webhooks)
2. **Copier l'URL** du webhook
3. **Ajouter dans `.env`** :
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/VOTRE_ID/VOTRE_TOKEN
```
4. **Redémarrer** le serveur

📖 Guide complet : [DISCORD_SETUP.md](./DISCORD_SETUP.md)

> **Note** : Pour un salon en lecture seule, configurez les permissions Discord pour que seul le webhook puisse poster.

## 🏗 Architecture

Le projet suit une architecture en couches claire et séparée :

```
ticket-management-system/
├── server/                 # Backend Node.js
│   ├── config/            # Configuration (env, constantes)
│   ├── controllers/       # Routes et handlers HTTP
│   ├── services/          # Logique métier
│   ├── middleware/        # Middlewares Express
│   ├── storage/           # Couche de persistance
│   └── utils/             # Utilitaires (logger, validators, errors)
├── public/                # Frontend
│   ├── css/              # Styles
│   ├── js/               # JavaScript vanilla
│   └── *.html            # Pages HTML
└── docs/                 # Documentation
```

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour plus de détails.

## ✅ Bonnes pratiques appliquées

### Principes SOLID et Clean Code

#### KISS (Keep It Simple, Stupid)
- Fonctions courtes et focalisées
- Pas de sur-ingénierie
- Code lisible et compréhensible

#### DRY (Don't Repeat Yourself)
- Utilitaires réutilisables (`logger.js`, `validators.js`)
- Services centralisés
- Pas de duplication de logique

#### YAGNI (You Aren't Gonna Need It)
- Développement au besoin réel
- Pas de fonctionnalités anticipées
- Code minimal et efficace

#### Séparation des responsabilités
- **Controllers** : Gestion des routes HTTP
- **Services** : Logique métier
- **Storage** : Persistance des données
- **Middleware** : Logique transversale

### Sécurité

✅ **Authentification JWT** avec expiration  
✅ **Mots de passe hashés** avec bcrypt  
✅ **Rate limiting** pour prévenir les abus  
✅ **Validation stricte** des entrées  
✅ **Sanitization** des données utilisateur  
✅ **Headers sécurisés** avec Helmet  
✅ **Pas de secrets** dans le code  
✅ **Logs sécurisés** (pas de données sensibles)

### Gestion d'erreurs

- Classes d'erreurs personnalisées et typées
- Middleware de gestion centralisée
- Messages d'erreur clairs et actionnables
- Logs structurés avec contexte

### Logs

Tous les logs suivent un format structuré :
```javascript
{
  timestamp: '2025-01-15T10:30:00.000Z',
  level: 'INFO',
  message: 'User authenticated',
  context: { userId: 'abc-123', role: 'client' }
}
```

Niveaux : `DEBUG`, `INFO`, `WARN`, `ERROR`, `CRITICAL`

### Conventions de code

- **Nommage** : camelCase pour variables/fonctions, PascalCase pour classes
- **Formatage** : Prettier avec configuration stricte
- **Linting** : ESLint avec règles personnalisées
- **Commentaires** : JSDoc pour toutes les fonctions publiques

Voir [CONVENTIONS.md](./CONVENTIONS.md) pour le guide complet.

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée du système
- [CONVENTIONS.md](./CONVENTIONS.md) - Conventions d'équipe
- [BUG_REPORT.md](./docs/BUG_REPORT.md) - Exemple de bug report avec débogage

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Vérifier le linting
npm run lint

# Vérifier le formatage
npm run format:check

# Corriger automatiquement
npm run lint:fix
npm run format
```

## 📝 Scripts disponibles

```bash
npm start          # Démarre le serveur en mode production
npm run dev        # Démarre en mode développement avec auto-reload
npm run lint       # Vérifie le code avec ESLint
npm run lint:fix   # Corrige automatiquement les erreurs ESLint
npm run format     # Formate le code avec Prettier
npm run format:check # Vérifie le formatage
npm run precommit  # Vérifie lint + format (à lancer avant commit)
```

## 🤝 Contribution

### Workflow Git

1. Créer une branche depuis `main`
```bash
git checkout -b feat/ma-fonctionnalite
```

2. Faire vos modifications

3. Vérifier la qualité du code
```bash
npm run precommit
```

4. Commit avec un message clair
```bash
git commit -m "feat: add ticket filtering by priority"
```

5. Push et créer une Pull Request
```bash
git push origin feat/ma-fonctionnalite
```

### Convention de nommage des branches
- `feat/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `refactor/` - Refactoring
- `chore/` - Tâches de maintenance

### Pull Requests
- Description claire des changements
- < 400 lignes de code modifié
- Tests ajoutés/mis à jour
- Review obligatoire avant merge

## 🐛 Débogage

En cas de problème, consulter [BUG_REPORT.md](./docs/BUG_REPORT.md) pour un exemple de processus de débogage complet.

### Problèmes courants

**Le serveur ne démarre pas**
- Vérifier que le port 3000 est libre
- Vérifier les variables d'environnement dans `.env`

**Erreur d'authentification**
- Vérifier que le JWT_SECRET est défini
- Vérifier que le token n'a pas expiré

**Erreur CORS**
- Vérifier que le frontend et backend sont sur le même domaine
- Vérifier la configuration CORS dans `server/index.js`

## 📄 Licence

MIT

## 🙏 Remerciements

- Module "Bonnes pratiques DEV" par Cyril Rodrigues
- Communauté Node.js et Express
- Tous les contributeurs open-source

---

**Note** : Ce projet est réalisé à des fins pédagogiques dans le cadre d'un module sur les bonnes pratiques de développement. Il démontre l'application concrète des principes KISS, DRY, YAGNI, ainsi que la gestion d'erreurs, les logs, la sécurité et le débogage.

*Dernière mise à jour : Janvier 2025*

