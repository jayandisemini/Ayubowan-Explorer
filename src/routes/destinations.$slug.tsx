import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { getDestination, destinations, type Destination } from "@/lib/destinations-data";
import { MapPin, Star, Calendar, Clock, Check, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/reviews-section";


export const Route = createFileRoute("/destinations/$slug")({
  component: DestinationDetailPage,
  loader: ({ params }) => {
    const dest = getDestination(params.slug);
    if (!dest) throw notFound();
    return { dest };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Destination not found" }, { name: "robots", content: "noindex" }] };
    const { dest } = loaderData;
    return {
      meta: [
        { title: `${dest.name} · ${dest.region} · Ayubowan Travels` },
        { name: "description", content: dest.body },
        { property: "og:title", content: `${dest.name} — ${dest.region} | Ayubowan Travels` },
        { property: "og:description", content: dest.body },
        { property: "og:image", content: dest.image },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${dest.name} — ${dest.region}` },
        { name: "twitter:description", content: dest.body },
        { name: "twitter:image", content: dest.image },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell eyebrow="Not found" title="Destination not found" heroImage={destinations[0].image}>
      <p className="text-muted-foreground">We couldn't find that destination. <Link to="/destinations" className="text-primary hover:underline">Browse all destinations</Link>.</p>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell eyebrow="Error" title="Something went wrong" heroImage={destinations[0].image}>
      <p className="text-muted-foreground">{error.message}</p>
    </PageShell>
  ),
});

function DestinationDetailPage() {
  const { dest } = Route.useLoaderData() as { dest: Destination };

  const related = destinations.filter((d) => d.slug !== dest.slug).slice(0, 3);

  return (
    <PageShell
      eyebrow={dest.region}
      title={<>{dest.name}<span className="text-gradient-gold">.</span></>}
      lead={dest.body}
      heroImage={dest.image}
    >
      <Link to="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> All destinations
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="font-display text-3xl mb-6">Highlights</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {dest.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/60 p-4">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl mb-6">Signature experiences</h2>
            <div className="space-y-4">
              {dest.experiences.map((e, i) => (
                <div key={e.title} className="rounded-2xl border border-border/40 bg-card/60 p-6 hover-lift">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-primary tabular-nums">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-xl">{e.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl mb-6">Gallery</h2>
            <div className="grid grid-cols-3 gap-3">
              {dest.gallery.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                  <img src={src} alt={`${dest.name} ${i + 1}`} loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl mb-6 inline-flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" /> Insider tips
            </h2>
            <ul className="space-y-3">
              {dest.tips.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="text-primary">✦</span> {t}
                </li>
              ))}
            </ul>
          </section>

          <ReviewsSection entityType="destination" entitySlug={dest.slug} entityName={dest.name} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border/40 bg-card/60 p-6 sticky top-32">
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">{dest.rating}</span>
              <span className="text-muted-foreground">traveler rating</span>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest"><MapPin className="w-3 h-3" /> Region</div>
                <div className="mt-1 font-medium">{dest.region}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest"><Calendar className="w-3 h-3" /> Best time</div>
                <div className="mt-1 font-medium">{dest.bestTime}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest"><Clock className="w-3 h-3" /> Suggested stay</div>
                <div className="mt-1 font-medium">{dest.duration}</div>
              </div>
            </div>
            <Link to="/contact" className="block mt-6">
              <Button className="w-full">Plan a trip to {dest.name}</Button>
            </Link>
            <Link to="/tours" className="block mt-2">
              <Button variant="outline" className="w-full">Browse tours</Button>
            </Link>
          </div>
        </aside>
      </div>

      <section className="mt-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl">You may also love</h2>
          <Link to="/destinations" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            All destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((d) => (
            <Link key={d.slug} to="/destinations/$slug" params={{ slug: d.slug }} className="group overflow-hidden rounded-3xl bg-card border border-border/40 hover-lift block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <div className="text-xs text-primary uppercase tracking-widest">{d.region}</div>
                <h3 className="mt-1 font-display text-xl">{d.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
