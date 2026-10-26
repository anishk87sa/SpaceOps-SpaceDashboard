# SpaceOps Client (Frontend Application)

The client tier of SpaceOps is a modern React application built on Vite, styled with Tailwind CSS v4, and equipped with React Router and Lucide aerospace icons.

---

## 1. Directory Structure

```text
client/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Bundled graphics and aerospace icons
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/         # Generic reusable UI primitives
│   │   ├── ui/             # Aerospace telemetry cards and badges
│   │   └── layout/         # Header and Footer layout wrappers
│   ├── pages/              # Primary route view components
│   │   ├── Dashboard/      # System status & mission control shell
│   │   ├── Launches/       # Upcoming launches (Milestone 2)
│   │   ├── Missions/       # Mission registry (Milestone 3)
│   │   ├── Spacecraft/     # Spacecraft directory (Milestone 3)
│   │   ├── Watchlist/      # Operator watchlist (Milestone 4)
│   │   └── NotFound/       # Aerospace 404 handler
│   ├── services/
│   │   ├── api/            # Centralized Fetch API client
│   │   └── missions/       # Mission-specific service abstractions
│   ├── hooks/              # Custom hooks (e.g. useApiHealth)
│   ├── context/            # React context providers
│   ├── utils/              # Utility helpers
│   ├── constants/          # Application constants
│   ├── routes/             # App routing registry (AppRoutes.jsx)
│   ├── styles/             # Global CSS and Tailwind design tokens
│   ├── App.jsx             # Top-level shell
│   └── main.jsx            # React 19 bootstrap entry
├── .env.example            # Environment template
├── .gitignore              # Client-specific Git ignores
├── index.html              # HTML5 entry with Orbitron & Inter fonts
├── package.json            # Client dependencies & scripts
└── vite.config.js          # Vite + Tailwind CSS configuration
```

---

## 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL of the SpaceOps Express backend |
| `VITE_SUPABASE_URL` | `https://your-project-ref.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `your-supabase-publishable-key` | Supabase publishable API key for client-side authentication |

> **Note**: Do NOT place database credentials or backend secret keys in client environment variables. Always use the public publishable key on the client side.

---

## 3. Development Scripts

Run from the `client/` directory:

```bash
# Install dependencies
npm install

# Start Vite development server (http://localhost:5173)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Standalone Operation

The client application is decoupled from the backend. When the backend server is offline or unreachable, the frontend gracefully degrades to a disconnected state with informative status alerts on the Dashboard shell.
