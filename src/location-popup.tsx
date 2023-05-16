import { clsx } from "clsx"
import { Popup } from "react-leaflet"

import { checklistUrlBase } from "./constants"
import { SpeciesMap } from "./ebird-api"

import "./location-popup.css"

interface ILocationPopupProps {
  locationId: string
  locationName: string
  species: SpeciesMap
}
export function LocationPopup({ locationId, locationName, species }: ILocationPopupProps) {
  const speciesKeys = Array.from(species.keys())
  return (
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
            <div key={`${locationId}-${speciesId}`}>
              <span className={clsx("observation-status", { valid: first?.obsValid })}>{status}</span>
              {"\u00a0"}
              <span className="species-name">
                <a href={checklistUrlBase + first?.subId} target="_blank">
                  {first?.comName}
                </a>
              </span> ({observations?.length ?? 0})
            </div>
          )
        })}
      </div>
    </Popup>
  )
}
