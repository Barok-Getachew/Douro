import interior from "@/assets/interior.jpg";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function Story() {
  const { t } = useLang();
  return (
    <section id="story" className="px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <Reveal>
          <p className="kicker">{t("storyKicker")}</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            <span className="text-gold-gradient">{t("storyTitle")}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{t("storyBody")}</p>
          <p className="mt-6 font-display text-xl text-primary">{t("founder")}</p>
        </Reveal>
        <Reveal delay={120}>
          <img
            src={interior}
            alt="Dark, candlelit dining room of D'ouro Soul Food in Salzburg"
            loading="lazy"
            width={1200}
            height={900}
            className="w-full rounded-2xl border border-primary/15 object-cover"
            style={{ boxShadow: "var(--shadow-lux)" }}
          />
        </Reveal>
      </div>
    </section>
  );
}
