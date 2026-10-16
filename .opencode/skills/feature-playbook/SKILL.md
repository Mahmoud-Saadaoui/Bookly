---
name: feature-playbook
description: À charger AVANT de commencer toute nouvelle fonctionnalité dans Fleetly. Donne la baseline exacte (tests backend/frontend, lint, build) à mesurer avant et après le développement, la liste des invariants à ne jamais casser (calendrier de disponibilité, brouillon de réservation, messages d'erreur backend, endpoints publics, i18n fr/en/ar) et les zones de code sensibles. Sert à éviter de casser une fonctionnalité déjà en service.
---

# Feature playbook — Fleetly

## 0. Pourquoi ce fichier existe

Une régression a déjà été constatée : une fonctionnalité « qui marchait » a cessé
de fonctionner après l'ajout d'une autre, sans que rien ne compile mal ni ne
plante. Le problème a été détecté à la main, tardivement.

**La règle absolue** : on mesure la baseline *avant* de toucher à quoi que ce
soit, on développe, puis on re-mesure *après*. Toute valeur qui a dérivé de la
baseline est une régression — même si le build passe et même si l'écran semble
correct.

Ne jamais « régler au passage » une dette existante pendant qu'on implémente une
feature : un tel changement devient indistinguable de l'erreur dans le diff.

## 1. Baseline (à mesurer avant, à re-mesurer après)

| Commande | Attendu aujourd'hui |
|---|---|
| `cd backend && npm test` | **98 tests, 0 fail** |
| `cd backend && npm run check` | OK (syntaxe `server.js` + `app.js`) |
| `cd frontend && npm test` | **52 tests, 4 fichiers, 0 fail** |
| `cd frontend && npx eslint .` | **0 erreur**, 12 warnings |
| `cd frontend && npm run build` | OK |

- Les 98 tests backend tournent sans `.env` **et sans MongoDB** (Mongoose est
  stubbé dans les tests) — un échec n'est donc jamais dû à l'environnement.
- Les tests frontend sont en Node, **indépendants du fuseau horaire** : la
  machine de développement est `Africa/Tunis`, la CI est `UTC`, et les
  helpers de `availability.js` raisonnent en jours locaux. Tout nouveau test
  de date doit construire ses dates avec le constructeur local
  (`new Date(2026, 9, 19, 12)`), jamais avec un instant absolu en `Z`.
- Seul `npm run lint` compte pour bloquer la CI : les **warnings ne font pas
  échouer un build**, mais une **erreur** oui.

## 2. Checklist de non-régression (avant de rendre une feature)

- [ ] `npm test` backend : toujours 98 (ou plus, si on en a ajouté — jamais moins).
- [ ] `npm test` frontend : toujours 52 (ou plus — jamais moins).
- [ ] `npx eslint .` : **0 erreur**. Ne pas ajouter de warning.
- [ ] `npm run build` : OK.
- [ ] Si j'ai ajouté une clé de traduction : elle existe dans **les 3 fichiers**
      `frontend/src/locales/fr.json`, `en.json` **et** `ar.json` (même nom de clé,
      même interpolation du type `{{status}}`).
- [ ] Vérification visuelle faite **par l'humain** : l'agent ne peut pas atteindre
      `localhost:5173` (espace réseau Chrome) — tout rendu d'écran doit être
      confirmé par l'utilisateur, pas déduit.

## 3. Invariants (contrats à ne pas casser)

### Réservation & calendrier
- Les dates viennent **uniquement** du calendrier
  (`components/booking/AvailabilityCalendar.jsx`), jamais d'un champ texte libre.
  Le devis (`pricing`) se calcule automatiquement à partir de ces dates.
- Brouillon de réservation : clé unique `fleetly_booking_draft`
  (`utils/bookingDraft.js`), dates en ISO, **expiration après 24 h**, effacé
  **après une réservation réussie**. Il fait survivre la sélection au aller-retour
  vers `/login` : c'est le comportement « mes dates ne sont pas perdues au moment
  de me connecter ».
- `utils/availability.js` (`toBookedDayRanges`, `isDayBooked`,
  `rangeTouchesBooking`) compare en **jours locaux** (`startOfDay`/`endOfDay`).
  Ne pas remplacer ça par une comparaison d'instants absolu.
- Si `vehicle.status !== 'available'`, la page détail remplace calendrier +
  formulaire par un **avis ambre** (garde `isBookable`), avec le badge de statut.

### Messages d'erreur backend
- Les messages backend remontent **mot pour mot** à l'utilisateur
  (`utils/apiError.js` → `getApiErrorMessage`), priorité donnée aux messages
  par champ (`errors[]`) sur `message` général.
- Deux situations **distinctes**, deux phrases distinctes dans
  `backend/controllers/bookingController.js` (`STATUS_TEXT`) :
  - `Vehicle is <statut> and cannot be booked` → le véhicule est en location,
    réservé, en maintenance ;
  - `Vehicle is already booked for these dates` → le véhicule est libre mais les
    dates sont prises.
  **12 des 28 véhicules du seed ne sont pas bookables** : ces deux causes ne
  doivent jamais être re-fusionnées, sinon le diagnostic redevient impossible.

### Endpoints publics
- `GET /api/vehicles/:id` et `GET /api/vehicles/:id/availability`
  (`backend/routes/vehicleRoute.js`) : **conserver l'ordre de déclaration**
  (`/:id/availability` avant `/:id`).
- `getVehicleAvailability` ne retourne **que des plages de dates**
  (`startAt`/`endAt`) — **jamais de données client** (nom, email, id client).

### Catalogue
- La recherche porte sur **make + model uniquement**, pas sur les autres champs.
- Debounce **500 ms** : `SEARCH_DEBOUNCE_MS` dans `pages/public/VehiclesPage.jsx`,
  qui appelle `useDebouncedValue` (défaut également 500 dans
  `hooks/useDebouncedValue.js`). Toute nouvelle requête de saisie doit passer par
  cette constante.
- Une réservation non disponible affiche un **badge de statut** en lieu et place
  du bouton « Book now ».

### Design & i18n
- Tokens de design à conserver : `dark`, `dark-light`, `accent`, `accent-light`,
  `font-cairo` (thème sombre).
- Langues par défaut `fr`, `en`, `ar`.

## 4. Zones sensibles

| Fichier | Ce qui y est couplé |
|---|---|
| `backend/controllers/bookingController.js` | `parseDates`, conflit de dates, `STATUS_TEXT`, les deux messages d'erreur, le devis |
| `backend/routes/vehicleRoute.js` | ordre des routes publiques |
| `frontend/src/utils/availability.js` | logique de chevauchement partagée par le calendrier ET la page détail |
| `frontend/src/utils/bookingDraft.js` | persistance liée au aller-retour login |
| `frontend/src/utils/apiError.js` | affichage de toutes les erreurs backend de l'app |
| `frontend/src/pages/public/VehicleDetailPage.jsx` | garde `isBookable`, calendrier, brouillon, devis automatique, 2 effets `useEffect` |
| `frontend/src/main.jsx` + `context/auth.js` + `context/AuthContext.jsx` | le contexte d'auth est scindé en deux fichiers pour que Fast Refresh fonctionne — **ne pas re-fusionner** |

## 5. Dette connue — à ne pas traiter « en passant »

12 warnings `react-hooks/exhaustive-deps`, tous du même motif (un `fetch*`
défini après le `useEffect` qui l'appelle) :

`admin/AnalyticsPage.jsx:14`, `admin/BookingsList.jsx:18`,
`admin/BranchesForm.jsx:21`, `admin/BranchesList.jsx:17`,
`admin/CalendarPage.jsx:25`, `admin/UsersList.jsx:14`,
`admin/VehiclesForm.jsx:43`, `admin/VehiclesList.jsx:18`,
`public/VehicleDetailPage.jsx:61` et `:177`, `public/VehiclesPage.jsx:57`,
`user/BookingsPage.jsx:24`.

- **Ne pas en ajouter** un de plus.
- **Ne pas les corriger au passage** : ajouter la fonction aux dépendances sans
  la passer par `useCallback` déclenche une boucle de re-fetch infinie. C'est un
  changement de comportement, ça se fait dans un commit dédié.

## 6. Validation continue (CI)

`.github/workflows/ci.yml` tourne sur **chaque push et chaque pull request** :

- **backend** : `npm ci` → `npm run check` → `npm test`
- **frontend** : `npm ci` → `npm run lint` → `npm test` → `npm run build`

Si cette CI échoue, la branche ne doit **pas** être poussée/merge avant d'être
verte. Node 24 est exigé (Vitest 5 accepte `^22.12 || ^24 || >=26`).

## 7. Conventions

- Commits en anglais, **Conventional Commits avec scope explicite** :
  `feat(vehicles): …`, `fix(bookings): …`, `chore(ci): …`.
- **Ne jamais pousser sur `main` sans accord explicite de l'utilisateur.**
- Avant toute commande invasive (`push`, `reset`, `stash`), re-vérifier
  `git status -sb` + `git log --oneline -5` : l'historique a connu un état
  incohérent avec une autre session en parallèle.
