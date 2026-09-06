'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Leaf, Star, Sparkles, MoreHorizontal, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CartQuantityButton from './CartQuantityButton';

// Shared shape both the /menu page and the landing page's popular-dishes
// section can satisfy structurally (extra fields on either side are fine).
export interface DishCardItem {
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

const spiceLabel = (level: number) =>
  level === 0 ? 'Mild' : level === 1 ? 'Light' : level === 2 ? 'Medium' : 'Spicy';

/**
 * Full-bleed "poster" style dish card. The image fills the entire card;
 * name/price/badges float on top of a permanent bottom scrim instead of
 * living in a separate white content block, so the photo gets almost all
 * of the card's real estate.
 */
export function DishCard({ item, index = 0 }: { item: DishCardItem; index?: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <div className="group relative h-full rounded-[1.75rem] overflow-hidden aspect-[3/4] shadow-md hover:shadow-2xl hover:shadow-primary/25 transition-shadow duration-500 bg-gray-200">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Permanent bottom scrim so text is always legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent group-hover:from-black/95 transition-colors duration-500" />
        {/* Soft top scrim so badges/price stay legible over bright images */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

        {/* Top row: badge chips + price medallion */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {item.isVegetarian && (
              <span
                title="Vegetarian"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white shadow-md ring-1 ring-white/40"
              >
                <Leaf className="w-3.5 h-3.5" />
              </span>
            )}
            {item.isPopular && (
              <span
                title="Popular"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white shadow-md ring-1 ring-white/40"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
              </span>
            )}
            {item.isNew && (
              <span
                title="New"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white shadow-md ring-1 ring-white/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-shrink-0 flex items-center justify-center h-8 px-3 rounded-full bg-white text-primary font-bold text-sm shadow-lg">
            ${item.price.toFixed(2)}
          </div>
        </div>

        {/* Quick-add - floats above the bottom content, hover-revealed on desktop */}
        <div className="absolute bottom-[5.5rem] right-3 transform md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
          <CartQuantityButton item={item} size="sm" />
        </div>

        {/* Bottom overlay content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center gap-1 mb-1.5">
            <Flame
              className={`w-3.5 h-3.5 ${
                item.spiceLevel === 0 ? 'text-white/40' :
                item.spiceLevel === 1 ? 'text-yellow-400' :
                item.spiceLevel === 2 ? 'text-orange-400' : 'text-red-400 fill-red-400/40'
              }`}
            />
            <span className="text-[11px] font-medium text-white/70 uppercase tracking-wide">
              {spiceLabel(item.spiceLevel)}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-white leading-tight line-clamp-1 drop-shadow-sm">
            {item.name}
          </h3>
          <p className="text-white/75 text-xs line-clamp-2 mt-1 leading-snug">
            {item.description}
          </p>

          <Link
            href={`/menu/${item.slug}`}
            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-white/90 hover:text-white transition-colors"
          >
            View details
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/** Compact horizontal row used on narrow screens where a poster card would be too tall to scan quickly. */
export function DishListItem({ item }: { item: DishCardItem }) {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex gap-3">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-[#1A1A1A]/5">
          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-semibold text-[#1A1A1A] truncate">{item.name}</h3>
                {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 capitalize">{item.category}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0 rounded-full">
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

          <div className="flex items-center justify-between mt-2">
            <span className="inline-flex items-center bg-primary text-white text-xs font-bold rounded-full px-2.5 py-1 shadow-sm shadow-primary/25">
              ${item.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1.5">
              {item.isPopular && (
                <Badge variant="outline" className="border-primary/30 text-primary text-[10px] px-1.5 py-0 h-4">Popular</Badge>
              )}
              {item.isNew && (
                <Badge variant="outline" className="border-amber-400/50 text-amber-700 text-[10px] px-1.5 py-0 h-4">New</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200">
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              item.spiceLevel === 0 ? 'text-gray-500' :
              item.spiceLevel === 1 ? 'text-yellow-600' :
              item.spiceLevel === 2 ? 'text-orange-600' : 'text-primary'
            }`}>
              <Flame className={`w-3 h-3 ${item.spiceLevel === 0 ? 'text-gray-300' : ''}`} />
              {spiceLabel(item.spiceLevel)}
            </span>
            <CartQuantityButton item={item} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
