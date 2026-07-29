import { useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

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

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "douro-qr-card.png";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

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

      <button
        onClick={handleDownload}
        id="download-qr-btn"
        className="group relative inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full px-10 text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_48px_-8px_rgba(184,135,58,0.6)]"
        style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
      >
        <Download className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        Download QR Card (PNG)
        <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
      </button>

      <p className="text-xs text-muted-foreground">
        1200 × 800 px · print-ready · branded gold card
      </p>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
