import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const KEY = "ayubowan-cookie-consent-v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!visible) return null;

  const decide = (value: "accepted" | "declined") => {
    try { localStorage.setItem(KEY, value); } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md animate-fade-up">
      <div className="glass rounded-2xl border border-border/60 p-5 shadow-2xl">
        <div className="flex gap-3">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary/15 text-primary shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="text-sm">
            <div className="font-display text-base">A taste of cookies</div>
            <p className="mt-1 text-muted-foreground">
              We use cookies to remember your preferences and understand how travelers explore Ayubowan Travels.
              You can decline non-essential cookies at any time.
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => decide("accepted")} className="rounded-full">Accept all</Button>
              <Button size="sm" variant="outline" onClick={() => decide("declined")} className="rounded-full">Only essential</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
