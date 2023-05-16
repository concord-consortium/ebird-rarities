import { CircleMarker, Popup } from 'react-leaflet'

import { Observation } from './ebird-api'

interface ILocationMarkerProps {
  latitude: number
  longitude: number
  observations: Observation[]
}
export function LocationMarker({ latitude, longitude, observations }: ILocationMarkerProps) {
  // colorFactor should be [0-1]. 0 is rendered as blue, 1 is rendered as red, and intermediate numbers are various shades of purple.
  const colorFactor = Math.round(Math.min((observations.length - 1) / 4, 1) * 255);
  const rawRed = colorFactor.toString(16);
  const red = rawRed.length < 2 ? `0${rawRed}` : rawRed;
  const rawBlue = (255 - colorFactor).toString(16);
  const blue = rawBlue.length < 2 ? `0${rawBlue}` : rawBlue;
  const color = `#${red}00${blue}`;
  return (
    <CircleMarker center={[latitude, longitude]} radius={10} pathOptions={{ color, fillColor: color, fillOpacity: .4 }}>
      <Popup>
        Number of observations: {observations.length}
      </Popup>
    </CircleMarker>
  );
}
