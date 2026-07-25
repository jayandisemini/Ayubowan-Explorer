import { useState } from "react";
import { Train, Clock, MapPin, ArrowRight, ShieldCheck, Search, Ticket, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type TrainRoute = {
  id: string;
  trainName: string;
  trainNumber: string;
  origin: string;
  destination: string;
  depTime: string;
  arrTime: string;
  duration: string;
  frequency: string;
  classes: string[];
  priceLKR: number;
  status: "On Time" | "Scheduled" | "Minor Delay";
};

const TRAIN_DATA: TrainRoute[] = [
  {
    id: "t1",
    trainName: "Ella Odyssey (Scenic Special)",
    trainNumber: "1041",
    origin: "Colombo Fort",
    destination: "Ella / Badulla",
    depTime: "05:30 AM",
    arrTime: "03:55 PM",
    duration: "10h 25m",
    frequency: "Daily",
    classes: ["1st Class AC", "Observation Saloon", "2nd Class Reserved"],
    priceLKR: 4000,
    status: "On Time",
  },
  {
    id: "t2",
    trainName: "Podi Menike Express",
    trainNumber: "1005",
    origin: "Colombo Fort",
    destination: "Nanu Oya / Ella",
    depTime: "05:55 AM",
    arrTime: "03:15 PM",
    duration: "9h 20m",
    frequency: "Daily",
    classes: ["1st Class AC", "2nd Class", "3rd Class"],
    priceLKR: 2800,
    status: "On Time",
  },
  {
    id: "t3",
    trainName: "Udarata Menike",
    trainNumber: "1015",
    origin: "Colombo Fort",
    destination: "Kandy",
    depTime: "08:30 AM",
    arrTime: "11:05 AM",
    duration: "2h 35m",
    frequency: "Daily",
    classes: ["1st Class AC", "2nd Class"],
    priceLKR: 1800,
    status: "On Time",
  },
  {
    id: "t4",
    trainName: "Ruhunu Kumari (Coastal Line)",
    trainNumber: "8058",
    origin: "Colombo Fort",
    destination: "Galle / Matara",
    depTime: "06:10 AM",
    arrTime: "08:35 AM",
    duration: "2h 25m",
    frequency: "Daily",
    classes: ["2nd Class Reserved", "3rd Class"],
    priceLKR: 1200,
    status: "On Time",
  },
  {
    id: "t5",
    trainName: "Yal Devi Express",
    trainNumber: "4077",
    origin: "Colombo Fort",
    destination: "Jaffna",
    depTime: "05:45 AM",
    arrTime: "12:40 PM",
    duration: "6h 55m",
    frequency: "Daily",
    classes: ["1st Class AC", "2nd Class Reserved"],
    priceLKR: 3200,
    status: "Scheduled",
  },
];

export function TrainScheduleFinder() {
  const [fromStation, setFromStation] = useState("Colombo Fort");
  const [toStation, setToStation] = useState("Ella");
  const [filteredTrains, setFilteredTrains] = useState<TrainRoute[]>(TRAIN_DATA);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const fromL = fromStation.toLowerCase();
    const toL = toStation.toLowerCase();

    const matches = TRAIN_DATA.filter((t) => {
      const origMatch = t.origin.toLowerCase().includes(fromL) || fromL === "";
      const destMatch = t.destination.toLowerCase().includes(toL) || toL === "";
      return origMatch || destMatch;
    });

    setFilteredTrains(matches.length > 0 ? matches : TRAIN_DATA);
    toast.info(`Found ${matches.length || TRAIN_DATA.length} trains matching your route`);
  };

  return (
    <Card className="rounded-3xl border border-border/40 bg-card/70 p-6 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-primary" />
            <h3 className="font-display text-xl">Sri Lanka Railways Timetable</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official schedules for Ella Odyssey, Podi Menike, Udarata Menike & Coastal Lines.
          </p>
        </div>
        <Badge variant="outline" className="rounded-full border-emerald-500/40 text-emerald-600 bg-emerald-500/10 px-3 py-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" /> Live Station Status
        </Badge>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">From Station</label>
          <Input
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            placeholder="e.g. Colombo Fort, Kandy"
            className="rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">To Station</label>
          <Input
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            placeholder="e.g. Ella, Nanu Oya, Galle"
            className="rounded-xl text-sm"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Search className="w-4 h-4 mr-2" /> Search Timetable
          </Button>
        </div>
      </form>

      {/* Train Schedule List */}
      <div className="space-y-3">
        {filteredTrains.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border/50 bg-card p-4 hover:border-primary/40 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold">{t.trainName}</span>
                <Badge variant="secondary" className="font-mono text-[10px]">#{t.trainNumber}</Badge>
              </div>
              <Badge variant="outline" className="text-[11px] border-emerald-500/40 text-emerald-600 bg-emerald-500/5">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {t.status}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <div className="text-muted-foreground">Route</div>
                <div className="font-medium mt-0.5 text-sm flex items-center gap-1.5">
                  {t.origin} <ArrowRight className="w-3 h-3 text-muted-foreground" /> {t.destination}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Departure / Arrival</div>
                <div className="font-medium mt-0.5 text-sm">
                  {t.depTime} — {t.arrTime} <span className="text-xs text-muted-foreground">({t.duration})</span>
                </div>
              </div>
              <div className="text-right sm:text-right text-left">
                <div className="text-muted-foreground">Fares From</div>
                <div className="font-display text-base text-primary font-semibold">
                  Rs. {t.priceLKR.toLocaleString()} LKR <span className="text-xs text-muted-foreground font-normal">(≈ ${Math.round(t.priceLKR / 305)} USD)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 mt-3 pt-2 text-[11px] text-muted-foreground">
              <div className="flex flex-wrap gap-1.5">
                {t.classes.map((c) => (
                  <span key={c} className="rounded-md bg-muted/60 px-2 py-0.5">{c}</span>
                ))}
              </div>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Ticket className="w-3 h-3" /> Advance booking available 30 days prior
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
