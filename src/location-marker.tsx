import { CircleMarker } from 'react-leaflet'

import { LocationInfo } from './ebird-api'
import { LocationPopup } from "./location-popup"

interface ILocationMarkerProps {
  latitude: number
  longitude: number
  locInfo: LocationInfo
}
export function LocationMarker({ latitude, longitude, locInfo }: ILocationMarkerProps) {
  // colorFactor should be [0-255]. 0 is rendered as blue, 255 is rendered as red, and intermediate numbers are various shades of purple.
  const colorFactor = Math.round(Math.min((locInfo.observationCount - 1) / 8, 1) * 255)
  const rawRed = colorFactor.toString(16)
  const red = rawRed.length < 2 ? `0${rawRed}` : rawRed
  const rawBlue = (255 - colorFactor).toString(16)
  const blue = rawBlue.length < 2 ? `0${rawBlue}` : rawBlue
  const color = `#${red}00${blue}`

  const species = locInfo.species
  const speciesKeys = Array.from(species.keys())
  const firstSpeciesKey = speciesKeys?.[0]
  const firstObservation = species.get(firstSpeciesKey)?.[0]
  const locationName = firstObservation?.locName ?? ""
  const locationId = firstObservation?.locId ?? ""

  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={10}
      pathOptions={{ color, fillColor: color, fillOpacity: .4 }}
    >
      <LocationPopup
        locationId={locationId}
        locationName={locationName}
        species={species}
      />
    </CircleMarker>
  );
}
