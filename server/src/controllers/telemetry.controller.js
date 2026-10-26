import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getTelemetry(req, res) {
  const { satelliteId = 'sat-iss-alpha', hours = 12 } = req.query;
  const telemetry = spaceopsRepo.getTelemetrySeries(satelliteId, Number(hours));

  res.status(200).json({
    status: 'success',
    data: telemetry,
  });
}
