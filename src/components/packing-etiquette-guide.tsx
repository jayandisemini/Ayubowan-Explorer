import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Shirt,
  CloudRain,
  Sun,
  ShieldAlert,
  Camera,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Luggage,
  BookOpen,
  Info,
  Layers,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Season = "peak" | "monsoon" | "shoulder";
type Region = "cultural" | "highlands" | "coast" | "safari";

interface PackingItem {
  id: string;
  label: string;
  category: "attire" | "weather" | "tech" | "health" | "documents";
  essential: boolean;
  tip?: string;
  regions?: Region[];
}

const PACKING_DATABASE: PackingItem[] = [
  // Temple & Cultural Attire
  { id: "p1", label: "Modest white tops/shirts (covers shoulders & chest)", category: "attire", essential: true, tip: "White is traditional for temple visits & shows respect.", regions: ["cultural"] },
  { id: "p2", label: "Long pants / maxi skirts / sarongs (covers knees)", category: "attire", essential: true, tip: "Strictly required for entering sacred sites like Dambulla & Temple of the Tooth.", regions: ["cultural"] },
  { id: "p3", label: "Slip-on shoes or sandals", category: "attire", essential: true, tip: "You must remove footwear before stepping onto temple grounds.", regions: ["cultural"] },
  { id: "p4", label: "Socks for hot temple stone floors", category: "attire", essential: false, tip: "Mid-day temple stones get extremely hot under direct sun!", regions: ["cultural"] },
  
  // Highland & Weather Essentials
  { id: "p5", label: "Fleece jacket or warm sweater for Ella/Nuwara Eliya", category: "weather", essential: true, tip: "Temperatures in hill country drop to 12°C–15°C at night.", regions: ["highlands"] },
  { id: "p6", label: "Lightweight waterproof raincoat or poncho", category: "weather", essential: true, tip: "Misty mountain rain can happen suddenly in tea country.", regions: ["highlands", "coast"] },
  { id: "p7", label: "Sturdy hiking shoes / trail runners", category: "weather", essential: true, tip: "Essential for Ella Rock, Adam's Peak & Sigiriya climbing.", regions: ["highlands", "cultural"] },
  
  // Coastal & Beach Essentials
  { id: "p8", label: "Reef-safe SPF 50+ sunscreen", category: "weather", essential: true, tip: "Protect tropical coral reefs around Mirissa & Hikkaduwa.", regions: ["coast"] },
  { id: "p9", label: "Polarized sunglasses & wide-brim hat", category: "weather", essential: true, tip: "UV index in Sri Lanka frequently reaches extreme levels (11+).", regions: ["coast", "safari"] },
  { id: "p10", label: "Quick-dry swimwear & UV rash guard", category: "weather", essential: true, tip: "Great for surfing, whale watching, and beach lounging.", regions: ["coast"] },

  // Safari & Wildlife
  { id: "p11", label: "Neutral color clothing (khaki, olive, beige)", category: "attire", essential: false, tip: "Bright colors can startle wild elephants and leopards in Yala/Wilpattu.", regions: ["safari"] },
  { id: "p12", label: "Compact 8x42 or 10x42 binoculars", category: "tech", essential: false, tip: "Enhances leopard and bird spotting during jeep safaris.", regions: ["safari"] },

  // Tech & Utilities
  { id: "p13", label: "Type G (UK 3-pin) travel adapter", category: "tech", essential: true, tip: "Sri Lanka standard uses 230V Type G 3-pin sockets.", regions: ["cultural", "highlands", "coast", "safari"] },
  { id: "p14", label: "20,000mAh Power bank", category: "tech", essential: true, tip: "Keeps your phone charged during long scenic train rides.", regions: ["cultural", "highlands", "coast", "safari"] },

  // Health & Safety
  { id: "p15", label: "Tropical strength mosquito repellent (DEET/Picaridin)", category: "health", essential: true, tip: "Apply during dawn/dusk, especially in safari & jungle areas.", regions: ["cultural", "coast", "safari"] },
  { id: "p16", label: "Oral rehydration salts & travel probiotic", category: "health", essential: true, tip: "Stay hydrated under tropical heat & adjust smoothly to spicy cuisine.", regions: ["cultural", "highlands", "coast", "safari"] },
  { id: "p17", label: "Hand sanitizer & biodegradable wet wipes", category: "health", essential: true, tip: "Handy for street food sampling in Pettah market.", regions: ["cultural", "highlands", "coast", "safari"] },

  // Documents
  { id: "p18", label: "Printed Sri Lanka ETA Visa Approval & Passport copy", category: "documents", essential: true, tip: "Keep physical copies handy for hotel check-ins & train ticket redemption.", regions: ["cultural", "highlands", "coast", "safari"] },
];

