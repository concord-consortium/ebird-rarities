import { MapContainer, TileLayer } from 'react-leaflet'

import { Observation } from './ebird-api'
import { LocationMarker } from './location-marker'

import "./map.css"

interface IMapProps {
  latitude: number
  locations?: Map<string, Observation[]>
  longitude: number
}
export function Map({ latitude, locations, longitude }: IMapProps) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} touchZoom={true} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      { locations ?
        Array.from(locations.keys()).map((locationId: string) => {
          const observations = locations.get(locationId);
          if (observations) {
            const firstObservation = observations[0];
            return (
              <LocationMarker 
                latitude={firstObservation.lat}
                longitude={firstObservation.lng}
                observations={observations}
              />
            )
          }
        })
        : null
      }
    </MapContainer>
  )
}
