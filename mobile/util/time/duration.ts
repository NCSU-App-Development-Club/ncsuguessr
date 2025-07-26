export class Duration {
  private constructor(private millis: number) {}

  static ofMillis(millis: number): Duration {
    return new Duration(millis)
  }

  toMillis(): number {
    return this.millis
  }

  static ofSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000)
  }

  toSeconds(): number {
    return this.millis / 1000
  }

  valueOf(): number {
    return this.millis
  }

  toJSON(): number {
    return this.millis
  }

  static ofJSON(millis: number): Duration {
    return this.ofMillis(millis)
  }

  add(other: Duration): Duration {
    return Duration.ofMillis(this.toMillis() + other.toMillis())
  }

  multiply(num: number): Duration {
    return Duration.ofMillis(this.toMillis() * num)
  }

  divide(num: number): Duration {
    if (num === 0) {
      throw new Error('attempted to divide a Duration by zero')
    }

    return Duration.ofMillis(this.toMillis() / num)
  }

  /**
   * @returns a positive value if this Duration is greater than `other`, a negative value
   * if this Duraiton is less than `other`, and zero if they are the same
   */
  compareTo(other: Duration): number {
    return this.toMillis() - other.toMillis()
  }

  static zero(): Duration {
    return Duration.ofSeconds(0)
  }

  static fromDates(dateA: Date, dateB: Date): Duration {
    return Duration.ofMillis(dateB.getTime() - dateA.getTime())
  }
}
