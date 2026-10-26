import * as satellite from 'satellite.js';

/**
 * SpaceOps - Orbital Calculation Engine
 * High-precision SGP4 orbital propagation, coordinate transformations, and trajectory sampling.
 * Built on satellite.js with full validation and aerospace unit normalization.
 */

// Earth gravitational parameter (km^3/s^2) and equatorial radius (km)
const MU_EARTH = 398600.4418;
const EARTH_RADIUS_KM = 6378.137;

/**
 * Validates TLE strings
 * @param {string} line1
 * @param {string} line2
 * @returns {boolean}
 */
export function isValidTle(line1, line2) {
  if (!line1 || !line2) return false;
  const l1 = line1.trim();
  const l2 = line2.trim();
  if (l1.length < 60 || l2.length < 60) return false;
  if (!l1.startsWith('1 ') || !l2.startsWith('2 ')) return false;
  return true;
}

/**
 * Parses and validates orbital elements into a satellite record
 * @param {string} line1
 * @param {string} line2
 * @returns {object|null}
 */
export function parseOrbitalElements(line1, line2) {
  if (!isValidTle(line1, line2)) {
    return null;
  }
  try {
    const satrec = satellite.twoline2satrec(line1.trim(), line2.trim());
    if (!satrec || satrec.error) {
      return null;
    }
    return satrec;
  } catch (error) {
    return null;
  }
}

/**
 * Derives orbital characteristics from a satrec record
 * @param {object} satrec
 * @returns {object}
 */
export function extractOrbitalCharacteristics(satrec) {
  if (!satrec || satrec.error) {
    return {
      inclinationDeg: 0,
      eccentricity: 0,
      periodMinutes: 0,
      meanMotionRevsPerDay: 0,
      apogeeKm: 0,
      perigeeKm: 0,
      raanDeg: 0,
    };
  }

  // Mean motion in radians/minute to revs/day
  const radPerMin = satrec.no;
  const meanMotionRevsPerDay = (radPerMin * 1440) / (2 * Math.PI);
  const periodMinutes = meanMotionRevsPerDay > 0 ? 1440 / meanMotionRevsPerDay : 0;

  // Inclination in degrees
  const inclinationDeg = (satrec.inclo * 180) / Math.PI;

  // Eccentricity
  const eccentricity = satrec.ecco;

  // Right Ascension of Ascending Node in degrees
  const raanDeg = (satrec.nodeo * 180) / Math.PI;

  // Semi-major axis calculation (km)
  // n in rad/s: satrec.no / 60
  const nRadPerSec = radPerMin / 60;
  let apogeeKm = 0;
  let perigeeKm = 0;
  if (nRadPerSec > 0) {
    const semiMajorAxisKm = Math.cbrt(MU_EARTH / (nRadPerSec * nRadPerSec));
    apogeeKm = semiMajorAxisKm * (1 + eccentricity) - EARTH_RADIUS_KM;
    perigeeKm = semiMajorAxisKm * (1 - eccentricity) - EARTH_RADIUS_KM;
  }

  return {
    inclinationDeg: Number(inclinationDeg.toFixed(4)),
    eccentricity: Number(eccentricity.toFixed(7)),
    periodMinutes: Number(periodMinutes.toFixed(2)),
    meanMotionRevsPerDay: Number(meanMotionRevsPerDay.toFixed(4)),
    apogeeKm: Math.round(Math.max(0, apogeeKm)),
    perigeeKm: Math.round(Math.max(0, perigeeKm)),
    raanDeg: Number(raanDeg.toFixed(4)),
  };
}

/**
 * Propagate a satellite to an exact timestamp and convert coordinates to Earth-fixed geodetic
 * @param {object} satrec - pre-parsed satrec object
 * @param {Date} [time=new Date()] - target simulation time
 * @returns {object|null}
 */
export function propagatePosition(satrec, time = new Date()) {
  if (!satrec || satrec.error) return null;

  try {
    const targetDate = time instanceof Date ? time : new Date(time);
    if (isNaN(targetDate.getTime())) return null;

    const positionAndVelocity = satellite.propagate(satrec, targetDate);
    const positionEci = positionAndVelocity?.position;
    const velocityEci = positionAndVelocity?.velocity;

    // Check validity of propagation results
    if (
      !positionEci ||
      !velocityEci ||
      !isFinite(positionEci.x) ||
      !isFinite(positionEci.y) ||
      !isFinite(positionEci.z) ||
      !isFinite(velocityEci.x) ||
      !isFinite(velocityEci.y) ||
      !isFinite(velocityEci.z)
    ) {
      return null;
    }

    // Greenwich Mean Sidereal Time for Earth rotation transformation
    const gmst = satellite.gstime(targetDate);

    // ECI (Inertial) to Geodetic (Earth-Fixed)
    const geodetic = satellite.eciToGeodetic(positionEci, gmst);
    const latitude = satellite.degreesLat(geodetic.latitude);
    const longitude = satellite.degreesLong(geodetic.longitude);
    const altitude = geodetic.height; // in km

    if (!isFinite(latitude) || !isFinite(longitude) || !isFinite(altitude)) {
      return null;
    }

    // Velocity magnitude in km/s
    const velocity = Math.sqrt(
      velocityEci.x * velocityEci.x +
      velocityEci.y * velocityEci.y +
      velocityEci.z * velocityEci.z
    );

    // Earth-Centered Fixed (ECF) coordinates for 3D visualization
    const ecf = satellite.eciToEcf(positionEci, gmst);

    return {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      altitudeKm: Number(altitude.toFixed(3)),
      velocityKmS: Number(velocity.toFixed(3)),
      velocityComponents: {
        x: Number(velocityEci.x.toFixed(3)),
        y: Number(velocityEci.y.toFixed(3)),
        z: Number(velocityEci.z.toFixed(3)),
      },
      positionEcf: ecf ? {
        x: Number(ecf.x.toFixed(3)),
        y: Number(ecf.y.toFixed(3)),
        z: Number(ecf.z.toFixed(3)),
      } : null,
      calculatedAt: targetDate.toISOString(),
      isValid: true,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Propagates an orbital trajectory across a complete orbit period
 * @param {object} satrec - parsed satrec object
 * @param {Date} [centerTime=new Date()]
 * @param {number} [samples=90] - number of discrete sample points
 * @returns {Array<object>} array of sample points
 */
export function calculateOrbitalTrajectory(satrec, centerTime = new Date(), samples = 90) {
  if (!satrec || satrec.error) return [];

  const characteristics = extractOrbitalCharacteristics(satrec);
  const periodMinutes = characteristics.periodMinutes || 95;
  const periodMs = periodMinutes * 60 * 1000;
  const startTime = centerTime.getTime() - periodMs * 0.2; // 20% in the past
  const stepMs = periodMs / samples;

  const trajectory = [];

  for (let i = 0; i <= samples; i++) {
    const t = new Date(startTime + i * stepMs);
    const pos = propagatePosition(satrec, t);
    if (pos) {
      trajectory.push({
        latitude: pos.latitude,
        longitude: pos.longitude,
        altitudeKm: pos.altitudeKm,
        velocityKmS: pos.velocityKmS,
        positionEcf: pos.positionEcf,
        timestamp: t.toISOString(),
      });
    }
  }

  return trajectory;
}

export const orbitalEngine = {
  isValidTle,
  parseOrbitalElements,
  extractOrbitalCharacteristics,
  propagatePosition,
  calculateOrbitalTrajectory,
};

export default orbitalEngine;
