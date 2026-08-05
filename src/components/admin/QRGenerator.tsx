import { useEffect, useRef, useCallback, useState } from "react";
import QRCode from "qrcode";
import { Download, FileImage, FileType2, Copy, ChevronDown, Check } from "lucide-react";

interface QRGeneratorProps {
  url: string;
  restaurantName: string;
  tagline: string;
}

export function QRGenerator({ url, restaurantName, tagline }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 1200;
    const H = 800;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // ── Luxury Dark Background (Premium Dark Slate with Soft Radial Highlights)
    const bg = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 700);
    bg.addColorStop(0, "#1c1510");
    bg.addColorStop(1, "#0c0806");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle premium warm gold marble veins
    ctx.strokeStyle = "rgba(197, 168, 112, 0.035)";
    ctx.lineWidth = 1.5;
    const veins = [
      [100, 0, 400, 300, 200, 500, 600, 800],
      [1100, 0, 800, 200, 900, 600, 700, 800],
      [0, 400, 300, 300, 600, 500, 1200, 400]
    ];
    for (const v of veins) {
      ctx.beginPath();
      ctx.moveTo(v[0], v[1]);
      ctx.bezierCurveTo(v[2], v[3], v[4], v[5], v[6], v[7]);
      ctx.stroke();
    }

    // ── Luxury Double Border Framing (Bright Gold) ──
    const borderPad = 36;
    const bw = W - borderPad * 2;
    const bh = H - borderPad * 2;

    // Solid inner frame
    ctx.strokeStyle = "#c5a870";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(borderPad, borderPad, bw, bh);

    // Fine outer frame
    ctx.strokeStyle = "rgba(197, 168, 112, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(borderPad - 8, borderPad - 8, bw + 16, bh + 16);

    // ── Corner Ornaments ──
    const corners = [
      { x: borderPad, y: borderPad, r: 0 },
      { x: W - borderPad, y: borderPad, r: Math.PI / 2 },
      { x: W - borderPad, y: H - borderPad, r: Math.PI },
      { x: borderPad, y: H - borderPad, r: Math.PI * 1.5 },
    ];
    ctx.strokeStyle = "#c5a870";
    for (const c of corners) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.r);
      
      const s = 45;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, -s);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(197, 168, 112, 0.4)";
      ctx.strokeRect(-12, -12, 24, 24);
      ctx.restore();
    }

    // ── Left Side: Brand Logo ──
    const colLeftX = 350;

    // Load and draw transparent logo.png containing genuine white letters and red chili pepper
    const brandLogo = await loadImage("/logo.png");
    
    // Scale logo down to fit the layout width (approx 340px width max)
    const logoW = 340;
    const logoH = logoW * (brandLogo.height / brandLogo.width);
    
    // Position center-aligned at Y: 180
    const logoX = colLeftX - logoW / 2;
    const logoY = 180;
    
    ctx.drawImage(brandLogo, logoX, logoY, logoW, logoH);

    // Divider Line
    ctx.strokeStyle = "rgba(197, 168, 112, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(colLeftX - 90, 420);
    ctx.lineTo(colLeftX + 90, 420);
    ctx.stroke();

    // Salzburg tagline
    ctx.font = "600 11px 'Manrope', system-ui, sans-serif";
    ctx.fillStyle = "rgba(197, 168, 112, 0.85)";
    ctx.letterSpacing = "0.15em";
    ctx.textAlign = "center";
    ctx.fillText("SALZBURG · AUSTRIA", colLeftX, 450);
    ctx.letterSpacing = "0";

    // Column Divider
    ctx.strokeStyle = "rgba(197, 168, 112, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(600, H / 2 - 180);
    ctx.lineTo(600, H / 2 + 180);
    ctx.stroke();

    // ── Right Side: High-Contrast Scanning Instructions & QR code ──
    const colRightX = 850;

    // Scan instruction (High Contrast White)
    ctx.font = "bold 24px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("SCAN FOR MENU", colRightX, 135);

    ctx.font = "600 11px 'Manrope', system-ui, sans-serif";
    ctx.fillStyle = "#c5a870"; // Bright Gold subtext
    ctx.letterSpacing = "0.18em";
    ctx.fillText("OPEN CAMERA TO SCAN", colRightX, 160);
    ctx.letterSpacing = "0";

    const qrSize = 310;
    const qrX = colRightX - qrSize / 2;
    const qrY = 195;
    const framePad = 14;

    // Draw white background card for QR scanning contrast
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qrX - framePad, qrY - framePad, qrSize + framePad * 2, qrSize + framePad * 2, 6);
    ctx.fill();

    // Draw thick solid gold framing line around white box
    ctx.strokeStyle = "#c5a870";
    ctx.lineWidth = 4;
    roundRect(ctx, qrX - framePad, qrY - framePad, qrSize + framePad * 2, qrSize + framePad * 2, 6);
    ctx.stroke();

    // Render QR Code content inside frame
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: qrSize * 2,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0c0806", light: "#ffffff" },
    });
    const qrImg = await loadImage(qrDataUrl);
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Callout Label Below
    ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "#c5a870";
    ctx.fillText("Visit our Menu Online", colRightX, qrY + qrSize + framePad + 38);

    // Website Link
    ctx.font = "500 11px 'Manrope', system-ui, sans-serif";
    ctx.fillStyle = "rgba(197, 168, 112, 0.75)";
    ctx.fillText("dourosoulfood.com", colRightX, qrY + qrSize + framePad + 56);

  }, [url, restaurantName, tagline]);

  useEffect(() => {
    draw();
  }, [draw]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /** Download the canvas as PNG */
  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), "douro-qr-card.png");
    }, "image/png");
    setMenuOpen(false);
  };

  /** Download the canvas as JPEG */
  const downloadJpeg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), "douro-qr-card.jpg");
    }, "image/jpeg", 0.95);
    setMenuOpen(false);
  };

  /** Download a raw QR code as SVG (no branding, just the scannable code) */
  const downloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(url, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#0c0806", light: "#ffffff" },
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      triggerDownload(URL.createObjectURL(blob), "douro-qr-code.svg");
    } catch (e) {
      console.error("SVG export failed", e);
    }
    setMenuOpen(false);
  };

  /** Copy the QR image (PNG) to clipboard */
  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
    setMenuOpen(false);
  };

  const exportOptions = [
    {
      id: "png",
      label: "Download PNG",
      sub: "Full branded card · lossless",
      Icon: FileImage,
      action: downloadPng,
    },
    {
      id: "jpeg",
      label: "Download JPEG",
      sub: "Full branded card · compressed",
      Icon: FileImage,
      action: downloadJpeg,
    },
    {
      id: "svg",
      label: "Download SVG",
      sub: "Raw QR code · scalable vector",
      Icon: FileType2,
      action: downloadSvg,
    },
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy to Clipboard",
      sub: "PNG · paste anywhere",
      Icon: copied ? Check : Copy,
      action: copyToClipboard,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          className="w-full rounded-2xl border border-primary/20"
          style={{ aspectRatio: "3/2" }}
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/10 pointer-events-none" />
      </div>

      {/* Export button + dropdown */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          id="download-qr-btn"
          className="group relative inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full px-10 text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_48px_-8px_rgba(184,135,58,0.6)]"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
        >
          <Download className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          Export QR Card
          <ChevronDown className={`size-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            className="absolute bottom-full left-1/2 mb-3 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-primary/20 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
            style={{ background: "linear-gradient(160deg, oklch(0.22 0.015 62), oklch(0.17 0.012 60))" }}
          >
            <p className="border-b border-border px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Export Format
            </p>
            {exportOptions.map(({ id, label, sub, Icon, action }) => (
              <button
                key={id}
                onClick={action}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <div
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20"
                  style={{ background: "oklch(0.19 0.013 60)" }}
                >
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">1200 × 800 px · print-ready · branded gold card</p>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
