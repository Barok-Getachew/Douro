import { Phone, MapPin, Instagram, Facebook, MessageCircle, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useMenuData } from "@/lib/menu-context";

export function FloatingActions() {
  const { t } = useLang();
  const { restaurant } = useMenuData();
  const [showTop, setShowTop] = useState(false);

  const actions = [
    { href: restaurant.phoneHref, icon: Phone, label: "Call restaurant" },
    { href: restaurant.whatsapp, icon: MessageCircle, label: "WhatsApp" },
    { href: restaurant.maps, icon: MapPin, label: "Google Maps" },
    { href: restaurant.instagram, icon: Instagram, label: "Instagram" },
    { href: restaurant.facebook, icon: Facebook, label: "Facebook" },
  ];

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 px-4 pb-4">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("backToTop")}
          className="pointer-events-auto grid size-11 place-items-center self-end rounded-full border border-primary/30 bg-card/90 text-primary backdrop-blur transition-transform hover:scale-105"
        >
          <ArrowUp className="size-5" aria-hidden />
        </button>
      )}
      <nav
        aria-label="Quick contact"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-primary/25 bg-card/90 px-2 py-2 shadow-[var(--shadow-lux)] backdrop-blur-xl"
      >
        {actions.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
          >
            <Icon className="size-5" aria-hidden />
          </a>
        ))}
      </nav>
    </div>
  );
}
