import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getHealthStatus } from '../src/services/health.service.js';

describe('Health Service', () => {
  test('returns operational status when database is unconfigured', () => {
    const { statusCode, data } = getHealthStatus();

    assert.equal(typeof statusCode, 'number');
    assert.equal(data.name, 'SpaceOps Backend API');
    assert.equal(typeof data.timestamp, 'string');
    assert.equal(typeof data.dependencies.database, 'object');
  });
});
