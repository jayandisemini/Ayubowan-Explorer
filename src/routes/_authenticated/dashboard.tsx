import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { ClientOnly } from "@/components/client-only";
import type { DestinationPin } from "@/components/destination-map";
import { Waves, Sparkles, Train, Bus, LogOut, MapPin, Utensils, Landmark, Mountain, History, Loader2, CalendarDays, Compass, Sun, CloudSun, Plane, Wallet, Heart, Bell, TrendingUp, Palmtree, ShieldCheck, Download } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import ellaImg from "@/assets/ella.jpg";
import galleImg from "@/assets/galle.jpg";
import mirissaImg from "@/assets/mirissa.jpg";
import sigiriyaImg from "@/assets/hero-sigiriya.jpg";
import { exportItineraryPDF } from "@/lib/pdf-itinerary";
import { BookingCheckoutDialog } from "@/components/booking-checkout-dialog";
import { TrainScheduleFinder } from "@/components/train-schedule-finder";
import { ThemeToggle } from "@/components/theme-toggle";

const DestinationMap = lazy(() => import("@/components/destination-map").then((m) => ({ default: m.DestinationMap })));

type Destination = {
  id: string; name: string; type: string; description: string;
  story: string | null; image_url: string | null;
  latitude: number; longitude: number;
};
type FoodRec = { id: string; food_name: string; description: string; price_level: number; destination_id: string };
type Booking = { id: string; travel_date: string; total_budget: number; status: string; destination_id: string | null; notes: string | null };

import { destinations as fallbackDestList } from "@/lib/destinations-data";

const defaultDestinations: Destination[] = fallbackDestList.map((d, i) => ({
  id: `dest-${i + 1}`,
  name: d.name,
  type: d.slug === "sigiriya" ? "cultural" : d.slug === "ella" ? "hillcountry" : d.slug === "galle" ? "cultural" : d.slug === "mirissa" ? "beach" : "wildlife",
  description: d.body,
  story: d.experiences[0]?.description || null,
  image_url: d.image,
  latitude: d.slug === "sigiriya" ? 7.957 : d.slug === "ella" ? 6.8667 : d.slug === "galle" ? 6.0536 : d.slug === "mirissa" ? 5.9483 : 7.2906,
  longitude: d.slug === "sigiriya" ? 80.7603 : d.slug === "ella" ? 81.0466 : d.slug === "galle" ? 80.217 : d.slug === "mirissa" ? 80.4716 : 80.6337,
}));

