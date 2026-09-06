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
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthRequiredModal from './AuthRequiredModal';

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

  const { status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [orderingSettings, setOrderingSettings] = useState({
    deliveryEnabled: false,
    promoEnabled: true,
  });

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) =>
        setOrderingSettings({
          deliveryEnabled: !!data?.deliveryEnabled,
          promoEnabled: data?.promoEnabled ?? true,
        })
      )
      .catch(() => {});
  }, []);

  // Delivery is disabled for now — cart previews assume Pickup / Dine-In unless admin re-enables it.
  const deliveryFee = orderingSettings.deliveryEnabled ? (subtotal > 30 ? 0 : 4.99) : 0;
  const discountRate = orderingSettings.promoEnabled && !orderingSettings.deliveryEnabled ? 0.1 : 0;
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <>
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md bg-warm-light border-l-[3px] border-dark shadow-brutal-lg flex flex-col p-0 gap-0 [&>button]:hidden">
        {/* Header */}
        <SheetHeader className="px-5 sm:px-6 py-5 border-b-[1.5px] border-dark/15 bg-cream flex-shrink-0 flex-row items-center justify-between gap-3 space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center justify-center w-11 h-11 border-[1.5px] border-dark bg-brand text-warm-light shadow-brutal-sm flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div className="text-left min-w-0">
              <SheetTitle className="font-heading text-xl font-bold text-dark">
                Your Cart
              </SheetTitle>
              <p className="font-mono-brutal text-[11px] uppercase tracking-wide text-dark/55 mt-0.5">
                {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Empty'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="brutal-hover flex items-center justify-center w-9 h-9 border-[1.5px] border-dark bg-dark text-warm-light shadow-brutal-sm flex-shrink-0"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-20 h-20 border-[1.5px] border-dark bg-warm-light shadow-brutal-sm flex items-center justify-center mb-4">
                  <ShoppingBag className="w-9 h-9 text-dark/30" />
                </div>
                <h3 className="font-heading text-lg font-bold text-dark mb-2">
                  Your cart is empty
                </h3>
                <p className="text-dark/50 text-sm mb-6 max-w-xs">
                  Looks like you haven&apos;t added any delicious momos yet!
                </p>
                <Button
                  onClick={closeCart}
                  className="rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal font-bold uppercase tracking-[0.04em] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  asChild
                >
                  <Link href="/menu">
                    Browse Menu
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-warm-light border-[1.5px] border-dark p-3 shadow-brutal-sm"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="relative w-20 h-20 border-[1.5px] border-dark overflow-hidden flex-shrink-0 bg-cream">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.isVegetarian && (
                          <div className="absolute top-1 left-1 w-4 h-4 border-[1.5px] border-dark bg-herb flex items-center justify-center">
                            <span className="text-warm-light text-[8px] font-bold">V</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-heading font-bold text-dark text-sm truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-dark/40 hover:text-brand transition-colors p-1 flex-shrink-0"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-brand font-mono-brutal font-bold text-sm mt-1">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border-[1.5px] border-dark">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center bg-warm-light hover:bg-dark/10 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 text-dark" />
                            </motion.button>
                            <span className="w-8 text-center font-mono-brutal font-bold text-sm text-dark border-x-[1.5px] border-dark">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center bg-brand hover:bg-brand-dark transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5 text-warm-light" />
                            </motion.button>
                          </div>
                          <p className="font-heading font-bold text-dark">
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
                    className="font-mono-brutal text-xs uppercase tracking-wide text-dark/50 hover:text-brand transition-colors flex items-center gap-1.5 mt-2"
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
          <SheetFooter className="border-t-[1.5px] border-dark/15 p-5 sm:p-6 bg-cream mt-0">
            <div className="w-full space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark/60 font-mono-brutal text-xs uppercase tracking-wide">Subtotal</span>
                  <span className="font-heading font-bold text-dark">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-herb flex items-center gap-1 font-mono-brutal text-xs uppercase tracking-wide">
                      <Tag className="w-3.5 h-3.5" />
                      Pickup &amp; Dine-In Promo (10%)
                    </span>
                    <span className="font-heading font-bold text-herb">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {orderingSettings.deliveryEnabled && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/60 font-mono-brutal text-xs uppercase tracking-wide">Delivery</span>
                    <span className="font-heading font-bold text-dark">
                      {deliveryFee === 0 ? (
                        <span className="text-herb">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                )}
                {orderingSettings.deliveryEnabled && deliveryFee > 0 && (
                  <p className="text-xs text-dark/45">
                    Free delivery on orders over $30
                  </p>
                )}
                {!orderingSettings.deliveryEnabled && orderingSettings.promoEnabled && (
                  <p className="text-xs text-dark/45">
                    Pickup &amp; Dine-In only for now — enjoy 10% off!
                  </p>
                )}
              </div>

              <Separator className="bg-dark/15" />

              <div className="flex justify-between items-center">
                <span className="font-mono-brutal text-xs uppercase tracking-wide font-bold text-dark">Total</span>
                <span className="font-heading font-bold text-xl text-brand">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                asChild={status !== 'unauthenticated'}
                className="w-full rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light h-12 font-mono-brutal font-bold uppercase tracking-[0.04em] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                onClick={(e) => {
                  if (status === 'unauthenticated') {
                    e.preventDefault();
                    setShowAuthModal(true);
                    return;
                  }
                  closeCart();
                }}
              >
                {status === 'unauthenticated' ? (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                )}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                className="w-full rounded-none border-[1.5px] border-dark bg-warm-light text-dark hover:bg-dark hover:text-warm-light font-mono-brutal font-bold uppercase tracking-[0.04em] transition-all"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>

    <AuthRequiredModal
      open={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      callbackUrl="/checkout"
    />
    </>
  );
}
