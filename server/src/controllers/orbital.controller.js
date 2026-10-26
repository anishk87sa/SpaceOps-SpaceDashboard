import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getOrbitalVisualizationData(req, res) {
  try {
    const satellites = spaceopsRepo.getSatellites();

    // Convert geodetic & orbital parameters into 3D renderable paths and points for public education
    const orbitalObjects = satellites.map((sat, idx) => {
      const pointsCount = 64;
      const path = [];
      const earthRadius = 6371; // km
      const scaledR = (earthRadius + sat.altitudeKm) / 3000;
      const incRad = (sat.inclinationDeg * Math.PI) / 180;
      const raanRad = (idx * 60 * Math.PI) / 180;

      for (let i = 0; i <= pointsCount; i++) {
        const theta = (i / pointsCount) * Math.PI * 2;
        const xOrb = scaledR * Math.cos(theta);
        const yOrb = scaledR * Math.sin(theta);

        const x = xOrb * Math.cos(raanRad) - yOrb * Math.cos(incRad) * Math.sin(raanRad);
        const z = xOrb * Math.sin(raanRad) + yOrb * Math.cos(incRad) * Math.cos(raanRad);
        const y = yOrb * Math.sin(incRad);

        path.push([Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))]);
      }

      const currentPoint = path[Math.floor((Date.now() / 3000 + idx * 10) % pointsCount)];

      return {
        id: sat.id,
        name: sat.name,
        noradId: sat.noradId,
        designator: sat.designator,
        type: sat.type,
        orbitType: sat.orbitType,
        status: sat.status,
        altitudeKm: sat.altitudeKm,
        velocityKmS: sat.velocityKmS,
        inclinationDeg: sat.inclinationDeg,
        periodMinutes: sat.periodMinutes,
        coordinates: sat.coordinates,
        position3D: currentPoint,
        orbitPath: path,
        color: '#38BDF8',
        tle: sat.tle,
      };
    });

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        objects: orbitalObjects,
        groundStations: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate orbital visualization data',
      error: error.message
    });
  }
}
