import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

const PRESETS = [
  { label: "🏰 Sigiriya & Dambulla Day Tour", text: "Ayubowan! I'd like to book a private tour to Sigiriya Lion Rock & Dambulla." },
  { label: "🚆 Ella Odyssey Train Tickets", text: "Ayubowan! Could you help reserve Ella Odyssey observation saloon train seats?" },
  { label: "🐋 Mirissa Whale Watching Cruise", text: "Ayubowan! I want to inquire about Mirissa blue whale watching cruises." },
  { label: "🇱🇰 Custom 7-Day Ceylon Itinerary", text: "Ayubowan! I need a custom 7-day Sri Lanka itinerary for 2 travelers." },
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function send(customText?: string) {
    const textToSend = customText || message.trim() || "Ayubowan! I'd love to plan a luxury trip to Sri Lanka.";
    const text = encodeURIComponent(textToSend);
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`, "_blank", "noopener");
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-88 rounded-3xl border border-emerald-500/30 bg-card/95 backdrop-blur-xl shadow-2xl animate-fade-up overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative rounded-full bg-white/20 p-2">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-300 border-2 border-emerald-600 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-semibold flex items-center gap-1.5">
                  Ayubowan Specialists <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                </div>
                <div className="text-[11px] text-white/90">Online · Usually replies in 5 minutes</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="hover:opacity-80 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-2xl rounded-tl-sm bg-muted/60 p-3.5 text-xs leading-relaxed">
              👋 <strong>Ayubowan!</strong> Welcome to Sri Lanka. How can our local tour specialists assist your journey today?
            </div>

            {/* Quick Inquiry Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" /> Instant Inquiry Presets:
              </div>
              <div className="flex flex-col gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setMessage(p.text);
                      send(p.text);
                    }}
                    className="text-left text-xs px-3 py-2 rounded-xl border border-border/60 bg-background hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors text-foreground/90 flex items-center justify-between group"
                  >
                    <span>{p.label}</span>
                    <Send className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Or type a custom message for our Colombo team…"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => send()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition"
              >
                <Send className="h-3.5 w-3.5" /> Start Chat via WhatsApp
              </button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground">Opens official WhatsApp web / app instantly</p>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-background animate-ping" />}
      </button>
    </>
  );
}
