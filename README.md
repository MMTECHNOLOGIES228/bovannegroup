# Bovanne Group - InfluenceHub Platform


## Présentation du Projet

Bovanne Group est une plateforme complète de gestion d'influenceurs comprenant un backend Node.js/Express avec TypeScript et un frontend Vue.js. Le système permet la gestion des utilisateurs, des rôles, des permissions, et des comptes de médias sociaux avec une interface d'administration complète.

### Architecture

- **Backend**: API RESTful avec Node.js, Express et TypeScript
- **Frontend**: Application Vue.js avec Vite et Tailwind CSS
- **Base de données**: PostgreSQL avec Sequelize ORM
- **Authentification**: JWT (JSON Web Tokens) avec refresh tokens
- **Documentation**: Swagger/OpenAPI intégrée

## Installation et Démarrage

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- PostgreSQL
- Docker et Docker Compose (optionnel)

### Méthode 1: Installation avec Docker (Recommandée)

1. Clonez le dépôt :
```bash
git clone <repository-url>
cd bovannegroup
```

2. Configurez les variables d'environnement :
```bash
# Copiez et modifiez le fichier d'environnement
cp backends/user_service/.env.example backends/user_service/.env
cp frontends/influenceHub/.env.example frontends/influenceHub/.env
```

3. Modifiez les fichiers `.env` avec vos configurations de base de données et autres paramètres.

4. Lancez les services avec Docker Compose :
```bash
docker-compose up -d
```

5. Accédez aux applications :
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9000
   - Documentation API: http://localhost:9000/api-docs

### Méthode 2: Installation Manuelle

#### Backend

1. Naviguez vers le dossier du service utilisateur :
```bash
cd backends/user_service
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez la base de données PostgreSQL et mettez à jour le fichier `.env` :
```env
DB_NAME=bovanne_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

4. Exécutez les migrations de base de données :
```bash
npx sequelize-cli db:migrate
```

5. Démarrez le serveur de développement :
```bash
npm run dev
```

#### Frontend

1. Naviguez vers le dossier frontend :
```bash
cd frontends/influenceHub
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement dans `.env` :
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Démarrez l'application :
```bash
npm run dev
```

## 📖 Utilisation

### Comptes par Défaut

Après l'installation, les comptes suivants sont disponibles :

- **Administrateur**: admin@bovanne.com / password
- **Utilisateur standard**: user@bovanne.com / password

### Fonctionnalités

- Gestion des utilisateurs et profils
- Système de rôles et permissions
- Gestion des comptes de médias sociaux
- Authentification JWT sécurisée
- Interface d'administration
- Documentation API interactive

## Développement

### Structure des dossiers

```
bovannegroup/
├── backends/
│   └── user_service/          # Service utilisateur principal
│       ├── src/
│       │   ├── config/        # Configuration de l'application
│       │   ├── interfaces/    # Interfaces TypeScript
│       │   ├── models/        # Modèles de base de données
│       │   ├── routes/        # Routes API
│       │   └── middlewares/   # Middlewares personnalisés
│       └── migrations/        # Migrations de base de données
└── frontends/
    └── influenceHub/          # Application Vue.js
        ├── src/
        │   ├── components/    # Composants Vue
        │   ├── pages/         # Pages de l'application
        │   ├── stores/        # Stores Pinia
        │   └── router/        # Configuration du routeur
```

### Commandes Utiles

**Backend:**
```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Compile TypeScript en JavaScript
npm run start        # Démarre le serveur de production
npm run db:migrate   # Exécute les migrations de base de données
```

**Frontend:**
```bash
npm run dev          # Démarre le serveur de développement Vite
npm run build        # Compile pour la production
npm run preview      # Prévisualise la build de production
```

## API Documentation

Une documentation interactive de l'API est disponible à l'adresse `/api-docs` une fois le serveur backend démarré. Cette documentation est générée avec Swagger et permet de tester directement les endpoints.

## Dépannage

### Problèmes Courants

1. **Erreurs de connexion à la base de données**
   - Vérifiez que PostgreSQL est en cours d'exécution
   - Confirmez les identifiants dans le fichier `.env`

2. **Erreurs de migration**
   - Exécutez `npx sequelize-cli db:migrate:undo:all` pour annuler toutes les migrations
   - Puis réexécutez `npx sequelize-cli db:migrate`

3. **Problèmes de CORS**
   - Vérifiez la configuration dans `backends/user_service/src/config/corsOptions.ts`

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés.

##  Support

Pour toute question ou problème, veuillez contacter l'équipe de développement à +22891514288.
<img width="2560" height="1440" alt="Screenshot 2025-09-20 at 10 26 39" src="https://github.com/user-attachments/assets/0ff294c4-29bc-4af8-80e5-f1cad9e44245" />






<img width="2560" height="1440" alt="Screenshot 2025-09-20 at 10 27 35" src="https://github.com/user-attachments/assets/3416427e-5101-4377-bfe1-222d1a834f0e" />


*Dernière mise à jour: 20 Septembre 2025*
