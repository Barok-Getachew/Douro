import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, ArrowLeft, Layers, LayoutGrid } from "lucide-react";

const title = "Printable QR Menu Cards — D'ouro Soul Food Salzburg";
const description =
  "Print-ready QR codes for the D'ouro Soul Food digital menu: A4 poster, table tent, sticker and business card formats.";

export const Route = createFileRoute("/qr")({
  component: QrPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/qr" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/qr" }],
  }),
});

interface FormatConfig {
  id: string;
  label: string;
  w: string;
  h: string;
  qrSize: number;
  scale: number;
  layout: "vertical" | "horizontal" | "circle";
}

const formats: FormatConfig[] = [
  { id: "a4", label: "A4 Poster (Wall / Counter Display)", w: "210mm", h: "297mm", qrSize: 220, scale: 1.2, layout: "vertical" },
  { id: "tent", label: "Table Tent (A6 Stand)", w: "105mm", h: "148mm", qrSize: 110, scale: 0.78, layout: "vertical" },
  { id: "card", label: "Table Card (Landscape)", w: "120mm", h: "80mm", qrSize: 84, scale: 0.78, layout: "horizontal" },
  { id: "sticker", label: "Coaster / Sticker (Circle)", w: "90mm", h: "90mm", qrSize: 72, scale: 0.7, layout: "circle" },
];

const TABLE_COUNT = 15;

/** Premium split-panel table card — QR left | number right */
function TableCard({ tableNum, dataUrl }: { tableNum: number; dataUrl: string }) {
  return (
    <div
      className="print-container"
      style={{
        width: "90mm",
        height: "64mm",
        boxSizing: "border-box",
        borderRadius: "7mm",
        background: "linear-gradient(135deg, #141008 0%, #1e1710 60%, #0e0b05 100%)",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(197,168,112,0.12)",
      }}
    >
      {/* ── LEFT: QR section ── */}
      <div
        style={{
          flex: "0 0 58%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4mm",
        }}
      >
        {/* spacer at top to push QR + label down */}
        <div style={{ height: "14mm" }} />
        {dataUrl && (
          <div style={{ background: "#fff", borderRadius: "3.5mm", padding: "2.5mm", boxShadow: "0 2px 12px rgba(0,0,0,0.4)", marginTop: "3mm", marginBottom: "7mm" }}>
            <img src={dataUrl} alt={`QR Table ${tableNum}`} style={{ width: "32mm", height: "32mm", display: "block" }} />
          </div>
        )}
        <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c5a870" }}>
          Scan for Menu
        </p>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ width: "0.3mm", background: "linear-gradient(to bottom, transparent 8%, #c5a870 30%, #c5a870 70%, transparent 92%)", opacity: 0.45, flexShrink: 0, alignSelf: "stretch" }} />

      {/* ── RIGHT: Table number section ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4mm",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2mm" }}>
          <span style={{ fontSize: "4.2rem", fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.02em" }}>
            {tableNum}
          </span>
          <img src="/logo.png" alt="D'ouro" style={{ height: "22mm", objectFit: "contain", opacity: 0.9 }} />
        </div>
      </div>
    </div>
  );
}

/** Redesigned premium format card */
function FormatCard({
  f,
  dataUrl,
}: {
  f: FormatConfig;
  dataUrl: string;
}) {
  const isHorizontal = f.layout === "horizontal";
  const isCircle = f.layout === "circle";

  return (
    <div
      className="art-deco-card print-container relative overflow-hidden"
      style={{
        width: f.w,
        height: f.h,
        boxSizing: "border-box",
        borderRadius: isCircle ? "50%" : "8mm",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isHorizontal ? "0" : "0",
        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
      }}
    >
      {/* Corner deco (non-circle) */}
      {!isCircle && (
        <>
          <div className="art-deco-border" style={{ borderRadius: "8mm" }} />
          <div className="art-deco-corner art-deco-corner-tl" />
          <div className="art-deco-corner art-deco-corner-tr" />
          <div className="art-deco-corner art-deco-corner-bl" />
          <div className="art-deco-corner art-deco-corner-br" />
        </>
      )}

      {/* Branding block */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          transform: `scale(${f.scale})`,
          transformOrigin: "center",
          ...(isHorizontal ? { width: "50%", justifyContent: "center" } : {}),
        }}
      >
        <div style={{ marginBottom: "6px" }}>
          <img src="/logo.png" alt="D'ouro logo" style={{ height: "80px", objectFit: "contain" }} />
        </div>
        <p
          style={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#c5a870",
            opacity: 0.9,
          }}
        >
          Scan to View Menu
        </p>
      </div>

      {/* QR block */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          transform: `scale(${f.scale})`,
          transformOrigin: "center",
          ...(isHorizontal ? { width: "50%", justifyContent: "center" } : {}),
        }}
      >
        {dataUrl && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "6px",
              padding: "8px",
              boxShadow: "0 0 0 2px rgba(197,168,112,0.25), 0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={dataUrl}
              alt="QR Code"
              style={{ width: `${f.qrSize}px`, height: `${f.qrSize}px`, display: "block" }}
            />
          </div>
        )}
        <p style={{ fontSize: "0.48rem", color: "#c5a870", marginTop: "8px", fontWeight: 500 }}>
          Visit our Menu Online
        </p>
        <p style={{ fontSize: "0.4rem", color: "#c5a870", opacity: 0.45, fontFamily: "monospace", marginTop: "2px" }}>
          dourosoulfood.com
        </p>
      </div>
    </div>
  );
}

