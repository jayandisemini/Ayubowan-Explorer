import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import heroImg from "@/assets/hero-sigiriya.jpg";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { destinations } from "@/lib/destinations-data";

export const Route = createFileRoute("/destinations/")({
  component: DestinationsPage,
  head: () => ({
    meta: [
      { title: "Destinations · Ayubowan Travels" },
      { name: "description", content: "From Sigiriya's rock fortress to Mirissa's blue whales — explore Sri Lanka's most iconic destinations." },
      { property: "og:title", content: "Sri Lanka Destinations · Ayubowan Travels" },
      { property: "og:description", content: "Curated destinations across the Pearl of the Indian Ocean." },
    ],
  }),
});

function DestinationsPage() {
  return (
    <PageShell
      eyebrow="Where to go"
      title={<>Nine provinces. <span className="text-gradient-gold">One unforgettable island.</span></>}
      lead="From ancient rock kingdoms to blue-whale bays, every corner of Sri Lanka rewards curiosity. Here are our most-loved destinations."
      heroImage={heroImg}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Link
            key={d.slug}
            to="/destinations/$slug"
            params={{ slug: d.slug }}
            className="group overflow-hidden rounded-3xl bg-card border border-border/40 hover-lift block"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-[11px] uppercase tracking-wider text-white">{d.tag}</div>
              <div className="absolute bottom-3 right-3 glass rounded-full px-3 py-1 text-xs text-white inline-flex items-center gap-1">
                <Star className="w-3 h-3 fill-primary text-primary" /> {d.rating}
              </div>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-primary uppercase tracking-widest"><MapPin className="w-3 h-3" /> {d.region}</div>
              <h3 className="mt-2 font-display text-2xl">{d.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d.body}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-medium">
                Explore {d.name}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
