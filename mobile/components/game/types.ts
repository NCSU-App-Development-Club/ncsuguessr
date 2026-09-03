import { Coordinate } from '../../util/space/location'

export interface MapPressEvent {
  nativeEvent: {
    coordinate: {
      latitude: number
      longitude: number
    }
  }
}

export interface GameMapProps {
  guessMarker: Coordinate | null
  onPress: (event: MapPressEvent) => void
  allowedPolygon?: { latitude: number; longitude: number }[]
}

export interface GameFinishedMapProps {
  userGuess: Coordinate
  actualLocation: Coordinate | null
}
