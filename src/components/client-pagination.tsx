import { Button } from "@/components/ui/button";
import { IMeta } from "@/types"; // Adjust import based on your types file
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  meta: IMeta | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
  dataLength?: number;
  itemName?: string;
  searchTerm?: string;
}

export default function ClientPagination({
  meta,
  currentPage,
  onPageChange,
  dataLength = 0,
  itemName = "items",
  searchTerm,
}: PaginationProps) {
  if (!meta) return null;

  const totalPages = Math.ceil((meta.total || 0) / (meta.limit || 10));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t bg-gray-50/50">
      {/* Left Side: Summary info */}
      <div className="text-sm font-medium text-gray-500">
        Showing <span className="text-gray-900">{dataLength}</span> of{" "}
        <span className="text-gray-900">{meta.total}</span> {itemName}
        {searchTerm && (
          <span className="ml-1 italic text-primary/80"> matching</span>
        )}
      </div>

      {/* Right Side: Navigation controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>

        <div className="flex items-center gap-1">
          <div className="flex h-8 w-12 items-center justify-center rounded-md border bg-white text-sm font-semibold text-primary shadow-sm">
            {currentPage}
          </div>
          <span className="text-sm text-gray-400 mx-1">of</span>
          <div className="flex h-8 w-12 items-center justify-center rounded-md border bg-gray-100/50 text-sm font-medium text-gray-600">
            {totalPages || 1}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  );
}
