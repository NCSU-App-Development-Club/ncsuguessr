type Coord = {
  latitude: number
  longitude: number
}

export const calculateDistance = (guess: Coord, correctLocation: Coord) => {
  const latDiff = Math.abs(guess.latitude - correctLocation.latitude)
  const lonDiff = Math.abs(guess.longitude - correctLocation.longitude)
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111
}
