import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Clock, MapPin, Navigation, ShieldCheck, Sparkles, MessageCircle, Users, Luggage, Fuel, CheckCircle2, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { useCurrency } from "@/lib/currency";
import { toast } from "sonner";

interface LocationHub {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
}

const LOCATIONS: LocationHub[] = [
  { id: "cmb", name: "Bandaranaike Airport (CMB)", region: "Katunayake", lat: 7.1808, lng: 79.8841 },
  { id: "colombo", name: "Colombo Fort / City Center", region: "Western Province", lat: 6.9271, lng: 79.8612 },
  { id: "kandy", name: "Kandy Sacred City", region: "Central Highlands", lat: 7.2906, lng: 80.6337 },
  { id: "sigiriya", name: "Sigiriya / Dambulla", region: "Cultural Triangle", lat: 7.957, lng: 80.7603 },
  { id: "nuwaraeliya", name: "Nuwara Eliya (Tea Country)", region: "Central Highlands", lat: 6.9497, lng: 80.7891 },
  { id: "ella", name: "Ella Gap & Nine Arches", region: "Uva Province", lat: 6.8667, lng: 81.0466 },
  { id: "yala", name: "Yala National Park", region: "Southern Wilderness", lat: 6.3725, lng: 81.5165 },
  { id: "galle", name: "Galle Fort", region: "Southern Coast", lat: 6.0536, lng: 80.217 },
  { id: "mirissa", name: "Mirissa Beach & Whale Port", region: "Southern Coast", lat: 5.9483, lng: 80.4716 },
  { id: "trinco", name: "Trincomalee / Nilaveli", region: "Eastern Coast", lat: 8.5874, lng: 81.2152 },
];

interface VehicleOption {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  paxMax: number;
  luggageMax: number;
  baseRateUsdPerKm: number;
  minFareUsd: number;
  features: string[];
}

const VEHICLES: VehicleOption[] = [
  {
    id: "tuktuk",
    name: "Authentic Sri Lankan Tuk-Tuk",
    tagline: "Open-air scenic coastal & town rides",
    icon: "🛺",
    paxMax: 2,
    luggageMax: 2,
    baseRateUsdPerKm: 0.35,
    minFareUsd: 15,
    features: ["Open-air 360° views", "Local driver", "Bluetooth music speaker"],
  },
  {
    id: "sedan",
    name: "Comfort Hybrid Sedan",
    tagline: "Toyota Prius / Grace with Dual AC",
    icon: "🚗",
    paxMax: 3,
    luggageMax: 3,
    baseRateUsdPerKm: 0.55,
    minFareUsd: 45,
    features: ["Climate Control AC", "Free Wi-Fi hotspot", "Mineral water bottles"],
  },
  {
    id: "suv",
    name: "4x4 Highland Explorer SUV",
    tagline: "Toyota Prado / RAV4 for steep mountain curves",
    icon: "🚙",
    paxMax: 4,
    luggageMax: 4,
    baseRateUsdPerKm: 0.85,
    minFareUsd: 65,
    features: ["High clearance 4WD", "Panoramic windows", "Cooler box for beverages"],
  },
  {
    id: "van",
    name: "Luxury High-Roof Passenger Van",
    tagline: "Toyota KDH High-Roof Luxury Minibus",
    icon: "🚐",
    paxMax: 8,
    luggageMax: 8,
    baseRateUsdPerKm: 1.1,
    minFareUsd: 95,
    features: ["Reclining velvet seats", "Individual AC vents", "Spacious luggage bay"],
  },
];

// Calculate Haversine distance in KM
function calcKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directKm = R * c;
  // Apply 1.35 factor for Sri Lankan winding mountain/coastal roads
  return Math.round(directKm * 1.35);
}

