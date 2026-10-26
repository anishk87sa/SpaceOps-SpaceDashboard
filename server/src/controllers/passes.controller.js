import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getPasses(req, res) {
  const { satelliteId, groundStationId, status } = req.query;
  const passes = spaceopsRepo.getPasses({ satelliteId, groundStationId, status });
  res.status(200).json({
    status: 'success',
    count: passes.length,
    data: passes,
  });
}
