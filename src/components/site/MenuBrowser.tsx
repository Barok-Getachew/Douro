import { useMemo, useState } from "react";
import { Search, Flame, Leaf, Sprout, WheatOff, Star } from "lucide-react";
import { type MenuItem, type Tag } from "@/lib/menu-data";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { useMenuData } from "@/lib/menu-context";

const tagIcon: Partial<Record<Tag, typeof Leaf>> = {
  vegan: Sprout,
  vegetarian: Leaf,
  glutenfree: WheatOff,
  spicy: Flame,
  chef: Star,
};

function TagPill({ tag }: { tag: Tag }) {
  const { t } = useLang();
  const Icon = tagIcon[tag];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
      {Icon && <Icon className="size-3" aria-hidden />}
      {t(tag)}
    </span>
  );
}

function Dish({ item }: { item: MenuItem }) {
  const { tr, lang } = useLang();
  const { allergenKey } = useMenuData();
  return (
    <article className="lux-card group flex gap-4 overflow-hidden rounded-xl p-3 transition-transform duration-500 hover:-translate-y-1 sm:p-4">
      {item.image ? (
        <img
          src={item.image}
          alt={tr(item.name)}
          loading="lazy"
          width={160}
          height={160}
          className="size-24 shrink-0 rounded-lg object-cover transition-transform duration-700 group-hover:scale-105 sm:size-28"
        />
      ) : (
        <div
          className="size-24 shrink-0 flex items-center justify-center rounded-lg border border-primary/15 sm:size-28 p-4 bg-white/5"
          aria-hidden
        >
          <img src="/logo.png" alt="D'ouro logo" className="h-full object-contain" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-foreground sm:text-2xl">
            {tr(item.name)}
          </h3>
          <span className="shrink-0 font-display text-xl text-primary sm:text-2xl">
            € {item.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tr(item.desc)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {item.allergens.length > 0 && (
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              {item.allergens.map((a) => allergenKey[a]?.[lang] ?? a).join(" · ")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function MenuBrowser() {
  const { t, tr } = useLang();
  const { menuItems, categories, allergenKey } = useMenuData();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const q = query.toLowerCase();
      const matchSearch =
        !q ||
        tr(item.name).toLowerCase().includes(q) ||
        tr(item.desc).toLowerCase().includes(q);
      const matchCategory = active === "all" || item.category === active;
      return matchSearch && matchCategory;
    });
  }, [menuItems, query, active, tr]);

  return (
    <section id="menu" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-5xl">
              {t("discoverMenu")}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("menuSubtitle")}
            </p>
          </div>
        </Reveal>

        {/* Search & Categories Bar */}
        <Reveal delay={200}>
          <div className="mt-12 space-y-4">
            {/* Search Input — full width, polished */}
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                id="menu-search"
                placeholder={t("search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-13 w-full rounded-full border border-primary/20 bg-background/60 pl-12 pr-6 text-sm text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-sm transition-all focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/10"
                style={{ height: "3.25rem" }}
              />
            </div>

            {/* Category Pills — centered scrollable row */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                id="cat-all"
                onClick={() => setActive("all")}
                className={`h-10 rounded-full px-5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  active === "all"
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                    : "border border-primary/15 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {t("allCategories")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  onClick={() => setActive(cat.id)}
                  className={`h-10 rounded-full px-5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                    active === cat.id
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                      : "border border-primary/15 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {tr(cat.name)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Menu Items Grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((item, idx) => (
            <Reveal key={item.id} delay={100 * (idx % 4)}>
              <Dish item={item} />
            </Reveal>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <Reveal>
            <div className="mt-20 text-center">
              <p className="text-lg text-muted-foreground">{t("noItemsFound")}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
