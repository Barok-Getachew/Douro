import { createFileRoute } from "@tanstack/react-router";
import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  UtensilsCrossed,
  Store,
  QrCode,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Save,
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  Leaf,
  Sprout,
  WheatOff,
  Sparkles,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  adminLoginFn,
  checkAuthFn,
  upsertMenuItemFn,
  deleteMenuItemFn,
  updateRestaurantFn,
  uploadMenuImageFn,
  getMenuDataFn,
} from "@/lib/server-fns";
import { categories, type MenuItem, type Tag } from "@/lib/menu-data";
import { QRGenerator } from "@/components/admin/QRGenerator";
import type { Restaurant } from "@/lib/menu-context";

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — D'ouro Soul Food" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

// ─── Storage key ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "douro_admin_tok";

function getStoredToken() {
  try {
    return typeof window !== "undefined"
      ? (sessionStorage.getItem(TOKEN_KEY) ?? "")
      : "";
  } catch {
    return "";
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "menu" | "restaurant" | "qr";

function AdminPage() {
  const [token, setToken] = useState(getStoredToken);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    checkAuthFn({ data: { token } })
      .then(({ authenticated }) => {
        setAuthenticated(authenticated);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [token]);

  const handleLogin = (tok: string) => {
    sessionStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminLoginFn({ data: { password } });
      onLogin(token);
    } catch {
      setError("Wrong password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-dvh items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.28 0.06 80 / 0.35), transparent), oklch(0.14 0.01 60)",
      }}
    >
      {/* Decorative gold orbs */}
      <div
        className="pointer-events-none fixed left-[-20vw] top-[-20vh] size-[60vw] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, oklch(0.79 0.13 84), transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed right-[-15vw] bottom-[-15vh] size-[50vw] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.1 80), transparent 70%)" }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm"
        id="admin-login-form"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.22 0.015 62), oklch(0.18 0.012 60))",
            border: "1px solid oklch(0.79 0.13 84 / 0.2)",
          }}
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex size-20 items-center justify-center">
              <img src="/logo.png" alt="D'ouro logo" className="h-full object-contain" />
            </div>
            <div className="text-center">
              <h1
                className="font-display text-3xl font-medium"
                style={{
                  background: "var(--gradient-gold)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Admin Portal
              </h1>
              <p className="mt-1 text-xs tracking-[0.25em] text-muted-foreground uppercase">
                D'ouro Soul Food
              </p>
            </div>
          </div>

          {/* Hairline */}
          <div className="hairline mb-8" />

          {/* Password field */}
          <div className="relative">
            <label
              htmlFor="admin-password"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-border bg-background/50 pr-12 pl-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !password}
            id="admin-login-btn"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_oklch(0.79_0.13_84/0.5)] disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: "var(--gradient-gold)" }}
          >
            {loading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : null}
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("menu");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: { id: Tab; label: string; Icon: typeof UtensilsCrossed }[] = [
    { id: "menu", label: "Menu Items", Icon: UtensilsCrossed },
    { id: "restaurant", label: "Restaurant", Icon: Store },
    { id: "qr", label: "QR Studio", Icon: QrCode },
  ];

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="size-9 shrink-0 flex items-center justify-center">
            <img src="/logo.png" alt="D'ouro logo" className="h-full object-contain" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-tight text-primary">
                D'ouro
              </p>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Admin
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-2 pt-4">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              id={`admin-tab-${id}`}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                tab === id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              style={tab === id ? { borderLeft: "3px solid var(--color-primary)" } : { borderLeft: "3px solid transparent" }}
            >
              <Icon className="size-5 shrink-0" />
              {sidebarOpen && label}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-border p-2">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            {sidebarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            {sidebarOpen && "Collapse"}
          </button>
          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4 shrink-0" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <h2 className="font-display text-2xl text-foreground">
            {navItems.find((n) => n.id === tab)?.label}
          </h2>
          <div
            className="ml-auto flex items-center gap-2 rounded-full border border-primary/25 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Live
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === "menu" && <MenuItemsTab token={token} />}
          {tab === "restaurant" && <RestaurantTab token={token} />}
          {tab === "qr" && <QRStudioTab />}
        </div>
      </main>
    </div>
  );
}

// ─── Menu Items Tab ───────────────────────────────────────────────────────────

