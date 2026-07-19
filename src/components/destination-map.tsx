import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

// Fix default marker icon paths (Leaflet + bundlers)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type DestinationPin = {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
};

const typeColors: Record<string, string> = {
  culture: "#c48a2b",
  nature: "#2f8f5f",
  history: "#8a5a3b",
  adventure: "#3b6ba3",
  food: "#c0442b",
};

function coloredIcon(type: string) {
  const color = typeColors[type] ?? "#2f8f5f";
  const html = `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.4);display:grid;place-items:center;color:white;font-size:12px;font-weight:700;">●</div>`;
  return L.divIcon({ html, className: "", iconSize: [26, 26], iconAnchor: [13, 13] });
}

function Fly({ selectedId, pins }: { selectedId: string | null; pins: DestinationPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const p = pins.find((x) => x.id === selectedId);
    if (p) map.flyTo([p.latitude, p.longitude], 9, { duration: 1.2 });
  }, [selectedId, pins, map]);
  return null;
}

export function DestinationMap({
  pins, onSelect, selectedId,
}: { pins: DestinationPin[]; onSelect: (id: string) => void; selectedId: string | null }) {
  const ref = useRef<L.Map | null>(null);
  return (
    <MapContainer
      ref={ref}
      center={[7.8731, 80.7718]}
      zoom={7}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((p) => (
        <Marker
          key={p.id}
          position={[p.latitude, p.longitude]}
          icon={coloredIcon(p.type)}
          eventHandlers={{ click: () => onSelect(p.id) }}
        />
      ))}
      <Fly selectedId={selectedId} pins={pins} />
    </MapContainer>
  );
}
