import { describe, it } from 'node:test';
import assert from 'node:assert';
import { celestrakService } from '../src/services/celestrak.service.js';
import app from '../src/app.js';

describe('Satellites Data Pipeline & API Endpoints', () => {
  it('parses multi-satellite TLE text streams accurately', () => {
    const rawTle = `
ISS (ZARYA)
1 25544U 98067A   26296.69304404  .00008515  00000+0  16237-3 0  9995
2 25544  51.6336  24.1765 0006871 300.7285  59.3026 15.49021515591674
CSS (TIANGONG)
1 48274U 21035A   26296.51860260  .00015694  00000+0  21319-3 0  9997
2 48274  41.4728  71.9312 0004128 206.5123 153.5670 15.58981423312985
    `;

    const parsed = celestrakService.parseTleText(rawTle, 'stations', 'Space Stations');
    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].noradId, 25544);
    assert.strictEqual(parsed[0].name, 'ISS (ZARYA)');
    assert.strictEqual(parsed[0].category, 'stations');
    assert.strictEqual(parsed[1].noradId, 48274);
    assert.strictEqual(parsed[1].name, 'CSS (TIANGONG)');
  });

  it('correctly classifies satellites into aerospace domain categories', () => {
    assert.strictEqual(celestrakService.detectCategory('ISS (ZARYA)', 25544), 'stations');
    assert.strictEqual(celestrakService.detectCategory('NOAA 20', 43013), 'weather');
    assert.strictEqual(celestrakService.detectCategory('NAVSTAR 81', 46826), 'navigation');
    assert.strictEqual(celestrakService.detectCategory('LANDSAT 9', 49260), 'earth_observation');
    assert.strictEqual(celestrakService.detectCategory('HUBBLE SPACE TELESCOPE', 20580), 'science');
    assert.strictEqual(celestrakService.detectCategory('STARLINK-1007', 44713), 'communications');
  });

  it('retrieves normalized satellite catalog with caching and fallback', async () => {
    const result = await celestrakService.getSatellites({ limit: 10 });
    assert.ok(result);
    assert.ok(Array.isArray(result.satellites));
    assert.ok(result.satellites.length > 0);
    assert.ok(result.totalCount > 0);
    assert.ok(result.source);
    assert.ok(result.lastUpdated);

    // Verify first satellite record structure
    const sat = result.satellites[0];
    assert.ok(sat.noradId);
    assert.ok(sat.name);
    assert.ok(sat.tleLine1);
    assert.ok(sat.tleLine2);
    assert.ok(sat.category);
    assert.ok(sat.categoryLabel);
  });

  it('retrieves single satellite by NORAD ID', async () => {
    const iss = await celestrakService.getSatelliteByNoradId(25544);
    assert.ok(iss);
    assert.strictEqual(iss.noradId, 25544);
    assert.ok(iss.name.includes('ISS'));
  });

  it('provides category breakdown with populated counts', async () => {
    const categories = await celestrakService.getCategories();
    assert.ok(Array.isArray(categories));
    assert.ok(categories.length >= 6);

    const stationsCat = categories.find((c) => c.id === 'stations');
    assert.ok(stationsCat);
    assert.ok(stationsCat.count > 0);
  });

  it('reports operational health status and telemetry freshness', () => {
    const status = celestrakService.getStatus();
    assert.ok(status);
    assert.ok(typeof status.isAvailable === 'boolean');
    assert.ok(status.activeSource);
  });
});
