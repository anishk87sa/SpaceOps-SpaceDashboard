import { launchProviderService } from '../services/launchProvider.service.js';

export async function getUpcomingLaunches(req, res) {
  try {
    const { month, provider, status, rocket, q, sort, refresh } = req.query;

    const result = await launchProviderService.getUpcomingLaunches({
      month,
      provider,
      status,
      rocket,
      q,
      sort,
      refresh: refresh === 'true' || refresh === '1',
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve upcoming three-month launches',
      error: error.message,
    });
  }
}

export async function getLaunches(req, res) {
  try {
    const { status, type = 'upcoming', provider, q, sort, page, limit, refresh } = req.query;

    const result = await launchProviderService.getLaunches({
      status,
      type,
      provider,
      q,
      sort,
      page,
      limit,
      refresh: refresh === 'true' || refresh === '1',
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve launches',
      error: error.message,
    });
  }
}


export async function getLaunchBySlug(req, res) {
  try {
    const { slug } = req.params;
    const launch = await launchProviderService.getLaunchBySlugOrId(slug);
    if (!launch) {
      return res.status(404).json({
        success: false,
        message: `Launch '${slug}' not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: launch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve launch details',
      error: error.message,
    });
  }
}

