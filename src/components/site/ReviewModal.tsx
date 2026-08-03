import { X, Star, Send, CheckCircle, ExternalLink, ChevronRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import type { Restaurant } from "@/lib/menu-context";
import { submitReviewFn } from "@/lib/server-fns";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
}

type Step = "form" | "thanks-positive" | "thanks-negative";

export function ReviewModal({ isOpen, onClose, restaurant }: ReviewModalProps) {
  const { t } = useLang();
  const [step, setStep] = useState<Step>("form");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setRating(0);
      setHoverRating(0);
      setName("");
      setComment("");
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("reviewErrorName");
    if (comment.trim().split(" ").length < 3) e.comment = t("reviewErrorComment");
    if (rating === 0) e.rating = t("reviewErrorRating");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitReviewFn({
        data: { author: name.trim(), rating, comment: comment.trim() },
      });
      // Route based on rating — review gating
      if (rating >= 4) {
        setStep("thanks-positive");
      } else {
        setStep("thanks-negative");
      }
    } catch {
      setErrors({ submit: t("reviewErrorFailed") });
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  const ratingLabels: Record<number, { en: string; de: string; pt: string }> = {
    1: { en: "Poor", de: "Schlecht", pt: "Ruim" },
    2: { en: "Fair", de: "Mäßig", pt: "Razoável" },
    3: { en: "Good", de: "Gut", pt: "Bom" },
    4: { en: "Very good", de: "Sehr gut", pt: "Muito bom" },
    5: { en: "Excellent!", de: "Ausgezeichnet!", pt: "Excelente!" },
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md no-print"
      style={{ animation: "fadeIn 0.18s ease" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 shadow-2xl"
        style={{
          background: "linear-gradient(160deg, oklch(0.22 0.015 62), oklch(0.16 0.012 60))",
          animation: "scaleUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 z-10 rounded-full border border-primary/10 bg-primary/5 p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {/* ── STEP: FORM ────────────────────────────────────────────── */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-6 pt-5">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary mb-3">
                <Star className="size-6 fill-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {t("reviewPromptTitle")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                {t("reviewPromptSub")}
              </p>
            </div>

            {/* Star Rating */}
            <div className="mb-5">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setRating(s); setErrors((prev) => ({ ...prev, rating: "" })); }}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-125 active:scale-110 focus:outline-none"
                    aria-label={`${s} star`}
                  >
                    <Star
                      className={`size-9 transition-colors ${
                        s <= displayRating
                          ? "fill-primary text-primary"
                          : "fill-transparent text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center h-4">
                {displayRating > 0 ? (
                  <span className="text-xs font-medium text-primary">
                    {ratingLabels[displayRating]?.en}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/60">{t("reviewRatePlaceholder")}</span>
                )}
              </div>
              {errors.rating && (
                <p className="text-center text-xs text-red-400 mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="admin-label">{t("reviewNameLabel")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder={t("reviewNamePlaceholder")}
                className="admin-input"
                maxLength={60}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Comment */}
            <div className="mb-5">
              <label className="admin-label">{t("reviewCommentLabel")}</label>
              <textarea
                value={comment}
                onChange={(e) => { setComment(e.target.value); setErrors((p) => ({ ...p, comment: "" })); }}
                placeholder={t("reviewCommentPlaceholder")}
                rows={4}
                maxLength={800}
                className="block w-full resize-none rounded-xl border border-border bg-[oklch(0.19_0.013_62)] px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:shadow-[0_0_0_3px_oklch(0.79_0.13_84/0.15)]"
              />
              <div className="flex justify-between mt-1">
                {errors.comment
                  ? <p className="text-xs text-red-400">{errors.comment}</p>
                  : <span />}
                <span className="text-xs text-muted-foreground/50">{comment.length}/800</span>
              </div>
            </div>

            {errors.submit && (
              <p className="mb-3 rounded-xl bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-primary-foreground disabled:opacity-60 transition-opacity"
              style={{ background: "var(--gradient-gold)" }}
            >
              {submitting ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <Send className="size-4" />
              )}
              {submitting ? t("reviewSubmitting") : t("reviewSubmit")}
            </button>
          </form>
        )}

        {/* ── STEP: THANK YOU (positive ≥ 4 stars) ─────────────────── */}
        {step === "thanks-positive" && (
          <div className="p-7 flex flex-col items-center text-center">
            {/* Animated check */}
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 mb-4">
              <CheckCircle className="size-8 text-emerald-400" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              {t("reviewThanks")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-7">
              {t("reviewThanksBody")}
            </p>

            {/* Google sync card */}
            <div className="w-full rounded-2xl border border-primary/25 bg-primary/5 p-4 mb-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#4285F4]/15">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t("reviewSyncPrompt")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t("reviewSyncBody")}</p>
                </div>
              </div>
            </div>

            <a
              href={restaurant.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-primary-foreground mb-3 transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-gold)" }}
            >
              <ExternalLink className="size-4" />
              {t("reviewSyncCta")}
            </a>
            <button
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("reviewSyncSkip")}
            </button>
          </div>
        )}

        {/* ── STEP: THANK YOU (negative ≤ 3 stars) ─────────────────── */}
        {step === "thanks-negative" && (
          <div className="p-7 flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <CheckCircle className="size-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              {t("reviewThanks")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-7">
              We truly appreciate your honest feedback. We will work hard to make your next visit even better!
            </p>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("close")} <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
