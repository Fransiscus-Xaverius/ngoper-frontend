# ngoper-frontend

React 19 SPA — chat platform ("Ngoper"). Vite 8 + TypeScript 6 + Tailwind CSS 4.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` (type-check first) |
| `npm run lint` | ESLint flat config on `**/*.{ts,tsx}` |
| `npm run preview` | Vite preview of built output |

Build command order matters: **type-check before bundle**. No test suite exists. No CI workflows.

## Architecture

- **Entry**: `src/main.tsx` — mounts `<App>` inside Redux `<Provider>` + `<BrowserRouter>`
- **Routing** (`src/App.tsx`): public routes (`/`, `/login`, `/register`), protected routes (`/home`, `/explore`, `/profile`, `/chat`, `/my-requests`, `/transactions`, `/trips`) via `<ProtectedRoute>`; jastiper-only `/orders` via `<JastiperRoute>`. Both redirect unauthenticated to `/login`.
- **State**: Redux Toolkit (`src/store/`) — single `auth` slice; typed hooks (`useAppDispatch`, `useAppSelector`) in `src/store/hooks.ts`
- **API**: Axios client (`src/api/client.ts`) — Bearer token on requests; response 401 interceptor queues concurrent retries and refreshes via `/v1/auth/refresh`. Refresh uses `withCredentials: true` (cookie-based). `PUBLIC_AUTH_PATHS` exempts login/register/refresh from retry.
- **Auth**: JWT in `localStorage('access_token')`; auto-refresh via `setTimeout` at `expires_in - 60` seconds. `AuthSync` component in `App.tsx` wires `setForceLogoutHandler` to Redux `logout` action.
- **Design**: Dark theme. Tailwind v4 configured via `@theme` block in `src/index.css` (watermelon palette). `tailwind.config.js` is **unused**. Utility classes: `.glass-card`, `.glow-watermelon`, `.gradient-text`. Font: Plus Jakarta Sans + Material Symbols.
- **Dev server**: configured with `allowedHosts: ['ngoper.fransiscus.dev']` in `vite.config.ts`.
- **Barrel exports**: `src/pages/index.ts`, `src/components/layout/index.ts`, `src/components/sections/index.ts`.
- **Conditional classes**: `clsx` utility available.

## API docs

`steering/swagger.yaml` — OpenAPI 3.0 spec. Covers auth, chat, attachments, WebSocket endpoints.

## Structure

```
src/
├── api/           # client.ts, auth.ts, posts.ts, orders.ts
├── assets/        # hero.png, icons
├── components/
│   ├── layout/    # Header, Footer (barrel export)
│   ├── sections/  # HeroSection, TrendingGrid, TopJastipers (barrel export)
│   ├── ui/        # MaterialIcon
│   └── ProtectedRoute.tsx
├── pages/         # 11 page components (barrel export via index.ts)
└── store/
    ├── index.ts   # configureStore
    ├── hooks.ts   # useAppDispatch, useAppSelector
    └── slices/
        └── authSlice.ts  # login/logout/fetchMe thunks
```

## TypeScript & linting quirks

- Strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly` — all on. `verbatimModuleSyntax` requires `type` keyword on type-only imports.
- ESLint flat config (`eslint.config.js`): `typescript-eslint`, `react-hooks`, `react-refresh`. `dist/` globally ignored.
- No `.env` files tracked (`.env*` gitignored). `VITE_API_URL` env var required for non-localhost backends.
