import { clsx } from "clsx"
import { useEffect, useState } from "react"
import { Popup } from "react-leaflet"

import { checklistUrlBase } from "./constants"
import { LocationInfo, Observation, eBirdUserHotSpotUrl } from "./ebird-api"

import "./location-popup.css"

interface ISpeciesRowProps {
  locationId: string
  observations?: Observation[]
  speciesId: string
}
function SpeciesRow({ locationId, observations, speciesId }: ISpeciesRowProps) {
  const [open, setOpen] = useState(false)
  const first = observations?.[0]
  const status = first?.obsValid
                  ? "✓"
                  : first?.obsReviewed && !first.obsValid
                    ? "𐄂"
                    : ""
  return first ? (
    <div key={`${locationId}-${speciesId}`}>
      <span className={clsx("observation-status", { valid: first?.obsValid })}>{status}</span>
      {"\u00a0"}
      <span className="species-name">
        {
          observations?.length > 1
          ? (
            <>
              <button className="multiple-lists" onClick={() => setOpen(!open)}>
                {first?.comName}
              </button>
            </>
          )
          : (
            <a href={checklistUrlBase + first?.subId} target="_blank">
              {first?.comName}
            </a>
          )
        }
      </span> ({observations?.length ?? 0})
      { open ? observations.map((observation: Observation) => (
        <>
          <br/>
          <a href={checklistUrlBase + observation.subId} target="_blank">
            {observation.comName}
          </a>
        </>
      )) : null}
    </div>
  ) : null
}

interface ILocationPopupProps {
  location: LocationInfo
}
export function LocationPopup({ location }: ILocationPopupProps) {
  const [isHotSpot, setIsHotSpot] = useState(false)
  useEffect(() => {
    async function updateHotSpotStatus() {
      setIsHotSpot((await location.response).ok)
    }
    updateHotSpotStatus()
  }, [location.response])
  const speciesKeys = Array.from(location.species.keys())
  return (
    <Popup>
      <div className='location-popup'>
        <div className="location-name">
          {isHotSpot
            ? <a target="_blank" href={eBirdUserHotSpotUrl(location.locId)}>{location.locName}</a>
            : location.locName}
        </div>
        <br/>
        {speciesKeys.map(speciesId => {
          const observations = location.species.get(speciesId)
          return <SpeciesRow locationId={location.locId} observations={observations} speciesId={speciesId} />
        })}
      </div>
    </Popup>
  )
}
