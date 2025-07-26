export class Day {
  /**
   * NOTE: in javascript `Date`s, months are zero-indexed. This uses one-indexed months:
   * January is 1, ..., December is 12.
   * @param year full 4 digit year
   * @param month the month (January = 1, etc.)
   * @param day the day (1 - 31)
   */
  constructor(
    private readonly year: number,
    private readonly month: number,
    private readonly day: number
  ) {
    // TODO: throw on invalid Date
    if (isNaN(this.toDate().getTime())) {
      throw new Error('invalid date')
    }
  }

  static ofDate(date: Date): Day {
    // TODO: use UTC for all of these or not?
    return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  static ofEpochMillis(epochMillis: number): Day {
    return this.ofDate(new Date(epochMillis))
  }

  getYear(): number {
    return this.year
  }

  /**
   * WARNING: this returns a 1-indexed month (i.e. January = 1, etc.), but
   * javascript `Date`s use 0-indexed months (i.e. January = 0, etc.)
   */
  getMonth(): number {
    return this.month
  }

  getDay(): number {
    return this.day
  }

  toDate(): Date {
    const date = new Date(this.getYear(), this.getMonth() - 1, this.getDay())
    date.setHours(0, 0, 0, 0)
    return date
  }

  /**
   * Gets the date in YYYY-MM-DD format
   */
  toString(): string {
    return `${this.getYear()}-${this.getMonth().toString().padStart(2, '0')}-${this.getDay().toString().padStart(2, '0')}`
  }

  isEqual(other: Day): boolean {
    return (
      this.getYear() === other.getYear() &&
      this.getMonth() === other.getMonth() &&
      this.getDay() === other.getDay()
    )
  }

  // getWeekOfYear(): number {
  //   const MS_PER_DAY = 86400000 // Number of milliseconds in a day
  //   const DAYS_IN_WEEK = 7
  //   const THURSDAY = 4 // ISO week starts on Monday, Thursday is used for calculation

  //   // Copy date so we don't mutate the original
  //   const tempDate = new Date(this.date.getTime())

  //   // Set date to the nearest Thursday (ISO week calculation)
  //   const dayOfWeek = tempDate.getUTCDay() || DAYS_IN_WEEK // Sunday is 0, so treat as 7
  //   tempDate.setUTCDate(tempDate.getUTCDate() + THURSDAY - dayOfWeek)

  //   // Get the first day of the year
  //   const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1))

  //   // Calculate ISO week number
  //   const diffDays =
  //     Math.floor((tempDate.getTime() - yearStart.getTime()) / MS_PER_DAY) + 1
  //   return Math.ceil(diffDays / DAYS_IN_WEEK)
  // }

  /**
   * This is immutable, it creates and returns a new `Day` representing `days` days ago
   */
  minusDays(days: number): Day {
    const date = this.toDate()
    date.setDate(date.getDate() - days)
    return Day.ofDate(date)
  }

  toJSON(): number {
    return this.toDate().getTime()
  }

  static ofJSON(epochMillis: number): Day {
    return this.ofEpochMillis(epochMillis)
  }

  /**
   * Only well-defined for strings of the form YYYY-MM-DD
   * @param yyyyMmDd
   * @returns
   */
  static ofString(yyyyMmDd: string): Day {
    const [year, month, day] = yyyyMmDd.split('-').map(Number)
    if (
      !year ||
      !month ||
      !day ||
      yyyyMmDd.length !== 10 ||
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day)
    ) {
      throw new Error(`invalid date string: ${yyyyMmDd}`)
    }
    return new Day(year, month, day)
  }
}
