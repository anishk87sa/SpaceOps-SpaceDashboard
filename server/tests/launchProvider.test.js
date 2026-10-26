import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { launchProviderService } from '../src/services/launchProvider.service.js';

describe('Launch Provider Service (Launch Library 2 Integration)', () => {
  const mockLL2Item = {
    id: 'test-uuid-001',
    slug: 'falcon-9-block-5-starlink-test-1',
    name: 'Falcon 9 Block 5 | Starlink Test 1',
    status: {
      id: 1,
      name: 'Go for Launch',
      abbrev: 'Go',
      description: 'Current T-0 confirmed by official sources.',
    },
    net: '2026-11-20T18:00:00Z',
    window_start: '2026-11-20T17:30:00Z',
    window_end: '2026-11-20T21:30:00Z',
    net_precision: {
      id: 0,
      name: 'Second',
    },
    probability: 85,
    weather_concerns: 'Thick clouds (15% violation)',
    launch_service_provider: {
      id: 121,
      name: 'SpaceX',
      type: 'Commercial',
    },
    rocket: {
      configuration: {
        id: 164,
        name: 'Falcon 9',
        family: 'Falcon',
        full_name: 'Falcon 9 Block 5',
        variant: 'Block 5',
      },
    },
    mission: {
      id: 999,
      name: 'Starlink Test Payload',
      description: 'Next-generation orbital communications constellation deployment.',
      type: 'Communications',
      orbit: {
        name: 'Low Earth Orbit',
        abbrev: 'LEO',
      },
    },
    pad: {
      id: 40,
      name: 'Space Launch Complex 40',
      latitude: '28.5619',
      longitude: '-80.5772',
      map_url: 'https://maps.google.com/?q=28.5619,-80.5772',
      location: {
        name: 'Cape Canaveral SFS, FL, USA',
        country_code: 'USA',
      },
    },
    webcast_live: false,
    vid_urls: [{ priority: 1, title: 'SpaceX Webcast', url: 'https://youtube.com/spacex' }],
    image: 'https://example.com/falcon9.jpg',
    last_updated: '2026-10-22T12:00:00Z',
  };

  test('normalizes raw LL2 item into standard SpaceOps Launch model', () => {
    const normalized = launchProviderService.normalizeLL2Launch(mockLL2Item);

    assert.equal(normalized.id, 'test-uuid-001');
    assert.equal(normalized.slug, 'falcon-9-block-5-starlink-test-1');
    assert.equal(normalized.name, 'Falcon 9 Block 5 | Starlink Test 1');
    assert.equal(normalized.launchProvider, 'SpaceX');
    assert.equal(normalized.providerType, 'Commercial');
    assert.equal(normalized.rocket.fullName, 'Falcon 9 Block 5');
    assert.equal(normalized.rocketFamily, 'Falcon');
    assert.equal(normalized.rocketVariant, 'Block 5');
    assert.equal(normalized.launchStatus, 'go');
    assert.equal(normalized.scheduleConfidence, 'Go for Launch');
    assert.equal(normalized.probability, 85);
    assert.equal(normalized.weatherConcerns, 'Thick clouds (15% violation)');
    assert.equal(normalized.payload, 'Starlink Test Payload');
    assert.equal(normalized.destination, 'Low Earth Orbit');
    assert.equal(normalized.destinationAbbrev, 'LEO');
    assert.equal(normalized.netPrecision, 'Second');
    assert.equal(normalized.launchDate, '2026-11-20T18:00:00Z');
    assert.equal(normalized.padDetails.name, 'Space Launch Complex 40');
    assert.equal(normalized.padDetails.latitude, 28.5619);
    assert.equal(normalized.padDetails.longitude, -80.5772);
    assert.equal(normalized.streamUrl, 'https://youtube.com/spacex');
    assert.equal(normalized.monthKey, '2026-11');
    assert.ok(normalized.sources.some((s) => s.name.includes('The Space Devs')));
  });

  test('handles missing optional fields gracefully without crashing', () => {
    const minimalItem = {
      id: 'minimal-1',
      name: 'Minimal Rocket',
      net: '2026-12-05T00:00:00Z',
    };

    const normalized = launchProviderService.normalizeLL2Launch(minimalItem);
    assert.equal(normalized.id, 'minimal-1');
    assert.equal(normalized.name, 'Minimal Rocket');
    assert.equal(normalized.launchDate, '2026-12-05T00:00:00Z');
    assert.equal(normalized.launchStatus, 'scheduled');
    assert.equal(normalized.launchProvider, 'Commercial Launch Provider');
    assert.equal(normalized.imageUrl, null);
    assert.equal(normalized.streamUrl, null);
    assert.equal(normalized.pad.latitude, null);
    assert.equal(normalized.pad.mapUrl, null);
    assert.equal(normalized.probability, null);
  });

  test('maps LL2 status codes accurately', () => {
    assert.equal(launchProviderService.mapStatusId({ id: 1 }).launchStatus, 'go');
    assert.equal(launchProviderService.mapStatusId({ id: 2 }).launchStatus, 'tbd');
    assert.equal(launchProviderService.mapStatusId({ id: 3 }).launchStatus, 'success');
    assert.equal(launchProviderService.mapStatusId({ id: 4 }).launchStatus, 'failed');
    assert.equal(launchProviderService.mapStatusId({ id: 5 }).launchStatus, 'hold');
    assert.equal(launchProviderService.mapStatusId({ id: 6 }).launchStatus, 'in_flight');
    assert.equal(launchProviderService.mapStatusId({ id: 7 }).launchStatus, 'partial_failure');
  });

  test('retrieves upcoming launches for rolling 3-month window with per-month counts', async () => {
    const res = await launchProviderService.getUpcomingLaunches();

    assert.equal(res.success, true);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.meta.windowStart);
    assert.ok(res.meta.windowEndExclusive);
    assert.equal(res.meta.months.length, 3);
    assert.ok(typeof res.meta.total === 'number');

    // Verify all returned launches strictly satisfy the 3-month interval
    const startMs = new Date(res.meta.windowStart).getTime();
    const endMs = new Date(res.meta.windowEndExclusive).getTime();

    for (const launch of res.data) {
      if (launch.launchDate) {
        const launchMs = new Date(launch.launchDate).getTime();
        assert.ok(launchMs >= startMs, `Launch ${launch.name} (${launch.launchDate}) is before window start ${res.meta.windowStart}`);
        assert.ok(launchMs < endMs, `Launch ${launch.name} (${launch.launchDate}) is on/after window end ${res.meta.windowEndExclusive}`);
      }
    }

    // Verify per-month counts add up to total dated launches
    const countedSum = res.meta.months.reduce((acc, m) => acc + m.count, 0);
    assert.equal(countedSum, res.meta.total);
  });

  test('filters rolling 3-month launches by specific month', async () => {
    const all = await launchProviderService.getUpcomingLaunches();
    const targetMonth = all.meta.months[0].key;

    const filtered = await launchProviderService.getUpcomingLaunches({ month: targetMonth });
    assert.equal(filtered.success, true);
    for (const launch of filtered.data) {
      assert.equal(launch.monthKey, targetMonth);
    }
  });

  test('filters launches by provider and search query', async () => {
    const res = await launchProviderService.getUpcomingLaunches({ provider: 'SpaceX' });
    assert.equal(res.success, true);
    for (const launch of res.data) {
      const p = (launch.launchProvider || launch.provider?.name || '').toLowerCase();
      assert.ok(p.includes('spacex'));
    }

    const searchRes = await launchProviderService.getUpcomingLaunches({ q: 'Starlink' });
    assert.equal(searchRes.success, true);
    for (const launch of searchRes.data) {
      const match =
        launch.name.toLowerCase().includes('starlink') ||
        (launch.payload || '').toLowerCase().includes('starlink') ||
        (launch.description || '').toLowerCase().includes('starlink');
      assert.ok(match);
    }
  });

  test('sorts launches chronologically with earliest first', async () => {
    const res = await launchProviderService.getUpcomingLaunches({ sort: 'date_asc' });
    assert.equal(res.success, true);

    for (let i = 0; i < res.data.length - 1; i++) {
      const curr = res.data[i].launchDate ? new Date(res.data[i].launchDate).getTime() : Infinity;
      const next = res.data[i + 1].launchDate ? new Date(res.data[i + 1].launchDate).getTime() : Infinity;
      assert.ok(curr <= next);
    }
  });

  test('retrieves single launch by slug or id', async () => {
    const listing = await launchProviderService.getUpcomingLaunches();
    assert.ok(listing.data.length > 0);
    const target = listing.data[0];

    const found = await launchProviderService.getLaunchBySlugOrId(target.slug);
    assert.ok(found);
    assert.equal(found.id, target.id);
    assert.equal(found.name, target.name);
  });
});
