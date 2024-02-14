export default class AnalyticsUtilityService {
  /**
   * Calculates the percentage of a part relative to a whole.
   * @param {number} part - The part value.
   * @param {number} whole - The whole value.
   * @return {number} The percentage value.
   */
  public static calculatePercentage(part: number, whole: number): number {
    if (whole === 0) return 0
    return (part / whole) * 100
  }

  /**
   * Calculates the percentage difference between two values.
   * @param {number} currentValue - The current value.
   * @param {number} previousValue - The previous value.
   * @return {number} The percentage difference.
   */
  public static calculatePercentageDifference(currentValue: number, previousValue: number): number {
    if (previousValue === 0) {
      return currentValue !== 0 ? Infinity : 0
    }
    return ((currentValue - previousValue) / previousValue) * 100
  }

  /**
   * Rounds a number to two decimal places.
   * @param {number} num - The number to round.
   * @return {number} The rounded number.
   */
  public static roundToTwoDecimals(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
