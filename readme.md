# Bookly

Application de gestion de bibliothèque basée sur la stack MERN : React/Vite, Node.js/Express, MongoDB/Mongoose et Cloudinary.

## Fonctionnalités

- Inscription et connexion JWT.
- Recherche, pagination et filtrage des livres.
- Avis, favoris et emprunts avec contrôle de disponibilité.
- Retour et historique des emprunts.
- Administration : création, modification, upload d’image et suppression logique des livres.
- Health checks et configuration CORS.

## Prérequis

- Node.js `20.19+` ; Node.js 24 est compatible avec la configuration actuelle.
- npm, MongoDB et un compte Cloudinary.

Les versions des dépendances sont conservées dans `frontend/package.json` et `backend/package.json`.

## Installation

```bash
git clone <url-du-depot>
cd Bookly
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API locale : `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run frontend
```

Application locale : `http://localhost:5173`.

## Configuration

### Backend `.env`

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

`CLIENT_ALLOWED_ORIGINS` est optionnel et accepte une liste d’origines séparées par des virgules.

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

En production, cette variable doit pointer vers l’API publique et se terminer par `/api`.

## Scripts

### Frontend

```bash
npm run frontend
npm run build
npm run preview
npm test
```

### Backend

```bash
npm run dev
npm start
npm run check
npm test
```

## API principale

Toutes les routes applicatives utilisent le préfixe `/api`.

| Domaine | Routes |
|---|---|
| Authentification | `POST /users/register`, `POST /users/login`, `GET /users/me` |
| Livres | `GET /books`, `GET /books/categories`, `GET /books/:id` |
| Administration | `POST /books`, `PUT /books/:id`, `PUT /books/update-image/:id`, `DELETE /books/:id` |
| Avis | `GET /books/:id/reviews`, `POST /books/:id/reviews` |
| Favoris | `GET /favoriteList`, `POST /favoriteList`, `DELETE /favoriteList/:id` |
| Emprunts | `POST /loans`, `GET /loans/book/:bookId`, `GET /loans/availability/:bookId` |
| Historique | `GET /loans/user/all`, `GET /loans/:loanId`, `PUT /loans/return/:loanId` |
| Configuration | `GET /config` |
| Santé | `GET /health`, `GET /health/ready`, `GET /health/live` |

Les routes protégées utilisent :

```http
Authorization: Bearer <accessToken>
```

## Structure

```text
Bookly/
├── frontend/       # Application React/Vite
├── backend/        # API Express/Mongoose
├── _docs/          # Documentation complémentaire
└── README.md
```

Consultez `frontend/README.md` et `backend/README.md` pour les détails spécifiques.

## Déploiement

### Frontend

- Répertoire : `frontend`
- Build : `npm run build`
- Sortie : `dist`
- Variable : `VITE_API_URL`
- Netlify utilise `frontend/public/_redirects` pour les routes SPA.

### Backend

- Répertoire : `backend`
- Installation : `npm install`
- Démarrage : `npm start`
- Configurer MongoDB, JWT, Cloudinary et les origines CORS dans l’environnement de déploiement.

## Sécurité

- Ne jamais committer `.env`.
- Utiliser un secret JWT long et aléatoire en production.
- Restreindre CORS aux domaines nécessaires.
- Les images sont limitées à 5 MB et aux formats JPEG, PNG, GIF et WebP.
- Les validations frontend ne remplacent jamais celles du backend.

## Vérification

```bash
cd frontend && npm run build && npm test
cd ../backend && npm run check && npm test
```
