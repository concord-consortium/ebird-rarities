export interface Observation {
  speciesCode: string
  comName: string
  sciName: string
  locId: string
  locName: string
  obsDt: string
  howMany: number
  lat: number
  lng: number
  obsValid: boolean
  obsReviewed: boolean
  locationPrivate: boolean
  subId: string
}

export type SpeciesMap = Map<string, Observation[]>

export interface LocationInfo {
  species: SpeciesMap
  speciesCount: number
  observationCount: number
}

export type LocationMap = Map<string, LocationInfo>

export async function fetchRarities(apiKey: string, lat: number, lng: number, daysBack = 5) {
  const latStr = lat.toFixed(2)
  const lngStr = lng.toFixed(2)
  const url = `https://api.ebird.org/v2/data/obs/geo/recent/notable?key=${apiKey}&lat=${latStr}&lng=${lngStr}&back=${daysBack}`
  return fetch(url)
}

export function processRarities(observations: Observation[]) {
  const locMap = new Map<string, LocationInfo>()
  observations.forEach(obs => {
    if (!locMap.has(obs.locId)) {
      locMap.set(obs.locId, {
        speciesCount: 0,
        observationCount: 0,
        species: new Map<string, Observation[]>()
    })
    }
    const locInfo = locMap.get(obs.locId)
    const speciesMap = locInfo?.species
    if (speciesMap && !speciesMap.has(obs.speciesCode)) {
      ++locInfo.speciesCount
      speciesMap.set(obs.speciesCode, [])
    }
    speciesMap?.get(obs.speciesCode)?.push(obs)
    ;(locInfo != null) && ++locInfo.observationCount
  })
  return locMap
}
