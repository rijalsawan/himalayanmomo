'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Flame, 
  Leaf, 
  Clock, 
  Users, 
  Star,
  Plus,
  Minus,
  ShoppingCart,
  AlertTriangle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartQuantityButton from '../../components/CartQuantityButton';
import { useCart } from '../../context/CartContext';

interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string | null;
  price: number;
  category: string;
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

// Spice level badge
const SpiceBadge = ({ level }: { level: number }) => {
  const config = [
    { label: 'Mild', classes: 'bg-warm-light text-dark/60' },
    { label: 'Light', classes: 'bg-golden/25 text-dark' },
    { label: 'Medium', classes: 'bg-golden text-dark' },
    { label: 'Spicy', classes: 'bg-brand text-warm-light' },
  ];
  const { label, classes } = config[level] || config[0];

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-dark text-sm font-mono-brutal font-semibold uppercase tracking-wide ${classes}`}>
      {level > 0 && <Flame className="w-3.5 h-3.5" />}
      {label}
    </div>
  );
};

// Related item card - simplified
const RelatedItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Link href={`/menu/${item.slug}`}>
      <div className="group overflow-hidden border-brutal-thin hover:shadow-brutal-sm transition-shadow duration-300 h-full bg-warm-light brutal-hover">
        <div className="relative aspect-[4/3] overflow-hidden bg-dark/5 border-b-[1.5px] border-dark/15">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Price tag */}
          <div className="absolute top-2.5 right-2.5 border-[1.5px] border-dark bg-warm-light px-2.5 py-1 shadow-brutal-sm">
            <span className="text-sm font-heading font-bold text-dark">${item.price.toFixed(2)}</span>
          </div>
          {/* Badges */}
          <div className="absolute bottom-2.5 left-2.5 flex gap-1.5">
            {item.isVegetarian && (
              <span className="w-6 h-6 border-[1.5px] border-dark bg-herb flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-warm-light" />
              </span>
            )}
            {item.isPopular && (
              <span className="w-6 h-6 border-[1.5px] border-dark bg-brand flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-warm-light fill-warm-light" />
              </span>
            )}
          </div>
          {/* Cart button on hover */}
          <div
            className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            <CartQuantityButton item={item} size="sm" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-dark group-hover:text-brand transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-dark/50 mt-1 font-mono-brutal uppercase tracking-wide">{item.category}</p>
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-warm-light">
    <Navbar />
    <main className="pt-20">
      {/* Breadcrumb skeleton */}
      <div className="bg-cream border-b-[1.5px] border-dark/10">
        <div className="container-custom py-4">
          <div className="h-4 w-48 bg-dark/10 animate-pulse" />
        </div>
      </div>
      
      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="aspect-square border-brutal-thin bg-dark/10 animate-pulse" />
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-dark/10 animate-pulse" />
            <div className="h-8 w-32 bg-dark/10 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-dark/10 animate-pulse" />
              <div className="h-4 w-5/6 bg-dark/10 animate-pulse" />
              <div className="h-4 w-4/6 bg-dark/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default function ItemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [item, setItem] = useState<MenuItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items, openCart } = useCart();

  const cartItem = item ? items.find((i) => i.id === item.id) : null;
  const isInCart = !!cartItem;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/menu/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
          
          const relatedResponse = await fetch(`/api/menu?category=${data.category}&limit=5`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedItems(relatedData.filter((i: MenuItem) => i.id !== data.id).slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error fetching menu item:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchItem();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setQuantity(1);
  };

  if (isLoading || !item) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-warm-light">
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="bg-cream border-b-[1.5px] border-dark/10">
          <div className="container-custom py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-sm overflow-x-auto font-mono-brutal uppercase tracking-wide text-xs">
              <Link href="/" className="text-dark/50 hover:text-brand transition-colors whitespace-nowrap">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-dark/30 flex-shrink-0" />
              <Link href="/menu" className="text-dark/50 hover:text-brand transition-colors whitespace-nowrap">
                Menu
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-dark/30 flex-shrink-0" />
              <span className="text-dark font-bold truncate normal-case">{item.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <section className="container-custom py-6 sm:py-8 lg:py-12">
          {/* Back link - mobile only */}
          <Link 
            href="/menu"
            className="inline-flex items-center gap-2 text-dark/60 hover:text-brand transition-colors mb-6 sm:hidden font-mono-brutal text-xs uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative aspect-square border-brutal overflow-hidden bg-dark/5 shadow-brutal">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Status badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {item.isVegetarian && (
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-dark bg-herb text-warm-light text-xs font-mono-brutal font-bold uppercase tracking-wide px-3 py-1.5 shadow-brutal-sm">
                      <Leaf className="w-3.5 h-3.5" />
                      Vegetarian
                    </span>
                  )}
                  {item.isPopular && (
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-dark bg-brand text-warm-light text-xs font-mono-brutal font-bold uppercase tracking-wide px-3 py-1.5 shadow-brutal-sm">
                      <Star className="w-3.5 h-3.5 fill-warm-light" />
                      Popular
                    </span>
                  )}
                  {item.isNew && (
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-dark bg-golden text-dark text-xs font-mono-brutal font-bold uppercase tracking-wide px-3 py-1.5 shadow-brutal-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      New
                    </span>
                  )}
                </div>

                {/* Unavailable overlay */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-dark/70 flex items-center justify-center">
                    <span className="bg-warm-light text-dark font-mono-brutal font-bold uppercase tracking-wide text-sm border-[1.5px] border-dark px-6 py-3 shadow-brutal-sm">
                      Currently Unavailable
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Category */}
              <span className="tag-mono w-fit bg-dark/85 mb-3">
                {item.category}
              </span>

              {/* Title */}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3">
                {item.name}
              </h1>

              {/* Price & Spice */}
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <span className="text-2xl sm:text-3xl font-heading font-bold text-brand border-[1.5px] border-dark bg-warm-light px-3 py-1 shadow-brutal-sm">
                  ${item.price.toFixed(2)}
                </span>
                <SpiceBadge level={item.spiceLevel} />
              </div>

              {/* Description */}
              <p className="text-dark/65 leading-relaxed mb-6">
                {item.longDescription || item.description}
              </p>

              {/* Quick Info Pills */}
              {(item.preparationTime || item.servingSize) && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {item.preparationTime && (
                    <div className="inline-flex items-center gap-2 bg-cream border-[1.5px] border-dark px-4 py-2">
                      <Clock className="w-4 h-4 text-brand" />
                      <span className="text-sm text-dark/75 font-medium">{item.preparationTime}</span>
                    </div>
                  )}
                  {item.servingSize && (
                    <div className="inline-flex items-center gap-2 bg-cream border-[1.5px] border-dark px-4 py-2">
                      <Users className="w-4 h-4 text-brand" />
                      <span className="text-sm text-dark/75 font-medium">{item.servingSize}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart Section */}
              {item.isAvailable && (
                <div className="border-brutal-thin bg-cream shadow-brutal-sm mb-6">
                  <div className="p-4 sm:p-5">
                    {!isInCart ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-center bg-warm-light overflow-hidden border-[1.5px] border-dark">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-3 hover:bg-dark/5 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-dark/70" />
                          </button>
                          <span className="px-5 py-3 font-heading font-bold text-dark min-w-[48px] text-center border-x-[1.5px] border-dark/15">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-3 hover:bg-dark/5 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-dark/70" />
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={handleAddToCart}
                          className="flex-1 rounded-none border-[1.5px] border-dark bg-dark hover:bg-brand text-warm-light h-12 text-base font-heading font-bold brutal-hover shadow-brutal-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart — ${(item.price * quantity).toFixed(2)}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 border-[1.5px] border-dark bg-herb flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-warm-light" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-dark">{cartItem.quantity} in cart</p>
                            <p className="text-sm text-dark/55">
                              ${(item.price * cartItem.quantity).toFixed(2)} total
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CartQuantityButton item={item} size="md" />
                          <Button
                            onClick={openCart}
                            variant="outline"
                            className="rounded-none border-[1.5px] border-dark text-dark hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide"
                          >
                            View Cart
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-mono-brutal font-bold text-dark uppercase tracking-wide mb-3">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, index) => (
                      <span 
                        key={index} 
                        className="bg-warm-light border-[1.5px] border-dark/20 text-dark/75 px-3 py-1.5 text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens Warning */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="bg-golden/15 border-[1.5px] border-dark p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-mono-brutal font-bold text-dark text-sm uppercase tracking-wide">Allergen Warning</h4>
                      <p className="text-sm text-dark/70 mt-0.5">
                        Contains: {item.allergens.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nutrition Info */}
              {(item.calories || item.protein || item.carbs || item.fat) && (
                <div>
                  <h3 className="text-sm font-mono-brutal font-bold text-dark uppercase tracking-wide mb-3">
                    Nutrition Facts
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.calories && (
                      <div className="bg-warm-light border-[1.5px] border-dark p-3 text-center">
                        <div className="text-xl font-heading font-bold text-brand">{item.calories}</div>
                        <div className="text-xs text-dark/50 mt-0.5 font-mono-brutal uppercase">Calories</div>
                      </div>
                    )}
                    {item.protein && (
                      <div className="bg-warm-light border-[1.5px] border-dark p-3 text-center">
                        <div className="text-xl font-heading font-bold text-brand">{item.protein}</div>
                        <div className="text-xs text-dark/50 mt-0.5 font-mono-brutal uppercase">Protein</div>
                      </div>
                    )}
                    {item.carbs && (
                      <div className="bg-warm-light border-[1.5px] border-dark p-3 text-center">
                        <div className="text-xl font-heading font-bold text-brand">{item.carbs}</div>
                        <div className="text-xs text-dark/50 mt-0.5 font-mono-brutal uppercase">Carbs</div>
                      </div>
                    )}
                    {item.fat && (
                      <div className="bg-warm-light border-[1.5px] border-dark p-3 text-center">
                        <div className="text-xl font-heading font-bold text-brand">{item.fat}</div>
                        <div className="text-xs text-dark/50 mt-0.5 font-mono-brutal uppercase">Fat</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-12 sm:mt-16 lg:mt-20 pt-8 border-t-[1.5px] border-dark/15"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="eyebrow-brutal mb-2">You May Also Like</span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-dark mt-2">
                    More from <span className="font-accent text-brand">{item.category}</span>
                  </h2>
                </div>
                <Link href="/menu" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="rounded-none border-[1.5px] border-dark text-dark hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedItems.map((relatedItem, index) => (
                  <motion.div
                    key={relatedItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <RelatedItemCard item={relatedItem} />
                  </motion.div>
                ))}
              </div>

              {/* Mobile view all link */}
              <div className="mt-6 text-center sm:hidden">
                <Link href="/menu">
                  <Button variant="outline" className="rounded-none border-[1.5px] border-dark text-dark hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide">
                    View Full Menu
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