const ETIQUETTE_RULES = [
  {
    icon: Shirt,
    title: "Temple Dress Code",
    summary: "Cover shoulders, chest, and knees at all sacred sites.",
    details: "Always remove hats, caps, and shoes before entering temple premises. Wearing white or pastel colors is highly respected.",
    doList: ["Wear white or modest light-colored clothing", "Remove shoes, sandals, and hats at the entrance", "Carry socks for scorching stone floors"],
    dontList: ["Do not wear sleeveless tops, shorts, or short skirts", "Do not enter with leather items in certain inner shrines"],
  },
  {
    icon: Camera,
    title: "Sacred Photography Rules",
    summary: "Never pose with your back turned to a Buddha statue.",
    details: "Turning your back to a Buddha statue for a selfie or photo is considered grave disrespect. Always face the statue or step to the side.",
    doList: ["Step to the side when photographing statues", "Ask permission before taking portraits of monks or locals", "Turn off flash inside ancient cave temples"],
    dontList: ["NEVER turn your back directly to a Buddha statue for photos", "Do not touch, climb, or lean against ancient murals or carvings", "Do not photograph military or security checkpoints"],
  },
  {
    icon: HeartHandshake,
    title: "Greetings & Social Norms",
    summary: "Greet locals with 'Ayubowan' and pressed palms.",
    details: "The traditional Sri Lankan greeting is 'Ayubowan' ('May you live long'), accompanied by pressing your palms together at chest height with a slight bow.",
    doList: ["Say 'Ayubowan' with palms joined at chest height", "Use your right hand when giving or receiving money or food", "Accept tea or coconut water warmly when offered"],
    dontList: ["Avoid public displays of intense physical affection", "Do not use your left hand for passing items or eating", "Do not touch the heads of children or adults"],
  },
  {
    icon: ShieldAlert,
    title: "Tattoos & Religious Symbols",
    summary: "Cover any Buddha tattoos or religious body art.",
    details: "Displaying Buddha tattoos in public is illegal and offensive in Sri Lanka. Cover any religious body art with clothing or bandage wraps while traveling.",
    doList: ["Keep Buddha or Hindu deity tattoos covered completely", "Be mindful of wearing apparel with religious symbols"],
    dontList: ["Do not expose Buddha tattoos in public, airports, or beaches", "Do not buy souvenir t-shirts depicting Buddha images casually"],
  },
];

