import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function HebMap({ listings }) {
  return (
    <MapContainer center={[42.9, 1.5]} zoom={12} scrollWheelZoom className="w-full h-96">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors" />
      {listings.map((l) => (
        <Marker key={l.id} position={[l.lat, l.lng]}>
          <Popup>
            <strong>{l.title}</strong><br />
            {l.price}€/nuit<br />
            <a href={l.link} target="_blank">Voir</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

