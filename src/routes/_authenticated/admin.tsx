import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, MapPin, Utensils, Calendar, Trash2, Plus, ArrowLeft, Crown, Loader2, Inbox, Mail, UserPlus, Users, XCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Ayubowan Travels" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Destination = { id: string; name: string; type: string; description: string; story: string | null; image_url: string | null; latitude: number; longitude: number };
type FoodRec = { id: string; food_name: string; description: string; price_level: number; destination_id: string | null };
type Booking = { id: string; travel_date: string; total_budget: number; status: string; destination_id: string | null; notes: string | null; user_id: string };

const DEST_TYPES = ["cultural", "beach", "wildlife", "hillcountry", "city"];

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [anyAdmin, setAnyAdmin] = useState<boolean | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => { void checkRole(); }, []);

  async function checkRole() {
    setChecking(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { setChecking(false); return; }
    // Server-verified check via SECURITY DEFINER RPC.
    const { data: adminFlag } = await supabase.rpc("is_current_user_admin");
    setIsAdmin(adminFlag === true);
    if (!adminFlag) setAnyAdmin(false);
    setChecking(false);
  }

  async function claimAdmin() {
    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_first_admin");
    setClaiming(false);
    if (error) { toast.error(error.message); return; }
    if (data === true) {
      toast.success("You are now the admin");
      await checkRole();
    } else {
      toast.error("An admin already exists — ask them to grant you access");
      setAnyAdmin(true);
    }
  }

  if (checking) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <Card className="glass p-10 max-w-md w-full text-center">
          <Crown className="w-10 h-10 mx-auto text-primary" />
          <h1 className="mt-4 font-display text-2xl">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">This area manages destinations, cuisine, and bookings. If no admin exists yet you can claim it now.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={claimAdmin} disabled={claiming}>
              {claiming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Crown className="w-4 h-4 mr-2" />}
              Claim admin role
            </Button>
            <Link to="/dashboard"><Button variant="outline" className="w-full">Back to dashboard</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
            <span className="text-border">/</span>
            <h1 className="font-display text-xl inline-flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Admin console</h1>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/30">Administrator</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Tabs defaultValue="destinations">
          <TabsList className="mb-6">
            <TabsTrigger value="destinations"><MapPin className="w-4 h-4 mr-2" />Destinations</TabsTrigger>
            <TabsTrigger value="cuisine"><Utensils className="w-4 h-4 mr-2" />Cuisine</TabsTrigger>
            <TabsTrigger value="bookings"><Calendar className="w-4 h-4 mr-2" />Bookings</TabsTrigger>
            <TabsTrigger value="inquiries"><Inbox className="w-4 h-4 mr-2" />Inquiries</TabsTrigger>
            <TabsTrigger value="admins"><Users className="w-4 h-4 mr-2" />Admins</TabsTrigger>
          </TabsList>
          <TabsContent value="destinations"><DestinationsAdmin /></TabsContent>
          <TabsContent value="cuisine"><CuisineAdmin /></TabsContent>
          <TabsContent value="bookings"><BookingsAdmin /></TabsContent>
          <TabsContent value="inquiries"><InquiriesAdmin /></TabsContent>
          <TabsContent value="admins"><AdminsAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------- Destinations ---------- */
function DestinationsAdmin() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Destination>>({ name: "", type: "cultural", description: "", story: "", image_url: "", latitude: 7.87, longitude: 80.77 });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("destinations").select("*").order("name");
    setItems((data as Destination[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function create() {
    if (!form.name || !form.description) { toast.error("Name and description required"); return; }
    const { error } = await supabase.from("destinations").insert({
      name: form.name!, type: form.type as any, description: form.description!,
      story: form.story || null, image_url: form.image_url || null,
      latitude: Number(form.latitude), longitude: Number(form.longitude),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Destination added");
    setForm({ name: "", type: "cultural", description: "", story: "", image_url: "", latitude: 7.87, longitude: 80.77 });
    void load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this destination?")) return;
    const { error } = await supabase.from("destinations").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <Card className="glass p-6 h-fit">
        <h3 className="font-display text-lg inline-flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> New destination</h3>
        <div className="mt-4 space-y-3">
          <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div>
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DEST_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Story (optional)</Label><Textarea rows={3} value={form.story || ""} onChange={(e) => setForm({ ...form, story: e.target.value })} /></div>
          <div><Label>Image URL</Label><Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Latitude</Label><Input type="number" step="0.0001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })} /></div>
            <div><Label>Longitude</Label><Input type="number" step="0.0001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })} /></div>
          </div>
          <Button className="w-full" onClick={create}><Plus className="w-4 h-4 mr-2" />Add destination</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : items.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-sm">No destinations yet.</Card>
        ) : items.map((d) => (
          <Card key={d.id} className="p-4 flex items-center gap-4">
            {d.image_url ? <img src={d.image_url} alt={d.name} className="w-20 h-20 rounded-xl object-cover" /> : <div className="w-20 h-20 rounded-xl bg-muted grid place-items-center"><MapPin className="w-5 h-5 text-muted-foreground" /></div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="font-display text-lg">{d.name}</span><Badge variant="outline" className="text-[10px]">{d.type}</Badge></div>
              <p className="text-sm text-muted-foreground line-clamp-2">{d.description}</p>
              <p className="text-[11px] text-muted-foreground mt-1">📍 {d.latitude.toFixed(3)}, {d.longitude.toFixed(3)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Cuisine ---------- */
function CuisineAdmin() {
  const [items, setItems] = useState<FoodRec[]>([]);
  const [dests, setDests] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<FoodRec>>({ food_name: "", description: "", price_level: 2, destination_id: "" });

  async function load() {
    setLoading(true);
    const [{ data: f }, { data: d }] = await Promise.all([
      supabase.from("food_recommendations").select("*").order("food_name"),
      supabase.from("destinations").select("*").order("name"),
    ]);
    setItems((f as FoodRec[]) ?? []);
    setDests((d as Destination[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function create() {
    if (!form.food_name || !form.description || !form.destination_id) { toast.error("All fields required"); return; }
    const { error } = await supabase.from("food_recommendations").insert({
      food_name: form.food_name!, description: form.description!,
      price_level: Number(form.price_level), destination_id: form.destination_id!,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Dish added");
    setForm({ food_name: "", description: "", price_level: 2, destination_id: "" });
    void load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this dish?")) return;
    const { error } = await supabase.from("food_recommendations").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <Card className="glass p-6 h-fit">
        <h3 className="font-display text-lg inline-flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> New dish</h3>
        <div className="mt-4 space-y-3">
          <div><Label>Dish name</Label><Input value={form.food_name || ""} onChange={(e) => setForm({ ...form, food_name: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div>
            <Label>Destination</Label>
            <Select value={form.destination_id || ""} onValueChange={(v) => setForm({ ...form, destination_id: v })}>
              <SelectTrigger><SelectValue placeholder="Pick a destination" /></SelectTrigger>
              <SelectContent>{dests.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Price level (1–4)</Label>
            <Input type="number" min={1} max={4} value={form.price_level} onChange={(e) => setForm({ ...form, price_level: parseInt(e.target.value) || 1 })} />
          </div>
          <Button className="w-full" onClick={create}><Plus className="w-4 h-4 mr-2" />Add dish</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : items.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-sm">No dishes yet.</Card>
        ) : items.map((f) => (
          <Card key={f.id} className="p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/15 grid place-items-center"><Utensils className="w-5 h-5 text-accent" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="font-display text-lg">{f.food_name}</span><span className="text-xs text-primary">{"$".repeat(f.price_level)}</span></div>
              <p className="text-sm text-muted-foreground line-clamp-2">{f.description}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{dests.find((d) => d.id === f.destination_id)?.name ?? "—"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(f.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Bookings ---------- */
function BookingsAdmin() {
  const [items, setItems] = useState<Booking[]>([]);
  const [dests, setDests] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: b }, { data: d }] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("destinations").select("*"),
    ]);
    setItems((b as Booking[]) ?? []);
    setDests((d as Destination[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated");
    void load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void load();
  }

  const statusColor = (s: string) => s === "confirmed" ? "bg-green-500/15 text-green-400 border-green-500/30" : s === "cancelled" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-primary/15 text-primary border-primary/30";

  return (
    <div className="space-y-3">
      {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : items.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground text-sm">No bookings yet.</Card>
      ) : items.map((b) => (
        <Card key={b.id} className="p-4">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg">{dests.find((d) => d.id === b.destination_id)?.name ?? "—"}</span>
                <Badge className={statusColor(b.status)}>{b.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Travel: {new Date(b.travel_date).toLocaleDateString()} · Budget: ${b.total_budget} · User: {b.user_id.slice(0, 8)}…</div>
              {b.notes && <p className="text-sm mt-2">{b.notes}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => remove(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Inquiries ---------- */
type Inquiry = { id: string; name: string; email: string; country: string | null; travel_dates: string | null; pax: string | null; message: string; source: string; status: string; admin_notes: string | null; created_at: string };

function InquiriesAdmin() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    let list: Inquiry[] = [];
    try {
      const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) list = data as Inquiry[];
    } catch {}

    try {
      const local = JSON.parse(localStorage.getItem("ayubowan_inquiries") || "[]");
      if (local && local.length > 0) {
        const ids = new Set(list.map((i) => i.id));
        for (const item of local) {
          if (!ids.has(item.id)) list.push(item);
        }
      }
    } catch {}

    setItems(list);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated");
    void load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void load();
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const statusColor = (s: string) => s === "closed" ? "bg-muted text-muted-foreground border-border" : s === "in-progress" ? "bg-primary/15 text-primary border-primary/30" : "bg-green-500/15 text-green-400 border-green-500/30";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {["all", "new", "in-progress", "closed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs rounded-full px-3 py-1 border ${filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}>{s}</button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} inquiries</span>
      </div>
      {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : filtered.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground text-sm">No inquiries here.</Card>
      ) : filtered.map((q) => (
        <Card key={q.id} className="p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-lg">{q.name}</span>
                <Badge className={statusColor(q.status)}>{q.status}</Badge>
                <Badge variant="outline" className="text-[10px] uppercase">{q.source}</Badge>
              </div>
              <a href={`mailto:${q.email}`} className="text-sm text-primary inline-flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {q.email}</a>
              <div className="text-xs text-muted-foreground mt-1">
                {[q.country, q.travel_dates, q.pax].filter(Boolean).join(" · ")}
              </div>
              <p className="text-sm mt-3 whitespace-pre-wrap">{q.message}</p>
              <div className="text-[11px] text-muted-foreground mt-2">{new Date(q.created_at).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={q.status} onValueChange={(v) => updateStatus(q.id, v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => remove(q.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Admins ---------- */
type AdminRow = { user_id: string; email: string; full_name: string | null; granted_at: string };
type AuditRow = { id: string; actor_id: string; action: string; target_user_id: string | null; target_email: string | null; created_at: string };

function AdminsAdmin() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [me, setMe] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: u }, { data: a }, { data: log }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.rpc("list_admins"),
      supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setMe(u.user?.id ?? null);
    setAdmins((a as AdminRow[]) ?? []);
    setAudit((log as AuditRow[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function grant() {
    if (!email.trim()) { toast.error("Enter an email"); return; }
    setGranting(true);
    const { error } = await supabase.rpc("grant_admin_role", { _email: email.trim() });
    setGranting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${email} is now an admin`);
    setEmail("");
    void load();
  }

  async function revoke(userId: string, name: string) {
    if (!confirm(`Revoke admin from ${name}?`)) return;
    const { error } = await supabase.rpc("revoke_admin_role", { _user_id: userId });
    if (error) { toast.error(error.message); return; }
    toast.success("Admin role revoked");
    void load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <Card className="glass p-6 h-fit">
        <h3 className="font-display text-lg inline-flex items-center gap-2"><UserPlus className="w-4 h-4 text-primary" /> Invite an admin</h3>
        <p className="text-xs text-muted-foreground mt-1">The user must already have an account. They'll get admin access instantly.</p>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Email address</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@example.com" />
          </div>
          <Button className="w-full" onClick={grant} disabled={granting}>
            {granting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Grant admin role
          </Button>
        </div>

        <div className="mt-8">
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recent audit log</h4>
          <div className="space-y-2 max-h-64 overflow-auto">
            {audit.length === 0 ? <p className="text-xs text-muted-foreground">No actions logged yet.</p> : audit.map((r) => (
              <div key={r.id} className="text-xs border-l-2 border-primary/40 pl-2">
                <div className="text-foreground">
                  {r.action === "grant_admin" ? "🟢" : "🔴"} {r.action.replace("_", " ")}
                  {r.target_email && <> · {r.target_email}</>}
                </div>
                <div className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Current admins</h3>
          <span className="text-xs text-muted-foreground">{admins.length} total</span>
        </div>
        {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : admins.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-sm">No admins yet.</Card>
        ) : admins.map((a) => (
          <Card key={a.user_id} className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/15 grid place-items-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-base">{a.full_name || a.email.split("@")[0]}</span>
                {a.user_id === me && <Badge variant="outline" className="text-[10px]">You</Badge>}
              </div>
              <a href={`mailto:${a.email}`} className="text-xs text-primary inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {a.email}</a>
              <div className="text-[11px] text-muted-foreground mt-1">Since {new Date(a.granted_at).toLocaleDateString()}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={a.user_id === me}
              onClick={() => revoke(a.user_id, a.full_name || a.email)}
              title={a.user_id === me ? "You cannot revoke your own admin role" : "Revoke admin role"}
            >
              <XCircle className="w-4 h-4 text-destructive mr-1" /> Revoke
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