function QrPage() {
  const [dataUrl, setDataUrl] = useState("");
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState<"formats" | "tables">("tables");

  useEffect(() => {
    const target = window.location.origin + "/";
    setUrl(target);
    QRCode.toDataURL(target, {
      width: 600,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#1a1108", light: "#ffffff" },
    }).then(setDataUrl);
  }, []);

  return (
    <main className="min-h-dvh bg-[#0d0907] px-5 py-10 sm:px-8 text-foreground no-print-bg">
      <div className="mx-auto max-w-5xl">

        {/* Top Control Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-primary/10 pb-6 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden /> Back to Menu
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Printer className="size-4" aria-hidden />
            {tab === "tables" ? "Print Table Cards" : "Print QR Papers"}
          </button>
        </div>

        {/* Intro */}
        <div className="no-print mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-display font-medium text-gold-gradient">
            Branded QR Cards
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Premium printable cards for D'ouro Soul Food.{" "}
            <span className="text-primary font-mono">{url || "loading..."}</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="no-print flex justify-center mb-12">
          <div className="inline-flex rounded-full border border-primary/20 bg-background/40 p-1 gap-1">
            <button
              onClick={() => setTab("tables")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                tab === "tables"
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              Table Cards (1–{TABLE_COUNT})
            </button>
            <button
              onClick={() => setTab("formats")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                tab === "formats"
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="size-3.5" />
              Format Templates
            </button>
          </div>
        </div>

        {/* ── TABLE CARDS SHEET ── */}
        {tab === "tables" && (
          <div>
            <p className="no-print text-center text-xs text-muted-foreground/60 mb-10">
              {TABLE_COUNT} cards · 3 per row · prints across 2 A4 pages · cut along the rounded edges
            </p>
            <div
              id="table-cards-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 90mm)",
                gap: "7mm",
                justifyContent: "center",
              }}
            >
              {Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map((n) => (
                <TableCard key={n} tableNum={n} dataUrl={dataUrl} />
              ))}
            </div>
          </div>
        )}

        {/* ── FORMAT TEMPLATES ── */}
        {tab === "formats" && (
          <div className="flex flex-col gap-16 items-center justify-center">
            {formats.map((f) => (
              <figure key={f.id} className="w-full flex flex-col items-center">
                <figcaption className="no-print mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/75">
                  {f.label} — <span className="font-mono">{f.w} × {f.h}</span>
                </figcaption>
                <FormatCard f={f} dataUrl={dataUrl} />
              </figure>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
