import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

// Pas de drapeaux : ils ne rendent pas sur Windows et un pays ≠ une langue.
const languages = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
];

interface LanguageSwitcherProps {
  showBg: boolean;
  /** `inline` affiche les langues côte à côte (menu mobile), sans dérouler. */
  variant?: "dropdown" | "inline";
}

export default function LanguageSwitcher({ showBg, variant = "dropdown" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.some((l) => l.code === i18n.language?.split("-")[0])
    ? i18n.language.split("-")[0]
    : "fr";
  const isRtl = currentLang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }, [currentLang, isRtl]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
    setOpen(false);
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            aria-current={currentLang === lang.code}
            className={`rounded-full px-3.5 py-1.5 font-raleway font-bold text-[12px] uppercase tracking-[0.08em] transition-colors duration-200 ${
              currentLang === lang.code
                ? "bg-beco-primary text-white"
                : "bg-beco-olive-light text-beco-dark/70 hover:text-beco-primary"
            }`}
          >
            {lang.code}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Changer la langue"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border ps-2.5 pe-2 py-1.5 font-raleway font-bold text-[12px] uppercase tracking-[0.08em] transition-colors duration-300 ${
          showBg
            ? "border-beco-primary/25 text-beco-primary hover:bg-beco-olive-light"
            : "border-white/40 text-white hover:bg-white/15"
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        {currentLang}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full mt-2 min-w-[170px] bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              role="menuitem"
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-start px-4 py-2.5 flex items-center gap-3 transition-colors ${
                currentLang === lang.code
                  ? "text-beco-primary bg-beco-olive-light"
                  : "text-beco-dark/70 hover:bg-gray-50"
              }`}
            >
              <span className="font-raleway font-bold text-[11px] uppercase tracking-[0.08em] w-6">
                {lang.code}
              </span>
              <span className="font-raleway text-[13px]">{lang.label}</span>
              {currentLang === lang.code && <Check className="w-3.5 h-3.5 ms-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
