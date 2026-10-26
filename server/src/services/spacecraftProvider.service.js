/**
 * SpaceOps - Spacecraft Data Provider Service
 *
 * Combines authoritative interplanetary exploration vehicles with
 * live orbital spacecraft manifests from The Space Devs (Launch Library 2 v2.3.0).
 *
 * Attribution: "Data provided by The Space Devs / Launch Library 2 & SpaceOps Registry"
 */

import { env } from '../config/env.js';
import { spaceopsRepo } from '../repositories/spaceops.repository.js';

const FETCH_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

class SpacecraftProviderService {
  constructor() {
    this.cache = {
      spacecraft: null,
      timestamp: 0,
      bySlugOrId: new Map(),
    };
  }

  determineCategory(name = '', typeName = '', desc = '') {
    const text = `${name} ${typeName} ${desc}`.toLowerCase();
    if (text.includes('station') || text.includes('hab') || text.includes('laboratory')) {
      return 'Space Stations';
    }
    if (text.includes('telescope') || text.includes('observatory') || text.includes('hubble') || text.includes('webb')) {
      return 'Space Telescopes';
    }
    if (text.includes('rover') || text.includes('lander')) {
      return 'Rovers and Landers';
    }
    return 'Space Probes';
  }

  normalizeSpacecraft(raw) {
    if (!raw) return null;

    const id = `ll2-sc-${raw.id}`;
    const slug = (raw.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const agency = raw.spacecraft_config?.agency || {};
    const configName = raw.spacecraft_config?.name || raw.name;
    const typeName = raw.spacecraft_config?.type?.name || 'Orbital Spacecraft';

    const category = this.determineCategory(raw.name, typeName, raw.description);

    const imageUrl =
      raw.image?.image_url ||
      raw.spacecraft_config?.image?.image_url ||
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80';

    return {
      id,
      slug,
      name: raw.name,
      model: configName,
      category,
      type: typeName,
      status: raw.in_space ? 'operational' : (raw.status?.name?.toLowerCase() === 'active' ? 'operational' : (raw.status?.name?.toLowerCase() || 'retired')),
      operator: agency.name || 'Commercial & International Spaceflight',
      organization: agency.name || 'Commercial & International Spaceflight',
      destination: raw.in_space ? 'Earth Orbit' : 'Earth & Interplanetary',
      launchDate: raw.spacecraft_config?.family?.[0]?.maiden_flight || 'Multi-mission',
      featuredImage: imageUrl,
      image: imageUrl,
      summary: raw.description
        ? raw.description.slice(0, 180) + (raw.description.length > 180 ? '...' : '')
        : `${configName} operated by ${agency.name || 'aerospace team'}.`,
      educationalNotes: raw.description || `${raw.name} is a high-performance space exploration vehicle.`,
      keyAchievements: raw.description || `${raw.name} flight operations.`,
      description: raw.description || `${raw.name} is a high-performance space exploration vehicle.`,
      specifications: {
        flightsCount: raw.flights_count ?? 1,
        serialNumber: raw.serial_number || 'Orbital Vehicle',
        dockingDuration: raw.time_docked || 'Classified / N/A',
        timeInSpace: raw.time_in_space || 'Multi-day orbital flight'
      },
      instruments: [
        { name: 'Orbital Maneuvering Thrusters', purpose: 'Rendezvous, trajectory corrections, and deorbit burns' },
        { name: 'Autonomous Docking Sensor Suite', purpose: 'LIDAR and optical proximity guidance' },
        { name: 'Life Support / Payload Conditioning', purpose: 'Pressurized environmental control' }
      ],
      isRealApi: true,
      source: 'The Space Devs LL2 Live'
    };
  }

  async getAllSpacecraft({ refresh = false } = {}) {
    const now = Date.now();
    if (!refresh && this.cache.spacecraft && (now - this.cache.timestamp < CACHE_TTL_MS)) {
      return this.cache.spacecraft;
    }

    const repoCraft = spaceopsRepo.getSpacecraft();
    let liveCraft = [];

    try {
      const url = `${env.LL2_API_BASE_URL || 'https://lldev.thespacedevs.com/2.3.0'}/spacecraft/?limit=40`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          'User-Agent': 'SpaceOps/1.0',
          'Accept': 'application/json',
          ...(env.LL2_API_KEY ? { 'Authorization': `Token ${env.LL2_API_KEY}` } : {})
        }
      });

      if (res.ok) {
        const json = await res.json();
        liveCraft = (json.results || []).map((sc) => this.normalizeSpacecraft(sc)).filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to fetch LL2 live spacecraft, using repo baseline:', e.message);
    }

    const combined = [...repoCraft];
    const existingSlugs = new Set(repoCraft.map((s) => s.slug.toLowerCase()));

    for (const sc of liveCraft) {
      if (!existingSlugs.has(sc.slug.toLowerCase())) {
        combined.push(sc);
        existingSlugs.add(sc.slug.toLowerCase());
      }
    }

    this.cache.spacecraft = combined;
    this.cache.timestamp = now;

    this.cache.bySlugOrId.clear();
    for (const sc of combined) {
      this.cache.bySlugOrId.set(String(sc.id), sc);
      this.cache.bySlugOrId.set(sc.slug, sc);
    }

    return combined;
  }

  async getSpacecraft({ category, type, destination, q, refresh = false } = {}) {
    const all = await this.getAllSpacecraft({ refresh });
    let result = [...all];

    if (category && category !== 'All') {
      result = result.filter((s) => s.category?.toLowerCase() === category.toLowerCase());
    }
    if (type && type !== 'All') {
      result = result.filter((s) => s.type?.toLowerCase() === type.toLowerCase());
    }
    if (destination && destination !== 'All') {
      result = result.filter((s) => s.destination?.toLowerCase() === destination.toLowerCase());
    }
    if (q) {
      const qLower = q.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(qLower) ||
          (s.description && s.description.toLowerCase().includes(qLower)) ||
          (s.operator && s.operator.toLowerCase().includes(qLower)) ||
          (s.model && s.model.toLowerCase().includes(qLower))
      );
    }

    return result;
  }

  async getSpacecraftBySlugOrId(slugOrId) {
    if (!slugOrId) return null;

    if (this.cache.bySlugOrId.has(slugOrId)) {
      return this.cache.bySlugOrId.get(slugOrId);
    }

    await this.getAllSpacecraft();
    return this.cache.bySlugOrId.get(slugOrId) || spaceopsRepo.getSpacecraftBySlugOrId(slugOrId) || null;
  }
}

export const spacecraftProviderService = new SpacecraftProviderService();
