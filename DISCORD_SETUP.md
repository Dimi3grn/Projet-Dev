# 🎮 Configuration Discord Webhook

Ce guide explique comment configurer les notifications Discord pour votre système de tickets.

## 📋 Prérequis

- Un serveur Discord
- Les permissions d'administrateur sur le serveur
- Un salon dédié aux notifications (recommandé)

## 🔧 Étapes de configuration

### 1. Créer un Webhook Discord

1. **Ouvrez Discord** et allez sur votre serveur
2. **Clic droit** sur le salon où vous voulez recevoir les notifications
3. Sélectionnez **"Modifier le salon"**
4. Allez dans l'onglet **"Intégrations"**
5. Cliquez sur **"Webhooks"**
6. Cliquez sur **"Nouveau Webhook"**
7. **Personnalisez** le webhook :
   - Nom : `Système de Tickets` (ou autre)
   - Avatar : Ajoutez une icône si vous voulez
   - Salon : Vérifiez que c'est le bon salon
8. **Copiez l'URL du webhook** (bouton "Copier l'URL du Webhook")

### 2. Configurer l'application

#### Option A : Fichier `.env` (recommandé)

1. Créez un fichier `.env` à la racine du projet (s'il n'existe pas déjà)
2. Ajoutez la ligne suivante avec votre URL de webhook :

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/VOTRE_WEBHOOK_ID/VOTRE_TOKEN
```

3. Sauvegardez le fichier

#### Option B : Variable d'environnement système

Sur Windows PowerShell :
```powershell
$env:DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/VOTRE_WEBHOOK_ID/VOTRE_TOKEN"
```

Sur Linux/Mac :
```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/VOTRE_WEBHOOK_ID/VOTRE_TOKEN"
```

### 3. Redémarrer le serveur

```bash
npm start
```

Vous devriez voir dans les logs :
```
[INFO] Discord notifications enabled
```

## 📬 Types de notifications

Le système envoie automatiquement des notifications pour :

### 🎫 Nouveau Ticket
- Titre du ticket
- Catégorie et priorité
- Email du client
- Description (extrait)

### 🔄 Changement de Statut
- Ancien et nouveau statut
- Titre du ticket
- Qui a fait la modification

### 💬 Nouveau Message
- Contenu du message
- Qui a écrit (client ou admin)
- Statut du ticket

### 👤 Nouvel Utilisateur
- Email de l'utilisateur
- Rôle (client/admin)

## 🎨 Personnalisation

Les notifications utilisent des **embeds Discord** avec :
- 🎨 **Couleurs** selon le type/priorité
- 📊 **Champs structurés** pour une lecture facile
- ⏰ **Timestamps** automatiques
- 🏷️ **Footer** avec l'ID du ticket/utilisateur

## ⚠️ Sécurité

### ⚡ Important
- **NE JAMAIS** commiter le fichier `.env` dans Git
- **NE JAMAIS** partager l'URL du webhook publiquement
- Le webhook permet de poster dans votre serveur Discord !

### 🔒 Protection
- Le fichier `.env` est déjà dans `.gitignore`
- Utilisez `.env.example` comme modèle (sans l'URL réelle)
- Si le webhook est compromis, supprimez-le et créez-en un nouveau

## 🧪 Test

Pour tester les notifications :

1. **Créez un nouveau compte** → Notification "Nouvel utilisateur"
2. **Créez un ticket** → Notification "Nouveau ticket"
3. **Ajoutez un message** → Notification "Nouveau message"
4. **Changez le statut** (admin) → Notification "Changement de statut"

## ❌ Désactiver les notifications

Pour désactiver temporairement les notifications :

1. Commentez ou supprimez la ligne `DISCORD_WEBHOOK_URL` dans `.env`
2. Redémarrez le serveur

Vous verrez dans les logs :
```
[WARN] Discord webhook not configured, notifications disabled
```

## 🐛 Dépannage

### Les notifications ne s'envoient pas

1. **Vérifiez l'URL du webhook** dans `.env`
2. **Vérifiez les logs** pour voir les erreurs
3. **Testez l'URL** manuellement avec curl :

```bash
curl -X POST "VOTRE_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test de webhook"}'
```

### Erreur "Discord API returned 404"

- L'URL du webhook est invalide ou le webhook a été supprimé
- Créez un nouveau webhook et mettez à jour `.env`

### Erreur "Discord API returned 429"

- Vous avez dépassé la limite de rate (30 messages/minute)
- Les notifications sont automatiquement désactivées en cas d'erreur
- Attendez quelques minutes

## 📚 Ressources

- [Documentation Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Guide des Embeds Discord](https://discord.com/developers/docs/resources/channel#embed-object)

## 🤝 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs du serveur (`npm start`)
2. Les permissions du webhook dans Discord
3. Que le salon existe toujours

---

**Fait avec ❤️ pour le projet de bonnes pratiques DEV**

