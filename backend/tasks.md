# Fleetly Backend — Tâches détaillées

> **Stack** : Express 4 + Mongoose (MongoDB) + JWT  
> **Principe** : chaque chantier est livrable indépendamment et ne casse rien d'existant.  
> **Total estimé** : 9–10 jours

---

## Chantier 1 — Pagination (0,5 j)

> **Pourquoi en premier** : utilitaire transversal réutilisé par tous les autres chantiers.

### 1.1 Créer le helper de pagination

- [x] Créer `utils/pagination.js`
- [x] Exporter `parsePagination(query)` → retourne `{ page, limit, skip }`
  - `page` : défaut 1, minimum 1
  - `limit` : défaut 20, borné entre 1 et 100
  - `skip` : calculé `(page - 1) * limit`
- [x] Exporter `getPaginationMeta(page, limit, total)` → retourne `{ page, limit, total, pages }`
  - `pages` : `Math.ceil(total / limit) || 0`

### 1.2 Appliquer sur les listes existantes

- [x] Modifier `controllers/vehicleController.js` → `getVehicles` utilise `parsePagination` + `paginatedResponse`
- [x] Modifier `controllers/bookingController.js` → `getMyBookings` utilise `parsePagination` + `paginatedResponse`
- [x] Modifier `controllers/analyticsController.js` → `getOverview` et `getProfitability` si listes

### 1.3 Vérifications

- [x] `GET /api/vehicles?page=2&limit=10` retourne `{ success, data, pagination: { page: 2, limit: 10, total, pages } }`
- [x] `page=0` ou `page=-1` → ramené à 1
- [x] `limit=999` → ramené à 100
- [x] `limit=abc` → retombe sur 20

---

## Chantier 2 — Agences / Branch (1 j)

> **Pourquoi en deuxième** : socle référencé par `users`, `vehicles` et `bookings`.

### 2.1 Modèle Branch

- [x] Créer `models/branch.js`
- [x] Champs :
  - `name` (String, required, trim, maxlength 100)
  - `code` (String, required, unique, uppercase, trim)
  - `address` : `{ street, city (required), postalCode, country (default 'FR') }`
  - `phone` (String)
  - `email` (String)
  - `isActive` (Boolean, default true)
- [x] Activer `timestamps: true`

### 2.2 Contrôleur Branch

- [x] Créer `controllers/branchController.js`
- [x] `createBranch` — validation → création → 201
- [x] `getBranches` — liste paginée (réutiliser chantier 1) + filtre `isActive`
- [x] `getBranchById` — détail par ID
- [x] `updateBranch` — PATCH partiel
- [x] `deleteBranch` — soft delete (`isActive: false`)

### 2.3 Routes Branch

- [x] Créer `routes/branchRoute.js`
- [x] Monter dans `app.js` sur `/api/branches`
- [x] Protéger avec `auth.check` + `authorize(...)` :
  - `POST` → `admin`, `fleet_manager`
  - `GET` → tout authentifié
  - `GET /:id` → tout authentifié
  - `PATCH /:id` → `admin`, `fleet_manager`
  - `DELETE /:id` → `admin`

### 2.4 Validateur Branch

- [x] Créer `validators/branchValidator.js`
- [x] Règles : `name` (notEmpty, trim), `code` (notEmpty, isLength 2-10), `address.city` (notEmpty)

### 2.5 Vérifications

- [x] CRUD complet fonctionnel via Postman/curl
- [x] `code` stocké en majuscules
- [x] `code` dupliqué → 409
- [x] Soft delete : `isActive: false`, document conservé
- [x] Liste paginée fonctionnelle

---

## Chantier 3 — Gestion utilisateurs (1,5 j)

> **Pourquoi en troisième** : dépend des branches (`branchIds`).

### 3.1 Contrôleur User Admin

- [x] Créer `controllers/userAdminController.js`
- [x] `listUsers` — pagination + filtres :
  - `role` (enum)
  - `branchId` (ObjectId)
  - `isActive` (Boolean)
  - `search` (regex sur name/email)
- [x] `getUserById` — détail avec `branchIds` peuplés (`.populate('branchIds')`)
- [x] `updateUser` — modification `role`, `branchIds`, `isActive`
- [x] `deleteUser` — soft delete
- [x] `inviteUser` — création compte + token d'invitation (email ou lien)

### 3.2 Routes User Admin

- [x] Créer `routes/userAdminRoute.js`
- [x] Monter dans `app.js` sur `/api/admin/users`
- [x] Protéger :
  - `GET /` → `admin`, `fleet_manager`
  - `GET /:id` → `admin`, `fleet_manager`
  - `PATCH /:id` → `admin`
  - `DELETE /:id` → `admin`
  - `POST /invite` → `admin`, `fleet_manager`

### 3.3 Validateur User Admin

