import { DateTime } from 'luxon'

export default class DateProvider {
  public date: DateTime
  constructor(date: DateTime = DateTime.now()) {
    this.date = date
  }

  public toSQL(): string {
    const dateToSQL: string | null = this.date.toSQL()
    if (!dateToSQL) {
      throw new Error('Invalid date')
    }
    return dateToSQL
  }
}
