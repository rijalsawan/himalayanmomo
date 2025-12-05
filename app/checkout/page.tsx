'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Clock,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Shield,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryInstructions: string;
}

const steps = [
  { id: 1, title: 'Delivery', icon: MapPin },
  { id: 2, title: 'Review & Pay', icon: CreditCard },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: '',
  });

  const deliveryFee = subtotal > 30 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  // Validation functions
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStripeCheckout = async () => {
    if (!validateStep(1)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
          deliveryInfo: {
            address: `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
            phone: formData.phone,
            instructions: formData.deliveryInstructions,
          },
          subtotal,
          tax,
          deliveryFee,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while checking authentication
  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FDF8F3] pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Empty cart check
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FDF8F3] pt-20">
          <div className="container-custom py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-primary/40" />
              </div>
              <h1 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-500 mb-8">
                Add some delicious momos to your cart before checking out!
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-[#B8420A] text-white"
              >
                <Link href="/menu">
                  Browse Menu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
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
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="container-custom py-8">
            <Link
              href="/menu"
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Link>

            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-800">
              Checkout
            </h1>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                        isComplete
                          ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                          : isActive
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span
                      className={`ml-3 font-medium hidden sm:block ${
                        isActive ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 md:w-24 h-0.5 mx-4 transition-colors ${
                          isComplete ? 'bg-[#2D6A4F]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {/* Step 1: Delivery Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="font-playfair flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Delivery Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Name */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                First Name *
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="John"
                                  value={formData.firstName}
                                  onChange={(e) =>
                                    handleInputChange('firstName', e.target.value)
                                  }
                                  onBlur={() => handleBlur('firstName')}
                                  className={`pl-10 ${
                                    errors.firstName && touched.firstName
                                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                      : ''
                                  }`}
                                />
                              </div>
                              {errors.firstName && touched.firstName && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Last Name *
                              </label>
                              <Input
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) =>
                                  handleInputChange('lastName', e.target.value)
                                }
                                onBlur={() => handleBlur('lastName')}
                                className={
                                  errors.lastName && touched.lastName
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                              {errors.lastName && touched.lastName && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Email *
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
                                  value={formData.email}
                                  onChange={(e) =>
                                    handleInputChange('email', e.target.value)
                                  }
                                  onBlur={() => handleBlur('email')}
                                  className={`pl-10 ${
                                    errors.email && touched.email
                                      ? 'border-red-500'
                                      : ''
                                  }`}
                                />
                              </div>
                              {errors.email && touched.email && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Phone *
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    handleInputChange('phone', e.target.value)
                                  }
                                  onBlur={() => handleBlur('phone')}
                                  className={`pl-10 ${
                                    errors.phone && touched.phone
                                      ? 'border-red-500'
                                      : ''
                                  }`}
                                />
                              </div>
                              {errors.phone && touched.phone && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Address */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Street Address *
                            </label>
                            <div className="relative">
                              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="123 Main Street"
                                value={formData.address}
                                onChange={(e) =>
                                  handleInputChange('address', e.target.value)
                                }
                                onBlur={() => handleBlur('address')}
                                className={`pl-10 ${
                                  errors.address && touched.address
                                    ? 'border-red-500'
                                    : ''
                                }`}
                              />
                            </div>
                            {errors.address && touched.address && (
                              <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.address}
                              </p>
                            )}
                          </div>

                          <Input
                            placeholder="Apartment, suite, etc. (optional)"
                            value={formData.apartment}
                            onChange={(e) =>
                              handleInputChange('apartment', e.target.value)
                            }
                          />

                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                City *
                              </label>
                              <Input
                                placeholder="New York"
                                value={formData.city}
                                onChange={(e) =>
                                  handleInputChange('city', e.target.value)
                                }
                                onBlur={() => handleBlur('city')}
                                className={
                                  errors.city && touched.city
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                              {errors.city && touched.city && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.city}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                State
                              </label>
                              <Input
                                placeholder="NY"
                                value={formData.state}
                                onChange={(e) =>
                                  handleInputChange('state', e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                ZIP Code *
                              </label>
                              <Input
                                placeholder="10001"
                                value={formData.zipCode}
                                onChange={(e) =>
                                  handleInputChange('zipCode', e.target.value)
                                }
                                onBlur={() => handleBlur('zipCode')}
                                className={
                                  errors.zipCode && touched.zipCode
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                              {errors.zipCode && touched.zipCode && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.zipCode}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Delivery Instructions */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Delivery Instructions (optional)
                            </label>
                            <textarea
                              placeholder="Ring doorbell, leave at door, etc."
                              value={formData.deliveryInstructions}
                              onChange={(e) =>
                                handleInputChange(
                                  'deliveryInstructions',
                                  e.target.value
                                )
                              }
                              className="w-full min-h-[80px] rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 2: Review & Pay */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Order Review Card */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="font-playfair flex items-center gap-2">
                            <Check className="w-5 h-5 text-primary" />
                            Order Review
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Delivery Address */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-800">
                                  Delivery Address
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formData.firstName} {formData.lastName}
                                  <br />
                                  {formData.address}
                                  {formData.apartment && `, ${formData.apartment}`}
                                  <br />
                                  {formData.city}, {formData.state}{' '}
                                  {formData.zipCode}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentStep(1)}
                                className="ml-auto text-primary hover:text-primary/80"
                              >
                                Edit
                              </Button>
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-800">
                                  Contact Information
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formData.email}
                                  <br />
                                  {formData.phone}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Instructions */}
                          {formData.deliveryInstructions && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <Home className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    Delivery Instructions
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {formData.deliveryInstructions}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Estimated Time */}
                          <div className="bg-primary/10 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium text-gray-800">
                                  Estimated Delivery Time
                                </p>
                                <p className="text-sm text-primary font-semibold">
                                  30-45 minutes
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Card */}
                      <Card className="border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] text-white">
                          <CardTitle className="font-playfair flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Secure Payment
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          {/* Stripe Branding */}
                          <div className="flex items-center justify-center gap-4 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Shield className="w-5 h-5 text-[#2D6A4F]" />
                              <span className="text-sm font-medium">Powered by</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#635BFF] font-bold text-xl">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                              </svg>
                              <span>stripe</span>
                            </div>
                          </div>

                          {/* Card Icons */}
                          <div className="flex items-center justify-center gap-3 py-2">
                            <div className="bg-white border border-gray-200 rounded px-3 py-1.5">
                              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="4" fill="#1A1F71"/>
                                <path d="M17 16.5l2.5-9h2l-2.5 9h-2zm10.5-9l-3.5 9h-2l1.75-4.25-2.25-4.75h2.25l1.25 3.25 1.5-3.25h2l-1 1zm-14.25 9l-.75-1h-3l-.5 1h-2l3.5-9h2l3 9h-2.25zm-2-3h2l-1-3-1 3z" fill="white"/>
                              </svg>
                            </div>
                            <div className="bg-white border border-gray-200 rounded px-3 py-1.5">
                              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="4" fill="#fff"/>
                                <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                                <circle cx="25" cy="12" r="7" fill="#F79E1B"/>
                                <path d="M20 6.5a6.98 6.98 0 012.5 5.5 6.98 6.98 0 01-2.5 5.5 6.98 6.98 0 01-2.5-5.5 6.98 6.98 0 012.5-5.5z" fill="#FF5F00"/>
                              </svg>
                            </div>
                            <div className="bg-white border border-gray-200 rounded px-3 py-1.5">
                              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="4" fill="#006FCF"/>
                                <path d="M20 5l7 7-7 7-7-7 7-7z" fill="#fff"/>
                              </svg>
                            </div>
                          </div>

                          <Separator />

                          {/* Total */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Total to pay</span>
                              <span className="text-2xl font-bold text-primary">
                                ${total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Pay Button */}
                          <Button
                            onClick={handleStripeCheckout}
                            disabled={isSubmitting}
                            className="w-full bg-[#635BFF] hover:bg-[#5851DB] text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                <span>Pay ${total.toFixed(2)} with Stripe</span>
                              </div>
                            )}
                          </Button>

                          {/* Security Note */}
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Shield className="w-4 h-4 text-[#2D6A4F]" />
                            <span>
                              Your payment is secured with 256-bit SSL encryption
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="border-gray-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="border-gray-200"
                    >
                      <Link href="/menu">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                  )}

                  {currentStep === 1 && (
                    <Button
                      onClick={nextStep}
                      className="bg-primary hover:bg-[#B8420A] text-white"
                    >
                      Review Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg sticky top-36">
                  <CardHeader>
                    <CardTitle className="font-playfair flex items-center justify-between">
                      <span>Order Summary</span>
                      <Badge variant="secondary">{totalItems} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          className="flex gap-3 bg-gray-50 rounded-lg p-3"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-primary font-semibold">
                              ${item.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="ml-auto text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">
                          {deliveryFee === 0 ? (
                            <span className="text-[#2D6A4F]">FREE</span>
                          ) : (
                            `$${deliveryFee.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
