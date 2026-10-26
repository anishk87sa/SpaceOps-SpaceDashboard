# SpaceOps — Space Exploration & Discovery Platform

> **Your window into space exploration.**  
> Discover upcoming rocket launches, follow active space missions, explore spacecraft journeys, and track celestial phenomena—all in one place.

SpaceOps is a public-facing space exploration information platform designed for **students, space enthusiasts, the general public, and researchers**. It brings together verified data from NASA, ESA, ISRO, launch providers, and astronomical observatories into an accessible, educational, and visually captivating web application.

---

## 1. Product Vision & Target Audience

SpaceOps makes space exploration understandable, exciting, and transparent:

1. **Students**: Learn how rockets work, explore rover missions on Mars, and read structured educational guides with glossary definitions.
2. **Space Enthusiasts**: Track upcoming rocket launches with live countdowns, browse spacecraft technical specifications, and bookmark missions.
3. **General Public**: Quickly discover what is launching, follow major space agency discoveries, and learn about visible meteor showers and eclipses.
4. **Researchers & Educators**: Access reliable, verified mission profiles with direct links to official agency portals and data sources.

---

## 2. Platform Architecture

```text
orbitron/
│
├── client/                         # Frontend React + Vite SPA
│   ├── public/                     # Favicons & public static assets
│   ├── src/
│   │   ├── components/             # Reusable UI & Layout
│   │   │   ├── common/             # GlobalSearchModal, etc.
│   │   │   ├── layout/             # PublicLayout, Header, Footer
│   │   │   └── orbital/            # OrbitalGlobe (3D Three.js spacecraft tracker)
│   │   ├── pages/                  # Public Discovery Views
│   │   │   ├── Public/             # Home, About, Contact
│   │   │   ├── Dashboard/          # PublicDashboard (/dashboard)
│   │   │   ├── Missions/           # MissionsDirectory, MissionDetail
│   │   │   ├── Launches/           # LaunchTracker, LaunchDetail
│   │   │   ├── Spacecraft/         # SpacecraftDirectory, SpacecraftDetail
│   │   │   ├── Destinations/       # DestinationExplorer, DestinationDetail
│   │   │   ├── Events/             # SpaceEventsCalendar, EventDetail
│   │   │   ├── News/               # SpaceNews, NewsDetail
│   │   │   ├── Learn/              # LearnCenter, ArticleDetail
│   │   │   ├── Search/             # SearchResults (/search)
│   │   │   ├── Bookmarks/          # BookmarksPage (/bookmarks)
│   │   │   └── Sources/            # SourcesPage (/sources)
│   │   ├── services/api/           # Centralized API client (Fetch API)
│   │   ├── routes/                 # AppRoutes registry
│   │   └── styles/                 # Tailwind CSS v4 design system
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Backend Express.js REST API
│   ├── src/
│   │   ├── config/                 # Environment validation (Zod)
│   │   ├── controllers/            # Public discovery controllers
│   │   ├── repositories/           # Authoritative SpaceOps data repository
│   │   ├── routes/                 # Versioned /api/v1 routes
│   │   ├── middleware/             # Error handlers & security headers (Helmet)
│   │   ├── app.js                  # Express middleware pipeline
│   │   └── server.js               # Server entry point
│   ├── tests/                      # Automated test suite (node:test)
│   └── package.json
│
├── docs/                           # Technical documentation
│   ├── ARCHITECTURE.md             # System tier specifications
│   └── API.md                      # REST API endpoints reference
│
├── package.json                    # Root orchestration scripts
└── README.md
```

---

## 3. Core Features & Routes

| Section | Route | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Hero section, upcoming launch countdowns, active missions spotlight, destination explorer, latest news, and educational guides. |
| **3D Satellite Tracking** | `/satellites` | Interactive 3D Earth geospatial tracking powered by CesiumJS & SGP4 orbital propagation from CelesTrak TLE catalog. |
| **Dashboard** | `/dashboard` | Public discovery hub with launch schedule, active missions, recent discoveries feed, and destination shortcuts. |
| **Missions** | `/missions`, `/missions/:slug` | Multi-category directory (Lunar, Mars, Space Telescopes, Deep Space) with objectives, milestones, discoveries, and source links. |
| **Launches** | `/launches`, `/launches/:slug` | Launch tracker with live countdowns, provider filters, pad information, payload details, and official webcast links. |
| **Spacecraft** | `/spacecraft`, `/spacecraft/:slug` | Spacecraft explorer (probes, rovers, telescopes, space stations) with technical specs and educational achievements. |
| **Destinations** | `/destinations`, `/destinations/:slug` | Solar system destination guide (Moon, Mars, Jupiter, Deep Space) with orbital facts, highlights, and linked missions. |
| **Space Events** | `/events`, `/events/:slug` | Calendar of celestial events (meteor showers, solar/lunar eclipses, oppositions) with viewing guidance. |
| **News** | `/news`, `/news/:slug` | Curated, reliable reporting on discoveries, launch updates, and space agency announcements with source attribution. |
| **Learn** | `/learn`, `/learn/:slug` | Educational learning center with illustrated guides (e.g. *How Rocket Launches Work*, *How Spacecraft Navigate to Other Planets*). |
| **Global Search** | `/search` & `⌘K` modal | Instant search across all space exploration entities (missions, launches, spacecraft, events, and articles). |
| **Bookmarks** | `/bookmarks` | Personal discovery repository saving interesting missions, launches, spacecraft, and articles to local storage. |
| **Sources** | `/sources` | Transparency on data feeds (NASA Open APIs, Launch Library 2, JPL Horizons) and schedule confidence policies. |

---

## 4. Getting Started

### Prerequisites

* **Node.js**: `v20.0.0` or higher (verified with Node `v24.x`)
* **npm**: `v10.0.0` or higher (verified with npm `v11.x`)

### Installation

Install root, client, and server dependencies in one command:

```bash
npm run install:all
```

### Running the Development Environment

Start both backend API (`localhost:5000`) and frontend Vite server (`localhost:5173`) concurrently:

```bash
npm run dev
```

* Frontend application: [http://localhost:5173](http://localhost:5173)
* Backend API root: [http://localhost:5000/api](http://localhost:5000/api)
* Backend API health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 5. Automated Tests & Quality Assurance

Run the automated test suite testing the public space exploration API, repository filters, launch countdown calculations, and multi-entity global search:

```bash
npm --prefix server test
```

Validate production client bundling:

```bash
npm --prefix client run build
```

---

## 6. Data Integrity & Attribution Policy

* **Truthful Schedules**: We distinguish confirmed launch dates from tentative windows. Unconfirmed schedules are explicitly labeled with their confidence level.
* **Open Science Attribution**: Content and imagery are sourced under educational open-access policies from NASA, ESA, ISRO, and scientific research institutes with direct citation links.
* **No Operator Telemetry**: The platform strictly avoids confusing public visitors with raw battery voltages, satellite thruster valves, or operational console controls.

---

## License

MIT License. Open for educational, scientific, and community use.
