import { FocusEventHandler, useState } from 'react'

import { Map } from './map'
import { Observation, fetchRarities, processRarities } from './ebird-api'

import './App.css'

const urlParams = new URLSearchParams(window.location.search)
const apiKey = urlParams.get("apiKey")

function App() {
  const [defaultLatitude, defaultLongitude] = [42.4557474, -71.3565596]
  const [locationValid, setLocationValid] = useState(true)
  const [latitude, setLatitude] = useState(defaultLatitude)
  const [longitude, setLongitude] = useState(defaultLongitude)
  const daysBack = 3
  // const [daysBack, setDaysBack] = useState(3)
  const [locations, setLocations] = useState<Map<string, Observation[]>>()
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
        <div className="ui-row">
          <label htmlFor="location">Location (lat, long): </label>
          <input className={locationValid ? "" : "input-invalid"} id="location" onChange={updateLocation} />
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
