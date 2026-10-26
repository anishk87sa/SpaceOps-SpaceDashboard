/**
 * SpaceOps - Space News Data Provider Service
 *
 * Integrates Spaceflight News API (SNAPI v4) for live, real-time aerospace journalism,
 * NASA announcements, scientific discoveries, and rocket launch news.
 *
 * Attribution: "Data provided by Spaceflight News API (SNAPI)"
 */

import { spaceopsRepo } from '../repositories/spaceops.repository.js';

const FETCH_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class NewsProviderService {
  constructor() {
    this.cache = {
      articles: null,
      timestamp: 0,
      bySlugOrId: new Map(),
    };
  }

  determineCategory(title = '', summary = '') {
    const text = `${title} ${summary}`.toLowerCase();
    if (text.includes('launch') || text.includes('rocket') || text.includes('liftoff') || text.includes('falcon') || text.includes('starship') || text.includes('vulcan') || text.includes('ariane')) {
      return 'Rocket Launches';
    }
    if (text.includes('discover') || text.includes('telescope') || text.includes('webb') || text.includes('exoplanet') || text.includes('galaxy') || text.includes('black hole') || text.includes('water on')) {
      return 'Scientific Discoveries';
    }
    if (text.includes('nasa') || text.includes('esa') || text.includes('isro') || text.includes('jaxa') || text.includes('roscosmos') || text.includes('contract') || text.includes('budget') || text.includes('agency')) {
      return 'Space Agencies';
    }
    return 'Mission Updates';
  }

  normalizeArticle(raw, index = 0) {
    if (!raw) return null;

    const id = `snapi-${raw.id}`;
    const slug = (raw.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `news-${raw.id}`;

    const category = this.determineCategory(raw.title, raw.summary);

    const imageUrl =
      raw.image_url ||
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80';

    return {
      id,
      slug,
      title: raw.title,
      headline: raw.title,
      summary: raw.summary || 'Real-time aerospace dispatch and exploration intelligence.',
      content: raw.summary || '',
      body: raw.summary || '',
      category,
      imageUrl,
      image: imageUrl,
      agency: raw.news_site || 'Aerospace Intelligence',
      publisher: raw.news_site || 'Spaceflight News',
      publishedAt: raw.published_at || new Date().toISOString(),
      publicationDate: raw.published_at || new Date().toISOString(),
      readTime: '3 min read',
      source: raw.news_site || 'Spaceflight News',
      sources: [{ name: raw.news_site || 'Spaceflight News', url: raw.url }],
      externalUrl: raw.url,
      originalUrl: raw.url,
      featured: Boolean(raw.featured || index === 0),
      isRealApi: true,
    };
  }

  async getAllNews({ refresh = false } = {}) {
    const now = Date.now();
    if (!refresh && this.cache.articles && (now - this.cache.timestamp < CACHE_TTL_MS)) {
      return this.cache.articles;
    }

    let liveArticles = [];
    try {
      const url = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=40';
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          'User-Agent': 'SpaceOps/1.0 (Public Educational Space Platform)',
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        liveArticles = (json.results || []).map((art, idx) => this.normalizeArticle(art, idx)).filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to fetch live space news from SNAPI, using repo baseline:', e.message);
    }

    const repoNews = spaceopsRepo.getNews();
    const combined = liveArticles.length > 0 ? liveArticles : repoNews;

    this.cache.articles = combined;
    this.cache.timestamp = now;

    this.cache.bySlugOrId.clear();
    for (const art of combined) {
      this.cache.bySlugOrId.set(String(art.id), art);
      this.cache.bySlugOrId.set(art.slug, art);
    }

    return combined;
  }

  async getNews({ category, q, refresh = false } = {}) {
    const all = await this.getAllNews({ refresh });
    let result = [...all];

    if (category && category !== 'All') {
      result = result.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      const qLower = q.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(qLower) ||
          n.summary.toLowerCase().includes(qLower) ||
          (n.agency && n.agency.toLowerCase().includes(qLower))
      );
    }

    return result;
  }

  async getNewsBySlugOrId(slugOrId) {
    if (!slugOrId) return null;

    if (this.cache.bySlugOrId.has(slugOrId)) {
      return this.cache.bySlugOrId.get(slugOrId);
    }

    await this.getAllNews();
    return this.cache.bySlugOrId.get(slugOrId) || spaceopsRepo.getNewsBySlugOrId(slugOrId) || null;
  }
}

export const newsProviderService = new NewsProviderService();
