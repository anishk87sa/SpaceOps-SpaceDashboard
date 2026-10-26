import { spaceopsRepo } from '../repositories/spaceops.repository.js';
import { astronautsProviderService } from '../services/astronautsProvider.service.js';

export async function searchAll(req, res) {
  try {
    const { q } = req.query;
    const query = q || '';
    const searchData = spaceopsRepo.globalSearch(query);

    if (query.trim()) {
      try {
        const astroResults = await astronautsProviderService.getAstronauts({ q: query, limit: 5 });
        const matchedAstronauts = (astroResults.data || []).map((a) => ({
          id: `astro-${a.id}`,
          title: a.name,
          slug: a.slug,
          type: 'Astronaut',
          url: `/astronauts/${a.slug || a.id}`,
          summary: `${a.nationality} • ${a.agency?.abbrev || 'Astronaut'} (${a.inSpace ? 'In Orbit' : a.statusLabel || a.status})`,
          badge: a.inSpace ? 'In Orbit' : a.statusLabel || a.status,
        }));

        searchData.results.astronauts = matchedAstronauts;
        searchData.totalResults += matchedAstronauts.length;
      } catch (err) {
        // Fallback
      }
    }

    res.status(200).json({
      success: true,
      data: searchData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Global search query failed',
      error: error.message,
    });
  }
}
