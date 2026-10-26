# SpaceOps Server (Backend API)

The server tier of SpaceOps is a Node.js REST API built using Express 5, ES modules, Mongoose 9, Helmet security headers, and Zod environment validation.

---

## 1. Directory Structure

```text
server/
├── src/
│   ├── config/             # Config loaders (env.js, database.js)
│   ├── controllers/        # Route controllers (health, root)
│   ├── routes/             # Express route routers
│   ├── services/           # Business and dependency logic
│   ├── models/             # Mongoose schemas and data models
│   ├── middleware/         # 404 handler, error handler
│   ├── validators/         # Zod request validators
│   ├── utils/              # Utility helpers
│   ├── constants/          # Application constants
│   ├── app.js              # Express app setup and middleware chain
│   └── server.js           # Server entry point & connection bootstrap
├── tests/                  # Test suites (Node native test runner)
├── .env.example            # Backend environment template
├── .gitignore              # Server-specific Git ignores
├── package.json            # Server dependencies & scripts
└── README.md               # Backend documentation
```

---

## 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the Express HTTP server |
| `NODE_ENV` | `development` | Runtime environment (`development`, `production`, `test`) |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin for frontend client requests |
| `MONGODB_URI` | *empty* | MongoDB Atlas connection string (optional during local setup) |
| `SUPABASE_URL` | *empty* | Supabase project URL (optional / recommended) |
| `SUPABASE_PUBLISHABLE_KEY` | *empty* | Supabase publishable API key for server verification client |
| `SUPABASE_JWT_SECRET` | *empty* | Supabase JWT Secret for token verification |

> **Detached Execution**: If `MONGODB_URI` is left blank, the server safely boots in **detached mode**. It accurately reports database unavailability at `GET /api/health` without crashing.

---

## 3. Development Scripts

Run from the `server/` directory:

```bash
# Install dependencies
npm install

# Start in development mode with nodemon hot-reload
npm run dev

# Start in production mode
npm start

# Run automated tests
npm test
```

---

## 4. Initial Endpoints

* `GET /api` — API information, active version, and endpoints metadata.
* `GET /api/health` — Real-time health status and database readiness check.
