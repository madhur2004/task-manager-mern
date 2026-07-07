import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="text-sm text-gray-500">
        Showing {start} to {end} of {totalItems} tasks
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 py-1 text-sm border rounded-md bg-gray-50">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
