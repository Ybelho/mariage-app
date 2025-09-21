"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type {
  MapContainerProps,
  TileLayerProps,
  MarkerProps,
  PopupProps,
} from "react-leaflet";

type Listing = {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  price?: number | null;
  link: string;
};

type Props = {
  listings: Listing[];
};

// On tape explicitement les props des composants chargés dynamiquement
const MapContainer = dynamic<MapContainerProps>(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic<TileLayerProps>(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic<MarkerProps>(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic<PopupProps>(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function HebMap({ listings }: Props) {
  return (
    <MapContainer
      center={[42.9, 1.5]}
      zoom={12}
      scrollWheelZoom
      className="w-full h-96"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {listings.map((l) => (
        <Marker key={String(l.id)} position={[l.lat, l.lng]}>
          <Popup>
            <strong>{l.title}</strong>
            <br />
            {l.price ?? "—"} €/nuit
            <br />
            <a href={l.link} target="_blank" rel="noreferrer">
              Voir
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
