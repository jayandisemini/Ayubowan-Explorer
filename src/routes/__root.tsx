import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { CookieConsent } from "@/components/cookie-consent";
import { LanguageProvider } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page drifted off the map.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { console.error("Root Error Boundary Caught:", error); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-display text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">{error?.message || "An unexpected error occurred while loading this page."}</p>
        <div className="pt-2 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground font-medium">Try again</button>
          <a href="/" className="rounded-full border border-input bg-background px-5 py-2 text-sm font-medium">Return Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ayubowan Travels — Luxury Sri Lanka Journeys" },
      { name: "description", content: "Discover Sri Lanka in vivid detail — cultural heritage, scenic expeditions, and authentic cuisine — with AI-crafted itineraries and live logistics." },
      { property: "og:title", content: "Ayubowan Travels — Luxury Sri Lanka Journeys" },
      { property: "og:description", content: "AI-crafted itineraries, live train & bus logistics, and immersive cultural storytelling across Sri Lanka." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "Ayubowan Travels",
          description: "Luxury Sri Lanka Journeys, AI-crafted itineraries, live logistics & authentic experiences.",
          address: {
            "@type": "PostalAddress",
            addressCountry: "LK",
            addressLocality: "Colombo",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
          router.invalidate();
          if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
        }
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    } catch (err) {
      console.warn("Supabase auth listener warning:", err);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, [queryClient, router]);
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <WhatsAppWidget />
        <CookieConsent />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </LanguageProvider>
  );
}