export function TransferBookingCalculator() {
  const { formatPrice } = useCurrency();
  const [pickupId, setPickupId] = useState<string>("cmb");
  const [dropoffId, setDropoffId] = useState<string>("kandy");
  const [vehicleId, setVehicleId] = useState<string>("sedan");
  const [travelDate, setTravelDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paxCount, setPaxCount] = useState<number>(2);
  const [withGuide, setWithGuide] = useState<boolean>(true);

  const pickup = LOCATIONS.find((l) => l.id === pickupId) || LOCATIONS[0];
  const dropoff = LOCATIONS.find((l) => l.id === dropoffId) || LOCATIONS[2];
  const vehicle = VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[1];

  const rawKm = calcKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  const estHours = Math.max(1, Math.round((rawKm / 42) * 10) / 10); // SL average speed ~42 km/h

  const baseCost = Math.max(vehicle.minFareUsd, Math.round(rawKm * vehicle.baseRateUsdPerKm));
  const guideAddon = withGuide ? 15 : 0;
  const totalCostUsd = baseCost + guideAddon;

  const handleBookWhatsApp = () => {
    const text = `Ayubowan! I would like to book a Private Transfer:

📍 *Pickup:* ${pickup.name}
🏁 *Dropoff:* ${dropoff.name}
📅 *Date:* ${travelDate}
🚘 *Vehicle:* ${vehicle.name} (${vehicle.icon})
👥 *Passengers:* ${paxCount} pax
🗺️ *Distance:* ~${rawKm} km (${estHours} hrs)
👨‍✈️ *Chauffeur Guide:* ${withGuide ? "Yes (English-speaking)" : "No"}
💵 *Estimated Fare:* ${formatPrice(totalCostUsd)}`;

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp with your transfer itinerary!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <Car className="w-7 h-7 text-primary" /> Private Transport & Airport Transfers
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chauffeur-driven island transfers with air-conditioned comfort or authentic Tuk-Tuk rides.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/40 text-primary py-1 px-3">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Government Licensed Drivers
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,420px]">
        {/* Selection Form */}
        <div className="space-y-6">
          <Card className="p-6 border-border/60 bg-card/90 backdrop-blur-md space-y-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary flex items-center gap-1.5">
              <Navigation className="w-4 h-4" /> Route & Schedule
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Pick-up Location</Label>
                <Select value={pickupId} onValueChange={setPickupId}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l) => (
                      <SelectItem key={l.id} value={l.id} disabled={l.id === dropoffId}>
                        <span className="font-medium">{l.name}</span> <span className="text-[11px] text-muted-foreground">({l.region})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Drop-off Destination</Label>
                <Select value={dropoffId} onValueChange={setDropoffId}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l) => (
                      <SelectItem key={l.id} value={l.id} disabled={l.id === pickupId}>
                        <span className="font-medium">{l.name}</span> <span className="text-[11px] text-muted-foreground">({l.region})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Travel Date</Label>
                <Input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-xs">Passengers</Label>
                <Select value={String(paxCount)} onValueChange={(v) => setPaxCount(parseInt(v))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Passenger" : "Passengers"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Vehicle Selection */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary flex items-center gap-1.5">
              <Car className="w-4 h-4" /> Select Vehicle Type
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {VEHICLES.map((v) => {
                const selected = v.id === vehicleId;
                const vFareUsd = Math.max(v.minFareUsd, Math.round(rawKm * v.baseRateUsdPerKm));

                return (
                  <Card
                    key={v.id}
                    onClick={() => setVehicleId(v.id)}
                    className={`p-4 cursor-pointer transition-all border ${
                      selected
                        ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                        : "border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-2xl">{v.icon}</div>
                      <Badge variant={selected ? "default" : "outline"} className="text-xs font-semibold">
                        {formatPrice(vFareUsd)}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <h4 className="font-display text-base text-foreground">{v.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.tagline}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
                      <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> Max {v.paxMax}</span>
                      <span className="inline-flex items-center gap-1"><Luggage className="w-3.5 h-3.5 text-primary" /> Max {v.luggageMax}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transfer Summary Card */}
        <Card className="p-6 border-primary/30 bg-card/95 backdrop-blur-xl h-fit space-y-6 shadow-luxe">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-semibold">Estimated Fare</div>
              <div className="font-display text-3xl text-gradient-gold mt-0.5">{formatPrice(totalCostUsd)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Fixed Price</div>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">All Tolls Included</div>
            </div>
          </div>

          {/* Route Stats */}
          <div className="rounded-2xl bg-muted/50 p-4 space-y-3 border border-border/50 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5 text-primary" /> Driving Distance</span>
              <span className="font-semibold text-foreground">~{rawKm} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Estimated Duration</span>
              <span className="font-semibold text-foreground">~{estHours} hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-primary" /> Vehicle Type</span>
              <span className="font-semibold text-foreground">{vehicle.name}</span>
            </div>
          </div>

          {/* Driver Add-on */}
          <div
            onClick={() => setWithGuide(!withGuide)}
            className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-secondary/30 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">English Chauffeur Guide</div>
                <div className="text-[11px] text-muted-foreground">Local recommendations & stopovers</div>
              </div>
            </div>
            <Badge variant={withGuide ? "default" : "outline"} className="text-[10px]">
              {withGuide ? "+$15 Included" : "Add +$15"}
            </Badge>
          </div>

          <div className="space-y-2">
            <Button onClick={handleBookWhatsApp} size="lg" className="w-full rounded-full font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
              <MessageCircle className="w-4 h-4 mr-2" /> Reserve via WhatsApp
            </Button>
            <div className="text-[11px] text-center text-muted-foreground">
              Free cancellation up to 24h before pick-up. Pay driver directly upon arrival.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
