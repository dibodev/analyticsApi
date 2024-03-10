import { DateTime } from 'luxon'

/**
 * Class representing a Date Provider.
 * @class
 */
export default class DateProvider {
  public date: DateTime
  constructor(date: DateTime = DateTime.now()) {
    this.date = date
  }

  /**
   * Converts the given date to a SQL-formatted string.
   *
   * @throws {Error} - If the date is invalid.
   *
   * @returns {string} - The SQL formatted date.
   */
  public toSQL(): string {
    const dateToSQL: string | null = this.date.toSQL()
    if (!dateToSQL) {
      throw new Error('Invalid date')
    }
    return dateToSQL
  }

  /**
   * Converts the date to a formatted string.
   *
   * @returns {string} The formatted date string in 'yyyy-MM-dd HH:mm:ss' format.
   */
  public toFormattedString(): string {
    return this.date.toFormat('yyyy-MM-dd HH:mm:ss')
  }
}
