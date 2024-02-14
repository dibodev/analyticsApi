/**
 * Rounds a number to two decimal places.
 *
 * @param {number} num - The number to be rounded.
 * @returns {number} The rounded number with two decimal places.
 */
export const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2))
}

/**
 * Calculates the percentage of a partial value in relation to a total value.
 *
 * @param {number} partialValue - The partial value.
 * @param {number} totalValue - The total value.
 * @returns {number} The calculated percentage, rounded to two decimal places.
 */
export const calculatePercentage = (partialValue: number, totalValue: number): number => {
  return roundToTwoDecimals((partialValue / totalValue) * 100)
}

/**
 * Calculates the percentage difference between two numbers.
 *
 * @param {number} current - The current value.
 * @param {number} previous - The previous value.
 * @returns {number} The percentage difference between the current and previous values.
 */
export const calculatePercentageDifference = (current: number, previous: number): number => {
  const difference = current - previous
  return previous > 0 ? calculatePercentage(difference, previous) : 0
}
