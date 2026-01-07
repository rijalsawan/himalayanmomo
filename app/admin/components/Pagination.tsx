'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
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
    <div className="flex items-center justify-center px-6 py-4 border-t border-gray-100">
      {/* Pill-style pagination controls */}
      <div className="inline-flex items-center bg-gray-100/80 rounded-full p-1 gap-0.5">
          {/* First page button */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
              'text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:shadow-none',
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
              'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
              'text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:shadow-none',
              'active:scale-95'
            )}
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="w-px h-4 bg-gray-300/60 mx-1" />

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={cn(
                  'flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full text-sm font-medium transition-all duration-200',
                  currentPage === page
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-gray-600 hover:text-primary hover:bg-white hover:shadow-sm',
                  'active:scale-95'
                )}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="flex items-center justify-center w-6 h-8 text-gray-400 text-sm">
                •••
              </span>
            )
          ))}

          {/* Divider */}
          <div className="w-px h-4 bg-gray-300/60 mx-1" />

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
              'text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:shadow-none',
              'active:scale-95'
            )}
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page button */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
              'text-gray-500 hover:text-primary hover:bg-white hover:shadow-sm',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:shadow-none',
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
