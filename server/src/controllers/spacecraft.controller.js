import { spacecraftProviderService } from '../services/spacecraftProvider.service.js';

export async function getSpacecraft(req, res) {
  try {
    const { category, type, destination, q, refresh } = req.query;
    const spacecraftList = await spacecraftProviderService.getSpacecraft({
      category,
      type,
      destination,
      q,
      refresh: refresh === 'true' || refresh === '1',
    });
    res.status(200).json({
      success: true,
      count: spacecraftList.length,
      data: spacecraftList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve spacecraft',
      error: error.message,
    });
  }
}

export async function getSpacecraftBySlug(req, res) {
  try {
    const { slug } = req.params;
    const craft = await spacecraftProviderService.getSpacecraftBySlugOrId(slug);
    if (!craft) {
      return res.status(404).json({
        success: false,
        message: `Spacecraft '${slug}' not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: craft,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve spacecraft details',
      error: error.message,
    });
  }
}
