'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Flame, Leaf, Sparkles, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { menuItems, categories, MenuItem } from '../data/menuItems';

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            {item.isPopular && (
              <Badge className="bg-primary hover:bg-primary text-white text-xs">
                <Star className="w-3 h-3 mr-1 fill-white" />
                Popular
              </Badge>
            )}
            {item.isNew && (
              <Badge className="bg-[#F4A261] hover:bg-[#F4A261] text-white text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
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
            <button className="text-sm font-medium text-primary hover:text-[#B8420A] transition-colors">
              Add to Order →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('momos');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

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
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Discover Our{' '}
            <span className="text-gradient">Delicious</span> Offerings
          </h2>
          <p className="text-muted-foreground mt-4">
            From classic steamed momos to crispy fried delights, explore our
            authentic Nepali dishes made with love and tradition.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-10">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 bg-gray-100 text-foreground/70 hover:bg-gray-200 transition-all"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Menu Grid */}
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredItems.map((item, index) => (
                      <MenuCard key={item.id} item={item} index={index} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Download Menu CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Can&apos;t decide? Download our full menu
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all">
            Download Full Menu (PDF)
          </button>
        </motion.div>
      </div>
    </section>
  );
}
