import { MapContainer, TileLayer } from 'react-leaflet'

import { LocationMap } from './ebird-api'
import { LocationMarker } from './location-marker'

import "./map.css"

interface IMapProps {
  latitude: number
  locations?: LocationMap
  longitude: number
  setMap?: any
}
export function Map({ latitude, locations, longitude, setMap }: IMapProps) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={9} scrollWheelZoom={false} touchZoom={true} ref={setMap} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      { locations ?
        Array.from(locations.keys())
          .sort((loc1, loc2) => {
            const loc1Value = locations.get(loc1)?.observationCount ?? 0
            const loc2Value = locations.get(loc2)?.observationCount ?? 0
            return loc1Value - loc2Value
          })
          .map((locationId: string) => {
            const locInfo = locations.get(locationId);
            if (locInfo) {
              const firstSpecies = Array.from(locInfo.species.keys())[0]
              const firstObservation = locInfo.species.get(firstSpecies)?.[0]
              return firstObservation
                ? (
                    <LocationMarker
                      latitude={firstObservation.lat}
                      longitude={firstObservation.lng}
                      locInfo={locInfo}
                    />
                  )
                : null
            }
          })
          : null
      }
    </MapContainer>
  )
}
