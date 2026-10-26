import * as satellite from 'satellite.js';
import * as Cesium from 'cesium';

/**
 * SpaceOps - Client-Side Orbital Propagation Service
 * Performs high-frequency, real-time SGP4 orbital propagation directly in the browser
 * for buttery-smooth 60fps Earth tracking and time scrub interaction without backend latency.
 */

// Satrec cache keyed by NORAD ID to avoid repeated parsing
const satrecCache = new Map();

/**
 * Get or parse satrec for a satellite record
 * @param {object} sat
 * @returns {object|null}
 */
export function getOrCreateSatrec(sat) {
  if (!sat || !sat.tleLine1 || !sat.tleLine2) return null;

  const key = sat.noradId || sat.id;
  if (satrecCache.has(key)) {
    return satrecCache.get(key);
  }

  try {
    const l1 = sat.tleLine1.trim();
    const l2 = sat.tleLine2.trim();
    if (!l1.startsWith('1 ') || !l2.startsWith('2 ')) return null;

    const satrec = satellite.twoline2satrec(l1, l2);
    if (satrec && !satrec.error) {
      satrecCache.set(key, satrec);
      return satrec;
    }
  } catch (err) {
    // Malformed TLE
  }
  return null;
}

/**
 * Propagate a satellite to an exact timestamp and compute both geodetic and Cesium Cartesian3 coordinates
 * @param {object} sat
 * @param {Date} [time=new Date()]
 * @returns {object|null}
 */
export function propagateSatellite(sat, time = new Date()) {
  const satrec = getOrCreateSatrec(sat);
  if (!satrec) return null;

  try {
    const date = time instanceof Date ? time : new Date(time);
    const pv = satellite.propagate(satrec, date);
    const posEci = pv?.position;
    const velEci = pv?.velocity;

    if (
      !posEci ||
      !velEci ||
      !isFinite(posEci.x) ||
      !isFinite(posEci.y) ||
      !isFinite(posEci.z)
    ) {
      return null;
    }

    const gmst = satellite.gstime(date);
    const geodetic = satellite.eciToGeodetic(posEci, gmst);

    const latDeg = satellite.degreesLat(geodetic.latitude);
    const lonDeg = satellite.degreesLong(geodetic.longitude);
    const altKm = geodetic.height; // in km

    if (!isFinite(latDeg) || !isFinite(lonDeg) || !isFinite(altKm)) {
      return null;
    }

    // Velocity magnitude in km/s
    const velocityKmS = Math.sqrt(
      velEci.x * velEci.x + velEci.y * velEci.y + velEci.z * velEci.z
    );

    // Convert to Cesium Cartesian3 (note Cesium expects height in METERS)
    const altMeters = altKm * 1000;
    const cartesian3 = Cesium.Cartesian3.fromDegrees(lonDeg, latDeg, altMeters);

    return {
      latitude: Number(latDeg.toFixed(4)),
      longitude: Number(lonDeg.toFixed(4)),
      altitudeKm: Number(altKm.toFixed(2)),
      velocityKmS: Number(velocityKmS.toFixed(2)),
      cartesian3,
      calculatedAt: date.toISOString(),
      isValid: true,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Calculate sampled 3D orbital trajectory across one full orbital period
 * @param {object} sat
 * @param {Date} [centerTime=new Date()]
 * @param {number} [samples=120]
 * @returns {Array<Cesium.Cartesian3>} array of Cartesian3 positions for Cesium Polyline
 */
export function calculateOrbitTrajectoryPositions(sat, centerTime = new Date(), samples = 120) {
  const satrec = getOrCreateSatrec(sat);
  if (!satrec) return [];

  const radPerMin = satrec.no || 0.06;
  const meanMotionRevsPerDay = (radPerMin * 1440) / (2 * Math.PI);
  const periodMinutes = meanMotionRevsPerDay > 0 ? 1440 / meanMotionRevsPerDay : 95;
  const periodMs = periodMinutes * 60 * 1000;

  // We sample from -0.1 period to +0.9 period for past trail + forward trajectory
  const startTime = centerTime.getTime() - periodMs * 0.15;
  const stepMs = periodMs / samples;

  const positions = [];

  for (let i = 0; i <= samples; i++) {
    const t = new Date(startTime + i * stepMs);
    const prop = propagateSatellite(sat, t);
    if (prop && prop.cartesian3) {
      positions.push(prop.cartesian3);
    }
  }

  return positions;
}

/**
 * Derives satellite orbital parameters (inclination, period, apogee, perigee, etc.)
 * @param {object} sat
 * @returns {object}
 */
export function getSatelliteOrbitalElements(sat) {
  const satrec = getOrCreateSatrec(sat);
  if (!satrec) {
    return {
      inclinationDeg: sat?.inclinationDeg || 0,
      eccentricity: 0,
      periodMinutes: sat?.periodMinutes || 0,
      apogeeKm: sat?.altitudeKm || 0,
      perigeeKm: sat?.altitudeKm || 0,
    };
  }

  const radPerMin = satrec.no;
  const meanMotionRevsPerDay = (radPerMin * 1440) / (2 * Math.PI);
  const periodMinutes = meanMotionRevsPerDay > 0 ? 1440 / meanMotionRevsPerDay : 0;
  const inclinationDeg = (satrec.inclo * 180) / Math.PI;
  const eccentricity = satrec.ecco;

  const nRadPerSec = radPerMin / 60;
  let apogeeKm = 0;
  let perigeeKm = 0;
  if (nRadPerSec > 0) {
    const semiMajorAxisKm = Math.cbrt(398600.4418 / (nRadPerSec * nRadPerSec));
    apogeeKm = semiMajorAxisKm * (1 + eccentricity) - 6378.137;
    perigeeKm = semiMajorAxisKm * (1 - eccentricity) - 6378.137;
  }

  return {
    inclinationDeg: Number(inclinationDeg.toFixed(2)),
    eccentricity: Number(eccentricity.toFixed(6)),
    periodMinutes: Number(periodMinutes.toFixed(1)),
    apogeeKm: Math.round(Math.max(0, apogeeKm)),
    perigeeKm: Math.round(Math.max(0, perigeeKm)),
  };
}

/**
 * Clear pre-parsed satrec cache (useful on major catalog refresh)
 */
export function clearSatrecCache() {
  satrecCache.clear();
}
