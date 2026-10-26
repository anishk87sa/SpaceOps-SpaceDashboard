import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getThreeMonthWindow,
  isDateInWindow,
  getMonthKeyForDate,
} from '../src/utils/dateWindow.js';

describe('Three-Month Date Window Utility', () => {
  test('dynamically calculates three-calendar-month window for current date', () => {
    const ref = new Date('2026-10-23T20:00:00.000Z');
    const window = getThreeMonthWindow(ref);

    assert.equal(window.startDate, '2026-10-01T00:00:00.000Z');
    assert.equal(window.endDateExclusive, '2027-01-01T00:00:00.000Z');
    assert.equal(window.months.length, 3);

    // Verify the three sequential months
    assert.equal(window.months[0].key, '2026-10');
    assert.equal(window.months[0].label, 'October 2026');

    assert.equal(window.months[1].key, '2026-11');
    assert.equal(window.months[1].label, 'November 2026');

    assert.equal(window.months[2].key, '2026-12');
    assert.equal(window.months[2].label, 'December 2026');

    assert.equal(window.windowLabel, 'October 2026 – December 2026');
  });

  test('includes first day of the current month (start boundary)', () => {
    const ref = new Date('2026-10-15T12:00:00.000Z');
    const window = getThreeMonthWindow(ref);

    const firstInstant = '2026-10-01T00:00:00.000Z';
    assert.equal(isDateInWindow(firstInstant, window), true);

    const slightlyEarlier = '2026-09-30T23:59:59.999Z';
    assert.equal(isDateInWindow(slightlyEarlier, window), false);
  });

  test('excludes first instant of the fourth month (end boundary)', () => {
    const ref = new Date('2026-10-15T12:00:00.000Z');
    const window = getThreeMonthWindow(ref);

    const lastInstant = '2026-12-31T23:59:59.999Z';
    assert.equal(isDateInWindow(lastInstant, window), true);

    const fourthMonthStart = '2027-01-01T00:00:00.000Z';
    assert.equal(isDateInWindow(fourthMonthStart, window), false);
  });

  test('handles December-to-January year transitions correctly', () => {
    const decRef = new Date('2026-12-15T10:00:00.000Z');
    const window = getThreeMonthWindow(decRef);

    assert.equal(window.startDate, '2026-12-01T00:00:00.000Z');
    assert.equal(window.endDateExclusive, '2027-03-01T00:00:00.000Z');

    assert.equal(window.months[0].key, '2026-12');
    assert.equal(window.months[0].label, 'December 2026');

    assert.equal(window.months[1].key, '2027-01');
    assert.equal(window.months[1].label, 'January 2027');

    assert.equal(window.months[2].key, '2027-02');
    assert.equal(window.months[2].label, 'February 2027');

    assert.equal(isDateInWindow('2027-01-15T00:00:00.000Z', window), true);
    assert.equal(isDateInWindow('2027-02-28T23:59:59.000Z', window), true);
    assert.equal(isDateInWindow('2027-03-01T00:00:00.000Z', window), false);
  });

  test('handles leap year transitions (February 29)', () => {
    const leapRef = new Date('2028-02-10T00:00:00.000Z');
    const window = getThreeMonthWindow(leapRef);

    assert.equal(window.startDate, '2028-02-01T00:00:00.000Z');
    assert.equal(window.endDateExclusive, '2028-05-01T00:00:00.000Z');

    assert.equal(window.months[0].key, '2028-02');
    assert.equal(window.months[0].label, 'February 2028');

    // Leap day must be included and assigned to February
    assert.equal(isDateInWindow('2028-02-29T23:59:59.000Z', window), true);
    assert.equal(getMonthKeyForDate('2028-02-29T23:59:59.000Z'), '2028-02');
  });

  test('correctly maps dates to their YYYY-MM month keys', () => {
    assert.equal(getMonthKeyForDate('2026-10-01T00:00:00.000Z'), '2026-10');
    assert.equal(getMonthKeyForDate('2026-10-31T23:59:59.999Z'), '2026-10');
    assert.equal(getMonthKeyForDate('2026-11-01T00:00:00.000Z'), '2026-11');
    assert.equal(getMonthKeyForDate('2026-12-31T23:59:59.000Z'), '2026-12');
    assert.equal(getMonthKeyForDate(null), null);
    assert.equal(getMonthKeyForDate('invalid-date'), null);
  });

  test('throws error for invalid reference date', () => {
    assert.throws(() => getThreeMonthWindow('invalid-date-string'), {
      message: /Invalid reference date/,
    });
  });
});
