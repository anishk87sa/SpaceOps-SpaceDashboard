# SpaceOps — System Architecture

## 1. System Overview

**SpaceOps** is a public-facing space exploration information and discovery platform. It is engineered to help students, space enthusiasts, the general public, and researchers discover, understand, and follow space exploration milestones.

The architecture emphasizes public accessibility, scientific accuracy, responsive editorial design, and decoupled multi-tier separation.

```text
                    ┌────────────────────────────────────────────────────────┐
                    │               Client Web Application                   │
                    │   (Public Discovery Portal + Interactive 3D Orbit)    │
                    │      React 19 + Vite + Tailwind CSS v4 + Three.js      │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                         HTTP / REST (JSON)
                                         Versioned /api/v1 Endpoints
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               Express.js API Gateway                   │
                    │           (Security Headers / Helmet / CORS)           │
                    └───────────┬────────────────────────────────┬───────────┘
                                │                                │
                                ▼                                ▼
                    ┌──────────────────────┐         ┌──────────────────────┐
                    │ Global Search Engine │         │  Public Discovery    │
                    │  (Multi-Entity Index)│         │  Domain Controllers  │
                    └──────────────────────┘         │ (Missions, Launches, │
                                                     │  Spacecraft, Events) │
                                                     └───────────┬──────────┘
                                                                 │
                                                                 ▼
                                                     ┌──────────────────────┐
                                                     │ Authoritative Space  │
                                                     │ Data Repository Layer│
                                                     └───────────┬──────────┘
                                                                 │
                                        ┌────────────────────────┴────────────────────────┐
                                        ▼                                                 ▼
                             ┌──────────────────────┐                          ┌──────────────────────┐
                             │ MongoDB Atlas Cluster│                          │ In-Memory Standalone │
                             │  (Optional Database) │                          │ (Deterministic Mode) │
                             └──────────────────────┘                          └──────────────────────┘
```

---

## 2. Core Architectural Pillars

### A. Discovery-Oriented Information Architecture
* No mandatory account creation or gatekeeping to read public space mission profiles, launch countdowns, or educational guides.
* Centralized multi-entity global search accessible from anywhere in the application (via keyboard shortcut `⌘K` or header search).
* Unified public dashboard (`/dashboard`) presenting an aggregated space intelligence feed for casual visitors.

### B. Frontend Presentation Layer (`client/`)
* **Technology**: React 19, Vite, Tailwind CSS v4, Lucide React, Three.js, React Router 7.
* **Layout Structure**: Unified `PublicLayout.jsx` with responsive drawer navigation, search modal overlay, and educational discovery footer.
* **3D Educational Spacecraft Tracker** (`OrbitalGlobe.jsx`): Interactive WebGL canvas rendering Earth geometry, atmosphere glow, and realistic parametric orbits of iconic space assets (ISS, Hubble, Sentinel-6).

### C. Backend API Gateway (`server/`)
* **Technology**: Node.js (ES Modules), Express 5, Zod environment validation, Helmet security policies.
* **Domain Controllers**:
  * `missions.controller.js`: Mission milestones, objectives, scientific discoveries, agency citations.
  * `launches.controller.js`: Orbital launch manifest with launch pad coordinates, vehicles, and live webcast links.
  * `spacecraft.controller.js`: Deep space probes, rovers, and space telescopes specifications.
  * `destinations.controller.js`: Solar system destinations with exploration highlights.
  * `events.controller.js`: Astronomical phenomena and viewing guidance.
  * `news.controller.js`: Curated scientific reporting with official source links.
  * `learn.controller.js`: Student-friendly educational articles with key takeaways and glossaries.
  * `search.controller.js`: Cross-entity global search indexer.

### D. Data Tier & Resilience
* **Dual Persistence Model**: Operates with zero configuration in deterministic standalone in-memory mode or backed by MongoDB Atlas when `MONGODB_URI` is provided.
* **Integrity & Honesty**: Clearly separates verified agency updates from demonstration schedules. Never shows fake negative countdowns or fabricated real-time telemetry.
