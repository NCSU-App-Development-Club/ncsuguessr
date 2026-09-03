import React, { useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GameMapProps, MapPressEvent } from './types'

const blueIcon = new L.DivIcon({
  className: 'guess-marker',
  html: '<div style="background:#4285F4;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function MapEventsHandler({
  onPress,
  allowedPolygon,
}: {
  onPress: (event: MapPressEvent) => void
  allowedPolygon?: { latitude: number; longitude: number }[]
}) {
  const pointInPolygon = useCallback(
    (
      lat: number,
      lng: number,
      polygon: { latitude: number; longitude: number }[]
    ) => {
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].longitude
        const yi = polygon[i].latitude
        const xj = polygon[j].longitude
        const yj = polygon[j].latitude
        const intersect =
          yi > lat !== yj > lat &&
          lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
        if (intersect) inside = !inside
      }
      return inside
    },
    []
  )

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      if (allowedPolygon && !pointInPolygon(lat, lng, allowedPolygon)) {
        return
      }
      onPress({
        nativeEvent: {
          coordinate: {
            latitude: lat,
            longitude: lng,
          },
        },
      })
    },
  })

  return null
}

const GameMap = ({ guessMarker, onPress, allowedPolygon }: GameMapProps) => {
  const polygonPositions: [number, number][] =
    allowedPolygon?.map((p) => [p.latitude, p.longitude]) || []

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[35.7847, -78.6821]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler onPress={onPress} allowedPolygon={allowedPolygon} />
        {guessMarker && (
          <Marker
            position={[guessMarker.getLatitude(), guessMarker.getLongitude()]}
            icon={blueIcon}
          />
        )}
        {polygonPositions.length > 2 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: '#CC0000',
              weight: 3,
              fillColor: 'rgba(204,0,0,0.06)',
              fillOpacity: 0.06,
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default GameMap
