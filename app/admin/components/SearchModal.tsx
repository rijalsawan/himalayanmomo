'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Clock,
  Hash,
  Mail,
  DollarSign,
  Loader2,
  ArrowRight,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'order' | 'customer' | 'menuItem';
  title: string;
  subtitle: string;
  meta?: string;
  status?: string;
  href: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  PREPARING: 'bg-purple-100 text-purple-700 border-purple-200',
  READY: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  UNAVAILABLE: 'bg-gray-100 text-gray-700 border-gray-200',
};

const typeConfig = {
  order: {
    icon: ShoppingBag,
    color: 'text-primary bg-primary/10',
    label: 'Order',
  },
  customer: {
    icon: Users,
    color: 'text-blue-600 bg-blue-50',
    label: 'Customer',
  },
  menuItem: {
    icon: UtensilsCrossed,
    color: 'text-emerald-600 bg-emerald-50',
    label: 'Menu Item',
  },
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search function with debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results || []);
        setSelectedIndex(0);
      } else {
        console.error('Search API error:', data.error);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results.length]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('admin-recent-searches', JSON.stringify(newRecent));

    router.push(result.href);
    onClose();
  };

  // Handle recent search click
  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('admin-recent-searches');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 animate-in slide-in-from-top-4 fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders, customers, menu items..."
              className="flex-1 text-lg bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
            />
            {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
            {query && !isLoading && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Loading State */}
            {isLoading && query && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Searching...</p>
                </div>
              </div>
            )}

            {/* Results List */}
            {!isLoading && results.length > 0 && (
              <div ref={resultsRef} className="p-2">
                {results.map((result, index) => {
                  const config = typeConfig[result.type];
                  const Icon = config.icon;
                  
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        'w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-150',
                        selectedIndex === index
                          ? 'bg-primary/5 ring-1 ring-primary/20'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {result.title}
                          </span>
                          {result.status && (
                            <Badge 
                              variant="outline" 
                              className={cn('text-[10px] px-1.5 py-0', statusColors[result.status])}
                            >
                              {result.status.replace(/_/g, ' ')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="truncate">{result.subtitle}</span>
                          {result.meta && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-400 flex-shrink-0">{result.meta}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-opacity',
                        selectedIndex === index ? 'opacity-100 bg-primary/10 text-primary' : 'opacity-0'
                      )}>
                        <CornerDownLeft className="w-3 h-3" />
                        Open
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query && results.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-1">No results found</p>
                <p className="text-gray-500 text-sm">
                  Try searching for something else
                </p>
              </div>
            )}

            {/* Empty State - Recent Searches */}
            {!query && !isLoading && (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearch(search)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-gray-400" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        router.push('/admin/orders');
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 text-sm">View Orders</p>
                        <p className="text-xs text-gray-500">Manage all orders</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => {
                        router.push('/admin/customers');
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 text-sm">View Customers</p>
                        <p className="text-xs text-gray-500">See all customers</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => {
                        router.push('/admin/menu');
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 text-sm">View Menu</p>
                        <p className="text-xs text-gray-500">Edit menu items</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">↓</kbd>
                <span className="text-gray-400">Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">↵</kbd>
                <span className="text-gray-400">Select</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">Esc</kbd>
                <span className="text-gray-400">Close</span>
              </span>
            </div>
            <span className="hidden sm:flex items-center gap-1.5">
              <Command className="w-3 h-3" />
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium">K</kbd>
              <span className="text-gray-400">to open</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
