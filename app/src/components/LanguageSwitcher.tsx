import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export default function LanguageSwitcher({ showBg }: { showBg: boolean }) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.split("-")[0] || "fr";
  const isRtl = currentLang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }, [currentLang, isRtl]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    const newIsRtl = code === "ar";
    document.documentElement.dir = newIsRtl ? "rtl" : "ltr";
    document.documentElement.lang = code;
  };

  return (
    <div className="relative group">
      <button
        aria-label="Changer la langue"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-300 ${
          showBg
            ? "text-beco-dark/60 hover:text-beco-primary hover:bg-gray-100"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        <span className="text-base leading-none">{languages.find(l => l.code === currentLang)?.flag || "🏳️"}</span>
      </button>
      <div className="absolute end-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full text-start px-4 py-2 text-sm flex items-center gap-2.5 transition-colors ${
              currentLang === lang.code
                ? "text-beco-primary bg-beco-primary/5 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
            {currentLang === lang.code && (
              <span className="ms-auto w-1.5 h-1.5 rounded-full bg-beco-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
