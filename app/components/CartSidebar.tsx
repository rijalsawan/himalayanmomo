'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    clearCart,
  } = useCart();

  const deliveryFee = subtotal > 30 ? 0 : 4.99;
  const total = subtotal + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-[#FDF8F3] border-l border-primary/10 flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-playfair text-xl flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Your Cart
              {totalItems > 0 && (
                <Badge className="bg-primary text-white ml-2">
                  {totalItems}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Looks like you haven&apos;t added any delicious momos yet!
                </p>
                <Button
                  onClick={closeCart}
                  className="bg-primary hover:bg-[#B8420A] text-white"
                  asChild
                >
                  <Link href="/menu">
                    Browse Menu
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-primary/5"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#FFF8F0]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isVegetarian && (
                          <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#2D6A4F] flex items-center justify-center">
                            <span className="text-white text-[8px]">V</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-800 text-sm truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-primary font-semibold text-sm mt-1">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center hover:bg-primary/10 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <span className="w-8 text-center font-semibold text-gray-800">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-primary" />
                            </motion.button>
                          </div>
                          <p className="font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Clear Cart */}
                {items.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={clearCart}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 mt-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear cart
                  </motion.button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with Summary */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-primary/10 p-6 bg-white">
            <div className="w-full space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#2D6A4F]">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Free delivery on orders over $30
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-lg text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                asChild
                className="w-full bg-primary hover:bg-[#B8420A] text-white h-12 text-base font-semibold"
                onClick={closeCart}
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                className="w-full border-primary/20 text-gray-700 hover:bg-primary/5"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
