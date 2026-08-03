import { Star, Quote } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { useMenuData } from "@/lib/menu-context";
import { ReviewModal } from "./ReviewModal";

export function Reviews() {
  const { t, tr } = useLang();
  const { restaurant, reviews } = useMenuData();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

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
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <div className="flex items-center gap-1">
                <span className="font-display text-2xl text-foreground">
                  {restaurant.rating.toFixed(1)}
                </span>
                <div className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">
                  ({restaurant.reviewCount} {t("reviewsCount")})
                </span>
              </div>
              
              <button
                onClick={() => setIsReviewOpen(true)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 hover:border-primary/45 active:scale-98"
              >
                <Star className="size-3.5 fill-primary" />
                {t("writeReview")}
              </button>
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

                {/* Content */}
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

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        restaurant={restaurant}
      />
    </section>
  );
}
