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
  const [submitted, setSubmitted] = useState(false);

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

    // Format and send message directly to WhatsApp (0740489343)
    const waText = `Ayubowan! New Travel Enquiry 🇱🇰

*Full Name:* ${inquiryData.name}
*Email:* ${inquiryData.email}
*Country:* ${inquiryData.country || "Not specified"}
*Travel Dates:* ${inquiryData.travel_dates || "Not specified"}
*Travelers:* ${inquiryData.pax || "Not specified"}
*Trip Details:* ${inquiryData.message}`;

    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`, "_blank", "noopener");

    setSending(false);
    if (sent) {
      setSubmitted(true);
      toast.success("Enquiry saved & dispatched to WhatsApp (+94 74 048 9343)!");
      form.reset();
    } else {
      toast.error("Couldn't send — please try again.");
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Ayubowan! I would like to inquire about booking a trip to Sri Lanka.");
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`, "_blank", "noopener");
  };

  return (
    <PageShell
      eyebrow="Start planning"
      title={<>Let's design <span className="text-gradient-gold">your journey.</span></>}
      lead="Tell us when you'd like to travel, roughly how long, and what you're dreaming of. A specialist will reply within 24 hours."
      heroImage={mirissaImg}
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          {submitted ? (
            <div className="rounded-3xl border border-primary/30 bg-primary/10 p-8 text-center space-y-4 animate-fade-up">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary grid place-items-center mx-auto text-xl">✓</div>
              <h2 className="font-display text-2xl text-foreground">Enquiry Received!</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Thank you for reaching out to Ayubowan Travels. Our local travel specialists are reviewing your request and will contact you via email or at <span className="font-semibold text-foreground">{SITE_CONFIG.whatsappFormatted}</span> shortly.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full mt-2">
                Send another enquiry
              </Button>
            </div>
          ) : (
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
                <Button type="submit" disabled={sending} size="lg" className="rounded-full font-semibold px-8">
                  {sending ? "Sending…" : "Send enquiry"}
                </Button>
                <Button type="button" onClick={openWhatsApp} variant="outline" size="lg" className="rounded-full flex items-center gap-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                  <MessageCircle className="w-4 h-4" /> Or chat via WhatsApp
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <InfoRow icon={Mail} title="Email" lines={[SITE_CONFIG.email, "planning@ayubowantravels.lk"]} />
          <InfoRow icon={Phone} title="Phone & WhatsApp" lines={[SITE_CONFIG.whatsappFormatted, `${SITE_CONFIG.whatsappFormatted} (24/7)`]} />
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
