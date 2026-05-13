# ngoper-frontend

React 19 SPA — chat platform ("Ngoper"). Vite 8 + TypeScript 6 + Tailwind CSS 4.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` (type-check via project references first) |
| `npm run lint` | ESLint flat config on all `**/*.{ts,tsx}` |
| `npm run preview` | Vite preview of built output |

## Architecture

- **Entry**: `src/main.tsx` — mounts `<App>` inside Redux `<Provider>` + `<BrowserRouter>`
- **Routing** (`src/App.tsx`): public routes (`/`, `/login`, `/register`), protected routes (`/home`, `/explore`, `/profile`, `/chat`) via `<ProtectedRoute>` which redirects unauthenticated users to `/login`
- **State**: Redux Toolkit (`src/store/`) — single `auth` slice with async thunks for login/logout; typed hooks in `src/store/hooks.ts`
- **API**: Axios client (`src/api/client.ts`) with request interceptor for Bearer token, response interceptor with token refresh queue (queues concurrent 401 retries); base URL from `VITE_API_URL` env var, defaults to `http://localhost:8080`
- **Auth**: JWT stored in `localStorage('access_token')`; auto-refresh scheduled via `setTimeout` at `expires_in - 60` seconds; refresh endpoint is `/v1/auth/refresh`
- **Design**: Dark theme, Tailwind v4 CSS config in `src/index.css` (`@import "tailwindcss"` + `@theme` block), custom color tokens (watermelon palette), utility classes: `.glass-card`, `.glow-watermelon`, `.gradient-text`; `tailwind.config.js` exists but is **unused** by Tailwind v4

## API docs

`steering/swagger.yaml` — OpenAPI 3.0 spec for the backend. Covers auth, chat, attachments, WebSocket endpoints.

## Structure

```
src/
├── api/          # Axios client + auth API calls
├── components/
│   ├── layout/   # Header, Footer
│   ├── sections/ # HeroSection, TrendingGrid, TopJastipers
│   └── ui/       # MaterialIcon (Google Material Symbols)
├── pages/        # Login, Register, Home, Explore, Profile, Chat
└── store/        # Redux store + auth slice + typed hooks
```

## Notes

- No test suite exists. No CI workflows.
- `npm run build` runs `tsc -b` (project references: `tsconfig.app.json` + `tsconfig.node.json`) — type-checking happens before bundling.
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly` are all on.
- ESLint uses flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins. `dist/` is globally ignored.
- `VITE_API_URL` env var required for non-localhost backends; the app handles token refresh internally via axios interceptor, so no manual refresh logic needed in pages.
- No `.env` files tracked in git (`.env*` gitignored).
