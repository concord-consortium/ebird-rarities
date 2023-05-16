import { CircleMarker, Popup } from 'react-leaflet'

import { Observation } from './ebird-api'

interface ILocationMarkerProps {
  latitude: number
  longitude: number
  observations: Observation[]
}
export function LocationMarker({ latitude, longitude, observations }: ILocationMarkerProps) {
  const radius = 5 + observations.length;
  return (
    <CircleMarker center={[latitude, longitude]} radius={radius} pathOptions={{ color: "red", fillColor: "blue", fillOpacity: .5 }}>
      <Popup>
        Number of observations: {observations.length}
      </Popup>
    </CircleMarker>
  );
}
