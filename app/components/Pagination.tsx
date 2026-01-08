'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showItemCount?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  showItemCount = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center gap-4",
      showItemCount ? "justify-between" : "justify-center"
    )}>
      {/* Items count */}
      {showItemCount && totalItems && (
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          Showing <span className="font-medium text-gray-700">{startItem}</span> to{' '}
          <span className="font-medium text-gray-700">{endItem}</span> of{' '}
          <span className="font-medium text-gray-700">{totalItems}</span> orders
        </p>
      )}

      {/* Pagination controls */}
      <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-0.5 shadow-sm order-1 sm:order-2">
        {/* First page button - hidden on mobile */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'hidden sm:flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
            'text-gray-500 hover:text-primary hover:bg-primary/5',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500',
            'active:scale-95'
          )}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
            'text-gray-500 hover:text-primary hover:bg-primary/5',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500',
            'active:scale-95'
          )}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Page numbers */}
        <div className="flex items-center gap-0.5">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={cn(
                  'flex items-center justify-center min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all duration-200',
                  currentPage === page
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5',
                  'active:scale-95'
                )}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="flex items-center justify-center w-8 h-9 text-gray-400 text-sm">
                {page}
              </span>
            )
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
            'text-gray-500 hover:text-primary hover:bg-primary/5',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500',
            'active:scale-95'
          )}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button - hidden on mobile */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'hidden sm:flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
            'text-gray-500 hover:text-primary hover:bg-primary/5',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500',
            'active:scale-95'
          )}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
