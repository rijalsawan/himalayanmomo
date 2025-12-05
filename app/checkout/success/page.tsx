'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Home, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAndCreateOrder = async () => {
      if (!sessionId) {
        router.push('/checkout');
        return;
      }

      try {
        // Call our API to verify the session and create the order
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Clear the cart after successful order creation
          clearCart();
          setOrderId(data.orderId);
          setStatus('success');
        } else {
          console.error('Failed to create order:', data.error);
          setErrorMessage(data.error || 'Failed to process order');
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setErrorMessage('An unexpected error occurred');
        setStatus('error');
      }
    };

    verifyAndCreateOrder();
  }, [sessionId, clearCart, router]);

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FDF8F3] pt-20 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <Loader2 className="w-16 h-16 text-primary" />
            </motion.div>
            <h2 className="font-heading text-xl font-semibold text-gray-800 mb-2">
              Processing your order...
            </h2>
            <p className="text-gray-500">Please wait while we confirm your payment.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FDF8F3] pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 mb-6">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-[#B8420A] text-white"
              >
                <Link href="/orders">Check My Orders</Link>
              </Button>
              <Button
                asChild
                variant="outline"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDF8F3] pt-20">
        <div className="container-custom py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-[#2D6A4F] flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Order Confirmed!
              </h1>
              {orderId && (
                <p className="text-primary font-semibold mb-2">
                  Order #{orderId.slice(-8).toUpperCase()}
                </p>
              )}
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your order. Your delicious momos are being prepared with love!
              </p>
            </motion.div>

            {/* Order Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg mb-8 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-3 text-primary mb-4">
                    <Package className="w-6 h-6" />
                    <span className="font-semibold">What&apos;s Next?</span>
                  </div>
                  <ul className="text-left space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                        1
                      </span>
                      <span>You&apos;ll receive an email confirmation shortly.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                        2
                      </span>
                      <span>Our chefs will start preparing your order.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                        3
                      </span>
                      <span>Your order will be delivered to your doorstep!</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-[#B8420A] text-white rounded-full px-8"
              >
                <Link href="/orders">
                  View My Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-300 rounded-full px-8"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                Questions about your order?{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FDF8F3] pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <SuccessContent />
    </Suspense>
  );
}
