import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
}

export default function AdminPagination({
  page,
  totalPages,
  onPageChange,
  total,
  pageSize = 10,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
      {total !== undefined && (
        <p className="text-sm text-gray-500">
          {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} sur {total}
        </p>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => {
          // Show first, last, and pages around current
          if (
            i === 0 ||
            i === totalPages - 1 ||
            (i >= page - 1 && i <= page + 1)
          ) {
            return (
              <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  i === page
                    ? "bg-beco-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            );
          }
          if (i === page - 2 || i === page + 2) {
            return (
              <span key={i} className="text-gray-400 text-sm px-1">
                ...
              </span>
            );
          }
          return null;
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
