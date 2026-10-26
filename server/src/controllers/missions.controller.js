import { missionsProviderService } from '../services/missionsProvider.service.js';

export async function getMissions(req, res) {
  try {
    const { status, category, destination, organization, q, refresh } = req.query;
    const missions = await missionsProviderService.getMissions({
      status,
      category,
      destination,
      organization,
      q,
      refresh: refresh === 'true' || refresh === '1',
    });
    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve space missions',
      error: error.message,
    });
  }
}

export async function getMissionBySlug(req, res) {
  try {
    const { slug } = req.params;
    const mission = await missionsProviderService.getMissionBySlugOrId(slug);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: `Mission '${slug}' not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: mission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mission details',
      error: error.message,
    });
  }
}
