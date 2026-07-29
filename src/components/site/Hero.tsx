import { Star } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { useLang } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useMenuData } from "@/lib/menu-context";

export function Hero() {
  const { t, tr } = useLang();
  const { restaurant } = useMenuData();

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
          {/* Monogram / Small Logo representation */}
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

          {/* Rating */}
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <span className="flex text-primary">
              <Star className="size-4 fill-primary" />
            </span>
            <span className="font-medium text-foreground">{restaurant.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{t("reviewsCount", { count: restaurant.reviewCount })}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
