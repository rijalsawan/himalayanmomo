'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { LogIn, UserPlus, X, Lock } from 'lucide-react';

interface AuthRequiredModalProps {
  open: boolean;
  onClose: () => void;
  /** Path to return to after a successful sign in / sign up. */
  callbackUrl?: string;
  title?: string;
  description?: string;
}

/**
 * Brutalist "sign in required" modal. Shown whenever a signed-out visitor
 * tries to place an order (from the cart sidebar's checkout button, or by
 * landing on /checkout directly). Preserves callbackUrl so the user lands
 * back where they were after authenticating.
 */
export default function AuthRequiredModal({
  open,
  onClose,
  callbackUrl = '/checkout',
  title = "Sign in to place your order",
  description = "Create a free account or sign in so we can save your order details, delivery info, and order history.",
}: AuthRequiredModalProps) {
  const encodedCallback = encodeURIComponent(callbackUrl);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-required-title"
            className="relative w-full max-w-md border-brutal bg-warm-light shadow-brutal-lg"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 border-brutal-thin bg-cream text-dark hover:bg-dark hover:text-warm-light transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              <span className="eyebrow-brutal mb-4">
                <Lock className="w-3.5 h-3.5" />
                Account required
              </span>

              <h2
                id="auth-required-title"
                className="font-heading text-2xl sm:text-3xl font-extrabold text-dark leading-tight mb-3"
              >
                {title}
              </h2>

              <p className="text-dark/70 text-sm sm:text-base leading-relaxed mb-7">
                {description}
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/login?callbackUrl=${encodedCallback}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 border-brutal bg-dark text-warm-light font-heading font-bold text-sm uppercase tracking-wide shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href={`/signup?callbackUrl=${encodedCallback}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 border-brutal bg-brand text-warm-light font-heading font-bold text-sm uppercase tracking-wide shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Link>
                <button
                  onClick={onClose}
                  className="text-center text-sm font-medium text-dark/60 hover:text-dark underline underline-offset-4 mt-1"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
