import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isValidTle,
  parseOrbitalElements,
  propagatePosition,
  calculateOrbitalTrajectory,
  extractOrbitalCharacteristics,
} from '../src/services/orbitalCalculation.service.js';

describe('SGP4 Orbital Calculation Engine', () => {
  const ISS_TLE_LINE1 = '1 25544U 98067A   26296.69304404  .00008515  00000+0  16237-3 0  9995';
  const ISS_TLE_LINE2 = '2 25544  51.6336  24.1765 0006871 300.7285  59.3026 15.49021515591674';

  it('validates genuine Two-Line Element (TLE) sets correctly', () => {
    assert.strictEqual(isValidTle(ISS_TLE_LINE1, ISS_TLE_LINE2), true);
    assert.strictEqual(isValidTle('', ISS_TLE_LINE2), false);
    assert.strictEqual(isValidTle(null, undefined), false);
    assert.strictEqual(isValidTle('Invalid line 1', 'Invalid line 2'), false);
    assert.strictEqual(isValidTle('1 1234', '2 1234'), false); // Too short
  });

  it('parses genuine TLE into a valid satellite record', () => {
    const satrec = parseOrbitalElements(ISS_TLE_LINE1, ISS_TLE_LINE2);
    assert.ok(satrec);
    assert.strictEqual(satrec.error, 0);
    assert.strictEqual(Number(satrec.satnum), 25544);
  });

  it('rejects malformed orbital elements without crashing', () => {
    const satrec = parseOrbitalElements('1 99999U MALFORMED', '2 99999 NOTVALID');
    assert.strictEqual(satrec, null);
  });

  it('extracts accurate orbital characteristics from satrec', () => {
    const satrec = parseOrbitalElements(ISS_TLE_LINE1, ISS_TLE_LINE2);
    const chars = extractOrbitalCharacteristics(satrec);

    assert.ok(chars);
    // ISS inclination is ~51.63 degrees
    assert.ok(chars.inclinationDeg > 51.0 && chars.inclinationDeg < 52.0);
    // ISS period is ~92.9 minutes
    assert.ok(chars.periodMinutes > 90.0 && chars.periodMinutes < 95.0);
    // ISS eccentricity is near circular (< 0.01)
    assert.ok(chars.eccentricity < 0.01);
    // ISS altitude is in LEO range (~400-440 km)
    assert.ok(chars.perigeeKm > 380 && chars.perigeeKm < 450);
    assert.ok(chars.apogeeKm > 400 && chars.apogeeKm < 460);
  });

  it('propagates ISS position with genuine geodetic coordinates, altitude, and velocity', () => {
    const satrec = parseOrbitalElements(ISS_TLE_LINE1, ISS_TLE_LINE2);
    const now = new Date('2026-10-24T12:00:00Z');
    const pos = propagatePosition(satrec, now);

    assert.ok(pos, 'Propagation result should be defined');
    assert.strictEqual(pos.isValid, true);

    // Latitude must be within inclination bounds [-52, 52]
    assert.ok(pos.latitude >= -52.0 && pos.latitude <= 52.0, `Latitude ${pos.latitude} out of inclination bounds`);

    // Longitude must be within geographic bounds [-180, 180]
    assert.ok(pos.longitude >= -180.0 && pos.longitude <= 180.0, `Longitude ${pos.longitude} out of bounds`);

    // Altitude in km should be typical LEO for ISS (~400-440 km)
    assert.ok(pos.altitudeKm > 390 && pos.altitudeKm < 460, `Altitude ${pos.altitudeKm} km out of realistic ISS range`);

    // Velocity in km/s should be standard orbital velocity (~7.6 - 7.7 km/s)
    assert.ok(pos.velocityKmS > 7.4 && pos.velocityKmS < 7.9, `Velocity ${pos.velocityKmS} km/s out of orbital velocity range`);

    // Position ECF coordinates must be populated
    assert.ok(pos.positionEcf);
    assert.ok(isFinite(pos.positionEcf.x));
    assert.ok(isFinite(pos.positionEcf.y));
    assert.ok(isFinite(pos.positionEcf.z));
  });

  it('generates smooth orbital trajectory over one complete orbit', () => {
    const satrec = parseOrbitalElements(ISS_TLE_LINE1, ISS_TLE_LINE2);
    const now = new Date('2026-10-24T12:00:00Z');
    const trajectory = calculateOrbitalTrajectory(satrec, now, 60);

    assert.ok(Array.isArray(trajectory));
    assert.ok(trajectory.length > 50, `Trajectory points count ${trajectory.length} should be > 50`);

    // Every sampled point must have finite, valid coordinates
    trajectory.forEach((pt, idx) => {
      assert.ok(isFinite(pt.latitude), `Point ${idx} latitude must be finite`);
      assert.ok(isFinite(pt.longitude), `Point ${idx} longitude must be finite`);
      assert.ok(isFinite(pt.altitudeKm), `Point ${idx} altitude must be finite`);
      assert.ok(pt.altitudeKm > 300, `Point ${idx} altitude must be above atmosphere`);
    });
  });

  it('gracefully handles outdated or unpropagatable dates without throwing', () => {
    const satrec = parseOrbitalElements(ISS_TLE_LINE1, ISS_TLE_LINE2);
    // Invalid date object
    const badDate = new Date('invalid-date');
    const result = propagatePosition(satrec, badDate);
    assert.strictEqual(result, null);
  });
});
