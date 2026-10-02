# Bookly Backend

API REST Express/Mongoose de Bookly.

## Stack actuelle

- Node.js
- Express 4
- Mongoose 8
- MongoDB
- JWT
- Cloudinary
- express-validator
- express-rate-limit
- Helmet
- Winston et Morgan

Les versions sont conservées dans `package.json` et `package-lock.json`.

## Installation

Prérequis : Node.js `20.19+`, npm, MongoDB et Cloudinary.

```bash
npm install
cp .env.example .env
npm run dev
```

Le port recommandé en développement est `5000`.

## Configuration `.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bookly
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=30d
BCRYPT_ROUNDS=12
MAX_LOAN_DURATION_DAYS=30
MAX_REVIEWS_PER_BOOK=500
MAX_FAVORITES_PER_USER=500
CLIENT_DEVELOPMENT_DOMAIN=http://localhost:5173
CLIENT_PRODUCTION_DOMAIN=https://mbookly.netlify.app
CLIENT_ALLOWED_ORIGINS=
TRUST_PROXY_HOPS=0
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

`CLIENT_ALLOWED_ORIGINS` est optionnel et accepte des origines séparées par des virgules. Ne commitez jamais `.env`.

## Scripts

```bash
npm run dev       # développement avec nodemon
npm run backend   # alias du développement
npm start         # production
npm run check     # vérification syntaxique
npm test          # tests Node.js
```

## API

Toutes les routes applicatives utilisent le préfixe `/api`.

### Authentification

| Méthode | Route | Auth |
|---|---|---|
| POST | `/api/users/register` | Non |
| POST | `/api/users/login` | Non |
| GET | `/api/users/me` | Bearer JWT |

### Livres

| Méthode | Route | Auth |
|---|---|---|
| GET | `/api/books` | Non |
| GET | `/api/books/categories` | Non |
| GET | `/api/books/:id` | Utilisateur |
| POST | `/api/books` | Administrateur |
| PUT | `/api/books/:id` | Administrateur |
| PUT | `/api/books/update-image/:id` | Administrateur |
| DELETE | `/api/books/:id` | Administrateur |

La liste accepte notamment `page`, `limit`, `q` et `category`. La limite serveur est de 50 livres par page.

### Avis et favoris

| Méthode | Route | Auth |
|---|---|---|
| GET | `/api/books/:id/reviews` | Non |
| POST | `/api/books/:id/reviews` | Utilisateur ayant emprunté |
| GET | `/api/favoriteList` | Utilisateur |
| POST | `/api/favoriteList` | Utilisateur |
| DELETE | `/api/favoriteList/:id` | Utilisateur |

### Emprunts

| Méthode | Route | Auth |
|---|---|---|
| POST | `/api/loans` | Utilisateur |
| GET | `/api/loans/book/:bookId` | Non |
| GET | `/api/loans/availability/:bookId` | Non |
| GET | `/api/loans/user/all` | Utilisateur |
| GET | `/api/loans/:loanId` | Propriétaire |
| PUT | `/api/loans/return/:loanId` | Propriétaire |

`POST /api/loans` accepte l’en-tête `Idempotency-Key` pour éviter les doublons lors d’une nouvelle tentative réseau.

### Configuration et santé

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/config` | Configuration publique du frontend |
| GET | `/health` | Santé API et MongoDB |
| GET | `/health/ready` | Readiness probe |
| GET | `/health/live` | Liveness probe |

## Format des réponses

Réponse réussie :

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Réponse paginée :

```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 }
}
```

Réponse d’erreur :

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

## Sécurité et limites

- JWT avec `Authorization: Bearer <token>`.
- Validation avec `express-validator`.
- Rate limiting, Helmet et logs structurés.
- CORS limité aux origines configurées.
- Images limitées à 5 MB et aux formats JPEG, PNG, GIF et WebP.
- Suppression logique des livres.
- Un utilisateur ne peut gérer que ses propres emprunts.

## Structure

```text
backend/
├── config/          # Connexion et environnement
├── controllers/     # Logique HTTP
├── middlewares/     # Auth, admin, validation, logs, erreurs
├── models/          # Schémas Mongoose
├── routes/          # Routes Express
├── services/        # Transactions métier
├── validators/      # Validations
├── utils/           # JWT, Cloudinary, réponses, logs
├── server.js
└── package.json
```

## Déploiement

Pour Render ou une plateforme Node équivalente :

- répertoire : `backend`
- installation : `npm install`
- démarrage : `npm start`
- configurer MongoDB, JWT, Cloudinary et CORS dans l’environnement
- laisser la plateforme fournir `PORT` si nécessaire

## Vérification

```bash
npm run check
npm test
```
