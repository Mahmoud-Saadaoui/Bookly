# Fleetly API

API REST Express/Mongoose de la plateforme de location automobile Fleetly.

## Démarrer

Prérequis : Node.js 20+, npm et MongoDB.

```bash
npm install
cp .env.example .env
npm run dev
```

Le serveur écoute par défaut sur le port `5000`.

## Routes principales

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/users/register` | Public |
| POST | `/api/users/login` | Public |
| GET | `/api/users/me` | Authentifié |
| GET | `/api/vehicles` | Public |
| POST | `/api/vehicles` | Admin / responsable de flotte |
| PATCH | `/api/vehicles/:id/status` | Admin / flotte / agent |
| POST | `/api/bookings/quote` | Public |
| POST | `/api/bookings` | Client authentifié |
| GET | `/api/bookings/mine` | Client authentifié |
| PATCH | `/api/bookings/:id/status` | Admin / flotte / agent |
| GET | `/api/analytics/overview` | Admin / flotte / finance |
| GET | `/api/analytics/profitability` | Admin / flotte / finance |
| GET | `/health` | Public |

Toutes les routes protégées utilisent `Authorization: Bearer <JWT>`.

## Rôles

`customer`, `agent`, `fleet_manager`, `finance_manager`, `support` et `admin`.

Les rôles sont vérifiés côté serveur. Les responsables et agents sont limités aux agences présentes dans `branchIds`.

## Variables d’environnement

Voir `.env.example`. Les montants métier sont stockés en centimes et les réservations utilisent une clé d’idempotence pour éviter les doublons.

## Vérifier le projet

```bash
npm run check
npm test
```
