import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import mirissaImg from "@/assets/mirissa.jpg";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Youtube, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/config";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact · Ayubowan Travels" },
      { name: "description", content: "Plan your Sri Lanka journey. Reach the Ayubowan Travels team by email, WhatsApp or the contact form." },
      { property: "og:title", content: "Contact Ayubowan Travels" },
      { property: "og:description", content: "Speak to a Sri Lanka travel specialist." },
    ],
  }),
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const sendToWhatsApp = (data: { name: string; email: string; country?: string | null; dates?: string | null; pax?: string | null; message: string }) => {
    const waText = `Ayubowan! New Travel Enquiry 🇱🇰

*Full Name:* ${data.name}
*Email:* ${data.email}
*Country:* ${data.country || "Not specified"}
*Travel Dates:* ${data.dates || "Not specified"}
*Travelers:* ${data.pax || "Not specified"}
*Trip Details:* ${data.message}`;

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    window.open(url, "_blank", "noopener");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const { supabase } = await import("@/integrations/supabase/client");
    
    const inquiryData = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      country: String(fd.get("country") || "") || null,
      travel_dates: String(fd.get("dates") || "") || null,
      pax: String(fd.get("pax") || "") || null,
      message: String(fd.get("message") || ""),
      source: "contact",
    };

    let sent = false;
    try {
      const { error } = await supabase.from("inquiries").insert(inquiryData);
      if (!error) sent = true;
    } catch (err) {
      console.warn("Supabase insert notice:", err);
    }

    // Always store local backup if network or DB fails
    try {
      const existing = JSON.parse(localStorage.getItem("ayubowan_inquiries") || "[]");
      localStorage.setItem("ayubowan_inquiries", JSON.stringify([{ id: "inq-" + Date.now(), ...inquiryData, status: "new", created_at: new Date().toISOString() }, ...existing]));
      sent = true;
    } catch (err) {
      console.warn("Local storage write notice:", err);
    }

    // Automatically trigger WhatsApp redirect with inquiry details
    sendToWhatsApp({
      name: inquiryData.name,
      email: inquiryData.email,
      country: inquiryData.country,
      dates: inquiryData.travel_dates,
      pax: inquiryData.pax,
      message: inquiryData.message,
    });

    setSending(false);
    toast.success("Enquiry saved & opening WhatsApp! 💬");
    form.reset();
  };


  return (
    <PageShell
      eyebrow="Start planning"
      title={<>Let's design <span className="text-gradient-gold">your journey.</span></>}
      lead="Tell us when you'd like to travel, roughly how long, and what you're dreaming of. Submitting sends details directly to our WhatsApp & saves your enquiry."
      heroImage={mirissaImg}
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border/40 bg-card p-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Country" name="country" />
            <Field label="Travel dates" name="dates" placeholder="e.g. Feb 10 – Feb 20" />
          </div>
          <Field label="Travelers" name="pax" placeholder="e.g. 2 adults, 1 child" />
          <div>
            <label className="text-sm font-medium">Tell us about your ideal trip</label>
            <textarea
              name="message" required rows={5}
              placeholder="Highlights, pace, budget range, hotel style, must-sees…"
              className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={sending} size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {sending ? "Opening WhatsApp…" : "Send via WhatsApp"}
            </Button>
            <span className="text-xs text-muted-foreground">
              Direct dispatch to <span className="font-semibold text-foreground">{SITE_CONFIG.whatsappFormatted}</span>
            </span>
          </div>
        </form>

        <aside className="space-y-4">
          <InfoRow icon={Mail} title="Email" lines={["hello@ayubowantravels.lk", "planning@ayubowantravels.lk"]} />
          <InfoRow icon={Phone} title="Phone & WhatsApp" lines={["+94 11 234 5678", "+94 77 123 4567 (24/7)"]} />
          <InfoRow icon={MapPin} title="Studio" lines={["36 Pedlar Street", "Galle Fort, Sri Lanka 80000"]} />
          <InfoRow icon={Clock} title="Hours" lines={["Mon–Sat · 9am – 7pm SLT", "Emergency line 24/7"]} />
          <div className="rounded-2xl border border-border/40 bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-primary">Follow the journey</div>
            <div className="mt-3 flex gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid place-items-center w-10 h-10 rounded-full border border-border/60 hover:border-primary hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input
        name={name} type={type} placeholder={placeholder} required={required}
        className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

function InfoRow({ icon: Icon, title, lines }: { icon: React.ComponentType<{ className?: string }>; title: string; lines: string[] }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border/40 bg-card p-5">
      <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary/15 text-primary shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        {lines.map((l) => <div key={l} className="text-sm text-foreground/90">{l}</div>)}
      </div>
    </div>
  );
}
