# 🚀 Guide de Configuration et Démarrage

Ce guide vous accompagne pas à pas pour installer et lancer le projet.

## 📋 Prérequis

### Logiciels requis

- **Node.js** v18.0.0 ou supérieur
- **npm** v9.0.0 ou supérieur (inclus avec Node.js)
- **Git** pour cloner le repository

### Vérifier les versions

```bash
node --version   # Doit afficher v18.x.x ou supérieur
npm --version    # Doit afficher v9.x.x ou supérieur
git --version    # Doit afficher v2.x.x ou supérieur
```

### Installer Node.js

Si Node.js n'est pas installé :

**Windows** : Télécharger depuis [nodejs.org](https://nodejs.org/)  
**macOS** : `brew install node`  
**Linux** : `sudo apt install nodejs npm`

---

## 📦 Installation

### 1. Cloner le repository

```bash
git clone <url-du-repository>
cd ticket-management-system
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande va installer :
- Express et ses middlewares
- Bibliothèques de sécurité (bcrypt, JWT, helmet)
- Outils de développement (ESLint, Prettier)

**Durée estimée** : 1-2 minutes

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Éditer le fichier `.env` :

```env
# Port du serveur
PORT=3000

# Environnement (development | production)
NODE_ENV=development

# Secret JWT (IMPORTANT: Changer en production !)
JWT_SECRET=votre-secret-super-securise-changez-moi

# Durée de validité du token
JWT_EXPIRES_IN=24h

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Compte admin par défaut
ADMIN_EMAIL=admin@support.com
ADMIN_PASSWORD=Admin123!

# Niveau de logs (debug | info | warn | error | critical)
LOG_LEVEL=info
```

⚠️ **Important** : En production, utilisez un `JWT_SECRET` fort et unique !

---

## 🚀 Démarrage

### Mode développement (recommandé)

Avec auto-reload lors des modifications :

```bash
npm run dev
```

### Mode production

```bash
npm start
```

### Vérifier que le serveur fonctionne

Vous devriez voir :

```
[2025-01-15T10:00:00.000Z] INFO: Server started successfully
{ port: 3000, environment: 'development', nodeVersion: 'v18.x.x' }
```

---

## 🌐 Accéder à l'application

Ouvrir votre navigateur à : **http://localhost:3000**

### Comptes de test

#### Compte Admin
- **Email** : `admin@support.com`
- **Mot de passe** : `Admin123!`
- **Accès** : Dashboard admin, tous les tickets

#### Créer un compte Client
1. Cliquer sur "S'inscrire"
2. Entrer email et mot de passe
3. Vous serez redirigé vers le dashboard client

---

## ✅ Vérification de l'installation

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "uptime": 123.45
}
```

### 2. Test de connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@support.com","password":"Admin123!"}'
```

Réponse attendue :
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "admin@support.com", "role": "admin" },
    "token": "eyJhbGc..."
  }
}
```

### 3. Lancer les tests

```bash
npm test
```

Tous les tests doivent passer ✅

---

## 🛠 Outils de développement

### Linter (ESLint)

Vérifier le code :
```bash
npm run lint
```

Corriger automatiquement :
```bash
npm run lint:fix
```

### Formatter (Prettier)

Vérifier le formatage :
```bash
npm run format:check
```

Formater automatiquement :
```bash
npm run format
```

### Pre-commit check

Avant chaque commit, lancer :
```bash
npm run precommit
```

Cela vérifie le linting ET le formatage.

---

## 🐛 Résolution de problèmes

### Le serveur ne démarre pas

**Erreur : Port 3000 déjà utilisé**

Solution 1 : Changer le port dans `.env`
```env
PORT=3001
```

Solution 2 : Tuer le processus sur le port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Erreur : Module not found**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur d'authentification

**Token expiré**

Solution : Se reconnecter pour obtenir un nouveau token

**JWT_SECRET manquant**

Vérifier que `.env` existe et contient `JWT_SECRET`

### Erreur CORS

Si vous accédez depuis un domaine différent, vérifier la configuration CORS dans `server/index.js`

### Base de données vide après redémarrage

C'est normal ! Le stockage est en mémoire. Les données sont perdues au redémarrage.

Pour une persistance réelle, voir [ARCHITECTURE.md](../ARCHITECTURE.md#évolutions-futures)

---

## 📚 Prochaines étapes

1. ✅ Lire le [README.md](../README.md) pour comprendre le projet
2. ✅ Consulter [ARCHITECTURE.md](../ARCHITECTURE.md) pour l'architecture
3. ✅ Voir [CONVENTIONS.md](../CONVENTIONS.md) pour les conventions de code
4. ✅ Tester l'application en créant des tickets
5. ✅ Explorer le code source

---

## 🆘 Besoin d'aide ?

- 📖 Documentation : Voir les fichiers `.md` à la racine
- 🐛 Bug trouvé : Créer une issue sur GitHub
- 💬 Questions : Contacter l'équipe

---

**Bon développement ! 🚀**

