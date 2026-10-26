import { astronautsProviderService } from '../services/astronautsProvider.service.js';

export async function getAstronauts(req, res) {
  try {
    const { inSpace, in_space, status, agency, q, limit = 24, offset = 0, refresh } = req.query;

    const result = await astronautsProviderService.getAstronauts({
      inSpace: inSpace ?? in_space,
      status,
      agency,
      q,
      limit: parseInt(limit, 10) || 24,
      offset: parseInt(offset, 10) || 0,
      refresh: refresh === 'true' || refresh === '1',
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve astronauts directory',
      error: error.message,
    });
  }
}

export async function getAstronautsInSpace(req, res) {
  try {
    const { refresh } = req.query;
    const result = await astronautsProviderService.getAstronautsInSpace(
      refresh === 'true' || refresh === '1'
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active orbital crew',
      error: error.message,
    });
  }
}

export async function getAstronautById(req, res) {
  try {
    const { id } = req.params;
    const astronaut = await astronautsProviderService.getAstronautByIdOrSlug(id);

    if (!astronaut) {
      return res.status(404).json({
        success: false,
        message: `Astronaut '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: astronaut,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve astronaut profile',
      error: error.message,
    });
  }
}
