import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./menu-data";

export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "pt", label: "PT" },
];

type Dict = Record<string, Record<Lang, string>>;

export const t_: Dict = {
  viewMenu: { en: "View Menu", de: "Zur Speisekarte", pt: "Ver Cardápio" },
  scrollHint: { en: "Scroll to explore", de: "Scrollen zum Entdecken", pt: "Role para explorar" },
  storyKicker: { en: "Our Story", de: "Unsere Geschichte", pt: "Nossa História" },
  storyTitle: { en: "How D'ouro began", de: "Wie D'ouro begann", pt: "Como o D'ouro começou" },
  storyBody: {
    en: "D'ouro started during lockdown, when Angela cooked homemade Brazilian food at home and handed it out to anyone who wanted a plate. That same warmth lives in every dish today — Brazilian soul, West African spice, cooked fresh by hand in the heart of Salzburg.",
    de: "D'ouro begann im Lockdown, als Angela zu Hause brasilianisch kochte und jedem einen Teller anbot, der Hunger hatte. Diese Wärme steckt bis heute in jedem Gericht — brasilianische Seele, westafrikanische Gewürze, täglich frisch von Hand zubereitet, mitten in Salzburg.",
    pt: "O D'ouro nasceu durante a pandemia, quando Angela cozinhava comida brasileira em casa e oferecia um prato a quem quisesse. Esse carinho continua em cada prato — alma brasileira e temperos da África Ocidental, no coração de Salzburgo.",
  },
  founder: { en: "Angela · Founder & Chef", de: "Angela · Gründerin & Küchenchefin", pt: "Angela · Fundadora & Chef" },
  menuKicker: { en: "The Menu", de: "Die Speisekarte", pt: "O Cardápio" },
  menuTitle: { en: "Afro-Latin Kitchen", de: "Afro-Latin Küche", pt: "Cozinha Afro-Latina" },
  search: { en: "Search dishes…", de: "Gerichte suchen…", pt: "Buscar pratos…" },
  all: { en: "All", de: "Alle", pt: "Todos" },
  popular: { en: "Popular", de: "Beliebt", pt: "Populares" },
  noResults: { en: "No dishes found.", de: "Keine Gerichte gefunden.", pt: "Nenhum prato encontrado." },
  allergensTitle: { en: "Allergens", de: "Allergene", pt: "Alérgenos" },
  allergenNote: {
    en: "Please ask our team for detailed allergen and ingredient information. All prices include VAT.",
    de: "Fragen Sie unser Team nach detaillierten Informationen zu Allergenen und Zutaten. Alle Preise inkl. MwSt.",
    pt: "Pergunte à nossa equipe sobre alérgenos e ingredientes. Todos os preços incluem IVA.",
  },
  chefPick: { en: "Chef's pick", de: "Empfehlung", pt: "Sugestão do chef" },
  vegan: { en: "Vegan", de: "Vegan", pt: "Vegano" },
  vegetarian: { en: "Vegetarian", de: "Vegetarisch", pt: "Vegetariano" },
  glutenfree: { en: "Gluten-free", de: "Glutenfrei", pt: "Sem glúten" },
  lactosefree: { en: "Lactose-free", de: "Laktosefrei", pt: "Sem lactose" },
  spicy: { en: "Spicy", de: "Scharf", pt: "Picante" },
  chef: { en: "Chef's pick", de: "Empfehlung", pt: "Sugestão do chef" },
  new: { en: "New", de: "Neu", pt: "Novo" },
  reviewsKicker: { en: "Guest Reviews", de: "Bewertungen", pt: "Avaliações" },
  reviewsTitle: { en: "What our guests say", de: "Was unsere Gäste sagen", pt: "O que dizem nossos clientes" },
  ratingLabel: { en: "reviews", de: "Bewertungen", pt: "avaliações" },
  visitKicker: { en: "Visit Us", de: "Besuchen Sie uns", pt: "Visite-nos" },
  address: { en: "Address", de: "Adresse", pt: "Endereço" },
  hours: { en: "Opening hours", de: "Öffnungszeiten", pt: "Horário" },
  contact: { en: "Contact", de: "Kontakt", pt: "Contato" },
  reserve: { en: "Reserve a table", de: "Tisch reservieren", pt: "Reservar mesa" },
  directions: { en: "Directions", de: "Wegbeschreibung", pt: "Como chegar" },
  order: { en: "Order online", de: "Online bestellen", pt: "Pedir online" },
  call: { en: "Call", de: "Anrufen", pt: "Ligar" },
  gallery: { en: "Gallery", de: "Galerie", pt: "Galeria" },
  backToTop: { en: "Back to top", de: "Nach oben", pt: "Voltar ao topo" },
  qrTitle: { en: "Scan to View Our Menu", de: "Scannen für unsere Speisekarte", pt: "Escaneie para ver o cardápio" },
  qrSub: { en: "No App Required", de: "Keine App nötig", pt: "Nenhum app necessário" },
  qrPrint: { en: "Print", de: "Drucken", pt: "Imprimir" },
  qrPage: { en: "QR table cards", de: "QR-Tischkarten", pt: "Cartões QR" },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof t_ | string) => string;
  tr: (v: Record<Lang, string>) => string;
}

const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => String(k),
  tr: (v) => v.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("douro-lang") as Lang | null;
    if (stored && ["en", "de", "pt"].includes(stored)) {
      setLangState(stored);
      return;
    }
    const nav = navigator.language.slice(0, 2);
    if (nav === "de" || nav === "pt") setLangState(nav);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("douro-lang", l);
    document.documentElement.lang = l;
  };

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
        t: (key) => t_[key as string]?.[lang] ?? String(key),
        tr: (v) => v[lang] ?? v.en,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
