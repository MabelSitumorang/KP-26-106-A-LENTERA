/**
 * utils/formatters.js — Data Formatting Utilities
 *
 * Pure helper functions for formatting and transforming data for display.
 * These functions are stateless, have no side effects, and should be
 * easy to unit test independently.
 *
 * Dependency: Day.js — https://day.js.org/
 * Install: included in package.json as "dayjs"
 *
 * Categories:
 *  - Date/Time formatting
 *  - Currency formatting (IDR - Indonesian Rupiah)
 *  - Number formatting
 *  - String utilities
 *  - Percentage/Ratio formatting
 */

// import dayjs from 'dayjs'
// import 'dayjs/locale/id'      // Indonesian locale
// import localizedFormat from 'dayjs/plugin/localizedFormat'
// dayjs.extend(localizedFormat)
// dayjs.locale('id')

// ─── Date & Time ─────────────────────────────────────────────────────────────

/**
 * Formats a date value into a localized Indonesian date string.
 * @param {string|Date|number} date - The date to format.
 * @param {string} [format='DD MMMM YYYY'] - Day.js format string.
 * @returns {string} - Formatted date string.
 * @example formatDate('2024-01-15') → '15 Januari 2024'
 */
export function formatDate(date, format = 'DD MMMM YYYY') {
  // TODO: Implement using dayjs
  // return dayjs(date).format(format)
  throw new Error('formatDate() is not yet implemented.')
}

/**
 * Calculates the number of months between two dates.
 * Useful for computing tenure/masa kerja.
 * @param {string|Date} startDate
 * @param {string|Date} [endDate=new Date()]
 * @returns {number} - Number of months difference.
 */
export function monthsBetween(startDate, endDate = new Date()) {
  // TODO: Implement
  throw new Error('monthsBetween() is not yet implemented.')
}

// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Formats a number as Indonesian Rupiah currency.
 * @param {number} amount - The monetary amount.
 * @param {boolean} [showSymbol=true] - Whether to include 'Rp' prefix.
 * @returns {string} - Formatted currency string.
 * @example formatRupiah(1500000) → 'Rp 1.500.000'
 */
export function formatRupiah(amount, showSymbol = true) {
  // TODO: Implement
  // const formatted = new Intl.NumberFormat('id-ID').format(amount)
  // return showSymbol ? `Rp ${formatted}` : formatted
  throw new Error('formatRupiah() is not yet implemented.')
}

// ─── Numbers & Percentages ────────────────────────────────────────────────────

/**
 * Formats a decimal ratio as a percentage string.
 * @param {number} value - Decimal value (e.g., 0.85 for 85%).
 * @param {number} [decimals=1] - Number of decimal places.
 * @returns {string} - Formatted percentage string.
 * @example formatPercent(0.856, 1) → '85.6%'
 */
export function formatPercent(value, decimals = 1) {
  // TODO: Implement
  throw new Error('formatPercent() is not yet implemented.')
}

// ─── Strings ──────────────────────────────────────────────────────────────────

/**
 * Truncates a string to a maximum length and appends ellipsis.
 * @param {string} str - The input string.
 * @param {number} [maxLength=50] - Maximum character length.
 * @returns {string} - Truncated string.
 */
export function truncate(str, maxLength = 50) {
  // TODO: Implement
  throw new Error('truncate() is not yet implemented.')
}

/**
 * Capitalizes the first letter of each word (Title Case).
 * @param {string} str - The input string.
 * @returns {string} - Title-cased string.
 */
export function toTitleCase(str) {
  // TODO: Implement
  throw new Error('toTitleCase() is not yet implemented.')
}
