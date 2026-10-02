# Bookly Frontend

Frontend React/Vite de Bookly.

## Stack actuelle

- React 18
- Vite 7
- Redux Toolkit et React Redux
- React Router DOM 6
- Axios
- Vitest
- CSS natif

Les versions déclarées sont conservées dans `package.json`.

## Installation

Prérequis : Node.js `20.19+` et un backend disponible sur `http://localhost:5000`.

```bash
npm install
cp .env.example .env
npm run frontend
```

Vite utilise le port `5173`.

## Configuration

```env
VITE_API_URL=http://localhost:5000/api
```

Sans cette variable, l’application utilise `http://localhost:5000/api` en développement et `https://bookly-1rvp.onrender.com/api` en production.

## Scripts

```bash
npm run frontend   # serveur de développement
npm run build      # build dans dist/
npm run preview    # prévisualisation du build
npm test           # tests Vitest
```

## Routes

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Accueil |
| `/books` | Public | Recherche, catégories et pagination |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/books/:bookId` | Authentifié | Détails, avis et emprunt |
| `/favorites` | Authentifié | Favoris |
| `/loans` | Authentifié | Historique et retour des emprunts |
| `/admin` | Administrateur | Gestion des livres |

Les routes `/profile` et `/forgot-password` ne sont pas proposées car aucun endpoint backend correspondant n’existe.

## Organisation

```text
src/
├── components/       # Composants réutilisables
├── pages/            # Pages liées aux routes
├── redux/apiCalls/   # Appels API et thunks
├── redux/slices/     # État Redux
├── services/         # Instance Axios et intercepteurs
├── hooks/            # Hooks réutilisables
├── lib/              # Normalisation des réponses API
└── styles/           # Styles
```

## API

`src/services/axiosInstance.js` :

- utilise `VITE_API_URL` ;
- ajoute automatiquement le token Bearer ;
- gère les réponses `401` ;
- exploite les réponses `{ success, message, data }` ;
- gère les métadonnées de pagination.

Les appels sont regroupés dans :

- `redux/apiCalls/authApiCalls.js`
- `redux/apiCalls/bookApiCall.js`
- `redux/apiCalls/favoritesApiCall.js`
- `redux/apiCalls/loanApiCall.js`

## Fonctionnalités connectées

- Authentification JWT.
- Livres, recherche, catégories et pagination.
- Favoris et avis.
- Disponibilité, création et retour des emprunts.
- Administration des livres et des couvertures.

## Déploiement

```bash
npm run build
```

Le build est généré dans `dist/`.

Pour Netlify :

- répertoire de publication : `dist`
- commande : `npm run build`
- variable : `VITE_API_URL`

Le fichier `public/_redirects` configure le fallback SPA.

## Règles de contribution

- Utiliser l’instance `api` plutôt qu’un appel Axios direct dans un composant.
- Gérer les états loading, empty et error.
- Ne pas ajouter de fonctionnalité frontend sans contrat backend correspondant.
- Ne jamais stocker de secret dans une variable `VITE_*`.
