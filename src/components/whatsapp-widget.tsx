import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const WHATSAPP_NUMBER = "94112345678"; // +94 11 234 5678

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function send() {
    const text = encodeURIComponent(
      message.trim() || "Ayubowan! I'd love to plan a trip to Sri Lanka.",
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl animate-fade-up">
          <div className="flex items-center justify-between rounded-t-2xl bg-[#25D366] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/20 p-1.5"><MessageCircle className="h-4 w-4" /></div>
              <div>
                <div className="text-sm font-semibold">Ayubowan Travels</div>
                <div className="text-[11px] opacity-90">Typically replies within 1 hour</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-2xl rounded-tl-sm bg-muted/60 p-3 text-sm">
              Ayubowan! 🌴 Tell us where you'd like to go in Sri Lanka and we'll craft your journey.
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message…"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={send}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
            >
              <Send className="h-4 w-4" /> Send via WhatsApp
            </button>
            <p className="text-[10px] text-center text-muted-foreground">Opens WhatsApp in a new tab</p>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 active:scale-95 transition"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-background animate-pulse" />}
      </button>
    </>
  );
}