function MenuItemsTab({ token }: { token: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMenuDataFn();
      setItems(data.menuItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      item.name.en.toLowerCase().includes(q) ||
      item.name.de.toLowerCase().includes(q);
    const matchCat = catFilter === "all" || item.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async (item: MenuItem) => {
    try {
      await upsertMenuItemFn({ data: { token, item } });
      showToast(`"${item.name.en}" saved!`);
      setEditing(null);
      load();
    } catch (e) {
      showToast((e as Error).message, false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteMenuItemFn({ data: { token, id } });
      showToast("Item deleted");
      load();
    } catch (e) {
      showToast((e as Error).message, false);
    }
  };

  const openNew = () => {
    setEditing({
      id: "",
      category: "appetizers",
      price: 0,
      allergens: [],
      tags: [],
      popular: false,
      name: { en: "", de: "", pt: "" },
      desc: { en: "", de: "", pt: "" },
    });
    setIsNew(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Items", val: items.length },
          { label: "Popular", val: items.filter((i) => i.popular).length },
          { label: "Categories", val: categories.length },
        ].map(({ label, val }) => (
          <div key={label} className="lux-card rounded-xl p-4 text-center">
            <p className="font-display text-3xl text-primary">{val}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="h-10 w-48 rounded-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="h-10 rounded-full border border-border bg-card px-4 text-sm text-foreground focus:border-primary/60 focus:outline-none"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.en}
            </option>
          ))}
        </select>
        <button
          id="admin-add-item-btn"
          onClick={openNew}
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Plus className="size-4" /> Add Item
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="lux-card h-40 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => { setEditing(item); setIsNew(false); }}
              onDelete={() => handleDelete(item.id, item.name.en)}
            />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <MenuItemModal
          item={editing}
          isNew={isNew}
          token={token}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg ${
            toast.ok ? "" : "bg-destructive"
          }`}
          style={toast.ok ? { background: "var(--gradient-gold)" } : undefined}
        >
          {toast.ok ? <Check className="size-4" /> : <AlertTriangle className="size-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="lux-card group relative flex gap-3 rounded-xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)]">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name.en}
          className="size-20 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="size-20 shrink-0 flex items-center justify-center rounded-lg border border-primary/15 p-2 bg-white/5">
          <img src="/logo.png" alt="D'ouro logo" className="h-full object-contain" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-display text-lg leading-tight text-foreground">
            {item.name.en}
          </p>
          <span className="shrink-0 font-display text-base text-primary">
            €{item.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-muted-foreground">
          {item.category}
        </span>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Pencil className="size-3" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="size-3" /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Menu Item Modal ──────────────────────────────────────────────────────────

const ALL_TAGS: { id: Tag; label: string; Icon: typeof Flame }[] = [
  { id: "vegan", label: "Vegan", Icon: Sprout },
  { id: "vegetarian", label: "Vegetarian", Icon: Leaf },
  { id: "glutenfree", label: "Gluten-Free", Icon: WheatOff },
  { id: "spicy", label: "Spicy", Icon: Flame },
  { id: "chef", label: "Chef's Pick", Icon: Star },
  { id: "new", label: "New", Icon: Sparkles },
];

const ALLERGEN_OPTIONS = ["A", "B", "E", "F", "G", "M", "R"];

type Lang = "en" | "de" | "pt";
const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "pt", label: "Português" },
];

function MenuItemModal({
  item: initial,
  isNew,
  token,
  onSave,
  onClose,
}: {
  item: MenuItem;
  isNew: boolean;
  token: string;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MenuItem>(initial);
  const [lang, setLang] = useState<Lang>("en");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const updateName = (v: string) =>
    setForm((f) => ({ ...f, name: { ...f.name, [lang]: v } }));
  const updateDesc = (v: string) =>
    setForm((f) => ({ ...f, desc: { ...f.desc, [lang]: v } }));
  const toggleTag = (tag: Tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  const toggleAllergen = (a: string) =>
    setForm((f) => ({
      ...f,
      allergens: f.allergens.includes(a)
        ? f.allergens.filter((x) => x !== a)
        : [...f.allergens, a],
    }));

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const { url } = await uploadMenuImageFn({
        data: { token, base64, filename: file.name, mimeType: file.type },
      });
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="relative ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden shadow-[var(--shadow-lux)]"
        style={{
          background: "linear-gradient(160deg, oklch(0.22 0.015 62), oklch(0.17 0.012 60))",
          borderLeft: "1px solid oklch(0.79 0.13 84 / 0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-2xl text-primary">
            {isNew ? "Add New Item" : "Edit Item"}
          </h3>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <form id="admin-item-form" onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* ID (new only) */}
          {isNew && (
            <div>
              <label className="admin-label">ID (slug)</label>
              <input
                required
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                placeholder="e.g. my-dish"
                className="admin-input"
              />
            </div>
          )}

          {/* Language tabs */}
          <div>
            <div className="mb-3 flex gap-1 rounded-lg border border-border p-1">
              {LANGS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLang(id)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                    lang === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <label className="admin-label">Name ({lang.toUpperCase()})</label>
                <input
                  required={lang === "en"}
                  value={form.name[lang]}
                  onChange={(e) => updateName(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Description ({lang.toUpperCase()})</label>
                <textarea
                  rows={3}
                  value={form.desc[lang]}
                  onChange={(e) => updateDesc(e.target.value)}
                  className="admin-input resize-none"
                />
              </div>
            </div>
          </div>

          {/* Price & category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Price (€)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price || ""}
                onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="admin-input"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="admin-label">Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-4 text-center hover:border-primary/40"
            >
              {form.image ? (
                <img
                  src={form.image}
                  alt="preview"
                  className="h-28 rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-6" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              {uploading && (
                <p className="text-xs text-primary">Uploading…</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
            {form.image && (
              <button
                type="button"
                className="mt-1 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => setForm((f) => ({ ...f, image: undefined }))}
              >
                Remove image
              </button>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="admin-label">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleTag(id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    form.tags.includes(id)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon className="size-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="admin-label">Allergens</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergen(a)}
                  className={`size-9 rounded-lg border text-xs font-bold transition-colors ${
                    form.allergens.includes(a)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Popular toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Popular Item</p>
              <p className="text-xs text-muted-foreground">Shows in the "Popular" filter</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, popular: !f.popular }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.popular ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  form.popular ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            type="submit"
            form="admin-item-form"
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            style={{ background: "var(--gradient-gold)" }}
          >
            {saving ? (
              <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <Save className="size-4" />
            )}
            {isNew ? "Create Item" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Restaurant Tab ───────────────────────────────────────────────────────────

function RestaurantTab({ token }: { token: string }) {
  const [form, setForm] = useState<Restaurant | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMenuDataFn().then((d) => setForm(d.restaurant as Restaurant));
  }, []);

  if (!form) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="lux-card h-14 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateRestaurantFn({ data: { token, restaurant: form } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Save failed: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof Restaurant, type = "text") => (
    <div key={key}>
      <label className="admin-label">{label}</label>
      <input
        type={type}
        value={(form[key] as string | number) ?? ""}
        onChange={(e) =>
          setForm((f) =>
            f
              ? {
                  ...f,
                  [key]: type === "number" ? parseFloat(e.target.value) : e.target.value,
                }
              : f,
          )
        }
        className="admin-input"
      />
    </div>
  );

  const multilangField = (
    label: string,
    key: "tagline" | "hours",
  ) => (
    <div key={key} className="space-y-2">
      <label className="admin-label">{label}</label>
      <div className="grid gap-2">
        {(["en", "de", "pt"] as const).map((l) => (
          <div key={l} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-center text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
              {l}
            </span>
            <input
              value={form[key][l]}
              onChange={(e) =>
                setForm((f) =>
                  f ? { ...f, [key]: { ...f[key], [l]: e.target.value } } : f,
                )
              }
              className="admin-input"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-5" id="admin-restaurant-form">
      <div className="lux-card rounded-xl p-6 space-y-5">
        <h3 className="font-display text-xl text-primary">Basic Info</h3>
        {field("Restaurant Name", "name")}
        {multilangField("Tagline", "tagline")}
        {multilangField("Opening Hours", "hours")}
        {field("Rating", "rating", "number")}
        {field("Review Count", "reviewCount", "number")}
      </div>

      <div className="lux-card rounded-xl p-6 space-y-5">
        <h3 className="font-display text-xl text-primary">Location & Contact</h3>
        {field("Street Address", "street")}
        {field("City", "city")}
        {field("Phone", "phone")}
        {field("Phone Href", "phoneHref")}
        {field("WhatsApp URL", "whatsapp")}
        {field("Email", "email")}
        {field("Google Maps URL", "maps")}
        {field("Order URL", "order")}
      </div>

      <div className="lux-card rounded-xl p-6 space-y-5">
        <h3 className="font-display text-xl text-primary">Social Media</h3>
        {field("Instagram URL", "instagram")}
        {field("Facebook URL", "facebook")}
        {field("TripAdvisor URL", "tripadvisor")}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          id="admin-save-restaurant-btn"
          className="inline-flex h-12 items-center gap-2 rounded-xl px-8 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          style={{ background: "var(--gradient-gold)" }}
        >
          {saving ? (
            <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
          ) : (
            <Save className="size-4" />
          )}
          Save Changes
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <Check className="size-4" /> Saved successfully!
          </span>
        )}
      </div>
    </form>
  );
}

// ─── QR Studio Tab ────────────────────────────────────────────────────────────

function QRStudioTab() {
  const [url, setUrl] = useState(typeof window !== "undefined" ? window.location.origin + "/" : "https://your-domain.com/");

  return (
    <div className="max-w-3xl space-y-8">
      <div className="lux-card rounded-xl p-5">
        <label className="admin-label">Menu URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="admin-input"
          placeholder="https://your-domain.com/"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          This URL is encoded in the QR code. Update it after deploying to Vercel.
        </p>
      </div>

      <QRGenerator
        url={url}
        restaurantName="D'ouro Soul Food"
        tagline="Afro-Latin Soul Food · Salzburg"
      />
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
