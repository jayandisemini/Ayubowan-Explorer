import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/page-shell";
import cuisineImg from "@/assets/cuisine.jpg";
import { useState } from "react";
import { Flame, Clock, MapPin, Utensils, ArrowRight, ChevronDown, ChefHat, X, Send, Users, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/cuisine")({
  component: CuisinePage,
  head: () => ({
    meta: [
      { title: "Cuisine · Ayubowan Travels" },
      { name: "description", content: "Hoppers, kottu, ambul thiyal — the flavors of Sri Lanka on a banana leaf, region by region." },
      { property: "og:title", content: "Sri Lankan Cuisine · Ayubowan Travels" },
      { property: "og:description", content: "A guide to the island's most beloved dishes and where to try them." },
    ],
  }),
});

type Dish = {
  name: string;
  heat: number;
  region: string;
  body: string;
  ingredients: string[];
  bestTime: string;
  whereToTry: string;
  pairing: string;
};

const dishes: Dish[] = [
  {
    name: "Egg Hoppers (Bittara Appa)",
    heat: 1,
    region: "Island-wide",
    body: "Bowl-shaped rice-flour pancakes with a soft egg cradled in the middle. Best at dawn with kiri hodi and pol sambol.",
    ingredients: ["Rice flour batter", "Coconut milk", "Egg", "Yeast"],
    bestTime: "Breakfast, 6 – 9am",
    whereToTry: "Street-side hoppers stands in Colombo 7 or Galle Fort",
    pairing: "Kiri hodi (coconut gravy) + pol sambol",
  },
  {
    name: "Kottu Roti",
    heat: 3,
    region: "Colombo · Kandy",
    body: "Shredded godhamba roti stir-fried with vegetables, egg, and chicken or cheese — chopped to a rhythmic clang on a hot iron plate.",
    ingredients: ["Godhamba roti", "Egg", "Leeks", "Carrot", "Chicken or cheese"],
    bestTime: "Late evening, after 8pm",
    whereToTry: "Hotel de Pilawoos, Colombo; Kandy night stalls",
    pairing: "A chilled Lion lager",
  },
  {
    name: "Rice & Curry",
    heat: 2,
    region: "Everywhere",
    body: "A daily ritual: five to seven curries orbiting a mound of red or white rice. Dhal, jackfruit, beetroot, gotu kola, papadum.",
    ingredients: ["Red or white rice", "Dhal", "Jackfruit", "Beetroot", "Papadum"],
    bestTime: "Lunch, 12 – 3pm",
    whereToTry: "Village homes in Sigiriya or local rice & curry cafés",
    pairing: "Seeni sambol and a crispy papadum",
  },
  {
    name: "Lamprais",
    heat: 2,
    region: "Colombo (Burgher)",
    body: "Dutch-Burgher heritage — rice, meat curry, frikkadels, seeni sambol and blachan, all wrapped in banana leaf and baked.",
    ingredients: ["Ghee rice", "Meat curry", "Frikkadels", "Seeni sambol", "Blachan"],
    bestTime: "Sunday lunch",
    whereToTry: "The VOC Café or Colombo Burgher kitchens",
    pairing: "Cucumber raita and chilled ginger beer",
  },
  {
    name: "Ambul Thiyal",
    heat: 3,
    region: "Southern coast",
    body: "Sour fish curry cooked dry with goraka — tuna cubes turned deep mahogany, tart, salty, and shelf-stable for days.",
    ingredients: ["Tuna", "Goraka", "Black pepper", "Curry leaves", "Turmeric"],
    bestTime: "Lunch by the beach",
    whereToTry: "Matara and Weligama beachfront seafood grills",
    pairing: "Pol sambol and steamed rice",
  },
  {
    name: "Pol Sambol",
    heat: 3,
    region: "Every table",
    body: "Freshly grated coconut pounded with chili, lime, shallots and Maldive fish. The island's most beloved condiment.",
    ingredients: ["Grated coconut", "Chili", "Lime", "Shallots", "Maldive fish"],
    bestTime: "Any meal, any time",
    whereToTry: "Every local restaurant and home kitchen",
    pairing: "Hoppers, string hoppers, or plain rice",
  },
  {
    name: "String Hoppers (Idiyappa)",
    heat: 1,
    region: "Central hills",
    body: "Nests of steamed rice noodles served with dhal, kiri hodi coconut gravy, and a fiery lunu miris.",
    ingredients: ["Rice flour dough", "Dhal", "Kiri hodi", "Lunu miris"],
    bestTime: "Breakfast or dinner",
    whereToTry: "Hill-country guesthouses in Ella and Nuwara Eliya",
    pairing: "Dhal curry and coconut sambol",
  },
  {
    name: "Watalappan",
    heat: 0,
    region: "Malay-Muslim tradition",
    body: "Silky steamed pudding of jaggery, coconut milk, egg and cardamom — Sri Lanka's answer to crème caramel.",
    ingredients: ["Jaggery", "Coconut milk", "Egg", "Cardamom", "Nutmeg"],
    bestTime: "After dinner",
    whereToTry: "Galle Fort Muslim sweet shops and Colombo weddings",
    pairing: "A strong Ceylon black tea",
  },
];

