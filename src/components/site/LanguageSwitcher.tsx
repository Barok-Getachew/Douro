import { useLang, languages } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-primary/25 bg-background/60 p-1 backdrop-blur ${
        compact ? "" : "shadow-[var(--shadow-gold)]"
      }`}
      role="group"
      aria-label="Language"
    >
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`min-h-8 rounded-full px-3 text-xs font-semibold tracking-widest transition-colors ${
            lang === l.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
