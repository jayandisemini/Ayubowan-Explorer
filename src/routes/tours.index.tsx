import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import ellaImg from "@/assets/ella.jpg";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check, ArrowRight } from "lucide-react";
import { tours } from "@/lib/tours-data";

export const Route = createFileRoute("/tours/")({
  component: ToursPage,
  head: () => ({
    meta: [
      { title: "Tours & Itineraries · Ayubowan Travels" },
      { name: "description", content: "Handcrafted 5–14 day Sri Lanka itineraries — cultural triangle, hill country, wildlife safaris, and coast." },
      { property: "og:title", content: "Sri Lanka Tours · Ayubowan Travels" },
      { property: "og:description", content: "Curated private and small-group itineraries across Sri Lanka." },
    ],
  }),
});

function ToursPage() {
  return (
    <PageShell
      eyebrow="Curated journeys"
      title={<>Itineraries, <span className="text-gradient-gold">artfully arranged.</span></>}
      lead="Every tour is privately guided or capped at eight travelers. Fixed departures or fully customized — the choice is yours."
      heroImage={ellaImg}
    >
      <div className="grid gap-8">
        {tours.map((t, i) => (
          <article key={t.slug} className={`grid gap-6 md:grid-cols-2 items-stretch rounded-3xl overflow-hidden bg-card border border-border/40 hover-lift ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
            <Link to="/tours/$slug" params={{ slug: t.slug }} className="relative aspect-[4/3] md:aspect-auto overflow-hidden block group">
              <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4 glass-dark rounded-full px-3 py-1 text-[11px] uppercase tracking-wider font-medium shadow-sm">{t.tag}</div>
            </Link>
            <div className="p-8 flex flex-col">
              <h3 className="font-display text-3xl">
                <Link to="/tours/$slug" params={{ slug: t.slug }} className="hover:text-primary transition-colors">{t.title}</Link>
              </h3>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {t.duration}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> {t.group}</span>
                <span className="inline-flex items-center gap-1.5 text-primary font-medium">from {t.price} pp</span>
              </div>
              <p className="mt-4 text-muted-foreground">{t.body}</p>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {t.includes.slice(0, 4).map((inc) => (
                  <li key={inc} className="inline-flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-primary shrink-0" /><span className="text-foreground/80">{inc}</span></li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Button asChild className="rounded-full">
                  <Link to="/tours/$slug" params={{ slug: t.slug }}>View itinerary <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full"><Link to="/contact">Speak to us</Link></Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
