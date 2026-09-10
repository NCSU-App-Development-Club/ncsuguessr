import React from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationPickerMapProps } from './LocationPickerMap'

const markerIcon = new L.DivIcon({
  className: 'location-picker-marker',
  html: '<div style="background:#CC0000;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function MapEventsHandler({
  onPress,
}: {
  onPress: (coords: { latitude: number; longitude: number }) => void
}) {
  useMapEvents({
    click(e) {
      onPress({ latitude: e.latlng.lat, longitude: e.latlng.lng })
    },
  })

  return null
}

const LocationPickerMap = ({
  selectedLocation,
  onPress,
}: LocationPickerMapProps) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[selectedLocation.latitude, selectedLocation.longitude]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler onPress={onPress} />
        <Marker
          position={[selectedLocation.latitude, selectedLocation.longitude]}
          icon={markerIcon}
        />
      </MapContainer>
    </div>
  )
}

export default LocationPickerMap
