'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Leaf, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { menuItems, MenuItem } from '../data/menuItems';
import CartQuantityButton from './CartQuantityButton';

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

          {/* Quick Add Button - Now uses CartQuantityButton */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <CartQuantityButton item={item} size="md" />
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

  // Get only popular items for the landing page
  const popularItems = menuItems.filter((item) => item.isPopular).slice(0, 6);

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

        {/* Popular Items Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {popularItems.map((item, index) => (
            <PopularMenuCard key={item.id} item={item} index={index} />
          ))}
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
