import { FALLBACK_SATELLITES } from '../data/fallbackSatellites.js';
import { parseOrbitalElements, extractOrbitalCharacteristics } from './orbitalCalculation.service.js';

/**
 * SpaceOps - CelesTrak Orbital Data Provider Service
 * Retrieves, normalizes, caches, and enriches real-world TLE satellite catalogs.
 * Includes concurrency protection, memory caching, and dependable offline fallback.
 */

// Supported CelesTrak Groups and their internal categorizations
export const CELESTRAK_GROUPS = {
  stations: { code: 'stations', category: 'stations', label: 'Space Stations' },
  visual: { code: 'visual', category: 'other', label: 'Brightest Satellites' },
  weather: { code: 'weather', category: 'weather', label: 'Weather Satellites' },
  resource: { code: 'resource', category: 'earth_observation', label: 'Earth Observation' },
  'gps-ops': { code: 'gps-ops', category: 'navigation', label: 'Navigation (GPS)' },
  science: { code: 'science', category: 'science', label: 'Scientific Missions' },
};

// Default in-memory cache configuration
const DEFAULT_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const CELESTRAK_BASE_URL = 'https://celestrak.org/NORAD/elements/gp.php';

class CelesTrakService {
  constructor() {
    this.cache = new Map(); // key -> { timestamp, data, source }
    this.lastSuccessfulRefresh = null;
    this.activeRefreshPromise = null;
    this.status = {
      isAvailable: true,
      lastError: null,
      lastRefreshTime: null,
      totalSatellites: 0,
      activeSource: 'uninitialized',
    };
  }

  /**
   * Parse raw TLE text stream into normalized satellite array
   * @param {string} rawText
   * @param {string} defaultCategory
   * @param {string} defaultLabel
   * @returns {Array<object>}
   */
  parseTleText(rawText, defaultCategory = 'other', defaultLabel = 'Satellite') {
    if (!rawText || typeof rawText !== 'string') return [];

    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const satellites = [];

    // TLE format: Line 0 (Name), Line 1 (1 25544U...), Line 2 (2 25544...)
    for (let i = 0; i < lines.length; ) {
      let name = '';
      let line1 = '';
      let line2 = '';

      if (lines[i].startsWith('1 ') && lines[i + 1]?.startsWith('2 ')) {
        // 2-line format without explicit name header
        line1 = lines[i];
        line2 = lines[i + 1];
        i += 2;
      } else if (
        lines[i + 1]?.startsWith('1 ') &&
        lines[i + 2]?.startsWith('2 ')
      ) {
        // Standard 3-line format
        name = lines[i].trim();
        line1 = lines[i + 1].trim();
        line2 = lines[i + 2].trim();
        i += 3;
      } else {
        i++;
        continue;
      }

      // Extract NORAD ID from line 1 or line 2
      const noradMatch = line1.match(/^1\s+(\d{1,5})/);
      const noradId = noradMatch ? parseInt(noradMatch[1], 10) : null;
      if (!noradId) continue;

      if (!name) {
        name = `OBJECT ${noradId}`;
      }

      // Classification (U = Unclassified, C = Classified, S = Secret)
      const classification = line1.charAt(7) || 'U';

      // International Designator
      const designator = line1.substring(9, 17).trim();

      // Pre-validate via orbital engine
      const satrec = parseOrbitalElements(line1, line2);
      if (!satrec) continue;

      const orbitalCharacteristics = extractOrbitalCharacteristics(satrec);

      // Determine category refinement
      const category = this.detectCategory(name, noradId, defaultCategory);
      const categoryLabel = this.getCategoryLabel(category);

      satellites.push({
        id: `sat-${noradId}`,
        noradId,
        name: this.sanitizeSatelliteName(name),
        classification,
        designator,
        category,
        categoryLabel,
        tleLine1: line1,
        tleLine2: line2,
        orbitalCharacteristics,
        source: 'CelesTrak GP API',
        fetchedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        dataQualityStatus: 'nominal',
      });
    }

    return satellites;
  }

  /**
   * Refines satellite category based on name keywords and catalog metadata
   */
  detectCategory(name, noradId, fallbackCategory = 'other') {
    const n = name.toUpperCase();
    if (n.includes('ISS') || n.includes('ZARYA') || n.includes('TIANGONG') || n.includes('CSS') || n.includes('STATION')) {
      return 'stations';
    }
    if (n.includes('STARLINK') || n.includes('ONEWEB') || n.includes('IRIDIUM') || n.includes('INTELSAT') || n.includes('SES-')) {
      return 'communications';
    }
    if (n.includes('NOAA') || n.includes('GOES') || n.includes('METOP') || n.includes('HIMAWARI') || n.includes('METEOR') || n.includes('FENGYUN')) {
      return 'weather';
    }
    if (n.includes('NAVSTAR') || n.includes('GPS') || n.includes('GLONASS') || n.includes('GALILEO') || n.includes('BEIDOU')) {
      return 'navigation';
    }
    if (n.includes('LANDSAT') || n.includes('SENTINEL') || n.includes('TERRA') || n.includes('AQUA') || n.includes('ENVISAT') || n.includes('SPOT') || n.includes('PLANET')) {
      return 'earth_observation';
    }
    if (n.includes('HUBBLE') || n.includes('CHANDRA') || n.includes('SWIFT') || n.includes('FERMI') || n.includes('XMM') || n.includes('SPITZER') || n.includes('JAMES WEBB')) {
      return 'science';
    }
    return fallbackCategory;
  }

