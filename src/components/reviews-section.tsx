import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

type Review = {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
};

function Stars({ value, onChange, size = 18 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= value ? "fill-primary text-primary" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection({ entityType, entitySlug, entityName }: { entityType: "tour" | "destination"; entitySlug: string; entityName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, rating, title, body, created_at")
      .eq("entity_type", entityType)
      .eq("entity_slug", entitySlug)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entitySlug]);

  const myReview = userId ? reviews.find((r) => r.user_id === userId) : undefined;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (body.trim().length < 4) return toast.error("Please write a few words about your experience.");
    setSubmitting(true);
    const payload = {
      user_id: userId,
      entity_type: entityType,
      entity_slug: entitySlug,
      rating,
      title: title.trim() || null,
      body: body.trim(),
    };
    const { error } = myReview
      ? await supabase.from("reviews").update(payload).eq("id", myReview.id)
      : await supabase.from("reviews").insert(payload);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(myReview ? "Review updated" : "Thanks for sharing!");
    setTitle(""); setBody(""); setRating(5);
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review removed");
    load();
  }

  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl inline-flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" /> Traveler reviews
          </h2>
          {reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <Stars value={Math.round(avg)} />
              <span className="font-medium text-foreground">{avg.toFixed(1)}</span>
              <span>· {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
            </div>
          )}
        </div>
      </div>

      {userId ? (
        <form onSubmit={submit} className="rounded-3xl border border-border/40 bg-card/60 p-6 space-y-4 mb-10">
          <div className="text-sm text-muted-foreground">
            {myReview ? "Update your review" : `Share your experience of ${entityName}`}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Rating</span>
            <Stars value={rating} onChange={setRating} size={22} />
          </div>
          <Input
            placeholder="Headline (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <Textarea
            placeholder={myReview ? myReview.body : "What did you love? Any tips for the next traveler?"}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={4}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="rounded-full">
              {submitting ? "Sending…" : myReview ? "Update review" : "Post review"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-3xl border border-border/40 bg-card/60 p-6 mb-10 text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to leave a review.
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="text-sm text-muted-foreground">No reviews yet — be the first to share.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border/40 bg-card/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Stars value={r.rating} size={14} />
                  {r.title && <h3 className="mt-1 font-display text-lg">{r.title}</h3>}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  {r.user_id === userId && (
                    <button
                      onClick={() => remove(r.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