- [x] Créer `validators/userAdminValidator.js`
- [x] Règles pour `updateUser` : `role` (enum valide), `branchIds` (array d'ObjectId)
- [x] Règles pour `inviteUser` : `name`, `email`, `role`, `branchIds`

### 3.4 Logique d'assignation de branches

- [x] Vérifier que les `branchIds` existent et sont actifs avant assignation
- [x] Si un ID invalide → 400 avec message clair

### 3.5 Vérifications

- [x] Liste paginée avec filtres combinables
- [x] Assignation branches validée (ID inexistant → 400)
- [x] Invitation fonctionnelle (email ou token)
- [x] Soft delete utilisateur

---

## Chantier 4 — Vue réservations agents (1 j)

> **Pourquoi en quatrième** : dépend branches + pagination.

### 4.1 Contrôleur Booking Agent

- [x] Créer `controllers/bookingAgentController.js`
- [x] `getAgentBookings` — réservations filtrées par agence :
  - Agent → ne voit que ses agences (`pickupBranch` ou `returnBranch` dans `branchIds`)
  - Admin / fleet_manager → voient tout
- [x] Filtres supportés :
  - `status` (enum booking)
  - `branchId` (ObjectId)
  - `dateFrom` / `dateTo` (sur `startAt`)
  - `search` (regex sur nom client ou véhicule)
- [x] Pagination (réutiliser chantier 1)
- [x] Populations : `customer` (name, email), `vehicle` (make, model, registrationNumber), `pickupBranch`, `returnBranch` (name, code)

### 4.2 Routes Booking Agent

- [x] Créer `routes/bookingAgentRoute.js`
- [x] Monter dans `app.js` sur `/api/agent/bookings`
- [x] Protéger : `agent`, `admin`, `fleet_manager`

### 4.3 Vérifications

- [x] Un agent ne voit que les réservations de ses agences
- [x] Admin/fleet_manager voient tout
- [x] Pagination + filtres combinables
- [x] Données peuplées correctement

---

## Chantier 5 — Véhicules édit/suppr. (1 j)

> **Pourquoi en cinquième** : dépend branches (scope).

### 5.1 Contrôleur Vehicle Admin

- [x] Créer `controllers/vehicleAdminController.js`
- [x] `updateVehicle` — PATCH partiel :
  - Champs modifiables : `make`, `model`, `category`, `registrationNumber`, `vin`, `branch`, `location`, `dailyRateCents`, `currency`, `seats`, `transmission`, `fuelType`, `mileage`, `images`, `status`
  - Vérifier unicité `registrationNumber` (hors véhicule courant)
  - Vérifier `branch` existe si fourni
- [x] `deleteVehicle` — soft delete :
  - Vérifier pas de réservation active (`Booking.activeStatuses`)
  - Si réservation active → 409
  - Sinon `isDeleted: true`

### 5.2 Routes Vehicle Admin

- [x] Créer `routes/vehicleAdminRoute.js`
- [x] Monter dans `app.js` sur `/api/admin/vehicles`
- [x] Protéger :
  - `PATCH /:id` → `admin`, `fleet_manager`
  - `DELETE /:id` → `admin`, `fleet_manager`

### 5.3 Validateur Vehicle

- [x] Créer `validators/vehicleValidator.js`
- [x] Règles pour champs modifiables (mêmes contraintes que modèle Mongoose)

### 5.4 Vérifications

- [x] Édition complète fonctionnelle
- [x] `registrationNumber` dupliqué → 409
- [x] Suppression logique (soft delete)
- [x] Blocage suppression si réservation active → 409

---

## Chantier 6 — Auth sociale Google/Facebook (2-3 j)

> **Pourquoi en sixième** : indépendant, mais le plus gros chantier.

### 6.1 Configuration

- [x] Ajouter dans `.env.example` :
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL`
  - `FACEBOOK_APP_ID`
  - `FACEBOOK_APP_SECRET`
  - `FACEBOOK_CALLBACK_URL`
- [x] Ajouter validation dans `config/validateEnv.js` (si présents, doivent être non vides)

### 6.2 Service Google

- [x] Créer `services/googleAuth.js`
- [x] Installer `google-auth-library`
- [x] `getGoogleAuthUrl()` → URL de consentement (scope: `profile`, `email`)
- [x] `getGoogleProfile(code)` → échange code → vérifie token → retourne `{ sub, email, name, picture }`

### 6.3 Service Facebook

- [x] Créer `services/facebookAuth.js`
- [x] Installer `axios`
- [x] `getFacebookAuthUrl()` → URL de consentement (scope: `email,public_profile`)
- [x] `getFacebookProfile(code)` → échange code → récupère profil → retourne `{ id, name, email, picture }`

### 6.4 Contrôleur Auth Social

- [x] Créer `controllers/authSocialController.js`
- [x] `handleSocialCallback(provider)` → factory retournant un handler :
  1. Récupérer `code` de `req.query`
  2. Appeler le service correspondant pour obtenir le profil
  3. Chercher user par `email`
  4. Si inexistant → créer (mot de passe aléatoire, `role: 'customer'`, stocker `googleId` ou `facebookId`)
  5. Générer JWT
  6. Retourner `{ token, user }`

### 6.5 Routes Auth Social

- [x] Créer `routes/authSocialRoute.js`
- [x] Monter dans `app.js` :
  - `GET /api/auth/google` → redirige vers Google
  - `GET /api/auth/google/callback` → échange code → JWT
  - `GET /api/auth/facebook` → redirige vers Facebook
  - `GET /api/auth/facebook/callback` → échange code → JWT

### 6.6 Modèle User — champs sociaux

- [x] Modifier `models/user.js` :
  - Ajouter `googleId` (String, sparse, unique)
  - Ajouter `facebookId` (String, sparse, unique)

### 6.7 Vérifications

- [x] Connexion Google fonctionnelle (redirige → callback → JWT)
- [x] Connexion Facebook fonctionnelle
- [x] Création automatique de compte si nouvel email
- [x] JWT retourné identique à l'auth classique
- [x] Gestion d'erreurs : code invalide, email manquant, provider erreur

---

## Chantier 7 — Tests métier (2 j)

> **Pourquoi en dernier** : finalisation + rattrapage des parcours existants.

### 7.1 Setup de test

- [x] Installer `supertest` (devDeps) — `mongodb-memory-server` remplacé par approche mocking
- [x] Créer `test/helpers.js` :
  - `makeUser(overrides)` → fixture user
  - `makeBranch(overrides)` → fixture branch
  - `makeVehicle(overrides)` → fixture vehicle
  - `makeBooking(overrides)` → fixture booking
  - `makeToken(user)` → génère un JWT valide
  - `createMockResponse()` → mock de réponse Express
  - `createMockRequest(options)` → mock de requête Express
- [x] Modifier `package.json` :
  - `"test": "node --test"`
  - `"test:watch": "node --test --watch"`

### 7.2 Tests Pagination

- [x] Créer `test/pagination.test.js`
- [x] Tester `parsePagination` : valeurs par défaut, bornes, limites
- [x] Tester `getPaginationMeta` : calcul `pages`

### 7.3 Tests Branch

- [x] Créer `test/branch.test.js`
- [x] Fixtures et validation des données
- [x] Soft delete vérifié
- [x] Code en majuscules vérifié

### 7.4 Tests User Admin

- [x] Créer `test/userAdmin.test.js`
- [x] Fixtures avec rôles et branches
- [x] Validation des IDs sociaux
- [x] Soft delete vérifié

### 7.5 Tests Booking Agent

- [x] Créer `test/bookingAgent.test.js`
- [x] Fixtures avec statuts et pricing
- [x] Relations entre modèles vérifiées
- [x] Statuts actifs vérifiés

### 7.6 Tests Vehicle Admin

- [x] Créer `test/vehicleAdmin.test.js`
- [x] Fixtures avec statuts et catégories
- [x] Soft delete vérifié
- [x] Validation des champs (transmission, fuelType, etc.)

### 7.7 Tests Auth Social

- [x] Créer `test/authSocial.test.js`
- [x] Fixtures avec googleId et facebookId
- [x] Providers vérifiés
- [x] Unicité des IDs sociaux vérifiée

### 7.8 Vérifications finales

- [x] `npm test` → 76 tests passent, 0 échec
- [x] Tests lisibles (noms descriptifs, structure claire)
- [x] Pas de dépendance MongoDB local (approche mocking)

---

## Récapitulatif

| Chantier | Durée | Dépendances | Livrable |
|----------|-------|-------------|----------|
| 1. Pagination | 0,5 j | — | Helper + appliqué sur listes |
| 2. Branch | 1 j | — | Modèle + CRUD |
| 3. User Admin | 1,5 j | Branch | Gestion utilisateurs |
| 4. Booking Agent | 1 j | Branch, Pagination | Vue agent |
| 5. Vehicle Admin | 1 j | Branch | Édit/suppr véhicules |
| 6. Auth Social | 2-3 j | — | Google + Facebook |
| 7. Tests | 2 j | Tous | Couverture métier |

**Total estimé : 9–10 jours**

---

## Conventions de code

- **Langue** : commentaires et messages en français
- **Structure** : Routes → Controllers → Models (pas de service layer sauf auth social)
- **Réponses** : toujours via `successResponse` / `paginatedResponse` / erreur helpers
- **Validation** : express-validator dans `validators/`, centralisée dans `middlewares/validate.js`
- **Tests** : `node:test` + `assert/strict`, structure arrange/act/assert
- **Noms** : camelCase pour variables, PascalCase pour modèles, kebab-case pour fichiers
