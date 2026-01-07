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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    { label: 'Mild', color: 'bg-gray-100 text-gray-600 border-gray-200' },
    { label: 'Light', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { label: 'Medium', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Spicy', color: 'bg-red-50 text-red-700 border-red-200' },
  ];
  const { label, color } = config[level] || config[0];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${color}`}>
      {level > 0 && <Flame className="w-3.5 h-3.5" />}
      {label}
    </div>
  );
};

// Related item card - simplified
const RelatedItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Link href={`/menu/${item.slug}`}>
      <Card className="group overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Price tag */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <span className="text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
          </div>
          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {item.isVegetarian && (
              <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-white" />
              </span>
            )}
            {item.isPopular && (
              <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-white fill-white" />
              </span>
            )}
          </div>
          {/* Cart button on hover */}
          <div 
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            <CartQuantityButton item={item} size="sm" />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 capitalize">{item.category}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F3]">
    <Navbar />
    <main className="pt-20">
      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
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
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-custom py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-sm overflow-x-auto">
              <Link href="/" className="text-gray-500 hover:text-primary transition-colors whitespace-nowrap">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Link href="/menu" className="text-gray-500 hover:text-primary transition-colors whitespace-nowrap">
                Menu
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-medium truncate">{item.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <section className="container-custom py-6 sm:py-8 lg:py-12">
          {/* Back link - mobile only */}
          <Link 
            href="/menu"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 sm:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Menu</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
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
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      <Leaf className="w-3.5 h-3.5" />
                      Vegetarian
                    </span>
                  )}
                  {item.isPopular && (
                    <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      Popular
                    </span>
                  )}
                  {item.isNew && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      New
                    </span>
                  )}
                </div>

                {/* Unavailable overlay */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-full">
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
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                {item.category}
              </span>

              {/* Title */}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {item.name}
              </h1>

              {/* Price & Spice */}
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
                <SpiceBadge level={item.spiceLevel} />
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {item.longDescription || item.description}
              </p>

              {/* Quick Info Pills */}
              {(item.preparationTime || item.servingSize) && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {item.preparationTime && (
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-700">{item.preparationTime}</span>
                    </div>
                  )}
                  {item.servingSize && (
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-700">{item.servingSize}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart Section */}
              {item.isAvailable && (
                <Card className="border-gray-200 mb-6">
                  <CardContent className="p-4 sm:p-5">
                    {!isInCart ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-5 py-3 font-semibold text-gray-900 min-w-[48px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={handleAddToCart}
                          className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold rounded-xl"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart — ${(item.price * quantity).toFixed(2)}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{cartItem.quantity} in cart</p>
                            <p className="text-sm text-gray-500">
                              ${(item.price * cartItem.quantity).toFixed(2)} total
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CartQuantityButton item={item} size="md" />
                          <Button
                            onClick={openCart}
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/5"
                          >
                            View Cart
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, index) => (
                      <span 
                        key={index} 
                        className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens Warning */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 text-sm">Allergen Warning</h4>
                      <p className="text-sm text-amber-700 mt-0.5">
                        Contains: {item.allergens.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nutrition Info */}
              {(item.calories || item.protein || item.carbs || item.fat) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Nutrition Facts
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.calories && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-primary">{item.calories}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Calories</div>
                      </div>
                    )}
                    {item.protein && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-primary">{item.protein}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Protein</div>
                      </div>
                    )}
                    {item.carbs && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-primary">{item.carbs}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Carbs</div>
                      </div>
                    )}
                    {item.fat && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-primary">{item.fat}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Fat</div>
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
              className="mt-12 sm:mt-16 lg:mt-20"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                    You May Also Like
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">More from {item.category}</p>
                </div>
                <Link href="/menu" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
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
                  <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
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
