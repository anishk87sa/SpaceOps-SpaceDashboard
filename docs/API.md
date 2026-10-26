# SpaceOps — Public REST API v1 Specification

Base URL: `http://localhost:5000/api`  
Version 1 Root: `http://localhost:5000/api/v1`  
Protocol: HTTP/1.1 JSON with public access (no mandatory login required for exploration)

---

## 1. System & Feed Endpoints

### `GET /api`
Returns base metadata, documentation pointers, and health checks.

### `GET /api/health`
Health check diagnostics returning server uptime, environment status, and database mode.

### `GET /api/v1/home`
Aggregate payload powering the public discovery homepage:
* Hero configuration and copy
* Upcoming rocket launches with live countdown timestamps
* Active space missions spotlight
* Featured mission profile
* Destination highlights
* Space events
* Latest space news
* Educational guides
* Global space agencies list

### `GET /api/v1/dashboard`
Unified public discovery dashboard overview:
* Summary statistics (launches, missions, updates, celestial events)
* Next 5 scheduled rocket launches
* Active planetary and orbital missions
* Chronological science and discovery updates
* Upcoming celestial phenomena
* Quick destination shortcuts

---

## 2. Space Missions (`/api/v1/missions`)

### `GET /api/v1/missions`
Query space missions directory with optional filters:
* `status` (e.g. `active`, `upcoming`, `completed`)
* `category` (e.g. `Planetary Science`, `Mars Exploration`, `Lunar Exploration`, `Space Telescopes`, `Deep Space`, `Human Spaceflight`)
* `destination` (e.g. `mars`, `moon`, `jupiter`, `earth-orbit`, `deep-space`)
* `organization` (e.g. `NASA`, `ESA`, `ISRO`, `JAXA`)
* `q` (free-text search)

### `GET /api/v1/missions/:slug`
Detailed mission profile including:
* Objectives & milestones timeline
* Associated spacecraft & scientific discoveries
* Official website & verified citations

---

## 3. Rocket Launches (`/api/v1/launches`)

### `GET /api/v1/launches`
Returns orbital launches with query parameters:
* `type`: `upcoming` (default) or `past`
* `provider`: `SpaceX`, `NASA`, `ISRO`, `Arianespace`
* `q`: free-text search across rocket, payload, or launch site

### `GET /api/v1/launches/:slug`
Launch detail record:
* Scheduled timestamp in UTC
* Launch vehicle specs and launch pad coordinates
* Schedule confidence indicator
* Official broadcast webcast stream link

---

## 4. Spacecraft Explorer (`/api/v1/spacecraft`)

### `GET /api/v1/spacecraft`
Browse spacecraft directory:
* `category`: `Space Telescopes`, `Rovers and Landers`, `Space Probes`, `Space Stations`
* `destination`: filter by destination
* `q`: search by spacecraft name or instruments

### `GET /api/v1/spacecraft/:slug`
Spacecraft technical specifications:
* Mirror size, wingspan, power sources, robotic arms, scientific instruments
* Key discoveries and educational notes

---

## 5. Destinations (`/api/v1/destinations`)

### `GET /api/v1/destinations`
Returns destinations across the solar system (Moon, Mars, Earth Orbit, Jupiter, Saturn, The Sun, Deep Space).

### `GET /api/v1/destinations/:slug`
Destination detail:
* Distance from Earth, orbital period
* Planetary exploration highlights & educational notes
* Linked active missions and exploring spacecraft

---

## 6. Space Events (`/api/v1/events`)

### `GET /api/v1/events`
Query upcoming astronomical events:
* `type`: `Meteor Shower`, `Eclipse`, `Planetary Conjunction`, `Rocket Launch`, `Mission Milestone`
* `q`: search by event title

### `GET /api/v1/events/:slug`
Celestial event guidance:
* Start & end window in UTC
* Visibility regions and dark-sky viewing tips
* Related astronomical bodies or missions

---

## 7. Space News (`/api/v1/news`)

### `GET /api/v1/news`
Chronological feed of space news:
* `category`: `Scientific Discoveries`, `Mission Updates`, `Space Agencies`, `Rocket Launches`

### `GET /api/v1/news/:slug`
Full article text with publisher attribution and official source reference.

---

## 8. Educational Learning Center (`/api/v1/learn`)

### `GET /api/v1/learn`
Curated educational articles written for students and enthusiasts.
* `category`: `Rocketry & Propulsion`, `Orbital Mechanics`, `Planetary Science`, `Astrophysics & Telescopes`

### `GET /api/v1/learn/:slug`
Full educational guide with key takeaways, illustrations, and glossary terms.

---

## 9. Global Multi-Entity Search (`/api/v1/search`)

### `GET /api/v1/search?q={query}`
Performs instant cross-entity search across missions, launches, spacecraft, destinations, events, news, and learning guides.

---

## 10. Data Sources Policy (`/api/v1/sources`)

### `GET /api/v1/sources`
Returns inventory and synchronization status of external data providers (NASA Open APIs, Launch Library 2, JPL Horizons).

---

## 11. Personal Bookmarks (`/api/v1/bookmarks`)

* `GET /api/v1/bookmarks` — Retrieve user bookmarks.
* `POST /api/v1/bookmarks` — Save a mission, launch, spacecraft, or guide to bookmarks.
* `DELETE /api/v1/bookmarks/:itemId` — Remove item from bookmarks.

---

## 12. Interactive 3D Earth & Satellite Tracking (`/api/v1/satellites` & `/api/satellites`)

Powered by genuine CelesTrak TLE orbital elements, in-memory caching, and SGP4 propagation.

### `GET /api/v1/satellites`
Returns the normalized satellite catalog.
* **Query Parameters**:
  * `category`: Filter by category (`stations`, `earth_observation`, `weather`, `navigation`, `science`, `communications`)
  * `search`: Search by name or NORAD catalog ID
  * `limit`: Limit returned records (default: 500)
  * `refresh`: Force catalog refresh (`true` / `1`)

### `GET /api/v1/satellites/:noradId`
Returns satellite metadata, orbital elements, and real-time calculated position for a specific NORAD ID.

### `GET /api/v1/satellites/:noradId/position`
Calculates SGP4 position at specified simulation time.
* **Query Parameters**:
  * `time`: ISO 8601 timestamp string (optional, defaults to current time)

### `GET /api/v1/satellites/:noradId/orbit`
Calculates sampled 3D orbital trajectory across one full orbital period.
* **Query Parameters**:
  * `samples`: Number of discrete sample points (24 - 180, default: 90)
  * `time`: Center time of orbit period (optional)

### `GET /api/v1/satellites/categories`
Returns available categories and satellite counts.

### `GET /api/v1/satellites/status`
Returns data source health, cache timestamp, and satellite count.

### `POST /api/v1/satellites/refresh`
Triggers catalog refresh from CelesTrak.

