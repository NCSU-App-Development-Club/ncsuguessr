export class Distance {
  private constructor(private meters: number) {}

  static ofMeters(meters: number): Distance {
    return new Distance(meters)
  }

  toMeters(): number {
    return this.meters
  }

  toKilometers(): number {
    const METERS_PER_KM = 1000
    return this.meters / METERS_PER_KM
  }

  toMiles(): number {
    const METERS_PER_MILE = 1609.344
    return this.meters / METERS_PER_MILE
  }

  static ofKilometers(kilometers: number): Distance {
    return new Distance(kilometers * 1000)
  }

  static ofMiles(miles: number): Distance {
    return new Distance(miles * 1609.344)
  }

  toJSON(): number {
    return this.meters
  }

  static ofJSON(meters: number): Distance {
    return Distance.ofMeters(meters)
  }

  add(other: Distance): Distance {
    return Distance.ofMeters(this.toMeters() + other.toMeters())
  }

  divide(num: number): Distance {
    return Distance.ofMeters(this.toMeters() / num)
  }

  /**
   * @returns a positive value if this Distance is greater than `other`, a negative value
   * if this Distance is less than `other`, and zero if they are the same
   */
  compareTo(other: Distance): number {
    return this.meters - other.meters
  }

  static infinity(): Distance {
    return Distance.ofMeters(Infinity)
  }

  valueOf(): number {
    return this.meters
  }
}
