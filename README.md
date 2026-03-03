# Tour Search (Vite + React + TypeScript)

Small tour search app built with **Vite**, **React**, **TypeScript**, **Redux Toolkit**, and **React Router**.

## Requirements

- **Node.js 18+** (recommended: latest LTS)
- **npm** (or you can use `pnpm` / `yarn` if you prefer)

## Getting started

### 1) Install dependencies

```bash
npm install
```
### 2) Start the development server

```bash
npm run dev
```
## Project structure (high level)

- `src/app` — app setup (store, providers, router wiring)
- `src/pages` — route-level pages (Home, Tour, etc.)
- `src/features` — user-facing business features (tour search, tour details, etc.)
- `src/entities` — domain entities and state (tourSearch, hotel, destination, currency)
- `src/shared` — reusable UI components, hooks, utils, constants
- `src/styles` — global styles and design tokens