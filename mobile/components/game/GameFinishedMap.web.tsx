import React, { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GameFinishedMapProps } from './types'

const blueIcon = new L.DivIcon({
  className: 'guess-marker',
  html: '<div style="color:#4285F4;font-size:28px;line-height:1;">📍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

const redIcon = new L.DivIcon({
  className: 'actual-marker',
  html: '<div style="color:#EA4335;font-size:28px;line-height:1;">🚩</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

function FitBounds({
  userGuess,
  actualLocation,
}: {
  userGuess: { getLatitude(): number; getLongitude(): number }
  actualLocation: { getLatitude(): number; getLongitude(): number } | null
}) {
  const map = useMap()

  useEffect(() => {
    if (actualLocation) {
      const bounds = L.latLngBounds(
        [userGuess.getLatitude(), userGuess.getLongitude()],
        [actualLocation.getLatitude(), actualLocation.getLongitude()]
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, userGuess, actualLocation])

  return null
}

export default function GameFinishedMap({
  userGuess,
  actualLocation,
}: GameFinishedMapProps) {
  const center: [number, number] = actualLocation
    ? [
        (userGuess.getLatitude() + actualLocation.getLatitude()) / 2,
        (userGuess.getLongitude() + actualLocation.getLongitude()) / 2,
      ]
    : [userGuess.getLatitude(), userGuess.getLongitude()]

  const polylinePositions: [number, number][] = actualLocation
    ? [
        [userGuess.getLatitude(), userGuess.getLongitude()],
        [actualLocation.getLatitude(), actualLocation.getLongitude()],
      ]
    : []

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds userGuess={userGuess} actualLocation={actualLocation} />
      <Marker
        position={[userGuess.getLatitude(), userGuess.getLongitude()]}
        icon={blueIcon}
      />
      {actualLocation && (
        <Marker
          position={[
            actualLocation.getLatitude(),
            actualLocation.getLongitude(),
          ]}
          icon={redIcon}
        />
      )}
      {actualLocation && (
        <Polyline
          positions={polylinePositions}
          pathOptions={{ color: 'black', weight: 2, dashArray: '5, 5' }}
        />
      )}
    </MapContainer>
  )
}