const defaultFoods: FoodRec[] = [
  { id: "f1", food_name: "Kottu Roti", description: "Shredded flatbread flash-fried with aromatic curry spices, vegetables & egg on a hot griddle.", price_level: 1, destination_id: "dest-1" },
  { id: "f2", food_name: "Ceylon Hopper (Appa)", description: "Crispy bowl-shaped rice flour crêpes with soft sponge center, served with pol sambol.", price_level: 1, destination_id: "dest-2" },
  { id: "f3", food_name: "Fresh Grilled Red Snapper", description: "Ocean-to-table whole fish marinated in lime and black pepper, grilled over coconut coals.", price_level: 2, destination_id: "dest-4" },
  { id: "f4", food_name: "Pol Roti with Lunu Miris", description: "Rustic coconut flatbread paired with spicy onion-chili sambol.", price_level: 1, destination_id: "dest-3" },
];

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Ayubowan Travels" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [foods, setFoods] = useState<FoodRec[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? "traveler@ayubowantravels.lk"));
    supabase.from("destinations").select("*").then(({ data }) => {
      if (data && data.length > 0) setDestinations((data as Destination[]) ?? []);
      else setDestinations(defaultDestinations);
    }).catch(() => setDestinations(defaultDestinations));

    supabase.from("food_recommendations").select("*").then(({ data }) => {
      if (data && data.length > 0) setFoods((data as FoodRec[]) ?? []);
      else setFoods(defaultFoods);
    }).catch(() => setFoods(defaultFoods));
  }, []);

  const selected = destinations.find((d) => d.id === selectedId) ?? null;
  const selectedFoods = foods.filter((f) => f.destination_id === selectedId);

  const pins: DestinationPin[] = useMemo(
    () => destinations.map((d) => ({ id: d.id, name: d.name, type: d.type, latitude: d.latitude, longitude: d.longitude })),
    [destinations],
  );

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const greeting = getGreeting();
  const firstName = (userEmail.split("@")[0] || "traveler").replace(/[._-]/g, " ");
  const inspiration = [
    { name: "Ella", img: ellaImg, tag: "Misty tea country" },
    { name: "Galle", img: galleImg, tag: "Colonial fort" },
    { name: "Mirissa", img: mirissaImg, tag: "Whale coast" },
    { name: "Sigiriya", img: sigiriyaImg, tag: "Lion rock" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-accent/10 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-display text-lg">
            <img src={logo} alt="Ayubowan Travels" width={44} height={44} className="w-11 h-11 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]" />
            <div className="leading-tight">
              <div className="text-foreground tracking-wide">Ayubowan <span className="text-gradient-gold">Travels</span></div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-sans">Traveler console</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full text-foreground/80 hover:text-foreground relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            </Button>
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border/60">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-semibold uppercase text-sm">
                {firstName.charAt(0)}
              </div>
              <div className="leading-tight">
                <div className="text-sm text-foreground capitalize font-medium">{firstName}</div>
                <div className="text-[11px] text-muted-foreground">{userEmail}</div>
              </div>
            </div>
            <Link to="/admin"><Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Button></Link>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Hero greeting */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-8 md:p-10 shadow-luxe">
          <div className="absolute -right-10 -top-10 opacity-20">
            <Palmtree className="w-64 h-64 text-primary" />
          </div>
          <div className="relative grid gap-6 md:grid-cols-[1.4fr,1fr] items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-card/60 backdrop-blur border border-border/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-primary/90">
                <Sparkles className="w-3 h-3" /> {greeting.label}
              </div>
              <h1 className="mt-4 font-display text-4xl md:text-5xl text-foreground capitalize">
                {greeting.hello}, {firstName}.
              </h1>
              <p className="mt-3 text-muted-foreground max-w-xl">Your Sri Lanka command center — plan itineraries, follow live logistics, and manage bookings in one immersive space.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1"><Sun className="w-3 h-3 mr-1.5" /> Colombo · 29°C</Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1"><CloudSun className="w-3 h-3 mr-1.5" /> Kandy · 24°C</Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1"><Waves className="w-3 h-3 mr-1.5" /> Mirissa · 27°C</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatTile icon={<MapPin className="w-4 h-4" />} label="Destinations" value={String(destinations.length)} accent="primary" />
              <StatTile icon={<CalendarDays className="w-4 h-4" />} label="Trips planned" value="—" accent="accent" tone="soft" />
              <StatTile icon={<Utensils className="w-4 h-4" />} label="Dishes to try" value={String(foods.length)} accent="accent" />
              <StatTile icon={<TrendingUp className="w-4 h-4" />} label="Season" value="Peak" accent="primary" tone="soft" />
            </div>
          </div>
        </div>

        {/* Inspiration strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {inspiration.map((i) => (
            <button
              key={i.name}
              onClick={() => setSelectedId(destinations.find((d) => d.name.toLowerCase().includes(i.name.toLowerCase()))?.id ?? null)}
              className="group relative h-32 overflow-hidden rounded-2xl border border-white/10 text-left"
            >
              <img src={i.img} alt={i.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-display text-lg text-white">{i.name}</div>
                <div className="text-[11px] text-white/70">{i.tag}</div>
              </div>
              <Heart className="absolute top-3 right-3 w-4 h-4 text-white/70 group-hover:text-accent transition" />
            </button>
          ))}
        </div>

        <Tabs defaultValue="architect" className="w-full mt-8">
          <TabsList className="glass h-12 rounded-full p-1">
            <TabsTrigger value="architect" className="rounded-full px-5"><Sparkles className="mr-2 h-4 w-4" />AI Trip Architect</TabsTrigger>
            <TabsTrigger value="logistics" className="rounded-full px-5"><Train className="mr-2 h-4 w-4" />Live Logistics Hub</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-full px-5"><CalendarDays className="mr-2 h-4 w-4" />My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="architect" className="mt-6">
            <ArchitectPanel destinations={destinations} />
          </TabsContent>

          <TabsContent value="logistics" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
              <Card className="p-2 overflow-hidden h-[560px]">
                <ClientOnly fallback={<div className="h-full w-full grid place-items-center text-muted-foreground">Loading map…</div>}>
                  <Suspense fallback={<div className="h-full w-full grid place-items-center text-muted-foreground">Loading map…</div>}>
                    <DestinationMap pins={pins} onSelect={setSelectedId} selectedId={selectedId} />
                  </Suspense>
                </ClientOnly>
              </Card>
              <LogisticsPanel />
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Tip: tap any marker on the map to see its story and local food recommendations.</div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <BookingsPanel destinations={destinations} />
          </TabsContent>
        </Tabs>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <div className="animate-slide-right">
              <div className="relative -mx-6 -mt-6 h-56 overflow-hidden">
                <div className="absolute inset-0 grid place-items-center" style={{ background: "var(--gradient-hero)" }}>
                  <TypeIcon type={selected.type} />
                </div>
              </div>
              <SheetHeader className="mt-4">
                <Badge variant="secondary" className="w-fit capitalize">{selected.type}</Badge>
                <SheetTitle className="font-display text-3xl">{selected.name}</SheetTitle>
                <SheetDescription>{selected.description}</SheetDescription>
              </SheetHeader>
              {selected.story && (
                <p className="mt-4 text-sm leading-relaxed text-foreground/85 italic border-l-2 border-accent pl-4">
                  {selected.story}
                </p>
              )}
              <div className="mt-6">
                <h4 className="flex items-center gap-2 font-display text-lg"><Utensils className="w-4 h-4 text-accent" />Local food to try</h4>
                <div className="mt-3 space-y-3">
                  {selectedFoods.length === 0 && <p className="text-sm text-muted-foreground">No recommendations yet.</p>}
                  {selectedFoods.map((f) => (
                    <div key={f.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{f.food_name}</div>
                        <div className="text-xs text-muted-foreground">{"$".repeat(f.price_level)}</div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { label: "Good morning", hello: "Ayubowan" };
  if (h < 18) return { label: "Good afternoon", hello: "Suba dawasak" };
  return { label: "Good evening", hello: "Suba sandawak" };
}

function StatTile({ icon, label, value, accent, tone }: { icon: React.ReactNode; label: string; value: string; accent: "primary" | "accent"; tone?: "soft" }) {
  const border = accent === "primary" ? "border-primary/25" : "border-accent/25";
  const bg = tone === "soft"
    ? "bg-card/40"
    : accent === "primary" ? "bg-primary/10" : "bg-accent/10";
  const iconWrap = accent === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent";
  return (
    <div className={`rounded-2xl border ${border} ${bg} backdrop-blur p-4`}>
      <div className={`w-8 h-8 rounded-lg grid place-items-center ${iconWrap}`}>{icon}</div>
      <div className="mt-3 text-2xl font-display text-foreground tabular-nums">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  const cls = "h-20 w-20 text-white/90";
  if (type === "culture") return <Landmark className={cls} />;
  if (type === "nature") return <Mountain className={cls} />;
  if (type === "history") return <History className={cls} />;
  if (type === "adventure") return <Compass className={cls} />;
  return <MapPin className={cls} />;
}

/* ---------- Live Logistics ---------- */
type Vehicle = { id: string; kind: "train" | "bus"; name: string; route: string; eta: string; status: "on-time" | "delayed"; delay: number };

function LogisticsPanel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => seedVehicles());
  useEffect(() => {
    const t = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const roll = Math.random();
          let delay = v.delay;
          if (roll < 0.3) delay = Math.max(0, delay - 1);
          else if (roll > 0.75) delay = Math.min(45, delay + Math.ceil(Math.random() * 4));
          const status: Vehicle["status"] = delay > 5 ? "delayed" : "on-time";
          const etaBase = parseInt(v.eta) + (roll > 0.5 ? -1 : 1);
          return { ...v, delay, status, eta: `${Math.max(1, etaBase)} min` };
        }),
      );
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
      <TrainScheduleFinder />

      <Card className="p-5 h-fit">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Live Trackers</h3>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" /> Live
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Active trains & Southern Expressway buses</p>
        <div className="mt-4 space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-xl border border-border p-3.5 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid place-items-center w-8 h-8 rounded-lg ${v.kind === "train" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}>
                    {v.kind === "train" ? <Train className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{v.name}</div>
                    <div className="text-[11px] text-muted-foreground">{v.route}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold tabular-nums">{v.eta}</div>
                  <div className="mt-0.5 inline-flex items-center gap-1.5 text-[10px]">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${v.status === "on-time" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className={v.status === "on-time" ? "text-emerald-600" : "text-red-600"}>
                      {v.status === "on-time" ? "On time" : `+${v.delay}m`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function seedVehicles(): Vehicle[] {
  return [
    { id: "1", kind: "train", name: "Ella Odyssey", route: "Colombo Fort → Badulla", eta: "12 min", status: "on-time", delay: 0 },
    { id: "2", kind: "train", name: "Podi Menike", route: "Colombo → Nanu Oya", eta: "24 min", status: "delayed", delay: 8 },
    { id: "3", kind: "train", name: "Udarata Menike", route: "Colombo → Kandy", eta: "6 min", status: "on-time", delay: 2 },
    { id: "4", kind: "bus", name: "SLTB EX1-42", route: "Colombo → Galle (E01)", eta: "18 min", status: "on-time", delay: 0 },
    { id: "5", kind: "bus", name: "SLTB EX2-07", route: "Colombo → Matara (E01)", eta: "31 min", status: "delayed", delay: 12 },
    { id: "6", kind: "train", name: "Ruhunu Kumari", route: "Colombo → Matara", eta: "9 min", status: "on-time", delay: 1 },
  ];
}

/* ---------- AI Architect ---------- */
import { generateItinerary, type ItineraryDay } from "@/lib/ai-itinerary.functions";
import { useServerFn } from "@tanstack/react-start";

function ArchitectPanel({ destinations }: { destinations: Destination[] }) {
  const [dest, setDest] = useState("Ella");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<number[]>([800]);
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const generate = useServerFn(generateItinerary);

  async function onGenerate() {
    setLoading(true);
    setItinerary([]);
    try {
      const res = await generate({ data: { destination: dest, days, budget: budget[0], interests: interests || undefined } });
      setItinerary(res.itinerary);
      toast.success("Your itinerary is ready ✨");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const [aiCheckoutOpen, setAiCheckoutOpen] = useState(false);

  const moveDay = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= itinerary.length) return;
    const newItinerary = [...itinerary];
    const temp = newItinerary[index];
    newItinerary[index] = newItinerary[targetIndex];
    newItinerary[targetIndex] = temp;
    const renumbered = newItinerary.map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(renumbered);
    toast.info(`Reordered Day ${index + 1} & Day ${targetIndex + 1}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
      <Card className="glass p-6 h-fit">
        <h3 className="font-display text-xl">AI Trip Architect</h3>
        <p className="mt-1 text-sm text-muted-foreground">Powered by live AI — real destinations, real dishes.</p>
        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <Label>Destination</Label>
            <Input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="e.g. Ella, Galle, Sigiriya" />
            <div className="flex flex-wrap gap-1.5">
              {destinations.slice(0, 5).map((d) => (
                <button key={d.id} type="button" onClick={() => setDest(d.name)} className="rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent hover:text-accent-foreground">
                  {d.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration (days)</Label>
            <Input type="number" min={1} max={14} value={days} onChange={(e) => setDays(parseInt(e.target.value) || 1)} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Budget (USD / traveler)</Label>
              <span className="text-sm font-semibold tabular-nums">${budget[0]}</span>
            </div>
            <Slider min={100} max={2000} step={50} value={budget} onValueChange={setBudget} />
            <div className="flex justify-between text-[11px] text-muted-foreground"><span>$100</span><span>$2000</span></div>
          </div>
          <div className="space-y-2">
            <Label>Interests (optional)</Label>
            <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="wildlife, tea plantations, surfing…" />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full py-6 font-semibold">
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Crafting itinerary…</>) : (<><Sparkles className="mr-2 h-4 w-4 text-amber-400" /> Generate Live AI Itinerary</>)}
          </Button>
        </div>
      </Card>

      <div>
        {loading && (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5 h-64 overflow-hidden relative">
                <div className="absolute inset-0 animate-shimmer" />
              </Card>
            ))}
          </div>
        )}
        {!loading && itinerary.length === 0 && (
          <Card className="p-12 text-center text-muted-foreground">
            <Sparkles className="mx-auto h-8 w-8 text-accent animate-bounce" />
            <p className="mt-3 font-medium">Your customized Sri Lankan journey will bloom here.</p>
            <p className="text-xs mt-1 text-muted-foreground">Select a destination & click Generate above.</p>
          </Card>
        )}
        {!loading && itinerary.length > 0 && (
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="font-display text-2xl">{dest} · {itinerary.length}-day custom itinerary</h4>
                <p className="text-xs text-muted-foreground">Tailored for ${budget[0]} USD budget per traveler</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => exportItineraryPDF({ destination: dest, days: itinerary.length, budget: budget[0], itinerary })}
                  variant="outline"
                  className="rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button
                  onClick={() => setAiCheckoutOpen(true)}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Book This Trip (${budget[0]})
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {itinerary.map((d, idx) => (
                <Card key={d.day} className="p-5 hover-lift space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="rounded-full">Day {d.day}</Badge>
                    <div className="flex gap-1 text-xs">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={idx === 0}
                        onClick={() => moveDay(idx, "left")}
                        className="h-6 px-1.5 text-xs rounded-md"
                        title="Move day earlier"
                      >
                        ← Move
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={idx === itinerary.length - 1}
                        onClick={() => moveDay(idx, "right")}
                        className="h-6 px-1.5 text-xs rounded-md"
                        title="Move day later"
                      >
                        Move →
                      </Button>
                    </div>
                  </div>
                  <h4 className="mt-2 font-display text-xl">{d.title}</h4>
                  <Row icon={<Landmark className="w-4 h-4 text-primary" />} label="Morning" text={d.morning} />
                  <Row icon={<Compass className="w-4 h-4 text-ocean" />} label="Afternoon" text={d.afternoon} />
                  <Row icon={<Mountain className="w-4 h-4 text-jade" />} label="Evening" text={d.evening} />
                  <Row icon={<Utensils className="w-4 h-4 text-accent" />} label="Must-eat" text={d.food} />
                </Card>
              ))}
            </div>

            <BookingCheckoutDialog
              open={aiCheckoutOpen}
              onOpenChange={setAiCheckoutOpen}
              tourTitle={`Custom ${dest} ${itinerary.length}-Day AI Itinerary`}
              pricePerPerson={budget[0]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
function Row({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="mt-3 flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
}


/* ---------- Bookings ---------- */
function BookingsPanel({ destinations }: { destinations: Destination[] }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destId, setDestId] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("500");
  const [notes, setNotes] = useState("");
  const [checkoutTarget, setCheckoutTarget] = useState<{ title: string; price: number } | null>(null);

  async function load() {
    const { data, error } = await supabase.from("bookings").select("*").order("travel_date");
    if (error) return;
    setBookings((data as Booking[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) return;
    const { error } = await supabase.from("bookings").insert({
      user_id: userRes.user.id,
      destination_id: destId || null,
      travel_date: date,
      total_budget: parseFloat(budget) || 0,
      notes: notes || null,
      status: "pending",
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Booking added");
    setNotes(""); setDate(""); setDestId("");
    load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
      <Card className="glass p-6 h-fit">
        <h3 className="font-display text-xl">New booking</h3>
        <form onSubmit={create} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Destination</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={destId} onChange={(e) => setDestId(e.target.value)}>
              <option value="">Choose…</option>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Travel date</Label><Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>Total budget (USD)</Label><Input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
          <div className="space-y-2"><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Whale watching, tea factory tour…" /></div>
          <Button type="submit" className="w-full">Save booking</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {bookings.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground">
            <CalendarDays className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3">No bookings yet. Add your first journey.</p>
          </Card>
        )}
        {bookings.map((b) => {
          const d = destinations.find((x) => x.id === b.destination_id);
          const isPaid = b.status === "confirmed" || b.status === "paid" || (b.notes && b.notes.includes("PAID"));
          const titleName = d?.name ? `${d.name} Tour Package` : "Custom Sri Lanka Expedition";
          return (
            <Card key={b.id} className="p-5 flex items-center justify-between hover-lift">
              <div>
                <div className="font-display text-lg">{d?.name ?? "Custom trip"}</div>
                <div className="text-sm text-muted-foreground">{new Date(b.travel_date).toLocaleDateString(undefined, { dateStyle: "long" })} · ${b.total_budget} USD</div>
                {b.notes && <div className="mt-1 text-sm text-muted-foreground">{b.notes}</div>}
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={isPaid ? "default" : "secondary"} className={`capitalize ${isPaid ? "bg-emerald-600 text-white" : ""}`}>
                  {isPaid ? "Paid & Confirmed" : b.status}
                </Badge>
                {!isPaid ? (
                  <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCheckoutTarget({ title: titleName, price: b.total_budget || 500 })}>
                    Pay Online
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={() => remove(b.id)}>Remove</Button>
              </div>
            </Card>
          );
        })}

        {checkoutTarget && (
          <BookingCheckoutDialog
            open={!!checkoutTarget}
            onOpenChange={(open) => {
              if (!open) {
                setCheckoutTarget(null);
                load();
              }
            }}
            tourTitle={checkoutTarget.title}
            pricePerPerson={checkoutTarget.price}
          />
        )}
      </div>
    </div>
  );
}
