import { Star, Quote } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { useMenuData } from "@/lib/menu-context";

export function Reviews() {
  const { t, tr } = useLang();
  const { restaurant, reviews } = useMenuData();
  return (
    <section id="reviews" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary">
              {t("guestReviews")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-wide text-foreground sm:text-5xl">
              {t("whatGuestsSay")}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-1">
              <span className="font-display text-2xl text-foreground">
                {restaurant.rating.toFixed(1)}
              </span>
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({restaurant.reviewCount} {t("reviewsCount")})
              </span>
            </div>
          </div>
        </Reveal>

        {/* Review Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((rev, idx) => (
            <Reveal key={idx} delay={200 * idx}>
              <article className="lux-card flex h-full flex-col justify-between rounded-2xl p-6 relative">
                {/* Decorative quote icon */}
                <Quote className="absolute right-6 top-6 size-8 text-primary/10" aria-hidden />

                <div>
                  {/* 5-Star Rating representation */}
                  <div className="flex gap-0.5 text-primary mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    "{tr(rev.quote)}"
                  </blockquote>
                </div>

                <div className="mt-6 border-t border-primary/10 pt-4 flex justify-between items-center text-xs">
                  <cite className="not-italic font-semibold text-foreground">{rev.author}</cite>
                  <span className="text-muted-foreground">{rev.source}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
