import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { astronautsProviderService } from '../src/services/astronautsProvider.service.js';
import { missionsProviderService } from '../src/services/missionsProvider.service.js';
import { newsProviderService } from '../src/services/newsProvider.service.js';
import { spacecraftProviderService } from '../src/services/spacecraftProvider.service.js';

describe('Astronauts & Real Space APIs Provider Integration', () => {
  it('retrieves live astronauts in orbit with space stations breakdown', async () => {
    const res = await astronautsProviderService.getAstronautsInSpace();
    assert.strictEqual(res.success, true);
    assert.ok(typeof res.totalInSpace === 'number' && res.totalInSpace > 0);
    assert.ok(res.stations && res.stations.iss);
    assert.ok(Array.isArray(res.astronauts));
    assert.ok(res.astronauts.length > 0);
    assert.strictEqual(res.astronauts[0].inSpace, true);
  });

  it('retrieves comprehensive astronauts directory with pagination and filters', async () => {
    const res = await astronautsProviderService.getAstronauts({ limit: 5 });
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.length > 0);

    const first = res.data[0];
    assert.ok(first.name);
    assert.ok(first.agency);
    assert.ok(first.nationality);
  });

  it('retrieves single astronaut by id or slug', async () => {
    const res = await astronautsProviderService.getAstronauts({ limit: 1 });
    const target = res.data[0];

    const byId = await astronautsProviderService.getAstronautByIdOrSlug(target.id);
    assert.ok(byId);
    assert.strictEqual(byId.name, target.name);

    const bySlug = await astronautsProviderService.getAstronautByIdOrSlug(target.slug);
    assert.ok(bySlug);
    assert.strictEqual(bySlug.name, target.name);
  });

  it('retrieves real API space exploration programs and missions on explore tab', async () => {
    const missions = await missionsProviderService.getMissions();
    assert.ok(Array.isArray(missions));
    assert.ok(missions.length > 10, 'Should include both curated and real LL2 programs');

    const realApiProg = missions.find((m) => m.isRealApi);
    assert.ok(realApiProg, 'Should include live API programs');
    assert.ok(realApiProg.name);
    assert.ok(realApiProg.description);
  });

  it('retrieves live space news articles with publishers and images', async () => {
    const news = await newsProviderService.getNews();
    assert.ok(Array.isArray(news));
    assert.ok(news.length > 0);

    const first = news[0];
    assert.ok(first.title || first.headline);
    assert.ok(first.summary);
    assert.ok(first.category);
  });

  it('retrieves live orbital spacecraft manifests', async () => {
    const craft = await spacecraftProviderService.getSpacecraft();
    assert.ok(Array.isArray(craft));
    assert.ok(craft.length > 10);

    const realCraft = craft.find((c) => c.isRealApi);
    assert.ok(realCraft, 'Should include live API spacecraft');
    assert.ok(realCraft.name);
  });
});