function HeatMeter({ heat }: { heat: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`Spice level ${heat} of 3`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          className={`w-3.5 h-3.5 ${i < heat ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function TasteModal({ dish, open, onClose }: { dish: Dish; open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Tasting request sent", {
      description: `Our culinary team will curate a ${dish.name} experience for you.`,
    });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="relative h-28 overflow-hidden">
          <img
            src={cuisineImg}
            alt=""
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] uppercase tracking-widest text-primary">{dish.region}</span>
            <h3 className="font-display text-2xl leading-tight">{dish.name}</h3>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Request a {dish.name} tasting</DialogTitle>
            <DialogDescription>Send your details and we will curate a culinary experience around this dish.</DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Want this flavor woven into your trip? Tell us when you are traveling and we will arrange the best place to try {dish.name}.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="taste-name" className="text-xs uppercase tracking-wide text-muted-foreground">Name</Label>
                <Input id="taste-name" placeholder="Your name" required className="rounded-xl bg-secondary/40 border-border/40" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="taste-email" className="text-xs uppercase tracking-wide text-muted-foreground">Email</Label>
                <Input id="taste-email" type="email" placeholder="you@example.com" required className="rounded-xl bg-secondary/40 border-border/40" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="taste-dates" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Travel dates
                </Label>
                <Input id="taste-dates" placeholder="e.g. 12 – 20 Mar 2026" className="rounded-xl bg-secondary/40 border-border/40" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="taste-party" className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Travelers
                </Label>
                <Input id="taste-party" type="number" min={1} placeholder="2" className="rounded-xl bg-secondary/40 border-border/40" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taste-note" className="text-xs uppercase tracking-wide text-muted-foreground">Note</Label>
              <Textarea
                id="taste-note"
                placeholder={`Anything specific about ${dish.name}? Dietary needs, preferred location?`}
                className="min-h-[90px] rounded-xl bg-secondary/40 border-border/40 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitted}
                className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                {submitted ? (
                  <>Sent</>
                ) : (
                  <>
                    Send request <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  const [open, setOpen] = useState(false);
  const [tasteOpen, setTasteOpen] = useState(false);

  return (
    <>
      <article className="rounded-3xl bg-card border border-border/40 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] hover:border-border/60">
        {/* Card header — always visible */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-widest text-primary">{dish.region}</span>
                <HeatMeter heat={dish.heat} />
              </div>
              <h3 className="mt-2 font-display text-2xl leading-tight">{dish.name}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{dish.body}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
            aria-expanded={open}
          >
            <ChefHat className="h-4 w-4 text-primary" />
            {open ? "Hide taste guide" : "View taste guide"}
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Expandable details panel */}
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border/30 bg-gradient-to-b from-secondary/20 to-transparent px-6 pb-6 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-card/60 p-4 border border-border/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade/15">
                    <Utensils className="h-4 w-4 text-jade" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Key ingredients</div>
                    <div className="mt-1 text-sm text-foreground leading-snug">{dish.ingredients.join(" · ")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-card/60 p-4 border border-border/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sunset/15">
                    <Clock className="h-4 w-4 text-sunset" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Best time</div>
                    <div className="mt-1 text-sm text-foreground leading-snug">{dish.bestTime}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-card/60 p-4 border border-border/30 sm:col-span-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean/15">
                    <MapPin className="h-4 w-4 text-ocean" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Where to try</div>
                    <div className="mt-1 text-sm text-foreground leading-snug">{dish.whereToTry}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Perfect with: <span className="text-primary font-medium">{dish.pairing}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTasteOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  Taste it <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <TasteModal dish={dish} open={tasteOpen} onClose={() => setTasteOpen(false)} />
    </>
  );
}

function CuisinePage() {
  const { data: dbDishes = [] } = useQuery({
    queryKey: ["cuisine-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_recommendations")
        .select("id, food_name, description, price_level, destinations(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any): Dish => ({
        name: r.food_name,
        heat: Math.min(3, Math.max(0, (r.price_level ?? 1) - 1)),
        region: r.destinations?.name ?? "Sri Lanka",
        body: r.description,
        ingredients: [],
        bestTime: "Ask our team",
        whereToTry: r.destinations?.name ?? "Across the island",
        pairing: "Chef's recommendation",
      }));
    },
  });

  const all = [...dbDishes, ...dishes];

  return (
    <PageShell
      eyebrow="Taste of the island"
      title={<>An island <span className="text-gradient-gold">on a banana leaf.</span></>}
      lead="Sri Lankan food is a mosaic of Sinhalese, Tamil, Malay, Moor and Burgher traditions — bold spice, gentle coconut, sour goraka and the sea in every bite."
      heroImage={cuisineImg}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {all.map((d, i) => (
          <DishCard key={`${d.name}-${i}`} dish={d} />
        ))}
      </div>

      <div className="mt-16 rounded-3xl p-10 md:p-14 text-white" style={{ background: "var(--gradient-hero)" }}>
        <h2 className="font-display text-3xl md:text-4xl">Culinary trails, on request.</h2>
        <p className="mt-3 max-w-2xl text-white/85">Spice garden walks in Matale, night-market crawls through Pettah, and hands-on cook-ups in a Galle Fort courtyard — we can weave any of these into your itinerary.</p>
      </div>
    </PageShell>
  );
}
