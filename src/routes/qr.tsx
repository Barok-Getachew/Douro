import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, ArrowLeft, Wifi } from "lucide-react";
import { restaurant } from "@/lib/menu-data";

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

function QrPage() {
  const [dataUrl, setDataUrl] = useState("");
  const [url, setUrl] = useState("");

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
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-gold)] transition-transform active:scale-95"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Printer className="size-4" aria-hidden /> Print QR Papers
            </button>
          </div>
        </div>

        {/* Intro */}
        <div className="no-print mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-display font-medium text-gold-gradient">
            Luxury Branded QR Papers
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Premium printable layouts matching the restaurant's dark marble and gold aesthetic. Pointing to:{" "}
            <span className="text-primary font-mono">{url || "loading..."}</span>. Use high-quality cardstock paper for best results.
          </p>
        </div>

        {/* Templates Loop */}
        <div className="flex flex-col gap-16 items-center justify-center">
          {formats.map((f) => (
            <figure key={f.id} className="w-full flex flex-col items-center">
              <figcaption className="no-print mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/75">
                {f.label} — <span className="font-mono">{f.w} × {f.h}</span>
              </figcaption>

              {/* Printable Wrapper - Matches generated mockup */}
              <div
                className={`art-deco-card print-container relative overflow-hidden flex ${
                  f.layout === "horizontal"
                    ? "flex-row items-center justify-center gap-6 px-4"
                    : "flex-col items-center justify-center gap-6 py-8 px-4"
                } ${
                  f.layout === "circle" ? "rounded-full" : "rounded-[2px]"
                } shadow-[0_25px_60px_rgba(0,0,0,0.85)] print:shadow-none`}
                style={{
                  width: f.w,
                  height: f.h,
                  boxSizing: "border-box",
                }}
              >
                {/* Border line framing */}
                {f.layout !== "circle" && <div className="art-deco-border" />}

                {/* Art Deco Corners */}
                {f.layout !== "circle" && (
                  <>
                    <div className="art-deco-corner art-deco-corner-tl" />
                    <div className="art-deco-corner art-deco-corner-tr" />
                    <div className="art-deco-corner art-deco-corner-bl" />
                    <div className="art-deco-corner art-deco-corner-br" />
                  </>
                )}

                {/* Left/Top Area: Branding */}
                <div
                  className={`relative z-10 flex flex-col items-center text-center ${
                    f.layout === "horizontal" ? "w-1/2 justify-center" : ""
                  }`}
                  style={{ transform: `scale(${f.scale})`, transformOrigin: "center" }}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <img src="/logo.png" alt="D'ouro logo" className="h-20 object-contain" />
                  </div>

                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[#c5a870]/90">
                    Scan to View Menu
                  </p>
                </div>

                {/* Right/Bottom Area: QR code in metallic gold frame */}
                <div
                  className={`relative z-10 flex flex-col items-center ${
                    f.layout === "horizontal" ? "w-1/2 justify-center" : ""
                  }`}
                  style={{ transform: `scale(${f.scale})`, transformOrigin: "center" }}
                >
                  {dataUrl && (
                    <div className="qr-gold-frame">
                      <img
                        src={dataUrl}
                        alt="QR Code"
                        style={{ width: `${f.qrSize}px`, height: `${f.qrSize}px` }}
                      />
                    </div>
                  )}
                  
                  <p className="text-[0.48rem] font-sans font-medium text-[#c5a870] mt-2">
                    Visit our Menu Online
                  </p>
                  <p className="text-[0.4rem] font-mono text-center tracking-wider text-[#c5a870]/50 mt-0.5">
                    dourosoulfood.com
                  </p>
                  
                  <div className="flex items-center gap-1 text-[0.38rem] font-semibold tracking-widest text-[#c5a870]/40 uppercase mt-2">
                    <Wifi className="size-2" />
                    <span>Free Wi-Fi Available</span>
                  </div>
                </div>

              </div>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
