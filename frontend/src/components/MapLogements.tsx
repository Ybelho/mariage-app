"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

export default function MapLogements({ listings }: { listings: any[] }) {
  const center: LatLngExpression = [42.9, 1.5]; // Domaine de Camboyer (approx)

  return (
    <div className="w-full h-80 sm:h-[420px] card p-0 overflow-hidden">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="w-full h-full rounded-card">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {listings.map((l) => (
          <Marker key={l.id} position={[l.lat, l.lng]}>
            <Popup>
              <strong>{l.title}</strong><br />
              {l.price !== null ? `${l.price} €/nuit` : "Prix indisponible"}<br />
              <a className="text-sage-700 underline" href={l.link} target="_blank">Voir</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
