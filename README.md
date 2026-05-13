# Ngoper Frontend

React SPA for the Ngoper marketplace — social feed, orders, chat, and user profiles.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Language | TypeScript 6 |
| State | Redux Toolkit |
| Routing | React Router 7 |
| HTTP | Axios |
| Styling | Tailwind CSS 4 |

## Quick Start

### Prerequisites

- Node.js 18+
- Backend services running (see [ngoper-backend](../ngoper-backend/README.md))

### Setup & Run

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server proxies API calls to `http://localhost:8080` via the `VITE_API_URL` environment variable.

### Environment

Create a `.env` file (already included for development):

```
VITE_API_URL=http://localhost:8080
```

### Test Credentials

| Email | Password | Role |
|-------|----------|------|
| `test@example.com` | `password123` | user (feed, posts) |
| `jastiper@test.com` | `password123` | jastiper (feed + orders) |

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public (guest) | Login form |
| `/register` | Public (guest) | Registration form |
| `/home` | Authenticated | Social feed |
| `/orders` | Jastiper only | Order management |
| `/explore` | Authenticated | Discover |
| `/profile` | Authenticated | User profile |
| `/chat` | Authenticated | Chat |

## Project Structure

```
ngoper-frontend/
├── .env                      # Environment variables
├── vite.config.ts            # Vite config
├── tailwind.config.js        # Tailwind config
├── src/
│   ├── api/                  # API clients
│   │   ├── auth.ts           # Auth API
│   │   ├── client.ts         # Axios instance + interceptors
│   │   ├── orders.ts         # Orders API
│   │   └── posts.ts          # Feed/posts/upload API
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Landing page sections
│   │   ├── ui/               # MaterialIcon
│   │   └── ProtectedRoute.tsx
│   ├── pages/                # Route pages
│   │   ├── HomePage.tsx      # Feed
│   │   ├── OrdersPage.tsx    # Jastiper orders
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ChatPage.tsx
│   ├── store/                # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/authSlice.ts
│   ├── App.tsx               # Routes
│   └── main.tsx              # Entry point
└── public/                   # Static assets
```

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```
