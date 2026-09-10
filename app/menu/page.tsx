'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Leaf,
  Sparkles,
  Star,
  ArrowLeft,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  ChevronDown,
  X,
  TrendingUp,
  Clock,
  DollarSign,
  Filter,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { categories, getDisplayCategory, MOMO_SUB_CATEGORIES } from '../data/menuItems';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartQuantityButton from '../components/CartQuantityButton';
import { DishCard, DishListItem } from '../components/DishCard';

// Define MenuItem type for database items
interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string | null;
  price: number;
  category: string;
  // Computed client-side: splits the Chef's Special momos out of the plain
  // "momos" DB category so the /menu page can mirror the physical menu board's
  // 9-category layout without needing a schema change.
  displayCategory: string;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isPopular: boolean;
  isNew: boolean;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  calories?: number | null;
  protein?: string | null;
  carbs?: string | null;
  fat?: string | null;
  preparationTime?: string | null;
  servingSize?: string | null;
}

type SortOption = 'default' | 'price-low' | 'price-high' | 'popular' | 'new' | 'name-az' | 'name-za';
type DietaryFilter = 'all' | 'vegetarian' | 'non-vegetarian';
type SpiceFilter = 'all' | 'mild' | 'medium' | 'spicy';

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'default', label: 'Default', icon: <Filter className="w-4 h-4" /> },
  { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'new', label: 'Newest First', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'price-low', label: 'Price: Low to High', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'price-high', label: 'Price: High to Low', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'name-az', label: 'Name: A to Z', icon: <span className="text-xs font-bold">AZ</span> },
  { value: 'name-za', label: 'Name: Z to A', icon: <span className="text-xs font-bold">ZA</span> },
];

