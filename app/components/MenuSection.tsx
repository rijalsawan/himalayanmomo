'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DishCard, DishListItem } from './DishCard';

// Define MenuItem type for database items
interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isPopular: boolean;
  isNew: boolean;
}

// Mobile List Skeleton
const MobileSkeletonListItem = () => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-2xl bg-gray-200 flex-shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MenuSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch popular items from site settings
  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        // First get the site settings to get selected popular dish IDs
        const settingsRes = await fetch('/api/site-settings');
        if (!settingsRes.ok) throw new Error('Failed to fetch settings');
        
        const settings = await settingsRes.json();
        const popularDishIds = settings.popularDishIds || [];
        
        if (popularDishIds.length > 0) {
          // Fetch the specific menu items by IDs
          const menuRes = await fetch('/api/menu');
          if (menuRes.ok) {
            const allItems = await menuRes.json();
            // Filter and order by the selected IDs
            const selectedItems = popularDishIds
              .map((id: string) => allItems.find((item: MenuItem) => item.id === id))
              .filter((item: MenuItem | undefined): item is MenuItem => item !== undefined);
            setPopularItems(selectedItems);
          }
        } else {
          // Fallback to auto-fetching popular items if no manual selection
          const response = await fetch('/api/menu?isPopular=true&limit=6');
          if (response.ok) {
            const data = await response.json();
            setPopularItems(data);
          }
        }
      } catch (error) {
        console.error('Error fetching popular items:', error);
        // Fallback to auto-fetch on error
        try {
          const response = await fetch('/api/menu?isPopular=true&limit=6');
          if (response.ok) {
            const data = await response.json();
            setPopularItems(data);
          }
        } catch {
          console.error('Fallback fetch also failed');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularItems();
  }, []);

  return (
    <section id="menu" className="section-padding bg-warm-light border-b-[3px] border-dark relative" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="eyebrow-brutal mx-auto">
            Our Menu
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark mt-5 tracking-tight">
            Most Popular{' '}
            <span className="font-accent italic text-brand">Dishes</span>
          </h2>
          <p className="text-dark/70 mt-4">
            Discover our customers&apos; favorites - handcrafted with love and
            authentic Nepali flavors.
          </p>
        </motion.div>

        {/* Popular Items - Mobile List View / Desktop Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile List View */}
          <div className="sm:hidden">
            <Card className="rounded-none border-brutal shadow-brutal-sm overflow-hidden py-0 bg-warm-light">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <MobileSkeletonListItem key={index} />
                ))
              ) : (
                popularItems.map((item) => (
                  <DishListItem key={item.id} item={item} />
                ))
              )}
            </Card>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden border-brutal py-0 bg-gray-200 h-full animate-pulse rounded-none aspect-[3/4]">
                  <CardContent className="p-0 h-full" />
                </Card>
              ))
            ) : (
              popularItems.map((item, index) => (
                <DishCard key={item.id} item={item} index={index} />
              ))
            )}
          </div>
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/menu">
            <button className="inline-flex items-center gap-2 font-heading font-bold text-base px-8 py-4 border-brutal bg-dark text-warm-light shadow-brutal-sm brutal-hover hover:shadow-brutal hover:bg-brand transition-colors">
              View Full Menu
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
