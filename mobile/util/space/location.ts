import { LatLng } from 'react-native-maps'
import { Distance } from './distance'

export class Coordinate {
  constructor(
    private latitude: number,
    private longitude: number
  ) {}

  distance(other: Coordinate): Distance {
    // haversine function implementation

    const EARTH_RADIUS = 6371000 // Earth's radius in meters
    const toRadians = (degrees: number) => degrees * (Math.PI / 180)

    const lat1Rad = toRadians(this.latitude)
    const lat2Rad = toRadians(other.latitude)
    const deltaLat = toRadians(other.latitude - this.latitude)
    const deltaLon = toRadians(other.longitude - this.longitude)

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distanceMeters = EARTH_RADIUS * c

    return Distance.ofMeters(distanceMeters)
  }

  getLatitude(): number {
    return this.latitude
  }

  getLongitude(): number {
    return this.longitude
  }

  static ofObject(latLng: { latitude: number; longitude: number }): Coordinate {
    return new Coordinate(latLng.latitude, latLng.longitude)
  }

  toJSON() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }
}
