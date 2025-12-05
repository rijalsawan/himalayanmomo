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
import { Separator } from '@/components/ui/separator';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartQuantityButton from '../../components/CartQuantityButton';
import { getMenuItemBySlug, getRelatedItems, MenuItem } from '../../data/menuItems';
import { useCart } from '../../context/CartContext';

const SpiceIndicator = ({ level }: { level: number }) => {
  const labels = ['Mild', 'Medium', 'Spicy', 'Extra Hot'];
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((i) => (
          <Flame
            key={i}
            className={`w-5 h-5 ${
              i <= level ? 'text-red-500 fill-red-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{labels[level]}</span>
    </div>
  );
};

const NutritionCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center p-4 bg-gray-50 rounded-xl">
    <div className="text-2xl font-bold text-primary font-heading">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

const RelatedItemCard = ({ item }: { item: MenuItem }) => {
  const { addItem, items } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/menu/${item.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full">
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
            </div>

            {/* Cart Button */}
            <div 
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.preventDefault()}
            >
              <CartQuantityButton item={item} size="sm" />
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-primary">
                ${item.price.toFixed(2)}
              </span>
              <SpiceIndicator level={item.spiceLevel} />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function ItemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [item, setItem] = useState<MenuItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items, openCart } = useCart();

  const cartItem = item ? items.find((i) => i.id === item.id) : null;
  const isInCart = !!cartItem;

  useEffect(() => {
    const menuItem = getMenuItemBySlug(slug);
    if (menuItem) {
      setItem(menuItem);
      setRelatedItems(getRelatedItems(menuItem, 4));
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setQuantity(1);
  };

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#FDF8F3]">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container-custom py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{item.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link 
                href="/menu"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Menu</span>
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                    {item.isVegetarian && (
                      <Badge className="bg-[#2D6A4F] hover:bg-[#2D6A4F] text-white px-4 py-2 text-sm">
                        <Leaf className="w-4 h-4 mr-2" />
                        Vegetarian
                      </Badge>
                    )}
                    {item.isPopular && (
                      <Badge className="bg-primary hover:bg-primary text-white px-4 py-2 text-sm">
                        <Star className="w-4 h-4 mr-2 fill-white" />
                        Popular
                      </Badge>
                    )}
                    {item.isNew && (
                      <Badge className="bg-[#F4A261] hover:bg-[#F4A261] text-white px-4 py-2 text-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col"
              >
                {/* Title & Price */}
                <div className="mb-6">
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    {item.name}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    <SpiceIndicator level={item.spiceLevel} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {item.longDescription || item.description}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {item.preparationTime && (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{item.preparationTime}</span>
                    </div>
                  )}
                  {item.servingSize && (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{item.servingSize}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Add to Cart Section */}
                {!isInCart ? (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-4 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-6 py-4 font-semibold text-lg min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-4 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      className="flex-1 bg-primary hover:bg-[#B8420A] text-white py-6 text-lg font-semibold rounded-xl"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - ${(item.price * quantity).toFixed(2)}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">In Your Cart</p>
                          <p className="text-sm text-green-600">{cartItem.quantity} item(s) added</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CartQuantityButton item={item} size="lg" />
                        <Button
                          onClick={openCart}
                          variant="outline"
                          className="border-green-500 text-green-700 hover:bg-green-100"
                        >
                          View Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-heading text-lg font-semibold mb-3">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1"
                        >
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens Warning */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-1">Allergen Information</h4>
                        <p className="text-sm text-amber-700">
                          Contains: {item.allergens.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nutrition Info */}
                {item.nutritionInfo && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-4">Nutrition Facts</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <NutritionCard label="Calories" value={item.nutritionInfo.calories} />
                      <NutritionCard label="Protein" value={item.nutritionInfo.protein} />
                      <NutritionCard label="Carbs" value={item.nutritionInfo.carbs} />
                      <NutritionCard label="Fat" value={item.nutritionInfo.fat} />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-20"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-primary font-medium text-sm uppercase tracking-wider">
                      You May Also Like
                    </span>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-2">
                      Similar Items
                    </h2>
                  </div>
                  <Link href="/menu">
                    <Button variant="outline" className="hidden sm:flex">
                      View All Menu
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedItems.map((relatedItem, index) => (
                    <motion.div
                      key={relatedItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <RelatedItemCard item={relatedItem} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
