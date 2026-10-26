import { spaceopsRepo } from '../repositories/spaceops.repository.js';
import { launchProviderService } from '../services/launchProvider.service.js';

export async function getDashboardOverview(req, res) {
  try {
    const feed = spaceopsRepo.getDashboardFeed();
    try {
      const liveLaunches = await launchProviderService.getLaunches({ type: 'upcoming', limit: 5 });
      if (liveLaunches.data && liveLaunches.data.length > 0) {
        feed.upcomingLaunches = liveLaunches.data;
        feed.summary.upcomingLaunchesCount = liveLaunches.total || liveLaunches.data.length;
      }
    } catch (e) {
      // Use repository fallback
    }

    res.status(200).json({
      success: true,
      data: feed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve public exploration dashboard',
      error: error.message,
    });
  }
}

