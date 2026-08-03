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
  seeMenu: { en: "See Menu", de: "Zur Speisekarte", pt: "Ver Cardápio" },
  discoverMenu: { en: "Our Menu", de: "Unsere Speisekarte", pt: "Nosso Cardápio" },
  menuSubtitle: { en: "Afro-Latin soul food, cooked fresh by hand in the heart of Salzburg.", de: "Afro-lateinamerikanisches Soul Food, täglich frisch per Hand in Salzburg zubereitet.", pt: "Soul food afro-latino, feito à mão, no coração de Salzburgo." },
  allCategories: { en: "All", de: "Alle", pt: "Todos" },
  noItemsFound: { en: "No dishes found.", de: "Keine Gerichte gefunden.", pt: "Nenhum prato encontrado." },
  guestReviews: { en: "Guest Reviews", de: "Gästebewertungen", pt: "Avaliações" },
  whatGuestsSay: { en: "What our guests say", de: "Was unsere Gäste sagen", pt: "O que dizem nossos clientes" },
  reviewsCount: { en: "reviews", de: "Bewertungen", pt: "avaliações" },
  visitUs: { en: "Visit Us", de: "Besuchen Sie uns", pt: "Visite-nos" },
  openingHours: { en: "Opening Hours", de: "Öffnungszeiten", pt: "Horário de Funcionamento" },
  salzburg: { en: "Salzburg, Austria", de: "Salzburg, Österreich", pt: "Salzburgo, Áustria" },
  findUsNear: { en: "Find us near the city centre — easy to reach by foot or public transport.", de: "Wir befinden uns nahe der Altstadt — gut zu Fuß oder mit öffentlichen Verkehrsmitteln erreichbar.", pt: "Encontre-nos perto do centro — fácil de chegar a pé ou de transporte público." },
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
  soldOut: { en: "Sold Out", de: "Ausverkauft", pt: "Esgotado" },
  reviewsKicker: { en: "Guest Reviews", de: "Bewertungen", pt: "Avaliações" },
  reviewsTitle: { en: "What our guests say", de: "Was unsere Gäste sagen", pt: "O que dizem nossos clientes" },
  ratingLabel: { en: "reviews", de: "Bewertungen", pt: "avaliações" },
  writeReview: { en: "Write a Review", de: "Bewertung schreiben", pt: "Escrever Avaliação" },
  reviewPromptTitle: { en: "Share Your Experience", de: "Teilen Sie Ihre Erfahrung", pt: "Compartilhe sua Experiência" },
  reviewPromptSub: { en: "Your feedback helps us grow and helps others discover us.", de: "Ihr Feedback hilft uns und hilft anderen uns zu entdecken.", pt: "Sua avaliação nos ajuda a crescer e ajuda outros a nos descobrir." },
  reviewOnGoogle: { en: "Also post on Google", de: "Auch auf Google bewerten", pt: "Publicar também no Google" },
  reviewOnTripadvisor: { en: "Review on TripAdvisor", de: "Auf TripAdvisor bewerten", pt: "Avaliar no TripAdvisor" },
  close: { en: "Close", de: "Schließen", pt: "Fechar" },
  reviewNameLabel: { en: "Your Name", de: "Ihr Name", pt: "Seu Nome" },
  reviewNamePlaceholder: { en: "e.g. Maria S.", de: "z. B. Maria S.", pt: "ex. Maria S." },
  reviewCommentLabel: { en: "Your Review", de: "Ihre Bewertung", pt: "Sua Avaliação" },
  reviewCommentPlaceholder: { en: "What did you love? Tell others about your experience…", de: "Was hat Ihnen gefallen? Erzählen Sie anderen von Ihrem Erlebnis…", pt: "O que você amou? Conte sua experiência para os outros…" },
  reviewSubmit: { en: "Submit Review", de: "Bewertung absenden", pt: "Enviar Avaliação" },
  reviewSubmitting: { en: "Submitting…", de: "Wird gesendet…", pt: "Enviando…" },
  reviewThanks: { en: "Thank you!", de: "Vielen Dank!", pt: "Obrigado!" },
  reviewThanksBody: { en: "Your review has been saved and will appear on our menu shortly.", de: "Ihre Bewertung wurde gespeichert und erscheint bald auf unserer Karte.", pt: "Sua avaliação foi salva e aparecerá no nosso cardápio em breve." },
  reviewSyncPrompt: { en: "Help others find us on Google too!", de: "Helfen Sie anderen, uns auf Google zu finden!", pt: "Ajude outros a nos encontrar no Google também!" },
  reviewSyncBody: { en: "It only takes a moment to paste your review on Google — it makes a big difference!", de: "Es dauert nur einen Moment, Ihre Bewertung auf Google zu teilen — das macht einen großen Unterschied!", pt: "Só leva um momento publicar sua avaliação no Google — faz uma grande diferença!" },
  reviewSyncCta: { en: "Post on Google", de: "Auf Google posten", pt: "Publicar no Google" },
  reviewSyncSkip: { en: "No thanks", de: "Nein danke", pt: "Não, obrigado" },
  reviewRatePlaceholder: { en: "Tap to rate", de: "Zum Bewerten tippen", pt: "Toque para avaliar" },
  reviewErrorName: { en: "Please enter your name.", de: "Bitte geben Sie Ihren Namen ein.", pt: "Por favor, insira seu nome." },
  reviewErrorComment: { en: "Please write at least a few words.", de: "Bitte schreiben Sie mindestens ein paar Wörter.", pt: "Por favor, escreva pelo menos algumas palavras." },
  reviewErrorRating: { en: "Please select a star rating.", de: "Bitte wählen Sie eine Sternebewertung.", pt: "Por favor, selecione uma avaliação em estrelas." },
  reviewErrorFailed: { en: "Something went wrong. Please try again.", de: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.", pt: "Algo deu errado. Por favor, tente novamente." },
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
