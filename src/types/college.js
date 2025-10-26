/**
 * @typedef {Object} College
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} state
 * @property {string} city
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} established
 * @property {string[]} courses
 * @property {string} [website]
 */

/**
 * @typedef {Object} UserLocation
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [state]
 */

/**
 * @typedef {College & {distance: number, travelTime: number}} CollegeWithDistance
 */

export {};
