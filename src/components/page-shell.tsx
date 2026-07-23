import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.history.back()}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );
}

export function PageShell({
  eyebrow,
  title,
  lead,
  heroImage,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  heroImage: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="relative h-[70svh] min-h-[460px] w-full overflow-hidden">
        <img src={heroImage} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover scale-105 animate-fade-in-slow" />
        <div className="absolute inset-0 gradient-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 pt-32">
          <div className="glass inline-flex w-fit rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-white animate-fade-up">
            {eyebrow}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-white md:text-7xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            {title}
          </h1>
          {lead && (
            <p className="mt-5 max-w-2xl text-lg text-white/85 animate-fade-up" style={{ animationDelay: "240ms" }}>
              {lead}
            </p>
          )}
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <BackButton />
        </div>
        {children}
      </main>
      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Ayubowan Travels · <Link to="/" className="hover:text-primary">Return home</Link>
      </footer>
    </div>
  );
}
