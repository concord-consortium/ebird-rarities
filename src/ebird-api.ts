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

export async function fetchRarities(apiKey: string, lat: number, lng: number, daysBack = 14) {
  const latStr = lat.toFixed(2)
  const lngStr = lng.toFixed(2)
  const url = `https://api.ebird.org/v2/data/obs/geo/recent/notable?key=${apiKey}&lat=${latStr}&lng=${lngStr}&back=${daysBack}`
  return fetch(url)
}

export function processRarities(observations: Observation[]) {
  const map = new Map<string, Observation[]>()
  observations.forEach(obs => {
    if (!map.has(obs.locId)) {
      map.set(obs.locId, [])
    }
    map.get(obs.locId)?.push(obs)
  })
  return map
}
