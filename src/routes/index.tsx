import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Landmark, Mountain, Utensils, Sparkles, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-sigiriya.jpg";
import ellaImg from "@/assets/ella.jpg";
import mirissaImg from "@/assets/mirissa.jpg";
import cuisineImg from "@/assets/cuisine.jpg";
import galleImg from "@/assets/galle.jpg";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site-nav";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img src={heroImg} alt="Sunrise over Sigiriya rock fortress" width={1920} height={1200} fetchPriority="high" decoding="async"
          className="absolute inset-0 h-full w-full object-cover scale-105 animate-fade-in-slow" />
        <div className="absolute inset-0 gradient-hero-overlay" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-start justify-center px-6 pt-32 pb-16">
          <div className="glass rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-white animate-fade-up">
            ආයුබෝවන් · Welcome to Sri Lanka
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-white md:text-7xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            The <span className="text-gradient-gold">Pearl of the Indian Ocean</span>, curated for the modern traveler.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 animate-fade-up" style={{ animationDelay: "240ms" }}>
            AI-crafted itineraries, live train logistics, and immersive storytelling — from the misty peaks of Ella to the golden shores of Mirissa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "360ms" }}>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/dashboard"><Sparkles className="mr-2 h-4 w-4" /> Begin your journey</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white"
              onClick={() => document.getElementById("experiences")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Explore experiences <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Floating destination chips */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "500ms" }}>
            {[
              { name: "Sigiriya", tag: "UNESCO" },
              { name: "Ella", tag: "Tea Country" },
              { name: "Mirissa", tag: "Blue Whales" },
            ].map((d) => (
              <div key={d.name} className="glass rounded-2xl px-4 py-3 text-white">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
                  <MapPin className="w-3 h-3" /> {d.tag}
                </div>
                <div className="mt-1 font-display text-lg">{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section id="experiences" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Three journeys, one island</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Crafted for the curious traveler.</h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <PillarCard id="heritage" title="Cultural Heritage" body="Ancient kingdoms, sacred temples, and the living rituals of Kandy's Perahera."
            image={heroImg} icon={<Landmark className="w-5 h-5" />} tag="Sigiriya · Kandy · Anuradhapura" />
          <PillarCard id="expeditions" title="Scenic Expeditions" body="Ride the Podi Menike through tea country, surf Mirissa dawns, hike Ella Rock at first light."
            image={ellaImg} icon={<Mountain className="w-5 h-5" />} tag="Ella · Mirissa · Yala" />
          <PillarCard id="cuisine" title="Authentic Cuisine" body="Egg hoppers, kottu roti, sour ambul thiyal — the island on a banana leaf."
            image={cuisineImg} icon={<Utensils className="w-5 h-5" />} tag="Pettah · Galle · Kandy" />
        </div>
      </section>

      {/* SPOTLIGHT */}
      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-6 md:grid-cols-2">
        <SpotlightCard image={mirissaImg} kicker="Southern Coast" title="Mirissa & the whales at dawn"
          body="Slide out on a wooden dhoni before sunrise. The largest animals on Earth cruise these waters between November and April." />
        <SpotlightCard image={galleImg} kicker="Colonial Legacy" title="Galle Fort by lamplight"
          body="Cobblestone lanes, Dutch ramparts, and the sound of the Indian Ocean crashing against 400-year-old walls." />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-white" style={{ background: "var(--gradient-hero)" }}>
          <div className="max-w-2xl">
            <h3 className="font-display text-3xl md:text-5xl">Let AI plan your perfect three days.</h3>
            <p className="mt-4 text-white/85">Tell us your destination, days, and budget. We'll return a scenic, culturally rich, and delicious itinerary in seconds.</p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link to="/dashboard"><Sparkles className="mr-2 h-4 w-4" /> Launch the AI Trip Architect</Link>
            </Button>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />


      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Ayubowan Travels · Made with 🌴 for wanderers of Sri Lanka
      </footer>
    </div>
  );
}

function PillarCard({ id, title, body, image, icon, tag }: { id: string; title: string; body: string; image: string; icon: React.ReactNode; tag: string }) {
  return (
    <a id={id} href="/dashboard" className="group relative overflow-hidden rounded-3xl hover-lift block">
      <img src={image} alt={title} loading="lazy" className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-white">{icon}{tag}</div>
        <h3 className="mt-3 font-display text-2xl">{title}</h3>
        <p className="mt-2 text-sm text-white/85">{body}</p>
      </div>
    </a>
  );
}

function SpotlightCard({ image, kicker, title, body }: { image: string; kicker: string; title: string; body: string }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-card hover-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <div className="text-xs uppercase tracking-widest text-primary">{kicker}</div>
        <h3 className="mt-2 font-display text-2xl">{title}</h3>
        <p className="mt-2 text-muted-foreground">{body}</p>
      </div>
    </article>
  );
}
