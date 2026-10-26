/**
 * SpaceOps - Centralized Public API Client
 * Built on native Fetch API with error handling, timeout controls, and local bookmark synchronization.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// In-memory response cache for instantaneous SPA page transitions without reloading
const apiCache = new Map();
const DEFAULT_CACHE_TTL_MS = 60000; // 60s cache

export function clearApiCache() {
  apiCache.clear();
}

/**
 * Universal request handler
 */
export async function request(endpoint, options = {}, timeoutMs = 8000) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const shouldBypassCache =
    Boolean(options.bypassCache) ||
    Boolean(options.refresh) ||
    endpoint.includes('refresh=true') ||
    endpoint.includes('refresh=1');

  // Return cached response immediately for instantaneous SPA transitions
  if (isGet && !shouldBypassCache && apiCache.has(url)) {
    const cached = apiCache.get(url);
    if (Date.now() - cached.timestamp < DEFAULT_CACHE_TTL_MS) {
      return cached.data;
    }
    apiCache.delete(url);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let token = null;
  try {
    token = localStorage.getItem('spaceops_token') || localStorage.getItem('orbitron_token');
  } catch (e) {
    // Ignore in private browsing
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Automatically JSON stringify request body when sending JavaScript objects
  let body = options.body;
  if (
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof URLSearchParams)
  ) {
    body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      body,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error?.message ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    // Cache successful GET requests and invalidate on mutations
    if (isGet && !shouldBypassCache && data) {
      apiCache.set(url, { timestamp: Date.now(), data });
    } else if (!isGet) {
      apiCache.clear();
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Server is not responding.', 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      'Network connection error: Unable to connect to SpaceOps API backend.',
      0,
      { originalError: error.message }
    );
  }
}

export const apiClient = {
  // 1. Core System & Feeds
  checkHealth: () => request('/health', { method: 'GET' }),
  getRoot: () => request('/', { method: 'GET' }),
  getHomeFeed: () => request('/v1/home', { method: 'GET' }),
  getDashboardFeed: () => request('/v1/dashboard', { method: 'GET' }),

  // 2. Space Missions
  getMissions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/missions${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getMissionBySlug: (slug) => request(`/v1/missions/${slug}`, { method: 'GET' }),

  // 2b. Astronauts & Orbital Crew
  getAstronauts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/astronauts${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getAstronautsInSpace: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/astronauts/in-space${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getAstronautById: (id) => request(`/v1/astronauts/${id}`, { method: 'GET' }),

  // 3. Rocket Launches
  getUpcomingLaunches: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/launches/upcoming${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getLaunches: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/launches${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getLaunchBySlug: (slug) => request(`/v1/launches/${slug}`, { method: 'GET' }),


  // 4. Spacecraft Explorer
  getSpacecraft: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/spacecraft${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getSpacecraftBySlug: (slug) => request(`/v1/spacecraft/${slug}`, { method: 'GET' }),

  // 5. Destinations
  getDestinations: () => request('/v1/destinations', { method: 'GET' }),
  getDestinationBySlug: (slug) => request(`/v1/destinations/${slug}`, { method: 'GET' }),

  // 6. Space Events & Astronomical Observations
  getEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/events${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getEventBySlug: (slug) => request(`/v1/events/${slug}`, { method: 'GET' }),

  // 7. Space News
  getNews: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/news${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getNewsBySlug: (slug) => request(`/v1/news/${slug}`, { method: 'GET' }),

  // 8. Educational Learning Center
  getArticles: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/learn${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getArticleBySlug: (slug) => request(`/v1/learn/${slug}`, { method: 'GET' }),

  // 9. Global Search
  searchAll: (query) => {
    const qs = new URLSearchParams({ q: query }).toString();
    return request(`/v1/search?${qs}`, { method: 'GET' });
  },

  // 10. Organizations & Data Sources
  getOrganizations: () => request('/v1/organizations', { method: 'GET' }),
  getDataSources: () => request('/v1/sources', { method: 'GET' }),

  // 11. Bookmarks & Personal Discovery
  getBookmarks: () => request('/v1/bookmarks', { method: 'GET' }),
  addBookmark: (item) => request('/v1/bookmarks', { method: 'POST', body: item }),
  removeBookmark: (itemId) => request(`/v1/bookmarks/${itemId}`, { method: 'DELETE' }),

  // 12. Educational 3D Orbital Tracker Data
  getOrbitalData: () => request('/v1/orbital', { method: 'GET' }),

  // 13. Interactive 3D Earth & Satellite Tracking Engine (CelesTrak / SGP4)
  getSatellites: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/satellites${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getSatelliteByNoradId: (noradId) => request(`/v1/satellites/${noradId}`, { method: 'GET' }),
  getSatellitePosition: (noradId, time) => {
    const qs = time ? `?time=${encodeURIComponent(time)}` : '';
    return request(`/v1/satellites/${noradId}/position${qs}`, { method: 'GET' });
  },
  getSatelliteOrbit: (noradId, samples = 90, time = null) => {
    const params = new URLSearchParams({ samples: samples.toString() });
    if (time) params.append('time', time);
    return request(`/v1/satellites/${noradId}/orbit?${params.toString()}`, { method: 'GET' });
  },
  getSatelliteCategories: () => request('/v1/satellites/categories', { method: 'GET' }),
  getSatellitesStatus: () => request('/v1/satellites/status', { method: 'GET' }),
  refreshSatellites: () => request('/v1/satellites/refresh', { method: 'POST' }),

  // 14. Optional Auth for personalization
  login: (credentials) => request('/v1/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => request('/v1/auth/register', { method: 'POST', body: payload }),
  getMe: () => request('/v1/auth/me', { method: 'GET' }),
  forgotPassword: (email) => request('/v1/auth/forgot-password', { method: 'POST', body: { email } }),
};

export default apiClient;
