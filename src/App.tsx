import { FocusEventHandler, useState } from 'react'

import { Map } from './map'
import { LocationMap, Observation, fetchRarities, processRarities } from './ebird-api'

import './App.css'

const urlParams = new URLSearchParams(window.location.search)
const apiKey = urlParams.get("apiKey")

function App() {
  const [defaultLatitude, defaultLongitude] = [42.4557474, -71.3565596]
  const [minDaysBack, maxDaysBack] = [1, 30]
  const defaultDaysBack = 3
  const [locationValid, setLocationValid] = useState(true)
  const [latitude, setLatitude] = useState(defaultLatitude)
  const [longitude, setLongitude] = useState(defaultLongitude)
  const [locations, setLocations] = useState<LocationMap>()
  const [daysBackValid, setDaysBackValid] = useState(true)
  const [daysBack, setDaysBack] = useState(defaultDaysBack)
  const [map, setMap] = useState<any>(null)

  const updateLocation: FocusEventHandler<HTMLInputElement> = (event) => {
    const location = event.target.value
    const cleanedLocation = location.replace(/\s+/g, "").replace(/\(+/g, "").replace(/\)+/g, "")
    if (!cleanedLocation) {
      setLocationValid(true)
      setLatitude(defaultLatitude)
      setLongitude(defaultLongitude)
      return
    }
    const [rawLat, rawLong] = cleanedLocation.split(",")
    const lat = Number(rawLat)
    const long = Number(rawLong)
    if (isNaN(lat) || isNaN(long)) {
      setLocationValid(false)
      setLatitude(defaultLatitude)
      setLongitude(defaultLongitude)
    } else {
      setLocationValid(true)
      setLatitude(lat)
      setLongitude(long)
    }
  }

  const updateDaysBack: FocusEventHandler<HTMLInputElement> = (event) => {
    const daysBackString = event.target.value.replace(/\s+/g, "")
    if (!daysBackString) {
      setDaysBackValid(true)
      setDaysBack(defaultDaysBack)
      return
    }
    const daysBackNumber = Number(daysBackString)
    if (isNaN(daysBackNumber) || daysBackNumber < minDaysBack || daysBackNumber > maxDaysBack) {
      setDaysBackValid(false)
      setDaysBack(defaultDaysBack)
    } else {
      setDaysBackValid(true)
      setDaysBack(Math.round(daysBackNumber))
    }
  }

  const onClick = async () => {
    if (apiKey) {
      const results = await fetchRarities(apiKey, latitude, longitude, daysBack)
      const observations: Observation[] = await results.json()
      const locations = processRarities(observations)
      setLocations(locations)
      if (map) {
        map.setView([latitude, longitude])
      }
    }
  }

  return (
    <>
      <div className="ui-area">
        <h4>Options</h4>
        <div className="ui-row">
          <label htmlFor="location">Location (lat, long): </label>
          <input className={locationValid ? "" : "input-invalid"} id="location" onChange={updateLocation} />
        </div>
        <div className="ui-row">
          <label htmlFor="daysBack">Number of days ({minDaysBack}-{maxDaysBack}): </label>
          <input className={daysBackValid ? "" : "input-invalid"} id="daysBack" onChange={updateDaysBack} />
        </div>
      </div>
      <div className="card">
        <button onClick={onClick}>
          {locations ? `${locations.size} observations found` : 'Click to find rarities'}
        </button>
      </div>
      <Map latitude={latitude} locations={locations} longitude={longitude} setMap={setMap} />
    </>
  )
}

export default App