// Mobile List Item Skeleton - brutalist shimmer
const SkeletonListItem = () => {
  return (
    <div className="p-4 border-b-[1.5px] border-dark/10">
      <div className="flex gap-3">
        {/* Image Skeleton */}
        <div className="relative w-16 h-16 border-[1.5px] border-dark/15 overflow-hidden bg-dark/5 flex-shrink-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-dark/5 via-dark/10 to-dark/5"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-3/4 bg-dark/10" />
          <div className="h-3 w-1/3 bg-dark/10" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-4 w-16 bg-dark/10" />
            <div className="h-4 w-12 bg-dark/10" />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-dark/10">
            <div className="h-4 w-12 bg-dark/10" />
            <div className="h-8 w-8 bg-dark/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Card Component
const SkeletonCard = ({ index }: { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="overflow-hidden border-brutal-thin bg-cream h-full aspect-[3/4] relative">
        {/* Image Skeleton */}
        <div className="absolute inset-0 overflow-hidden bg-dark/10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-dark/5 via-dark/15 to-dark/5"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Price tag skeleton */}
          <div className="absolute top-3 right-3 w-16 h-8 border-[1.5px] border-dark/20 bg-warm-light/60" />
          {/* Badge skeleton */}
          <div className="absolute bottom-4 left-4 w-full max-w-[70%] space-y-2">
            <div className="h-5 w-3/4 bg-warm-light/30" />
            <div className="h-3 w-full bg-warm-light/20" />
            <div className="h-3 w-2/3 bg-warm-light/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const { totalItems, openCart } = useCart();
  const PREVIEW_COUNT = 8;
  
  // Track previous filter values to detect actual changes
  const prevFiltersRef = useRef({
    activeCategory,
    searchQuery,
    sortBy,
    dietaryFilter,
    spiceFilter,
  });

  // Fetch menu items from API
  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        const withDisplayCategory = (data as MenuItem[]).map((item) => ({
          ...item,
          displayCategory: getDisplayCategory(item),
        }));
        setMenuItems(withDisplayCategory);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Show skeleton when filters change (after initial load)
  useEffect(() => {
    const prevFilters = prevFiltersRef.current;
    const hasChanged = 
      prevFilters.activeCategory !== activeCategory ||
      prevFilters.searchQuery !== searchQuery ||
      prevFilters.sortBy !== sortBy ||
      prevFilters.dietaryFilter !== dietaryFilter ||
      prevFilters.spiceFilter !== spiceFilter;
    
    // Update ref with current values
    prevFiltersRef.current = {
      activeCategory,
      searchQuery,
      sortBy,
      dietaryFilter,
      spiceFilter,
    };

    // Only show skeleton if filters actually changed and not during initial load
    if (hasChanged && !isLoading) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeCategory, searchQuery, sortBy, dietaryFilter, spiceFilter, isLoading]);

  // Combined loading state
  const showSkeleton = isLoading || isFiltering;

  // Count active filters
  const activeFilterCount = [
    sortBy !== 'default',
    dietaryFilter !== 'all',
    spiceFilter !== 'all',
  ].filter(Boolean).length;

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.displayCategory === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Dietary filter
      const matchesDietary = 
        dietaryFilter === 'all' ||
        (dietaryFilter === 'vegetarian' && item.isVegetarian) ||
        (dietaryFilter === 'non-vegetarian' && !item.isVegetarian);
      
      // Spice filter
      const matchesSpice =
        spiceFilter === 'all' ||
        (spiceFilter === 'mild' && item.spiceLevel <= 1) ||
        (spiceFilter === 'medium' && item.spiceLevel === 2) ||
        (spiceFilter === 'spicy' && item.spiceLevel >= 3);

      return matchesCategory && matchesSearch && matchesDietary && matchesSpice;
    });

    // Sort items
    switch (sortBy) {
      case 'price-low':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        items = [...items].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case 'new':
        items = [...items].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-az':
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        items = [...items].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return items;
  }, [menuItems, activeCategory, searchQuery, sortBy, dietaryFilter, spiceFilter]);

  // Item counts per category (unaffected by search/dietary/spice filters, for the nav pills)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.id] = menuItems.filter((item) => item.displayCategory === cat.id).length;
    }
    return counts;
  }, [menuItems]);

  // Close the category modal whenever the active category or filters change
  useEffect(() => {
    setModalCategory(null);
  }, [activeCategory, searchQuery, sortBy, dietaryFilter, spiceFilter]);

  const modalCategoryData = modalCategory
    ? categories.find((c) => c.id === modalCategory) ?? null
    : null;
  const modalItems = modalCategory
    ? filteredItems.filter((item) => item.displayCategory === modalCategory)
    : [];

  // Shared mobile-list + desktop-grid renderer, reused for flat categories,
  // momo sub-groups, and the "show all" modal.
  const renderItemGrid = (items: MenuItem[]) => (
    <>
      <div className="sm:hidden overflow-hidden border-brutal-thin bg-warm-light mb-2">
        <div className="divide-y divide-dark/10">
          {items.map((item) => (
            <DishListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <DishCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </>
  );

  // Himalayan Momos are split into 5 preparation-style sub-groups (Steamed,
  // Jhol, Fried, Kothey, Chilli) to mirror the physical menu board's layout.
  const renderMomoSubGroups = (items: MenuItem[]) => (
    <div className="space-y-8">
      {MOMO_SUB_CATEGORIES.map((sub) => {
        const subItems = items.filter((item) => item.slug.startsWith(sub.prefix));
        if (subItems.length === 0) return null;
        return (
          <div key={sub.id}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-5 bg-brand flex-shrink-0" aria-hidden="true" />
              <h3 className="font-heading text-base md:text-lg font-bold text-dark uppercase tracking-wide">
                {sub.label}
              </h3>
              <span className="tag-mono bg-dark/60">{subItems.length}</span>
            </div>
            {renderItemGrid(subItems)}
          </div>
        );
      })}
    </div>
  );

  const clearAllFilters = () => {
    setSortBy('default');
    setDietaryFilter('all');
    setSpiceFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-warm-light">
      <Navbar />

      <main className="pt-16 md:pt-20">
        {/* Search and Filters */}
        <section
          className="static md:sticky z-30 bg-warm-light/95 md:backdrop-blur-md border-b-[1.5px] border-dark/10"
          style={{ top: 'calc(var(--announcement-h, 0px) + var(--navbar-h, 0px))' }}
        >
          <div className="container-custom py-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                <Input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-brutal-thin rounded-none bg-cream focus-visible:ring-0 focus-visible:border-brand placeholder:text-dark/35 font-medium"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-[11px] uppercase tracking-wide"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                      {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                        'Sort'}
                      <ChevronDown className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-none border-[1.5px] border-dark shadow-brutal-sm">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={
                          sortBy === option.value
                            ? 'bg-brand/10 text-brand font-semibold rounded-none'
                            : 'rounded-none'
                        }
                      >
                        {option.icon}
                        <span className="ml-2">{option.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dietary Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        dietaryFilter !== 'all'
                          ? 'h-10 rounded-none border-[1.5px] border-dark bg-herb text-warm-light hover:bg-herb/90 hover:text-warm-light font-mono-brutal text-[11px] uppercase tracking-wide'
                          : 'h-10 rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-[11px] uppercase tracking-wide'
                      }
                    >
                      <Leaf className="w-3.5 h-3.5 mr-2" />
                      {dietaryFilter === 'all'
                        ? 'Dietary'
                        : dietaryFilter === 'vegetarian'
                          ? 'Veg Only'
                          : 'Non-Veg Only'}
                      <ChevronDown className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-none border-[1.5px] border-dark shadow-brutal-sm">
                    <DropdownMenuItem
                      onClick={() => setDietaryFilter('all')}
                      className={
                        dietaryFilter === 'all'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      All Items
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDietaryFilter('vegetarian')}
                      className={
                        dietaryFilter === 'vegetarian'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      <Leaf className="w-4 h-4 mr-2 text-herb" />
                      Vegetarian
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDietaryFilter('non-vegetarian')}
                      className={
                        dietaryFilter === 'non-vegetarian'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      <span className="w-4 h-4 mr-2 text-brand">🍖</span>
                      Non-Vegetarian
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Spice Level Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        spiceFilter !== 'all'
                          ? 'h-10 rounded-none border-[1.5px] border-dark bg-brand text-warm-light hover:bg-brand-dark hover:text-warm-light font-mono-brutal text-[11px] uppercase tracking-wide'
                          : 'h-10 rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-[11px] uppercase tracking-wide'
                      }
                    >
                      <Flame className="w-3.5 h-3.5 mr-2" />
                      {spiceFilter === 'all'
                        ? 'Spice Level'
                        : spiceFilter.charAt(0).toUpperCase() +
                          spiceFilter.slice(1)}
                      <ChevronDown className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-none border-[1.5px] border-dark shadow-brutal-sm">
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('all')}
                      className={
                        spiceFilter === 'all'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      All Levels
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('mild')}
                      className={
                        spiceFilter === 'mild'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      🌶️ Mild
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('medium')}
                      className={
                        spiceFilter === 'medium'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      🌶️🌶️ Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('spicy')}
                      className={
                        spiceFilter === 'spicy'
                          ? 'bg-brand/10 text-brand font-semibold rounded-none'
                          : 'rounded-none'
                      }
                    >
                      🌶️🌶️🌶️ Spicy
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Active Filters & Clear */}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-10 rounded-none text-dark/60 hover:text-brand hover:bg-transparent font-mono-brutal text-[11px] uppercase tracking-wide"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Clear ({activeFilterCount})
                  </Button>
                )}
              </div>
            </div>

            {/* Category Quick Nav */}
            <div className="gap-2 pb-1 -mx-1 px-1 mt-3 pt-3 space-x-3 space-y-3">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 border-[1.5px] border-dark text-sm font-semibold whitespace-nowrap transition-colors font-mono-brutal uppercase tracking-wide text-[11px] ${
                  activeCategory === 'all'
                    ? 'bg-dark text-warm-light'
                    : 'bg-warm-light text-dark/70 hover:bg-dark/5'
                }`}
              >
                <span>🍽️</span> All
                <span className="opacity-60">({menuItems.length})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 border-[1.5px] border-dark text-sm font-semibold whitespace-nowrap transition-colors font-mono-brutal uppercase tracking-wide text-[11px] ${
                    activeCategory === cat.id
                      ? 'bg-brand text-warm-light'
                      : 'bg-warm-light text-dark/70 hover:bg-dark/5'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                  <span className="opacity-60">({categoryCounts[cat.id] ?? 0})</span>
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* Menu Content */}
        <section className="py-8 md:py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <AnimatePresence mode="wait">
                {showSkeleton ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Mobile Skeleton List */}
                    <div className="sm:hidden overflow-hidden border-brutal-thin bg-warm-light">
                      <div className="divide-y divide-dark/10">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <SkeletonListItem key={index} />
                        ))}
                      </div>
                    </div>
                    {/* Desktop Skeleton Grid */}
                    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <SkeletonCard key={index} index={index} />
                      ))}
                    </div>
                  </motion.div>
                ) : filteredItems.length > 0 ? (
                  <motion.div
                    key={`groups-${activeCategory}-${searchQuery}-${sortBy}-${dietaryFilter}-${spiceFilter}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                  >
                    {categories
                      .filter((cat) => activeCategory === 'all' || activeCategory === cat.id)
                      .map((cat) => {
                        const items = filteredItems.filter((item) => item.displayCategory === cat.id);
                        if (items.length === 0) return null;

                        // When a single category is filtered via the nav pills, show it all
                        // inline; otherwise show a preview and let "Show all" open a modal.
                        const showAllInline = activeCategory !== 'all';
                        const visibleItems = showAllInline ? items : items.slice(0, PREVIEW_COUNT);
                        const isMomosCategory = cat.id === 'momos';

                        return (
                          <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-40">
                            {/* Category Header */}
                            <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b-[1.5px] border-dark/15">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center justify-center w-11 h-11 border-[1.5px] border-dark bg-cream text-2xl leading-none flex-shrink-0 shadow-brutal-sm">
                                    {cat.icon}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h2 className="font-heading text-xl md:text-3xl font-bold text-dark">
                                        {cat.name}
                                      </h2>
                                      <span className="tag-mono bg-dark/80">
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                      </span>
                                    </div>
                                    <p className="text-dark/55 mt-0.5 text-sm md:text-base">{cat.description}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isMomosCategory && showAllInline
                              ? renderMomoSubGroups(visibleItems)
                              : renderItemGrid(visibleItems)}

                            {/* Show all modal trigger */}
                            {!showAllInline && items.length > PREVIEW_COUNT && (
                              <div className="flex justify-center mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setModalCategory(cat.id)}
                                  className="brutal-hover rounded-none border-[1.5px] border-dark bg-warm-light text-dark shadow-brutal-sm hover:bg-dark hover:text-warm-light px-6 font-mono-brutal text-xs uppercase tracking-wide"
                                >
                                  Show all {items.length} {cat.name.toLowerCase()}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 border-[1.5px] border-dark bg-cream flex items-center justify-center mx-auto mb-4 shadow-brutal-sm">
                      <Search className="w-9 h-9 text-dark/40" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-dark mb-2">
                      No items found
                    </h3>
                    <p className="text-dark/55 mb-4">
                      Try adjusting your search or filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearAllFilters();
                        setActiveCategory('all');
                      }}
                      className="rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide"
                    >
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Category "Show all" modal */}
      <Dialog
        open={modalCategory !== null}
        onOpenChange={(open) => !open && setModalCategory(null)}
        modal
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-dark/80 backdrop-blur-sm data-[state=open]:duration-300 data-[state=closed]:duration-200"
          className="max-w-[95vw] sm:max-w-3xl lg:max-w-5xl max-h-[90vh] p-0 overflow-hidden rounded-none border-[1.5px] sm:border-brutal border-dark bg-warm-light flex flex-col gap-0 shadow-brutal-lg data-[state=open]:duration-300 data-[state=closed]:duration-200 data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-6 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 data-[state=open]:ease-out data-[state=closed]:ease-in"
        >
          {modalCategoryData && (
            <>
              {/* Header strip */}
              <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b-[1.5px] border-dark/15 bg-cream flex-shrink-0 flex-row items-center justify-between gap-3 space-y-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-11 h-11 border-[1.5px] border-dark bg-warm-light text-2xl leading-none flex-shrink-0 shadow-brutal-sm">
                    {modalCategoryData.icon}
                  </span>
                  <div className="text-left min-w-0">
                    <DialogTitle className="font-heading text-xl sm:text-2xl font-bold text-dark truncate">
                      {modalCategoryData.name}
                    </DialogTitle>
                    <p className="text-xs sm:text-sm text-dark/55 mt-0.5 truncate">
                      {modalItems.length} {modalItems.length === 1 ? 'item' : 'items'} &middot; {modalCategoryData.description}
                    </p>
                  </div>
                </div>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="brutal-hover flex items-center justify-center w-9 h-9 border-[1.5px] border-dark bg-dark text-warm-light shadow-brutal-sm flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </DialogClose>
              </DialogHeader>

              {/* Scrollable items body - overscroll-contain stops scroll chaining to the page behind once this reaches its own top/bottom edge */}
              <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 flex-1">
                {modalCategory === 'momos' ? renderMomoSubGroups(modalItems) : renderItemGrid(modalItems)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
