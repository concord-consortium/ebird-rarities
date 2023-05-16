import { clsx } from "clsx"
import { CircleMarker, Popup } from 'react-leaflet'

import { SpeciesMap } from './ebird-api'

import "./location-marker.css"

interface ILocationMarkerProps {
  latitude: number
  longitude: number
  species: SpeciesMap
}
export function LocationMarker({ latitude, longitude, species }: ILocationMarkerProps) {
  // colorFactor should be [0-255]. 0 is rendered as blue, 255 is rendered as red, and intermediate numbers are various shades of purple.
  const obsCount = Array.from(species.values()).reduce((sum, obs) => sum + obs.length, 0)
  const colorFactor = Math.round(Math.min((obsCount - 1) / 8, 1) * 255);
  const rawRed = colorFactor.toString(16);
  const red = rawRed.length < 2 ? `0${rawRed}` : rawRed;
  const rawBlue = (255 - colorFactor).toString(16);
  const blue = rawBlue.length < 2 ? `0${rawBlue}` : rawBlue;
  const color = `#${red}00${blue}`;
  const speciesKeys = Array.from(species.keys())
  const firstSpeciesKey = speciesKeys?.[0]
  const firstObservation = species.get(firstSpeciesKey)?.[0]
  const locationName = firstObservation?.locName ?? ""
  return (
    <CircleMarker center={[latitude, longitude]} radius={10} pathOptions={{ color, fillColor: color, fillOpacity: .4 }}>
      <Popup>
        <div className='location-popup'>
          <div className="location-name">{locationName}</div>
          <br/>
          {speciesKeys.map(speciesId => {
            const observations = species.get(speciesId)
            const first = observations?.[0]
            const status = first?.obsValid
                            ? "✓"
                            : first?.obsReviewed && !first.obsValid
                              ? "𐄂"
                              : ""
            return first && (
              <div>
                <span className={clsx("observation-status", { valid: first?.obsValid })}>{status}</span>
                {"\u00a0"}
                <span className="species-name">{first?.comName}</span> ({observations?.length ?? 0})
              </div>
            )
          })}
        </div>
      </Popup>
    </CircleMarker>
  );
}
