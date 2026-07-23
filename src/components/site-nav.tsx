import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, Phone, Mail, MapPin, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks: { label: string; to: "/destinations" | "/tours" | "/cuisine" | "/about" | "/contact" }[] = [
  { label: "Destinations", to: "/destinations" },
  { label: "Tours", to: "/tours" },
  { label: "Cuisine", to: "/cuisine" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteNav() {
  const [authed, setAuthed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-white/10 bg-background/70 backdrop-blur-md text-white/80 text-xs">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> Colombo, Sri Lanka</span>
            <span className="inline-flex items-center gap-2"><Phone className="w-3 h-3 text-primary" /> +94 11 234 5678</span>
            <span className="inline-flex items-center gap-2"><Mail className="w-3 h-3 text-primary" /> hello@ayubowantravels.lk</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-70">Follow:</span>
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">YouTube</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl shadow-luxe border-b border-white/10" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Ayubowan Travels" width={48} height={48} className="w-12 h-12 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />
            <div className="leading-tight">
              <div className="font-display text-xl text-white tracking-wide">Ayubowan</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Travels · Sri Lanka</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="relative px-4 py-2 text-sm font-medium text-white/85 hover:text-primary transition-colors group"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
            <Link to="/dashboard" className="relative px-4 py-2 text-sm font-medium text-white/85 hover:text-primary transition-colors inline-flex items-center gap-1">
              Dashboard <ChevronDown className="w-3 h-3" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {authed ? (
              <Button asChild size="sm" className="hidden md:inline-flex rounded-full">
                <Link to="/dashboard">Open Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link to="/auth" className="hidden md:inline text-sm text-white/85 hover:text-primary">Sign in</Link>
                <Button asChild size="sm" className="hidden md:inline-flex rounded-full">
                  <Link to="/dashboard">Book Now</Link>
                </Button>
              </>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden grid place-items-center w-10 h-10 rounded-full border border-white/20 text-white"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-white/85 hover:bg-white/5 hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-white/85 hover:bg-white/5 hover:text-primary">Dashboard</Link>
              <Button asChild className="mt-2 rounded-full">
                <Link to={authed ? "/dashboard" : "/auth"}>{authed ? "Open Dashboard" : "Book Now"}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
