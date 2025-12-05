'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { menuItems, categories, MenuItem } from '../data/menuItems';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartQuantityButton from '../components/CartQuantityButton';

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

const SpiceIndicator = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <Flame
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= level ? 'text-red-500 fill-red-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const MenuCard = ({ item, index }: { item: MenuItem; index: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white h-full rounded-2xl">
        {/* Image Container with Overlay */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Price Tag - Floating */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                <span className="text-lg font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Badges - Bottom Left of Image */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {item.isVegetarian && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  <Leaf className="w-3 h-3" />
                  Veg
                </span>
              )}
              {item.isPopular && (
                <span className="inline-flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-white" />
                  Popular
                </span>
              )}
              {item.isNew && (
                <span className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  New
                </span>
              )}
            </div>

            {/* Cart Button - Appears on Hover */}
            <div className="absolute bottom-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <CartQuantityButton item={item} size="md" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {item.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {/* Spice Level */}
            <div className="flex items-center gap-2">
              <SpiceIndicator level={item.spiceLevel} />
              <span className="text-xs text-gray-400">
                {item.spiceLevel === 0 ? 'Mild' : item.spiceLevel === 1 ? 'Light' : item.spiceLevel === 2 ? 'Medium' : 'Spicy'}
              </span>
            </div>
            
            {/* Learn More Link */}
            <Link
              href={`/menu/${item.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-[#B8420A] transition-colors group/link"
            >
              Details
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const { totalItems, openCart } = useCart();
  
  // Track previous filter values to detect actual changes
  const prevFiltersRef = useRef({
    activeCategory,
    searchQuery,
    sortBy,
    dietaryFilter,
    spiceFilter,
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
  }, [activeCategory, searchQuery, sortBy, dietaryFilter, spiceFilter]);

  const clearAllFilters = () => {
    setSortBy('default');
    setDietaryFilter('all');
    setSpiceFilter('all');
    setSearchQuery('');
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#FDF8F3] pt-20">
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
        <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
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

                {/* Cart Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCart}
                  className="border-primary text-primary hover:bg-primary hover:text-white relative ml-2"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 p-0 flex items-center justify-center">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Content */}
        <section className="section-padding">
          <div className="container-custom">
            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full"
              >
                <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-10">
                  <TabsTrigger
                    value="all"
                    className="px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 bg-white text-foreground/70 hover:bg-gray-100 transition-all border border-gray-200 data-[state=active]:border-transparent"
                  >
                    🍽️ All Items
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 bg-white text-foreground/70 hover:bg-gray-100 transition-all border border-gray-200 data-[state=active]:border-transparent"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Results Count */}
                <div className="mb-6 text-center">
                  {showSkeleton ? (
                    <div className="h-5 w-32 bg-gray-200 rounded mx-auto overflow-hidden relative">
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
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Showing{' '}
                      <span className="font-semibold text-foreground">
                        {filteredItems.length}
                      </span>{' '}
                      {filteredItems.length === 1 ? 'item' : 'items'}
                      {searchQuery && (
                        <span>
                          {' '}
                          for &quot;{searchQuery}&quot;
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Menu Grid */}
                <TabsContent value={activeCategory} className="mt-0">
                  <AnimatePresence mode="wait">
                    {showSkeleton ? (
                      <motion.div
                        key="skeleton-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {Array.from({ length: 8 }).map((_, index) => (
                          <SkeletonCard key={index} index={index} />
                        ))}
                      </motion.div>
                    ) : filteredItems.length > 0 ? (
                      <motion.div
                        key={`${activeCategory}-${searchQuery}-${sortBy}-${dietaryFilter}-${spiceFilter}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {filteredItems.map((item, index) => (
                          <MenuCard key={item.id} item={item} index={index} />
                        ))}
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
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
