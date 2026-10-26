import { celestrakService } from '../services/celestrak.service.js';
import {
  parseOrbitalElements,
  propagatePosition,
  calculateOrbitalTrajectory,
  extractOrbitalCharacteristics,
} from '../services/orbitalCalculation.service.js';

/**
 * SpaceOps - Satellites API Controller
 * Provides endpoints for satellite catalog retrieval, live positions, orbital trajectories, and health.
 */

export async function getSatellites(req, res, next) {
  try {
    const { category, search, limit, refresh } = req.query;
    const forceRefresh = refresh === 'true' || refresh === '1';

    if (forceRefresh) {
      await celestrakService.refreshAllSatellites(true);
    }

    const result = await celestrakService.getSatellites({
      category: category || null,
      search: search || '',
      limit: limit ? parseInt(limit, 10) : 500,
    });

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatelliteByNoradId(req, res, next) {
  try {
    const { noradId } = req.params;
    const sat = await celestrakService.getSatelliteByNoradId(noradId);

    if (!sat) {
      return res.status(404).json({
        status: 'error',
        message: `Satellite with NORAD ID ${noradId} not found`,
      });
    }

    // Calculate current position
    const satrec = parseOrbitalElements(sat.tleLine1, sat.tleLine2);
    const currentPosition = satrec ? propagatePosition(satrec, new Date()) : null;

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        ...sat,
        currentPosition,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatellitePosition(req, res, next) {
  try {
    const { noradId } = req.params;
    const { time } = req.query;

    const sat = await celestrakService.getSatelliteByNoradId(noradId);
    if (!sat) {
      return res.status(404).json({
        status: 'error',
        message: `Satellite with NORAD ID ${noradId} not found`,
      });
    }

    const satrec = parseOrbitalElements(sat.tleLine1, sat.tleLine2);
    if (!satrec) {
      return res.status(422).json({
        status: 'error',
        message: `Invalid orbital elements for satellite ${noradId}`,
      });
    }

    const targetDate = time ? new Date(time) : new Date();
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid ISO timestamp provided in time query parameter',
      });
    }

    const position = propagatePosition(satrec, targetDate);
    if (!position) {
      return res.status(422).json({
        status: 'error',
        message: 'Orbital propagation failed for the specified timestamp',
      });
    }

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        noradId: sat.noradId,
        name: sat.name,
        targetTime: targetDate.toISOString(),
        position,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatelliteOrbit(req, res, next) {
  try {
    const { noradId } = req.params;
    const { samples = 90, time } = req.query;

    const sat = await celestrakService.getSatelliteByNoradId(noradId);
    if (!sat) {
      return res.status(404).json({
        status: 'error',
        message: `Satellite with NORAD ID ${noradId} not found`,
      });
    }

    const satrec = parseOrbitalElements(sat.tleLine1, sat.tleLine2);
    if (!satrec) {
      return res.status(422).json({
        status: 'error',
        message: `Invalid orbital elements for satellite ${noradId}`,
      });
    }

    const sampleCount = Math.min(Math.max(parseInt(samples, 10) || 90, 24), 180);
    const centerDate = time ? new Date(time) : new Date();
    const trajectory = calculateOrbitalTrajectory(satrec, centerDate, sampleCount);

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        noradId: sat.noradId,
        name: sat.name,
        orbitalCharacteristics: sat.orbitalCharacteristics || extractOrbitalCharacteristics(satrec),
        sampleCount: trajectory.length,
        centerTime: centerDate.toISOString(),
        trajectory,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatelliteCategories(req, res, next) {
  try {
    const categories = await celestrakService.getCategories();
    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatellitesStatus(req, res, next) {
  try {
    const status = celestrakService.getStatus();
    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshSatellites(req, res, next) {
  try {
    const refreshed = await celestrakService.refreshAllSatellites(true);
    res.status(200).json({
      status: 'success',
      message: `Successfully refreshed orbital catalog with ${refreshed.length} satellites`,
      timestamp: new Date().toISOString(),
      count: refreshed.length,
    });
  } catch (error) {
    next(error);
  }
}
