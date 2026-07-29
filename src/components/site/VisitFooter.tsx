import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { useMenuData } from "@/lib/menu-context";

export function VisitFooter() {
  const { t, tr } = useLang();
  const { restaurant } = useMenuData();

  // Extract query parameter or coordinate values for embedding if available.
  // Using Auerspergstraße 10, Salzburg, Austria
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2698.816480537021!2d13.042784577239247!3d47.80491027120786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47769062b1660d5b%3A0xc39f8892f3f7ca80!2sAuerspergstra%C3%9Fe%2010%2C%205020%20Salzburg!5e0!3m2!1sen!2sat!4v1700000000000!5m2!1sen!2sat`;

  return (
    <footer id="visit" className="border-t border-border px-5 pb-32 pt-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left Side: Brand, opening hours, contact details */}
          <Reveal>
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-medium tracking-wide text-foreground">
                  {t("visitUs")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{tr(restaurant.tagline)}</p>
              </div>

              {/* Opening Hours */}
              <div className="flex gap-4">
                <Clock className="size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    {t("openingHours")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tr(restaurant.hours)}</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex gap-4">
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    {t("address")}
                  </h3>
                  <a
                    href={restaurant.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {restaurant.street}
                    <br />
                    {restaurant.city}
                  </a>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-primary" aria-hidden />
                  <a
                    href={restaurant.phoneHref}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {restaurant.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-primary" aria-hidden />
                  <a
                    href={`mailto:${restaurant.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {restaurant.email}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Side: Map iframe rendering */}
          <Reveal delay={200}>
            <div className="lux-card relative aspect-video w-full overflow-hidden rounded-2xl flex flex-col md:aspect-square md:max-w-md md:justify-self-end">
              {/* Actual Google Maps IFrame */}
              <iframe
                title="Google Maps Location"
                src={embedUrl}
                className="w-full h-2/3 border-b border-primary/10"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary">
                    {t("salzburg")}
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t("findUsNear")}
                  </p>
                </div>

                {/* Interactive monograms / links */}
                <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-2">
                  {/* Social media icons */}
                  <div className="flex gap-3 text-muted-foreground">
                    <a
                      href={restaurant.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-primary"
                      aria-label="Instagram"
                    >
                      <Instagram className="size-5" />
                    </a>
                    <a
                      href={restaurant.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-primary"
                      aria-label="Facebook"
                    >
                      <Facebook className="size-5" />
                    </a>
                  </div>

                  {/* Hidden Entry Area: Subtle copyright link for Admin entrance */}
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                    <Link
                      to="/admin"
                      className="opacity-0 select-none pointer-events-auto w-8 h-8 block"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      &nbsp;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Small copyright note */}
        <div className="mt-20 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
