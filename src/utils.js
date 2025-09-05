/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Generates a random integer within a specified interval (inclusive).
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @returns {number} A random integer between min and max (inclusive).
 */
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    timer,
    randomIntFromInterval,
};