export function PackingEtiquetteGuide() {
  const [selectedSeason, setSelectedSeason] = useState<Season>("peak");
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(["cultural", "highlands", "coast"]);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("packing");

  const toggleRegion = (r: Region) => {
    if (selectedRegions.includes(r)) {
      if (selectedRegions.length > 1) {
        setSelectedRegions(selectedRegions.filter((x) => x !== r));
      }
    } else {
      setSelectedRegions([...selectedRegions, r]);
    }
  };

  const filteredItems = PACKING_DATABASE.filter((item) => {
    if (!item.regions) return true;
    return item.regions.some((r) => selectedRegions.includes(r));
  });

  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPercent = filteredItems.length > 0 ? Math.round((checkedCount / filteredItems.length) * 100) : 0;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetChecklist = () => {
    setCheckedIds({});
    toast.info("Packing checklist reset");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <Luggage className="w-7 h-7 text-primary" /> AI Sri Lanka Travel & Etiquette Guide
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Smart packing tailored to your Sri Lankan regions & essential cultural etiquette rules.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
          <TabsList className="glass h-10 rounded-full p-1">
            <TabsTrigger value="packing" className="rounded-full text-xs px-4">
              <Luggage className="w-3.5 h-3.5 mr-1.5" /> Packing List
            </TabsTrigger>
            <TabsTrigger value="etiquette" className="rounded-full text-xs px-4">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Temple Etiquette
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "packing" && (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          {/* Controls Panel */}
          <Card className="p-6 h-fit space-y-6 border-border/60 bg-card/80 backdrop-blur-md">
            <div>
              <Label className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
                <Sun className="w-4 h-4" /> Travel Season
              </Label>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {[
                  { id: "peak", name: "Nov – Apr (West & South Coast)", desc: "Dry season for Mirissa, Galle, Colombo" },
                  { id: "monsoon", name: "May – Sep (East & North)", desc: "Best for Trincomalee, Arugam Bay" },
                  { id: "shoulder", name: "Year-Round Hill Country", desc: "Ella & Nuwara Eliya misty climate" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeason(s.id as Season)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedSeason === s.id
                        ? "border-primary bg-primary/10 text-foreground font-medium"
                        : "border-border/60 hover:border-primary/40 text-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div className="mt-0.5 text-[11px] opacity-80">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Destination Regions
              </Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { id: "cultural", label: "🛕 Cultural Triangle" },
                  { id: "highlands", label: "⛰️ Hill Country" },
                  { id: "coast", label: "🏖️ Beaches & Coast" },
                  { id: "safari", label: "🐆 Yala Safari" },
                ].map((r) => {
                  const active = selectedRegions.includes(r.id as Region);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRegion(r.id as Region)}
                      className={`px-3 py-2 rounded-xl border text-xs text-left transition-all ${
                        active
                          ? "border-primary bg-primary/15 text-primary font-medium shadow-xs"
                          : "border-border/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Packing Progress */}
            <div className="pt-4 border-t border-border/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-foreground">Packing Progress</span>
                <span className="font-bold text-primary">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {checkedCount} of {filteredItems.length} packed
                </span>
                {checkedCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleResetChecklist} className="h-7 text-[11px]">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Personalized Checklist ({filteredItems.length} items)
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedRegions.length} Regions Active
              </Badge>
            </div>

            <div className="grid gap-3">
              {filteredItems.map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <Card
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 cursor-pointer transition-all border ${
                      isChecked
                        ? "bg-primary/5 border-primary/40 opacity-75"
                        : "bg-card border-border/50 hover:border-primary/50 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={() => toggleCheck(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label
                            htmlFor={item.id}
                            className={`text-sm font-medium cursor-pointer ${
                              isChecked ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {item.label}
                          </label>
                          {item.essential && (
                            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                              Essential
                            </Badge>
                          )}
                        </div>
                        {item.tip && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{item.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "etiquette" && (
        <div className="grid gap-6 md:grid-cols-2">
          {ETIQUETTE_RULES.map((rule) => {
            const IconComponent = rule.icon;
            return (
              <Card key={rule.title} className="p-6 border border-border/60 bg-card/90 backdrop-blur-md space-y-4 hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary grid place-items-center shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-foreground">{rule.title}</h3>
                    <p className="text-xs font-medium text-primary mt-0.5">{rule.summary}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{rule.details}</p>

                <div className="grid gap-3 pt-2">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 space-y-1.5">
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Respectful Practices (Do)
                    </div>
                    <ul className="space-y-1 text-xs text-foreground/90">
                      {rule.doList.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 space-y-1.5">
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Taboos & Offenses (Don't)
                    </div>
                    <ul className="space-y-1 text-xs text-foreground/90">
                      {rule.dontList.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
