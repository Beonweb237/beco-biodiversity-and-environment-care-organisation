import { useState, useMemo, useCallback } from "react";

interface SearchConfig<T> {
  data: T[] | undefined;
  searchFields: (keyof T)[];
  placeholder?: string;
  pageSize?: number;
}

export function useAdminSearch<T extends Record<string, unknown>>({
  data,
  searchFields,
  placeholder = "Rechercher...",
  pageSize = 10,
}: SearchConfig<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const paginated = useMemo(
    () => filtered.slice(safePage * pageSize, (safePage + 1) * pageSize),
    [filtered, safePage, pageSize]
  );

  const resetSearch = useCallback(() => {
    setSearch("");
    setPage(0);
  }, []);

  return {
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(0);
    },
    page: safePage,
    setPage,
    totalPages,
    filtered,
    paginated,
    total: filtered.length,
    placeholder,
    pageSize,
    resetSearch,
  };
}
