<div align="center">

# React Starter Kit

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![i18next](https://img.shields.io/badge/i18next-25-26A69A?style=for-the-badge&logo=i18next&logoColor=white)](https://www.i18next.com/)

**A reusable, multilingual, RTL-ready React boilerplate for fast project bootstrapping.**

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| **i18n Ready** | English, French, Arabic with RTL auto-switching |
| **Routing** | React Router 7 with lazy-loaded routes |
| **Styling** | Tailwind CSS 4 configured out of the box |
| **Error Handling** | Global error boundary with i18n support |
| **Loading States** | Reusable spinner component |
| **DX** | ESLint + Vite HMR, code-split vendor chunks |

## Tech Stack

- **React 18** + **Vite 7**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **React Router 7** (lazy routes + Suspense)
- **i18next** + **react-i18next** + **browser-language-detector**
- **ESLint 9** (flat config, react-hooks, react-refresh)

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (or yarn / pnpm)

### Installation

```bash
git clone <your-repo-url> my-project
cd my-project
npm install
cp .env.example .env   # optional, configures client vars
npm run dev
```

The app is available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run build:analyze` | Build with bundle analysis mode |

## Project Structure

```
src/
├── assets/            # Images and media
├── components/
│   └── common/        # Reusable UI base (Loading, ErrorBoundary, ...)
├── config/            # i18n configuration
├── hooks/             # Custom hooks (shared, project-agnostic)
├── layouts/           # Page layouts (MainLayout)
├── locales/           # Translation files (en/fr/ar)
├── pages/             # Route page components
├── services/          # External services / API clients
├── styles/            # Global styles, design tokens
├── utils/             # Shared utility functions
├── App.jsx            # Routes (lazy loaded)
├── main.jsx           # Entry point
└── index.css          # Tailwind import + global styles
```

## Add a New Language

1. Create `src/locales/es.json` with the same keys.
2. Register it in `src/config/i18n.js`:

```javascript
import es from "../locales/es.json";

i18n.init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
    es: { translation: es },
  },
});
```

RTL languages (e.g. Arabic) are handled automatically by `MainLayout`.

## Environment Variables

All client-exposed variables must be prefixed with `VITE_`. See `.env.example`.

## Customization

- **Fonts**: edit `src/index.css` (web font import).
- **Theme colors**: add Tailwind theme tokens or CSS variables in `src/index.css`.
- **UI base components**: extend `src/components/common/`.
- **Default language**: change `fallbackLng` in `src/config/i18n.js`.

## Deployment

```bash
npm run build   # outputs to dist/
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host. Set your `VITE_*` variables in the hosting platform dashboard.

## License

MIT