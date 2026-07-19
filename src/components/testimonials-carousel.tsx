import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  entity_slug: string | null;
};

const FALLBACK: Review[] = [
  { id: "f1", rating: 5, title: "A journey we'll never forget", body: "Every detail was thought through — from the sunrise at Sigiriya to the private cooking class in Galle. Ayubowan Travels turned two weeks into a lifetime memory.", entity_slug: "Classic Ceylon" },
  { id: "f2", rating: 5, title: "Truly luxurious, truly local", body: "Boutique villas, warm hosts, and guides who felt like friends. The tea-country train ride at dawn was pure magic.", entity_slug: "Ella" },
  { id: "f3", rating: 5, title: "Wildlife dream come true", body: "We saw leopards at Yala and blue whales off Mirissa in the same trip. Impeccably organized, effortlessly relaxed.", entity_slug: "Wildlife & Whales" },
];

export function TestimonialsCarousel() {
  const { data } = useQuery({
    queryKey: ["testimonials-approved"],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, title, body, entity_slug")
        .eq("approved", true)
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error || !data || data.length === 0) return FALLBACK;
      return data as Review[];
    },
  });

  const reviews = data ?? FALLBACK;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const current = reviews[idx];
  if (!current) return null;

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-xs uppercase tracking-widest text-primary">Traveler stories</div>
        <h2 className="mt-2 font-display text-3xl md:text-5xl">Words from the road</h2>
      </div>
      <div className="max-w-3xl mx-auto glass rounded-3xl border border-border/50 p-8 md:p-12 relative overflow-hidden">
        <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/20" />
        <div key={current.id} className="animate-fade-up">
          <div className="flex justify-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < current.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          {current.title && <h3 className="font-display text-2xl md:text-3xl text-center">{current.title}</h3>}
          <p className="mt-4 text-center text-muted-foreground text-lg leading-relaxed">"{current.body}"</p>
          {current.entity_slug && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              on <span className="text-primary capitalize">{current.entity_slug.replace(/-/g, " ")}</span>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