  getCategoryLabel(category) {
    switch (category) {
      case 'stations':
        return 'Space Stations';
      case 'earth_observation':
        return 'Earth Observation';
      case 'weather':
        return 'Weather';
      case 'navigation':
        return 'Navigation (GPS)';
      case 'science':
        return 'Scientific Missions';
      case 'communications':
        return 'Communications';
      default:
        return 'Orbital Asset';
    }
  }

  sanitizeSatelliteName(name) {
    return name
      .replace(/\[.*\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Fetch a single satellite group from CelesTrak with timeout
   * @param {string} groupCode
   * @param {number} [timeoutMs=7000]
   * @returns {Promise<Array<object>>}
   */
  async fetchGroupFromCelesTrak(groupCode, timeoutMs = 7000) {
    const url = `${CELESTRAK_BASE_URL}?GROUP=${groupCode}&FORMAT=tle`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SpaceOps-Orbitron/1.0 (Orbital Visualizer)',
          Accept: 'text/plain',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`CelesTrak returned HTTP ${response.status}`);
      }

      const text = await response.text();
      const meta = CELESTRAK_GROUPS[groupCode] || { category: 'other', label: 'Other' };
      return this.parseTleText(text, meta.category, meta.label);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * Single-flight master refresh: fetches all primary groups in parallel
   * Merges, deduplicates by NORAD ID, and enriches.
   */
  async refreshAllSatellites(force = false) {
    const cacheKey = 'all_satellites';
    const cached = this.cache.get(cacheKey);

    if (!force && cached && Date.now() - cached.timestamp < DEFAULT_CACHE_TTL_MS) {
      return cached.data;
    }

    // Single-flight lock: return active promise if already fetching
    if (this.activeRefreshPromise) {
      return this.activeRefreshPromise;
    }

    this.activeRefreshPromise = (async () => {
      const groupsToFetch = ['stations', 'weather', 'resource', 'gps-ops', 'science', 'visual'];
      const results = [];
      let anyFailed = false;

      const groupPromises = groupsToFetch.map(async (group) => {
        try {
          const sats = await this.fetchGroupFromCelesTrak(group);
          return { group, sats, success: true };
        } catch (err) {
          anyFailed = true;
          return { group, sats: [], success: false, error: err.message };
        }
      });

      const fetchResults = await Promise.allSettled(groupPromises);

      fetchResults.forEach((res) => {
        if (res.status === 'fulfilled' && res.value.success) {
          results.push(...res.value.sats);
        }
      });

      // Deduplicate by NORAD ID
      const satelliteMap = new Map();
      results.forEach((s) => {
        if (!satelliteMap.has(s.noradId)) {
          satelliteMap.set(s.noradId, s);
        }
      });

      // If CelesTrak returned fewer than 10 satellites or failed completely, fallback
      if (satelliteMap.size < 10) {
        // Merge in curated fallback satellites
        FALLBACK_SATELLITES.forEach((fb) => {
          if (!satelliteMap.has(fb.noradId)) {
            const satrec = parseOrbitalElements(fb.tleLine1, fb.tleLine2);
            satelliteMap.set(fb.noradId, {
              id: `sat-${fb.noradId}`,
              noradId: fb.noradId,
              name: fb.name,
              classification: fb.classification || 'U',
              designator: fb.designator,
              category: fb.category,
              categoryLabel: fb.categoryLabel,
              tleLine1: fb.tleLine1,
              tleLine2: fb.tleLine2,
              orbitalCharacteristics: extractOrbitalCharacteristics(satrec),
              source: 'SpaceOps Curated Aerospace Catalog',
              operator: fb.operator,
              launchDate: fb.launchDate,
              launchVehicle: fb.launchVehicle,
              description: fb.description,
              fetchedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
              dataQualityStatus: anyFailed ? 'fallback' : 'nominal',
            });
          }
        });
      }

      // Enrich any existing satellites with fallback metadata if matched
      FALLBACK_SATELLITES.forEach((fb) => {
        if (satelliteMap.has(fb.noradId)) {
          const existing = satelliteMap.get(fb.noradId);
          existing.operator = existing.operator || fb.operator;
          existing.launchDate = existing.launchDate || fb.launchDate;
          existing.launchVehicle = existing.launchVehicle || fb.launchVehicle;
          existing.description = existing.description || fb.description;
        }
      });

      const allSatellites = Array.from(satelliteMap.values());

      // Update cache & status
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: allSatellites,
        source: anyFailed ? 'CelesTrak (Partial with fallback)' : 'CelesTrak GP API',
      });

      this.lastSuccessfulRefresh = new Date().toISOString();
      this.status = {
        isAvailable: true,
        lastError: anyFailed ? 'Partial group timeout' : null,
        lastRefreshTime: this.lastSuccessfulRefresh,
        totalSatellites: allSatellites.length,
        activeSource: anyFailed ? 'Hybrid CelesTrak + Fallback' : 'CelesTrak Live API',
      };

      return allSatellites;
    })()
      .catch((err) => {
        // If master fetch crashed completely, fall back to cached data or local manifest
        if (cached && cached.data) {
          this.status.lastError = err.message;
          this.status.activeSource = 'Preserved Cache (Offline Fallback)';
          return cached.data;
        }

        // Return fallback manifest
        const fallbackList = FALLBACK_SATELLITES.map((fb) => {
          const satrec = parseOrbitalElements(fb.tleLine1, fb.tleLine2);
          return {
            id: `sat-${fb.noradId}`,
            noradId: fb.noradId,
            name: fb.name,
            classification: fb.classification || 'U',
            designator: fb.designator,
            category: fb.category,
            categoryLabel: fb.categoryLabel,
            tleLine1: fb.tleLine1,
            tleLine2: fb.tleLine2,
            orbitalCharacteristics: extractOrbitalCharacteristics(satrec),
            source: 'SpaceOps Fallback Manifest',
            operator: fb.operator,
            launchDate: fb.launchDate,
            launchVehicle: fb.launchVehicle,
            description: fb.description,
            fetchedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            dataQualityStatus: 'fallback',
          };
        });

        this.status = {
          isAvailable: false,
          lastError: err.message,
          lastRefreshTime: new Date().toISOString(),
          totalSatellites: fallbackList.length,
          activeSource: 'Curated Fallback Manifest',
        };

        return fallbackList;
      })
      .finally(() => {
        this.activeRefreshPromise = null;
      });

    return this.activeRefreshPromise;
  }

