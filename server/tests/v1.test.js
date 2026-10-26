import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spaceopsRepo } from '../src/repositories/spaceops.repository.js';
import { signToken } from '../src/middleware/auth.middleware.js';

describe('SpaceOps Public API & Repositories', () => {
  test('returns verified active and completed space missions', () => {
    const missions = spaceopsRepo.getMissions();
    assert.ok(missions.length >= 6);
    
    // Check specific flagship missions
    const clipper = missions.find(m => m.slug === 'europa-clipper');
    assert.ok(clipper);
    assert.equal(clipper.name, 'Europa Clipper');
    assert.equal(clipper.status, 'active');
    assert.ok(clipper.objectives.length > 0);

    const jwst = missions.find(m => m.slug === 'james-webb-space-telescope');
    assert.ok(jwst);
    assert.equal(jwst.category, 'Space Telescopes');
  });

  test('filters missions by destination and category', () => {
    const marsMissions = spaceopsRepo.getMissions({ destination: 'mars' });
    assert.ok(marsMissions.length >= 1);
    assert.equal(marsMissions[0].slug, 'mars-perseverance-rover');

    const lunarMissions = spaceopsRepo.getMissions({ category: 'Lunar' });
    assert.ok(lunarMissions.length >= 2);
  });

  test('returns upcoming rocket launches with launch providers and payloads', () => {
    const launches = spaceopsRepo.getLaunches({ type: 'upcoming' });
    assert.ok(launches.length >= 3);
    
    const starship = launches.find(l => l.slug.includes('starship'));
    assert.ok(starship);
    assert.equal(starship.launchProvider, 'SpaceX');
    assert.ok(starship.plannedLaunchDate);
    assert.equal(typeof starship.isDemonstrationSchedule, 'boolean');
  });

  test('returns spacecraft explorer assets with educational specifications', () => {
    const crafts = spaceopsRepo.getSpacecraft();
    assert.ok(crafts.length >= 5);

    const jwstCraft = crafts.find(c => c.slug === 'jwst-observatory');
    assert.ok(jwstCraft);
    assert.equal(jwstCraft.type, 'Space Telescope');
    assert.ok(jwstCraft.specifications.mirrorDiameterMeters);
  });

  test('returns destinations with educational facts and mission links', () => {
    const destinations = spaceopsRepo.getDestinations();
    assert.ok(destinations.length >= 5);

    const mars = destinations.find(d => d.slug === 'mars');
    assert.ok(mars);
    assert.equal(mars.name, 'Mars');
    assert.ok(mars.highlights.length > 0);
  });

  test('returns upcoming astronomical events and meteor showers', () => {
    const events = spaceopsRepo.getEvents();
    assert.ok(events.length >= 4);

    const perseids = events.find(e => e.eventType === 'Meteor Shower');
    assert.ok(perseids);
    assert.ok(perseids.viewingGuidance);
  });

  test('global multi-entity search returns relevant matches across types', () => {
    const searchMars = spaceopsRepo.globalSearch('Mars');
    assert.ok(searchMars.totalResults > 0);
    assert.ok(searchMars.results.missions.length >= 1);
    assert.ok(searchMars.results.spacecraft.length >= 1);
    assert.ok(searchMars.results.destinations.length >= 1);

    const searchWebb = spaceopsRepo.globalSearch('Webb');
    assert.ok(searchWebb.totalResults > 0);
    assert.ok(searchWebb.results.missions.some(m => m.title.includes('Webb')));
  });

  test('supports bookmarking personal space discoveries', () => {
    const item = {
      id: 'mis-europa-clipper',
      title: 'Europa Clipper',
      slug: 'europa-clipper',
      url: '/missions/europa-clipper',
      summary: 'NASA Flagship Mission'
    };

    const saved = spaceopsRepo.addBookmark('test-user-1', item);
    assert.ok(saved.id);
    assert.equal(saved.title, 'Europa Clipper');

    const bookmarks = spaceopsRepo.getUserBookmarks('test-user-1');
    assert.equal(bookmarks.length, 1);

    const removed = spaceopsRepo.removeBookmark('test-user-1', 'mis-europa-clipper');
    assert.equal(removed, true);
    assert.equal(spaceopsRepo.getUserBookmarks('test-user-1').length, 0);
  });

  test('generates valid JWT token for optional authenticated personalization', () => {
    const token = signToken({
      id: 'usr-enthusiast-1',
      email: 'enthusiast@spaceops.org',
      name: 'Space Enthusiast',
      role: 'User',
    });
    assert.equal(typeof token, 'string');
    assert.ok(token.split('.').length === 3);
  });
});
