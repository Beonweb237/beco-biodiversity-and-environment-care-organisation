import { Link } from "react-router-dom";
import { FileText, ChevronRight, Languages } from "lucide-react";
import { PAGE_DEFS, CONTENT_LANGS } from "@contracts/pageContent";

const langFlags: Record<string, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
  ar: "🇸🇦",
};

export default function AdminPages() {
  return (
    <div className="space-y-4 max-w-[900px]">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Contenus des pages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Modifiez les textes des pages (titres, paragraphes…) par langue. Les champs vides affichent automatiquement la version française.
        </p>
      </div>

      <div className="grid gap-4">
        {PAGE_DEFS.map((page) => (
          <Link
            key={page.id}
            to={`/administrateur/pages/${page.id}`}
            className="group flex items-center justify-between bg-white rounded-xl border border-gray-200 p-5 hover:border-beco-primary hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-beco-primary/10 text-beco-primary flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{page.label}</p>
                <p className="text-sm text-gray-400">{page.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Languages className="w-3.5 h-3.5" />
                  {CONTENT_LANGS.map((l) => (
                    <span key={l} className="px-1">{langFlags[l]} {l.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-beco-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
