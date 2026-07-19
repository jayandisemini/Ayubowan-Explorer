import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { getTour, tours, type Tour } from "@/lib/tours-data";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/reviews-section";
import { Clock, Users, Sparkles, Check, X, ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/tours/$slug")({
  component: TourDetailPage,
  loader: ({ params }) => {
    const tour = getTour(params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tour not found" }, { name: "robots", content: "noindex" }] };
    const { tour } = loaderData;
    return {
      meta: [
        { title: `${tour.title} · ${tour.duration} · Ayubowan Travels` },
        { name: "description", content: tour.body },
        { property: "og:title", content: `${tour.title} — Sri Lanka` },
        { property: "og:description", content: tour.body },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell eyebrow="Not found" title="Tour not found" heroImage={tours[0].image}>
      <p className="text-muted-foreground">
        We couldn't find that tour. <Link to="/tours" className="text-primary hover:underline">Browse all tours</Link>.
      </p>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell eyebrow="Error" title="Something went wrong" heroImage={tours[0].image}>
      <p className="text-muted-foreground">{error.message}</p>
    </PageShell>
  ),
});

function TourDetailPage() {
  const { tour } = Route.useLoaderData() as { tour: Tour };
  const related = tours.filter((t) => t.slug !== tour.slug).slice(0, 3);

  return (
    <PageShell
      eyebrow={tour.tag}
      title={<>{tour.title}<span className="text-gradient-gold">.</span></>}
      lead={tour.longBody}
      heroImage={tour.image}
    >
      <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> All tours
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="font-display text-3xl mb-6">Day by day</h2>
            <ol className="space-y-4">
              {tour.itinerary.map((d) => (
                <li key={d.day} className="rounded-2xl border border-border/40 bg-card/60 p-6 hover-lift">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-xs uppercase tracking-[0.3em] text-primary shrink-0">Day {String(d.day).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-xl">{d.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-3xl mb-6">What's included</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {tour.includes.map((inc) => (
                <div key={inc} className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/60 p-4">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{inc}</span>
                </div>
              ))}
              {tour.excludes.map((ex) => (
                <div key={ex} className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/30 p-4 opacity-70">
                  <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{ex}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl mb-6">Gallery</h2>
            <div className="grid grid-cols-3 gap-3">
              {tour.gallery.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                  <img src={src} alt={`${tour.title} ${i + 1}`} loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>

          <ReviewsSection entityType="tour" entitySlug={tour.slug} entityName={tour.title} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border/40 bg-card/60 p-6 sticky top-32">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">From</div>
            <div className="mt-1 font-display text-4xl text-gradient-gold">{tour.price}</div>
            <div className="text-xs text-muted-foreground">per person, twin share</div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {tour.duration}</div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {tour.group}</div>
            </div>

            <Link to="/dashboard" className="block mt-6">
              <Button className="w-full rounded-full"><Sparkles className="mr-2 w-4 h-4" /> Customize this tour</Button>
            </Link>
            <Link to="/contact" className="block mt-2">
              <Button variant="outline" className="w-full rounded-full">Speak to a specialist</Button>
            </Link>
          </div>
        </aside>
      </div>

      <section className="mt-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl">Other journeys</h2>
          <Link to="/tours" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            All tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((t) => (
            <Link key={t.slug} to="/tours/$slug" params={{ slug: t.slug }} className="group overflow-hidden rounded-3xl bg-card border border-border/40 hover-lift block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <div className="text-xs text-primary uppercase tracking-widest">{t.duration}</div>
                <h3 className="mt-1 font-display text-xl">{t.title}</h3>
                <div className="mt-2 text-sm text-muted-foreground">from {t.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
