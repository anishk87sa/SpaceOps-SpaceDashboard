import { spaceopsRepo } from '../repositories/spaceops.repository.js';
import { launchProviderService } from '../services/launchProvider.service.js';

export async function getHomeFeed(req, res) {
  try {
    const homeData = spaceopsRepo.getHomeFeed();
    try {
      const liveLaunches = await launchProviderService.getLaunches({ type: 'upcoming', limit: 4 });
      if (liveLaunches.data && liveLaunches.data.length > 0) {
        homeData.upcomingLaunches = liveLaunches.data;
      }
    } catch (e) {
      // Use repository fallback
    }

    res.status(200).json({
      success: true,
      data: homeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve homepage data',
      error: error.message,
    });
  }
}

