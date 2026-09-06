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
import { Card, CardContent } from '@/components/ui/card';
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
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { categories } from '../data/menuItems';
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
  category: 'momos' | 'sides' | 'drinks' | 'desserts';
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

// Mobile List Item Skeleton - Matches Admin UI
const SkeletonListItem = () => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex gap-3">
        {/* Image Skeleton */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-200 rounded" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
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
      <Card className="overflow-hidden border-0 shadow-lg bg-white h-full rounded-2xl">
        {/* Image Skeleton */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
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
          <div className="absolute top-4 right-4 w-16 h-8 bg-white/80 rounded-full" />
          {/* Badge skeleton */}
          <div className="absolute bottom-4 left-4 w-16 h-6 bg-white/30 rounded-full" />
        </div>

        {/* Content Skeleton */}
        <CardContent className="p-5 space-y-3">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: index * 0.1,
              }}
            />
          </div>

          {/* Description skeleton - 2 lines */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.1 + 0.1,
                }}
              />
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3 overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.1 + 0.2,
                }}
              />
            </div>
          </div>

          {/* Bottom row skeleton */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
                ))}
              </div>
              <div className="w-12 h-3 bg-gray-200 rounded" />
            </div>
            <div className="w-14 h-4 bg-gray-200 rounded overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.1 + 0.3,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
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
        setMenuItems(data);
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
        activeCategory === 'all' || item.category === activeCategory;
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
      counts[cat.id] = menuItems.filter((item) => item.category === cat.id).length;
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
    ? filteredItems.filter((item) => item.category === modalCategory)
    : [];

  const clearAllFilters = () => {
    setSortBy('default');
    setDietaryFilter('all');
    setSpiceFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Banner */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#F4A261] blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Our{' '}
                <span className="text-gradient">Complete Menu</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                Explore our full range of authentic Nepali dishes. From classic
                momos to refreshing drinks, find your new favorite.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="container-custom py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
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
                      className="border-gray-200 hover:border-primary"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                        'Sort'}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={
                          sortBy === option.value
                            ? 'bg-primary/10 text-primary'
                            : ''
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
                      variant={dietaryFilter !== 'all' ? 'default' : 'outline'}
                      size="sm"
                      className={
                        dietaryFilter !== 'all'
                          ? 'bg-[#2D6A4F] hover:bg-[#245840]'
                          : 'border-gray-200 hover:border-primary'
                      }
                    >
                      <Leaf className="w-4 h-4 mr-2" />
                      {dietaryFilter === 'all'
                        ? 'Dietary'
                        : dietaryFilter === 'vegetarian'
                          ? 'Veg Only'
                          : 'Non-Veg Only'}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => setDietaryFilter('all')}
                      className={
                        dietaryFilter === 'all'
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }
                    >
                      All Items
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDietaryFilter('vegetarian')}
                      className={
                        dietaryFilter === 'vegetarian'
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }
                    >
                      <Leaf className="w-4 h-4 mr-2 text-green-600" />
                      Vegetarian
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDietaryFilter('non-vegetarian')}
                      className={
                        dietaryFilter === 'non-vegetarian'
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }
                    >
                      <span className="w-4 h-4 mr-2 text-red-600">🍖</span>
                      Non-Vegetarian
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Spice Level Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={spiceFilter !== 'all' ? 'default' : 'outline'}
                      size="sm"
                      className={
                        spiceFilter !== 'all'
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'border-gray-200 hover:border-primary'
                      }
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      {spiceFilter === 'all'
                        ? 'Spice Level'
                        : spiceFilter.charAt(0).toUpperCase() +
                          spiceFilter.slice(1)}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('all')}
                      className={
                        spiceFilter === 'all'
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }
                    >
                      All Levels
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('mild')}
                      className={
                        spiceFilter === 'mild'
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }
                    >
                      🌶️ Mild
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('medium')}
                      className={
                        spiceFilter === 'medium'
                          ? 'bg-primary/10 text-primary'
                          : ''
                      }
                    >
                      🌶️🌶️ Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSpiceFilter('spicy')}
                      className={
                        spiceFilter === 'spicy'
                          ? 'bg-primary/10 text-primary'
                          : ''
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
                    className="text-gray-500 hover:text-primary"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear ({activeFilterCount})
                  </Button>
                )}

                
              </div>
            </div>

            {/* Category Quick Nav */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 mt-3 pt-3 border-t border-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>🍽️</span> All
                <span className="opacity-70">({menuItems.length})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                  <span className="opacity-70">({categoryCounts[cat.id] ?? 0})</span>
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
                    <Card className="sm:hidden overflow-hidden">
                      <div className="divide-y divide-gray-100">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <SkeletonListItem key={index} />
                        ))}
                      </div>
                    </Card>
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
                        const items = filteredItems.filter((item) => item.category === cat.id);
                        if (items.length === 0) return null;

                        // When a single category is filtered via the nav pills, show it all
                        // inline; otherwise show a preview and let "Show all" open a modal.
                        const showAllInline = activeCategory !== 'all';
                        const visibleItems = showAllInline ? items : items.slice(0, PREVIEW_COUNT);

                        return (
                          <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-40">
                            {/* Category Header */}
                            <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                              <div>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-3xl leading-none">{cat.icon}</span>
                                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                                    {cat.name}
                                  </h2>
                                  <span className="text-sm font-medium text-gray-400">
                                    {items.length} {items.length === 1 ? 'item' : 'items'}
                                  </span>
                                </div>
                                <p className="text-gray-500 mt-1">{cat.description}</p>
                              </div>
                            </div>

                            {/* Mobile List View */}
                            <Card className="sm:hidden overflow-hidden mb-2">
                              <div className="divide-y divide-gray-100">
                                {visibleItems.map((item) => (
                                  <DishListItem key={item.id} item={item} />
                                ))}
                              </div>
                            </Card>

                            {/* Desktop Card Grid */}
                            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {visibleItems.map((item, index) => (
                                <DishCard key={item.id} item={item} index={index} />
                              ))}
                            </div>

                            {/* Show all modal trigger */}
                            {!showAllInline && items.length > PREVIEW_COUNT && (
                              <div className="flex justify-center mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setModalCategory(cat.id)}
                                  className="rounded-full border-primary/25 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 px-6"
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
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">
                      No items found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearAllFilters();
                        setActiveCategory('all');
                      }}
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
          overlayClassName="bg-[#1A1A1A]/70 backdrop-blur-sm data-[state=open]:duration-300 data-[state=closed]:duration-200"
          className="max-w-[95vw] sm:max-w-3xl lg:max-w-5xl max-h-[90vh] p-0 overflow-hidden rounded-3xl border-0 bg-[#FDF8F3] flex flex-col gap-0 shadow-2xl data-[state=open]:duration-300 data-[state=closed]:duration-200 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:ease-out data-[state=closed]:ease-in"
        >
          {modalCategoryData && (
            <>
              {/* Cream header strip */}
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#1A1A1A]/10 bg-white/60 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{modalCategoryData.icon}</span>
                  <div className="text-left">
                    <DialogTitle className="font-heading text-2xl font-bold text-gray-900">
                      {modalCategoryData.name}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {modalItems.length} {modalItems.length === 1 ? 'item' : 'items'} · {modalCategoryData.description}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Scrollable items body - overscroll-contain stops scroll chaining to the page behind once this reaches its own top/bottom edge */}
              <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 flex-1">
                {/* Mobile list */}
                <Card className="sm:hidden overflow-hidden rounded-2xl border border-[#1A1A1A]/5">
                  <div className="divide-y divide-gray-100">
                    {modalItems.map((item) => (
                      <DishListItem key={item.id} item={item} />
                    ))}
                  </div>
                </Card>

                {/* Desktop grid */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modalItems.map((item, index) => (
                    <DishCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