  /**
   * Get all satellites with optional category and search filters
   */
  async getSatellites({ category = null, search = '', limit = 500 } = {}) {
    const list = await this.refreshAllSatellites();

    let filtered = list;

    if (category && category !== 'all') {
      filtered = filtered.filter((s) => s.category === category);
    }

    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.noradId.toString().includes(q) ||
          (s.designator && s.designator.toLowerCase().includes(q))
      );
    }

    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return {
      satellites: filtered,
      totalCount: filtered.length,
      unfilteredTotal: list.length,
      source: this.status.activeSource,
      lastUpdated: this.lastSuccessfulRefresh || new Date().toISOString(),
      dataQualityStatus: this.status.isAvailable ? 'nominal' : 'fallback',
    };
  }

  /**
   * Get single satellite by NORAD ID
   */
  async getSatelliteByNoradId(noradId) {
    const id = parseInt(noradId, 10);
    if (!id || isNaN(id)) return null;

    const all = await this.refreshAllSatellites();
    const found = all.find((s) => s.noradId === id);
    if (found) return found;

    // Direct CelesTrak query if not in current catalog
    try {
      const url = `${CELESTRAK_BASE_URL}?CATNR=${id}&FORMAT=tle`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const text = await res.text();
        const parsed = this.parseTleText(text);
        if (parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch (e) {
      // Ignore
    }

    return null;
  }

  /**
   * Get satellite categories breakdown with counts
   */
  async getCategories() {
    const all = await this.refreshAllSatellites();
    const categoryCounts = {};

    all.forEach((s) => {
      const cat = s.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryList = [
      { id: 'all', label: 'All Tracked Satellites', count: all.length },
      { id: 'stations', label: 'Space Stations', count: categoryCounts.stations || 0 },
      { id: 'earth_observation', label: 'Earth Observation', count: categoryCounts.earth_observation || 0 },
      { id: 'weather', label: 'Weather Satellites', count: categoryCounts.weather || 0 },
      { id: 'navigation', label: 'Navigation (GPS)', count: categoryCounts.navigation || 0 },
      { id: 'science', label: 'Scientific Missions', count: categoryCounts.science || 0 },
      { id: 'communications', label: 'Communications', count: categoryCounts.communications || 0 },
      { id: 'other', label: 'Other Active Assets', count: categoryCounts.other || 0 },
    ];

    return categoryList;
  }

  getStatus() {
    return {
      ...this.status,
      timestamp: new Date().toISOString(),
    };
  }
}

export const celestrakService = new CelesTrakService();
export default celestrakService;
