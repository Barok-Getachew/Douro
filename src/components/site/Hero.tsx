import { Star, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { useLang } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useMenuData } from "@/lib/menu-context";

export function Hero() {
  const { t, tr } = useLang();
  const { restaurant } = useMenuData();

  const scrollToMenu = () => {
    const el = document.getElementById("menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Restaurant interior"
          className="size-full object-cover object-[center_35%]"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/50" />
      </div>

      {/* Language Switcher Positioned Top Right */}
      <div className="flex justify-end p-5">
        <LanguageSwitcher />
      </div>

      {/* Content centered vertically and horizontally */}
      <div className="flex flex-1 items-center justify-center px-5 text-center">
        <div className="max-w-2xl">
          {/* Logo */}
          <div className="mb-6 inline-flex items-center justify-center">
            <img src="/logo.png" alt="D'ouro logo" className="h-32 object-contain" />
          </div>

          <h1 className="font-display text-5xl font-medium tracking-wide text-foreground sm:text-7xl">
            {restaurant.name}
          </h1>

          <p className="mt-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
            {tr(restaurant.tagline)}
          </p>

          {/* Golden Hairline Divider */}
          <div className="mx-auto my-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Rating — premium pill design */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-background/40 px-5 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3.5 ${
                      i < Math.round(restaurant.rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-display text-base font-medium text-foreground">
                {restaurant.rating.toFixed(1)}
              </span>
              <span className="h-4 w-px bg-primary/25" />
              <span className="text-sm text-muted-foreground">
                {restaurant.reviewCount} {t("ratingLabel")}
              </span>
            </div>
          </div>

          {/* CTA Button — See Menu */}
          <div className="mt-10">
            <button
              id="hero-menu-btn"
              onClick={scrollToMenu}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-[var(--shadow-gold)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(var(--primary-rgb,212,166,88),0.45)]"
            >
              {/* Shimmer sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
              <span>{t("seeMenu") ?? "See Menu"}</span>
              <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="flex justify-center pb-8">
        <button
          onClick={scrollToMenu}
          aria-label="Scroll to menu"
          className="animate-bounce text-primary/50 transition-colors hover:text-primary"
        >
          <ChevronDown className="size-6" />
        </button>
      </div>
    </header>
  );
}
