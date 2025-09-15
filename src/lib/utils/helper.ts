/**
 * Generates a random integer between min and max (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer between min and max.
 */
export function getRandomInt(max: number): number {
  const min = 1;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}