'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Leaf, Star, ArrowRight, Loader2, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CartQuantityButton from './CartQuantityButton';

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

// Mobile List Item Component - Same as Menu Page
const MobileMenuListItem = ({ item }: { item: MenuItem }) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex gap-3">
        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-medium text-[#1A1A1A] truncate">{item.name}</h3>
                {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 capitalize">{item.category}</p>
            </div>
            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={`/menu/${item.slug}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Price and badges */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-[#1A1A1A]">${item.price.toFixed(2)}</span>
            <div className="flex items-center gap-1.5">
              {item.isPopular && (
                <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4">Popular</Badge>
              )}
              {item.isNew && (
                <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-4">New</Badge>
              )}
            </div>
          </div>

          {/* Bottom row - Spice & Cart */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <Badge variant="outline" className={`font-normal gap-1 text-[10px] ${
              item.spiceLevel === 0 ? 'text-gray-600' :
              item.spiceLevel === 1 ? 'text-yellow-600' :
              item.spiceLevel === 2 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {item.spiceLevel > 0 && <Flame className="w-2.5 h-2.5" />}
              {item.spiceLevel === 0 ? 'Mild' : item.spiceLevel === 1 ? 'Light' : item.spiceLevel === 2 ? 'Medium' : 'Spicy'}
            </Badge>
            <CartQuantityButton item={item} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile List Skeleton
const MobileSkeletonListItem = () => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 animate-pulse" />
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

const PopularMenuCard = ({ item, index }: { item: MenuItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {item.isVegetarian && (
              <Badge className="bg-[#2D6A4F] hover:bg-[#2D6A4F] text-white text-xs">
                <Leaf className="w-3 h-3 mr-1" />
                Veg
              </Badge>
            )}
            <Badge className="bg-primary hover:bg-primary text-white text-xs">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Popular
            </Badge>
          </div>

          {/* Quick Add Button - Always visible on mobile, hover on desktop */}
          <div className="absolute bottom-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <CartQuantityButton item={item} size="sm" />
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="text-xl font-bold text-primary whitespace-nowrap">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {item.description}
          </p>

          <div className="flex items-center justify-between">
            <SpiceIndicator level={item.spiceLevel} />
            <Link 
              href={`/menu/${item.slug}`}
              className="text-sm font-medium text-primary hover:text-[#B8420A] transition-colors"
            >
              Learn More →
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function MenuSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch popular items from API
  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await fetch('/api/menu?isPopular=true&limit=6');
        if (response.ok) {
          const data = await response.json();
          setPopularItems(data);
        }
      } catch (error) {
        console.error('Error fetching popular items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularItems();
  }, []);

  return (
    <section id="menu" className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest">
            Our Menu
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Most Popular{' '}
            <span className="text-gradient">Dishes</span>
          </h2>
          <p className="text-muted-foreground mt-4">
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
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <MobileSkeletonListItem key={index} />
                ))
              ) : (
                popularItems.map((item) => (
                  <MobileMenuListItem key={item.id} item={item} />
                ))
              )}
            </Card>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md bg-white h-full animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <CardContent className="p-5">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              popularItems.map((item, index) => (
                <PopularMenuCard key={item.id} item={item} index={index} />
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
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-[#B8420A] text-white px-8 py-6 text-base font-semibold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            <Link href="/menu">
              View Full Menu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
