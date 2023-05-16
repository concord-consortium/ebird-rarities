import { useState } from 'react'

import { Map } from './map'
import { Observation, fetchRarities, processRarities } from './ebird-api'

import './App.css'

const urlParams = new URLSearchParams(window.location.search)
const apiKey = urlParams.get("apiKey")

function App() {
  const [locations, setLocations] = useState<Map<string, Observation[]>>()
  const latitude = 42.4557474
  const longitude = -71.3565596
  const daysBack = 3

  return (
    <>
      <div className="card">
        <button onClick={async () => {
          if (apiKey) {
            const results = await fetchRarities(apiKey, latitude, longitude, daysBack)
            const observations: Observation[] = await results.json()
            const locations = processRarities(observations)
            setLocations(locations)
          }
        }}>
          {locations ? `${locations.size} observations found` : 'Click to find rarities'}
        </button>
      </div>
      <Map latitude={latitude} locations={locations} longitude={longitude} />
    </>
  )
}

export default App
