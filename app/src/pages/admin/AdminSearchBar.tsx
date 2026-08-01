import { Search, X } from "lucide-react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  total?: number;
}

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  total,
}: AdminSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-64 pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-beco-primary focus:ring-1 focus:ring-beco-primary/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {total !== undefined && value && (
        <span className="text-xs text-gray-400 ml-2">
          {total} résultat{total > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
