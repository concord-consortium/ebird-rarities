import { useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
