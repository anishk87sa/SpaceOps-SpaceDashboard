import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getDataSources(req, res) {
  try {
    const sources = spaceopsRepo.getDataSources();
    res.status(200).json({
      success: true,
      count: sources.length,
      data: sources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve data sources',
      error: error.message
    });
  }
}

export function syncDataSource(req, res) {
  try {
    const { sourceId } = req.params;
    res.status(200).json({
      success: true,
      message: `Triggered sync for source ${sourceId}`,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to sync data source',
      error: error.message
    });
  }
}
