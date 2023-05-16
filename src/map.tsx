import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import "./map.css";

interface IMapProps {
  latitude: number;
  longitude: number;
}
export function Map({ latitude, longitude }: IMapProps) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} touchZoom={true} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          Bird seen here.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
