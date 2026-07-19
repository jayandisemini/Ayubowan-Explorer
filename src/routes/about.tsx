import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import galleImg from "@/assets/galle.jpg";
import { Award, Leaf, Heart, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About · Ayubowan Travels" },
      { name: "description", content: "Ayubowan Travels is a family-run luxury travel house crafting authentic, sustainable journeys across Sri Lanka since 2011." },
      { property: "og:title", content: "About Ayubowan Travels" },
      { property: "og:description", content: "Family-run luxury Sri Lanka specialists since 2011." },
    ],
  }),
});

const stats = [
  { value: "13", label: "Years on the island" },
  { value: "4,200+", label: "Travelers hosted" },
  { value: "38", label: "Local partner hotels" },
  { value: "100%", label: "Locally owned" },
];

const values = [
  { icon: Heart, title: "Ayubowan means 'may you live long'", body: "The greeting we're named for is a wish — for you, for our guides, for the villages you visit. It shapes how we host." },
  { icon: Leaf, title: "Community-first tourism", body: "We work with family-run bungalows and independent guides. A meaningful share of every booking stays in the villages you pass through." },
  { icon: Award, title: "Slow, considered travel", body: "No 40-stop coach tours. Fewer places, more time — a temple at dawn, a village lunch, a sunset from your own veranda." },
  { icon: Users, title: "A team who lives here", body: "Our fifteen guides, drivers and planners live between Colombo, Kandy and Galle. They know which train seat catches the tea-country view." },
];

function AboutPage() {
  return (
    <PageShell
      eyebrow="Our story"
      title={<>A small team, <span className="text-gradient-gold">deeply rooted.</span></>}
      lead="Ayubowan Travels was founded in Galle in 2011 by two siblings who grew up racing tuk-tuks along the southern coast. Today we host thoughtful travelers from thirty-plus countries."
      heroImage={galleImg}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-border/40 bg-card p-6 text-center">
            <div className="font-display text-4xl text-gradient-gold">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">What we believe</div>
          <h2 className="mt-3 font-display text-4xl">Travel that gives back as much as it gives.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We built Ayubowan Travels because too many Sri Lanka itineraries treat the island as a checklist — rock, elephant, beach, done. Our journeys move slower, stop for conversations, and put money into the hands of the people who make each place worth visiting.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every itinerary is designed by a planner who has personally walked the paths, tasted the food, and slept in the rooms we recommend.
          </p>
        </div>
        <div className="grid gap-4">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4 rounded-2xl border border-border/40 bg-card p-5">
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary/15 text-primary shrink-0">
                <v.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
