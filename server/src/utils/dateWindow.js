/**
 * SpaceOps - Three-Month Date Window Utility
 *
 * Dynamically computes a rolling three-calendar-month window starting on
 * the first day of the current calendar month (00:00:00.000 UTC) and ending on
 * the first day of the fourth calendar month (00:00:00.000 UTC, exclusive).
 *
 * Example (October 2026):
 * - Start: October 1, 2026, 00:00:00.000 UTC
 * - End: January 1, 2027, 00:00:00.000 UTC (exclusive)
 * - Covered Months: October 2026, November 2026, December 2026
 */

/**
 * Calculates the dynamic three-month calendar window for any given reference date.
 *
 * @param {Date|string|number} [referenceDate=new Date()] Optional reference date (defaults to now)
 * @returns {Object} Three-month window details
 */
export function getThreeMonthWindow(referenceDate = new Date()) {
  const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

  if (isNaN(ref.getTime())) {
    throw new Error('Invalid reference date provided to getThreeMonthWindow');
  }

  const currentYear = ref.getUTCFullYear();
  const currentMonth = ref.getUTCMonth(); // 0-indexed (0 = Jan, 9 = Oct, 11 = Dec)

  // Start date: 1st day of the current calendar month at 00:00:00.000 UTC
  const startDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0));

  // End date (exclusive): 1st day of the 4th calendar month from current at 00:00:00.000 UTC
  // Note: JavaScript Date.UTC automatically handles month rollover into the next year(s)
  const endDateExclusive = new Date(Date.UTC(currentYear, currentMonth + 3, 1, 0, 0, 0, 0));

  // Generate metadata for each of the three calendar months in the window
  const months = [0, 1, 2].map((offset) => {
    const d = new Date(Date.UTC(currentYear, currentMonth + offset, 1, 0, 0, 0, 0));
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1; // 1-indexed
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const shortLabel = d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });

    return {
      key,
      year,
      month,
      label,
      shortLabel,
    };
  });

  const windowLabel = `${months[0].label} – ${months[2].label}`;

  return {
    startDate: startDate.toISOString(),
    endDateExclusive: endDateExclusive.toISOString(),
    startDateObj: startDate,
    endDateExclusiveObj: endDateExclusive,
    months,
    windowLabel,
  };
}

/**
 * Checks whether an ISO date string or Date object falls within the given window [startDate, endDateExclusive).
 *
 * @param {Date|string|number} dateInput
 * @param {Object} window Window object returned by getThreeMonthWindow
 * @returns {boolean}
 */
export function isDateInWindow(dateInput, window) {
  if (!dateInput) return false;
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return false;

  const startMs = window.startDateObj
    ? window.startDateObj.getTime()
    : new Date(window.startDate).getTime();
  const endMs = window.endDateExclusiveObj
    ? window.endDateExclusiveObj.getTime()
    : new Date(window.endDateExclusive).getTime();
  const targetMs = d.getTime();

  return targetMs >= startMs && targetMs < endMs;
}

/**
 * Returns the YYYY-MM key for any given date input in UTC.
 *
 * @param {Date|string|number} dateInput
 * @returns {string|null} Key in 'YYYY-MM' format or null if invalid
 */
export function getMonthKeyForDate(dateInput) {
  if (!dateInput) return null;
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}
