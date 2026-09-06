'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPrompt({ isOpen, onClose }: AuthPromptProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Auto-close after 8 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-warm-light border-brutal shadow-brutal-lg overflow-hidden">
              {/* Decorative header */}
              <div className="relative h-24 bg-brand overflow-hidden border-b-[3px] border-dark">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-white/10"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, -10, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10"
                />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 border-[1.5px] border-dark bg-dark hover:bg-black flex items-center justify-center text-warm-light transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 border-brutal bg-warm-light shadow-brutal-sm flex items-center justify-center"
                  >
                    <span className="text-3xl">🥟</span>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pt-12 pb-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-dark">
                    Ready to Order?
                  </h3>
                  <p className="text-dark/60 mt-2 text-sm sm:text-base">
                    Sign in to add items to your cart and enjoy delicious momos!
                  </p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 space-y-2"
                >
                  {[
                    'Save your favorite orders',
                    'Track your order status',
                    'Get exclusive member discounts',
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 font-mono-brutal text-xs uppercase tracking-wide text-dark/70 justify-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand" />
                      {benefit}
                    </div>
                  ))}
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 space-y-3"
                >
                  <Link href="/login" onClick={onClose} className="block">
                    <Button
                      className="w-full h-12 rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal font-bold uppercase tracking-[0.04em] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={onClose} className="block">
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-none border-[1.5px] border-dark bg-warm-light text-dark hover:bg-dark hover:text-warm-light font-mono-brutal font-bold uppercase tracking-[0.04em] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    >
                      Create an Account
                    </Button>
                  </Link>
                </motion.div>

                {/* Continue browsing */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="mt-4 font-mono-brutal text-xs uppercase tracking-wide text-dark/40 hover:text-dark/70 transition-colors"
                >
                  Continue browsing
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Pointer animation to navbar (on larger screens) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block fixed top-20 right-8 z-50"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <div className="bg-dark text-warm-light border-[1.5px] border-dark px-4 py-2 font-mono-brutal text-xs uppercase tracking-wide shadow-brutal-sm">
                Sign in here! ☝️
              </div>
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-dark -rotate-180 -mt-1" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
