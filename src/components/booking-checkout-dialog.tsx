import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, ShieldCheck, CheckCircle2, Download, Loader2, Sparkles, CalendarDays, Users, Building2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { exportBookingReceiptPDF } from "@/lib/pdf-receipt";
import { toast } from "sonner";

type BookingCheckoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourTitle: string;
  pricePerPerson: number; // in USD e.g. 890
  tourId?: string;
};

export function BookingCheckoutDialog({
  open,
  onOpenChange,
  tourTitle,
  pricePerPerson,
  tourId,
}: BookingCheckoutProps) {
  const [step, setStep] = useState<"details" | "payment" | "processing" | "success">("details");
  const [guests, setGuests] = useState(1);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Payment details
  const [gateway, setGateway] = useState<"stripe" | "payhere">("stripe");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");
  const [payHereMobile, setPayHereMobile] = useState("+94 77 123 4567");

  // Receipt state
  const [completedBooking, setCompletedBooking] = useState<{
    id: string;
    transactionRef: string;
    totalAmountUSD: number;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        setName(data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0] ?? "");
      }
    });
  }, [open]);

  const USD_TO_LKR_RATE = 305.5; // Approximate LKR rate
  const totalUSD = Math.round(pricePerPerson * guests);
  const totalLKR = Math.round(totalUSD * USD_TO_LKR_RATE);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !travelDate) {
      toast.error("Please fill in traveler details");
      return;
    }
    setStep("payment");
  };

  const handleProcessPayment = async () => {
    setStep("processing");

    // Simulate payment gateway API handoff (1.8s)
    setTimeout(async () => {
      const txRef = (gateway === "stripe" ? "STP-" : "PHY-") + Math.random().toString(36).substring(2, 9).toUpperCase();
      const bookingId = "BK-" + Math.floor(100000 + Math.random() * 900000);

      try {
        const { data: userResp } = await supabase.auth.getUser();
        const userId = userResp.user?.id ?? null;

        if (userId) {
          await supabase.from("bookings").insert({
            user_id: userId,
            travel_date: travelDate,
            total_budget: totalUSD,
            status: "confirmed",
            notes: `[PAID via ${gateway.toUpperCase()} ref:${txRef}] ${tourTitle} (${guests} guest/s). ${notes}`,
          });
        }
      } catch (err) {
        console.warn("Supabase insert fallback warning:", err);
      }

      setCompletedBooking({
        id: bookingId,
        transactionRef: txRef,
        totalAmountUSD: totalUSD,
      });

      setStep("success");
      toast.success("Payment successful! Tour booking confirmed.");
    }, 1800);
  };

  const handleDownloadPDF = () => {
    if (!completedBooking) return;
    exportBookingReceiptPDF({
      bookingId: completedBooking.id,
      itemTitle: tourTitle,
      travelerName: name,
      email: email,
      travelDate: travelDate,
      guests: guests,
      paymentMethod: gateway,
      amountUSD: completedBooking.totalAmountUSD,
      transactionRef: completedBooking.transactionRef,
    });
    toast.success("Receipt downloaded successfully!");
  };

  const resetModal = () => {
    setStep("details");
    setCompletedBooking(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[540px] rounded-3xl p-6 bg-card text-card-foreground border-border/60">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="rounded-full border-primary/40 text-primary px-3 py-0.5 text-xs">
              <Sparkles className="w-3 h-3 mr-1" /> Instant Confirmation
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" /> 256-Bit TLS Encrypted
            </span>
          </div>
          <DialogTitle className="font-display text-2xl mt-2">
            {step === "success" ? "Booking Confirmed! 🎉" : `Book ${tourTitle}`}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {step === "details" && "Configure your group size and travel date to proceed."}
            {step === "payment" && "Choose your preferred payment gateway."}
            {step === "processing" && "Verifying secure payment authorization..."}
            {step === "success" && "Your reservation is locked in. We have sent receipt details to your email."}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: DETAILS */}
        {step === "details" && (
          <form onSubmit={handleStartPayment} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="guests" className="text-xs">Travelers</Label>
                <div className="relative mt-1">
                  <Users className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="date" className="text-xs">Start Date</Label>
                <div className="relative mt-1">
                  <CalendarDays className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="pl-9 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fullname" className="text-xs">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="eleanor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-xs">Special Requests / Dietary Needs (Optional)</Label>
              <Input
                id="notes"
                placeholder="Vegetarian meals, pickup preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>

            {/* Price Summary Box */}
            <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50 space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{guests} × ${pricePerPerson} USD</span>
                <span>${pricePerPerson * guests} USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Local Taxes & Service Fee</span>
                <span className="text-emerald-500 font-medium">Included</span>
              </div>
              <div className="border-t border-border/40 pt-2 flex justify-between items-baseline">
                <span className="font-semibold text-sm">Total Due</span>
                <div className="text-right">
                  <div className="font-display text-2xl text-gradient-gold">${totalUSD} USD</div>
                  <div className="text-[11px] text-muted-foreground">≈ LKR {totalLKR.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full py-6 text-base font-medium">
              Proceed to Secure Payment →
            </Button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === "payment" && (
          <div className="space-y-4 mt-2">
            <Tabs defaultValue="stripe" onValueChange={(val) => setGateway(val as any)}>
              <TabsList className="grid grid-cols-2 rounded-2xl p-1 bg-muted/60">
                <TabsTrigger value="stripe" className="rounded-xl gap-2">
                  <CreditCard className="w-4 h-4 text-sky-500" /> Stripe (Global)
                </TabsTrigger>
                <TabsTrigger value="payhere" className="rounded-xl gap-2">
                  <Building2 className="w-4 h-4 text-emerald-500" /> PayHere (Sri Lanka)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stripe" className="space-y-3 mt-4">
                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4 text-xs text-sky-600 dark:text-sky-300">
                  Accepts Visa, MasterCard, American Express, Apple Pay, & Google Pay globally.
                </div>
                <div>
                  <Label className="text-xs">Card Number</Label>
                  <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="mt-1 rounded-xl font-mono text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Expiry Date</Label>
                    <Input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="mt-1 rounded-xl text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">CVC / CVV</Label>
                    <Input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="mt-1 rounded-xl text-sm" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payhere" className="space-y-3 mt-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-emerald-600 dark:text-emerald-300">
                  PayHere Sri Lanka: Instant checkout in LKR via local Visa/Mastercard, Sampath PayApp, ezCash, mCash, & Internet Banking.
                </div>
                <div>
                  <Label className="text-xs">Mobile Number for Payment SMS</Label>
                  <Input value={payHereMobile} onChange={(e) => setPayHereMobile(e.target.value)} className="mt-1 rounded-xl text-sm" />
                </div>
                <div className="p-3 rounded-xl bg-card border text-xs space-y-1">
                  <div className="flex justify-between"><span>Converted Total:</span><span className="font-bold">Rs. {totalLKR.toLocaleString()} LKR</span></div>
                  <div className="text-[11px] text-muted-foreground">Exchange Rate: 1 USD = {USD_TO_LKR_RATE} LKR</div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("details")} className="rounded-xl">
                ← Back
              </Button>
              <Button onClick={handleProcessPayment} size="lg" className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                Pay ${totalUSD} USD Now
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING */}
        {step === "processing" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h3 className="font-display text-xl">Processing Payment</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Communicating with {gateway === "stripe" ? "Stripe Payments" : "PayHere Gateway"} secure servers...
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && completedBooking && (
          <div className="space-y-5 mt-2">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="font-display text-xl text-emerald-600 dark:text-emerald-400">Payment Authorized</div>
              <p className="text-xs text-muted-foreground">Ref: <span className="font-mono text-foreground font-semibold">{completedBooking.transactionRef}</span></p>
            </div>

            <div className="rounded-xl bg-card border p-4 text-xs space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Package:</span><span className="font-semibold">{tourTitle}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Traveler:</span><span>{name} ({email})</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date & Party:</span><span>{travelDate} · {guests} Guest(s)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gateway:</span><span className="uppercase">{gateway}</span></div>
              <div className="flex justify-between pt-2 border-t font-semibold text-sm">
                <span>Total Paid:</span>
                <span className="text-emerald-500">${completedBooking.totalAmountUSD} USD</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleDownloadPDF} variant="outline" className="w-full rounded-full gap-2">
                <Download className="w-4 h-4" /> Download Official PDF Receipt
              </Button>
              <Button onClick={resetModal} className="w-full rounded-full">
                Done & Return to Site
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
