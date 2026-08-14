import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";

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

export interface RoutePreset {
  id: string;
  name: string;
  days: string;
  distanceKm: number;
  estHours: number;
  waypoints: { name: string; lat: number; lng: number; day: number }[];
}

export const PRESET_ROUTES: RoutePreset[] = [
  {
    id: "cultural-5d",
    name: "Classic Cultural & Tea Loop",
    days: "5 Days",
    distanceKm: 580,
    estHours: 13,
    waypoints: [
      { name: "Colombo Fort", lat: 6.9271, lng: 79.8612, day: 1 },
      { name: "Kandy Sacred City", lat: 7.2906, lng: 80.6337, day: 2 },
      { name: "Sigiriya Lion Rock", lat: 7.957, lng: 80.7603, day: 3 },
      { name: "Ella Tea Gap", lat: 6.8667, lng: 81.0466, day: 4 },
      { name: "Mirissa Coast", lat: 5.9483, lng: 80.4716, day: 5 },
    ],
  },
  {
    id: "highland-7d",
    name: "Highland & Wildlife Expedition",
    days: "7 Days",
    distanceKm: 740,
    estHours: 16,
    waypoints: [
      { name: "Bandaranaike Airport", lat: 7.1808, lng: 79.8841, day: 1 },
      { name: "Kandy Temple", lat: 7.2906, lng: 80.6337, day: 2 },
      { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, day: 3 },
      { name: "Ella Nine Arches", lat: 6.8667, lng: 81.0466, day: 4 },
      { name: "Yala National Park", lat: 6.3725, lng: 81.5165, day: 5 },
      { name: "Galle Fort", lat: 6.0536, lng: 80.217, day: 6 },
      { name: "Colombo", lat: 6.9271, lng: 79.8612, day: 7 },
    ],
  },
];

const typeColors: Record<string, string> = {
  culture: "#c48a2b",
  nature: "#2f8f5f",
  history: "#8a5a3b",
  adventure: "#3b6ba3",
  food: "#c0442b",
  cultural: "#c48a2b",
  hillcountry: "#2f8f5f",
  beach: "#3b6ba3",
  wildlife: "#c0442b",
};

function coloredIcon(type: string) {
  const color = typeColors[type] ?? "#2f8f5f";
  const html = `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.4);display:grid;place-items:center;color:white;font-size:12px;font-weight:700;">●</div>`;
  return L.divIcon({ html, className: "", iconSize: [26, 26], iconAnchor: [13, 13] });
}

function waypointNumberIcon(num: number, name: string) {
  const html = `<div style="background:#0f172a;border:2px solid #eab308;color:#f8fafc;border-radius:999px;padding:3px 10px;font-size:11px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,0.5);display:inline-flex;align-items:center;gap:5px;white-space:nowrap;">
    <span style="background:#eab308;color:#0f172a;border-radius:50%;width:16px;height:16px;display:grid;place-items:center;font-size:10px;">${num}</span>
    <span>${name}</span>
  </div>`;
  return L.divIcon({ html, className: "", iconSize: [120, 26], iconAnchor: [60, 13] });
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
  pins,
  onSelect,
  selectedId,
  showRouteVisualizer = true,
}: {
  pins: DestinationPin[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  showRouteVisualizer?: boolean;
}) {
  const ref = useRef<L.Map | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string>("cultural-5d");
  const [enableRoute, setEnableRoute] = useState<boolean>(true);

  const route = PRESET_ROUTES.find((r) => r.id === activeRouteId) || PRESET_ROUTES[0];
  const polylineCoords: [number, number][] = route.waypoints.map((w) => [w.lat, w.lng]);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden">
      {/* Route Control Panel Overlay */}
      {showRouteVisualizer && (
        <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot" /> Multi-Day Route
            </span>
            <select
              value={activeRouteId}
              onChange={(e) => setActiveRouteId(e.target.value)}
              className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs text-foreground outline-none font-medium"
            >
              {PRESET_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.days})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <span className="font-bold text-primary">~{route.distanceKm} km</span>
              <span>·</span>
              <span className="font-bold text-foreground">~{route.estHours} hrs drive</span>
            </div>
            <button
              onClick={() => setEnableRoute(!enableRoute)}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-colors ${
                enableRoute ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40" : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {enableRoute ? "Route Visible" : "Show Route"}
            </button>
          </div>
        </div>
      )}

      <MapContainer
        ref={ref}
        center={[7.8731, 80.7718]}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full rounded-2xl z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Destination Pins */}
        {pins.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={coloredIcon(p.type)}
            eventHandlers={{ click: () => onSelect(p.id) }}
          />
        ))}

        {/* Animated Multi-Day Route Polyline */}
        {enableRoute && showRouteVisualizer && (
          <>
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: "#eab308",
                weight: 4,
                opacity: 0.9,
                dashArray: "12, 12",
                className: "animate-route-dash",
              }}
            />

            {/* Waypoint Numbered Markers */}
            {route.waypoints.map((w, idx) => (
              <Marker key={w.name} position={[w.lat, w.lng]} icon={waypointNumberIcon(idx + 1, w.name)}>
                <Popup>
                  <div className="p-1 text-xs">
                    <div className="font-bold text-amber-500 uppercase tracking-wider">Day {w.day} Stop</div>
                    <div className="font-semibold text-foreground text-sm mt-0.5">{w.name}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

        <Fly selectedId={selectedId} pins={pins} />
      </MapContainer>
    </div>
  );
}
