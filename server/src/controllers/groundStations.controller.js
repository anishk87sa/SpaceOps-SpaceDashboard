import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getGroundStations(req, res) {
  const stations = spaceopsRepo.getGroundStations();
  res.status(200).json({
    status: 'success',
    count: stations.length,
    data: stations,
  });
}

export function getGroundStationById(req, res) {
  const station = spaceopsRepo.getGroundStationById(req.params.id);
  if (!station) {
    return res.status(404).json({
      status: 'fail',
      error: { code: 'GROUND_STATION_NOT_FOUND', message: `Station ${req.params.id} not found.` },
    });
  }

  const upcomingPasses = spaceopsRepo.getPasses({ groundStationId: station.id });

  res.status(200).json({
    status: 'success',
    data: {
      ...station,
      upcomingPasses,
    },
  });
}
