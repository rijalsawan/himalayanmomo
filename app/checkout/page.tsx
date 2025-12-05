'use client';

import { useState } from 'react';
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
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
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
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const steps = [
  { id: 1, title: 'Delivery', icon: MapPin },
  { id: 2, title: 'Payment', icon: CreditCard },
  { id: 3, title: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
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

  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (date: string) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(date)) return false;
    const [month, year] = date.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiry > new Date();
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
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

    if (step === 2) {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!validateCVV(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
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

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setOrderComplete(true);
    clearCart();
  };

  // Empty cart check
  if (items.length === 0 && !orderComplete) {
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

  // Order Complete
  if (orderComplete) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FDF8F3] pt-20">
          <div className="container-custom py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-[#2D6A4F] flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
                Order Confirmed!
              </h1>
              <p className="text-gray-500 mb-2">
                Thank you for your order. Your delicious momos are on the way!
              </p>
              <p className="text-gray-600 font-semibold mb-8">
                Order #HM{Date.now().toString().slice(-6)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-primary hover:bg-[#B8420A] text-white"
                >
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  <Link href="/menu">
                    Order Again
                  </Link>
                </Button>
              </div>
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

                  {/* Step 2: Payment */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="font-playfair flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Payment Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Card Number */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Card Number *
                            </label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) =>
                                  handleInputChange(
                                    'cardNumber',
                                    formatCardNumber(e.target.value)
                                  )
                                }
                                onBlur={() => handleBlur('cardNumber')}
                                maxLength={19}
                                className={`pl-10 ${
                                  errors.cardNumber && touched.cardNumber
                                    ? 'border-red-500'
                                    : ''
                                }`}
                              />
                            </div>
                            {errors.cardNumber && touched.cardNumber && (
                              <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.cardNumber}
                              </p>
                            )}
                          </div>

                          {/* Card Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Name on Card
                            </label>
                            <Input
                              placeholder="John Doe"
                              value={formData.cardName}
                              onChange={(e) =>
                                handleInputChange('cardName', e.target.value)
                              }
                            />
                          </div>

                          {/* Expiry & CVV */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Expiry Date *
                              </label>
                              <Input
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) =>
                                  handleInputChange(
                                    'expiryDate',
                                    formatExpiryDate(e.target.value)
                                  )
                                }
                                onBlur={() => handleBlur('expiryDate')}
                                maxLength={5}
                                className={
                                  errors.expiryDate && touched.expiryDate
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                              {errors.expiryDate && touched.expiryDate && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.expiryDate}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                CVV *
                              </label>
                              <Input
                                type="password"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) =>
                                  handleInputChange(
                                    'cvv',
                                    e.target.value.replace(/\D/g, '').slice(0, 4)
                                  )
                                }
                                onBlur={() => handleBlur('cvv')}
                                maxLength={4}
                                className={
                                  errors.cvv && touched.cvv ? 'border-red-500' : ''
                                }
                              />
                              {errors.cvv && touched.cvv && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.cvv}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Security Note */}
                          <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Secure Payment
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                Your payment information is encrypted and secure.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
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
                              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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

                          {/* Payment Method */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-800">
                                  Payment Method
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Card ending in ****{' '}
                                  {formData.cardNumber.slice(-4)}
                                </p>
                              </div>
                            </div>
                          </div>

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
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-primary hover:bg-[#B8420A] text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#2D6A4F] hover:bg-[#245840] text-white min-w-[150px]"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: 'linear',
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Place Order
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
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
