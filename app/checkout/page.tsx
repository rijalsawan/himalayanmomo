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
  Lock,
  Shield,
  Loader2,
  ChevronRight,
  Package,
  Store,
  UtensilsCrossed,
  Truck,
  Tag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { businessInfo } from '../data/businessInfo';

type FulfillmentType = 'PICKUP' | 'DINE_IN' | 'DELIVERY';

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
  { id: 1, title: 'Order Details', icon: MapPin },
  { id: 2, title: 'Review & Pay', icon: CreditCard },
];

const fulfillmentOptions: { value: FulfillmentType; label: string; description: string; icon: typeof Store }[] = [
  { value: 'PICKUP', label: 'Pickup', description: 'Grab your order at the restaurant', icon: Store },
  { value: 'DINE_IN', label: 'Dine-In', description: "We'll have it ready at your table", icon: UtensilsCrossed },
  { value: 'DELIVERY', label: 'Delivery', description: 'Delivered to your door', icon: Truck },
];

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F3]">
    <Navbar />
    <main className="pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="container-custom py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 h-fit">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

// Empty cart component
const EmptyCart = () => (
  <div className="min-h-screen bg-[#FDF8F3]">
    <Navbar />
    <main className="pt-20">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Add some delicious momos to your cart before checking out!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/menu">
              Browse Menu
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalItems, subtotal, updateQuantity, removeItem } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('PICKUP');
  const [orderingSettings, setOrderingSettings] = useState({ deliveryEnabled: false, promoEnabled: true });

  // Fetch admin-controlled ordering settings (delivery availability & promo)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setOrderingSettings({
            deliveryEnabled: !!data.deliveryEnabled,
            promoEnabled: data.promoEnabled ?? true,
          });
        }
      } catch (error) {
        console.error('Error fetching ordering settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // If delivery gets disabled while Delivery is selected, fall back to Pickup
  useEffect(() => {
    if (fulfillmentType === 'DELIVERY' && !orderingSettings.deliveryEnabled) {
      setFulfillmentType('PICKUP');
    }
  }, [orderingSettings.deliveryEnabled, fulfillmentType]);

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

  // Fetch user profile and pre-fill form
  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== 'authenticated') {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const profile = await response.json();
          
          // Parse the name into first and last name
          const nameParts = (profile.name || '').trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          // Parse address if available (format: "street, apt, city, state zip")
          let street = '';
          let apartment = '';
          let city = '';
          let state = '';
          let zipCode = '';
          
          if (profile.address) {
            // Try to parse address - common formats:
            // "123 Main St, Apt 4, New York, NY 10001"
            // "123 Main St, New York, NY 10001"
            const addressParts = profile.address.split(',').map((p: string) => p.trim());
            
            if (addressParts.length >= 3) {
              street = addressParts[0] || '';
              
              // Check if second part looks like an apartment
              const secondPart = addressParts[1] || '';
              const isApartment = /^(apt|suite|unit|#|\d)/i.test(secondPart);
              
              if (isApartment && addressParts.length >= 4) {
                apartment = secondPart;
                city = addressParts[2] || '';
                const stateZip = addressParts[3] || '';
                const stateZipMatch = stateZip.match(/^([A-Za-z]{2})\s*(\d{5}(-\d{4})?)?$/);
                if (stateZipMatch) {
                  state = stateZipMatch[1] || '';
                  zipCode = stateZipMatch[2] || '';
                } else {
                  state = stateZip;
                }
              } else {
                city = addressParts[1] || '';
                const stateZip = addressParts[2] || '';
                const stateZipMatch = stateZip.match(/^([A-Za-z]{2})\s*(\d{5}(-\d{4})?)?$/);
                if (stateZipMatch) {
                  state = stateZipMatch[1] || '';
                  zipCode = stateZipMatch[2] || '';
                } else {
                  state = stateZip;
                }
              }
            } else if (addressParts.length === 1) {
              // Just a simple address
              street = profile.address;
            }
          }

          setFormData(prev => ({
            ...prev,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            email: profile.email || prev.email,
            phone: profile.phone || prev.phone,
            address: street || prev.address,
            apartment: apartment || prev.apartment,
            city: city || prev.city,
            state: state || prev.state,
            zipCode: zipCode || prev.zipCode,
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const isDelivery = fulfillmentType === 'DELIVERY';
  const deliveryFee = isDelivery ? (subtotal > 30 ? 0 : 4.99) : 0;
  const discountRate = orderingSettings.promoEnabled && !isDelivery ? 0.1 : 0;
  const discountAmount = subtotal * discountRate;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + tax + deliveryFee;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[\d\s\-\+\(\)]{10,}$/.test(phone);

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};
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
    if (isDelivery) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFocus = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const nextStep = () => {
    setSubmitAttempted(true);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      ...(isDelivery ? { address: true, city: true, zipCode: true } : {}),
    });

    if (validateStep()) {
      setSubmitAttempted(false);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
          element?.focus();
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  };

  const prevStep = () => setCurrentStep(1);

  const getFulfillmentAddress = () => {
    if (fulfillmentType === 'DELIVERY') {
      return `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
    }
    const { street, city, state, zip } = businessInfo.contact.address;
    if (fulfillmentType === 'DINE_IN') {
      return `Dine-In at ${businessInfo.name} — ${street}, ${city}, ${state} ${zip}`;
    }
    return `Pickup at ${businessInfo.name} — ${street}, ${city}, ${state} ${zip}`;
  };

  const handleStripeCheckout = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
          deliveryInfo: {
            address: getFulfillmentAddress(),
            phone: formData.phone,
            instructions: formData.deliveryInstructions,
          },
          fulfillmentType,
          subtotal,
          discountAmount,
          tax,
          deliveryFee,
          total,
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoadingProfile) return <LoadingSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  const showError = (field: keyof FormErrors) =>
    errors[field] && (touched[field] || submitAttempted);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navbar />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-custom py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/menu" className="hover:text-primary transition-colors">
                Menu
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Checkout</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-6 sm:py-8 lg:py-12">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Checkout
            </h1>
            {/* Progress Steps - Pill Style */}
            <div className="flex items-center gap-2 mt-4 sm:mt-6">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <button
                      onClick={() => isComplete && setCurrentStep(step.id)}
                      disabled={!isComplete}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isComplete
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer'
                          : isActive
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{step.id}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-12 h-0.5 ${isComplete ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Delivery Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Fulfillment Method Selector */}
                    <Card className="border border-gray-200 shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Store className="w-5 h-5 text-primary" />
                          <h2 className="font-heading text-lg font-semibold text-gray-900">
                            How would you like your order?
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {fulfillmentOptions
                            .filter((option) => option.value !== 'DELIVERY' || orderingSettings.deliveryEnabled)
                            .map((option) => {
                              const isSelected = fulfillmentType === option.value;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setFulfillmentType(option.value)}
                                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-primary bg-primary/5'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    <option.icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                      {option.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                        {!orderingSettings.deliveryEnabled && (
                          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            Delivery isn&apos;t available just yet — pickup and dine-in orders get 10% off!
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Delivery Form Card */}
                    <Card className="border border-gray-200 shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h2 className="font-heading text-lg font-semibold text-gray-900">
                            {isDelivery ? 'Delivery Information' : 'Contact Information'}
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {/* Name Fields */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                First Name <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  name="firstName"
                                  placeholder="John"
                                  value={formData.firstName}
                                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                                  onFocus={() => handleFocus('firstName')}
                                  onBlur={() => handleBlur('firstName')}
                                  className={`pl-10 h-11 ${showError('firstName') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                                />
                              </div>
                              {showError('firstName') && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Last Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                onFocus={() => handleFocus('lastName')}
                                onBlur={() => handleBlur('lastName')}
                                className={`h-11 ${showError('lastName') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                              />
                              {showError('lastName') && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Contact Fields */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  name="email"
                                  type="email"
                                  placeholder="john@example.com"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  onFocus={() => handleFocus('email')}
                                  onBlur={() => handleBlur('email')}
                                  className={`pl-10 h-11 ${showError('email') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                                />
                              </div>
                              {showError('email') && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  name="phone"
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  value={formData.phone}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  onFocus={() => handleFocus('phone')}
                                  onBlur={() => handleBlur('phone')}
                                  className={`pl-10 h-11 ${showError('phone') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                                />
                              </div>
                              {showError('phone') && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Address (Delivery only) */}
                          {isDelivery && (
                            <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Street Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                name="address"
                                placeholder="123 Main Street"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                onFocus={() => handleFocus('address')}
                                onBlur={() => handleBlur('address')}
                                className={`pl-10 h-11 ${showError('address') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                              />
                            </div>
                            {showError('address') && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.address}
                              </p>
                            )}
                          </div>

                          {/* Apartment */}
                          <Input
                            placeholder="Apartment, suite, etc. (optional)"
                            value={formData.apartment}
                            onChange={(e) => handleInputChange('apartment', e.target.value)}
                            className="h-11 border-gray-200"
                          />

                          {/* City, State, ZIP */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                City <span className="text-red-500">*</span>
                              </label>
                              <Input
                                name="city"
                                placeholder="New York"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                onFocus={() => handleFocus('city')}
                                onBlur={() => handleBlur('city')}
                                className={`h-11 ${showError('city') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                              />
                              {showError('city') && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.city}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                State
                              </label>
                              <Input
                                placeholder="NY"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className="h-11 border-gray-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                ZIP <span className="text-red-500">*</span>
                              </label>
                              <Input
                                name="zipCode"
                                placeholder="10001"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                onFocus={() => handleFocus('zipCode')}
                                onBlur={() => handleBlur('zipCode')}
                                className={`h-11 ${showError('zipCode') ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
                              />
                              {showError('zipCode') && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.zipCode}
                                </p>
                              )}
                            </div>
                          </div>
                            </>
                          )}

                          {/* Pickup / Dine-In notice */}
                          {!isDelivery && (
                            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                              <Store className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div className="text-sm text-gray-700">
                                <p className="font-medium text-gray-900">
                                  {fulfillmentType === 'DINE_IN' ? 'Dine-In at' : 'Pickup at'} {businessInfo.name}
                                </p>
                                <p className="text-gray-500 mt-0.5">
                                  {businessInfo.contact.address.street}, {businessInfo.contact.address.city}, {businessInfo.contact.address.state} {businessInfo.contact.address.zip}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Instructions */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              {isDelivery ? 'Delivery Instructions (optional)' : 'Notes for the kitchen (optional)'}
                            </label>
                            <textarea
                              placeholder={isDelivery ? 'Ring doorbell, leave at door, etc.' : 'Any special requests?'}
                              value={formData.deliveryInstructions}
                              onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                              rows={3}
                              className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Error Summary */}
                    <AnimatePresence>
                      {submitAttempted && Object.keys(errors).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-50 border border-red-200 rounded-xl p-4"
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-700 text-sm">
                                Please fix the following errors:
                              </p>
                              <ul className="mt-2 space-y-1">
                                {Object.values(errors).map((error, index) => (
                                  <li key={index} className="text-red-600 text-xs flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {error}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between pt-2">
                      <Button asChild variant="outline" className="border-gray-200">
                        <Link href="/menu">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Continue Shopping
                        </Link>
                      </Button>
                      <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                        Review Order
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
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
                    className="space-y-5 sm:space-y-6"
                  >
                    {/* Delivery Details Card - Minimalist */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <h2 className="font-heading text-base sm:text-lg font-semibold text-gray-900">
                            {fulfillmentType === 'DELIVERY' ? 'Delivery Details' : fulfillmentType === 'DINE_IN' ? 'Dine-In Details' : 'Pickup Details'}
                          </h2>
                        </div>
                        <button
                          onClick={prevStep}
                          className="text-sm text-primary font-medium hover:underline underline-offset-2 transition-all"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                          {/* Delivery / Pickup Address */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <MapPin className="w-3.5 h-3.5" />
                              {isDelivery ? 'Delivery Address' : fulfillmentType === 'DINE_IN' ? 'Dine-In Location' : 'Pickup Location'}
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed">
                              <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                              {isDelivery ? (
                                <>
                                  <p>{formData.address}{formData.apartment && `, ${formData.apartment}`}</p>
                                  <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                                </>
                              ) : (
                                <>
                                  <p>{businessInfo.name}</p>
                                  <p>{businessInfo.contact.address.street}, {businessInfo.contact.address.city}, {businessInfo.contact.address.state} {businessInfo.contact.address.zip}</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <User className="w-3.5 h-3.5" />
                              Contact
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                              <p className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {formData.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                {formData.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Instructions */}
                        {formData.deliveryInstructions && (
                          <div className="mt-5 pt-5 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                              <Home className="w-3.5 h-3.5" />
                              {isDelivery ? 'Instructions' : 'Notes'}
                            </div>
                            <p className="text-sm text-gray-600 italic">&ldquo;{formData.deliveryInstructions}&rdquo;</p>
                          </div>
                        )}

                        {/* Estimated Time Banner */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-5 flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50"
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <Clock className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">
                              {isDelivery ? 'Est. Delivery' : 'Est. Ready Time'}
                            </p>
                            <p className="text-lg font-bold text-gray-900">{isDelivery ? '30–45 min' : '15–20 min'}</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Payment Section - Premium Design */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                    >
                      {/* Dark Header */}
                      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-5 sm:px-6 py-5">
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#635BFF]/20 rounded-full blur-2xl" />
                        </div>
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="font-heading text-base sm:text-lg font-semibold text-white">
                                Secure Checkout
                              </h2>
                              <p className="text-xs text-gray-400">End-to-end encrypted</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium hidden sm:inline">Protected</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Content */}
                      <div className="p-5 sm:p-6 space-y-5">
                        {/* Order Total - Highlighted */}
                        <div className="relative p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Amount</p>
                              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                                ${total.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Includes</p>
                              <p className="text-sm text-gray-600">
                                Tax{isDelivery ? ` & ${deliveryFee === 0 ? 'Free' : ''} Delivery` : ''}{discountAmount > 0 ? ' & 10% Off' : ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                            Accepted Payment Methods
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Visa */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#1A1F71" />
                                <path d="M17.5 16l2-8h2l-2 8h-2zm8-8l-3 8h-2l1.5-3.5-2-4.5h2l1.5 3 1-3h2zm-12 8l-.5-1.5h-2.5L10 16H8l3-8h2l2.5 8H13zm-1.5-3h1.5l-.75-2.5-.75 2.5z" fill="white" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Visa</span>
                            </div>
                            {/* Mastercard */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#F7F7F7" />
                                <circle cx="15" cy="12" r="6" fill="#EB001B" />
                                <circle cx="25" cy="12" r="6" fill="#F79E1B" />
                                <path d="M20 7a5.98 5.98 0 012 5 5.98 5.98 0 01-2 5 5.98 5.98 0 01-2-5 5.98 5.98 0 012-5z" fill="#FF5F00" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Mastercard</span>
                            </div>
                            {/* Amex */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#006FCF" />
                                <path d="M8 15h3l.5-1.5h1l.5 1.5h7v-1l.5 1h3l.5-1v1h3V9h-3l-.5 1-.5-1h-7v1l-.5-1H12l-.5 1-.5-1H8v6z" fill="white" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Amex</span>
                            </div>
                            {/* Apple Pay */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#000" />
                                <path d="M14 8.5c.5-.6 1.2-1 1.8-1 .1.8-.2 1.5-.7 2-.5.6-1.1 1-1.8.9-.1-.7.3-1.4.7-1.9zm.8 2.2c1 0 1.5.7 1.5.7s-.8.5-.8 1.5c0 1.2 1 1.6 1 1.6s-.7 2-1.7 2c-.5 0-.8-.3-1.3-.3-.5 0-.9.3-1.3.3-.9 0-2-1.9-2-3.4 0-1.5 1-2.3 1.8-2.3.5 0 1 .3 1.3.3.4 0 .9-.4 1.5-.4z" fill="white" />
                                <path d="M21 9h1.2l2.3 5.5 2.3-5.5H28l-3.2 7h-1.3L21 9z" fill="white" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Apple Pay</span>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-xs text-gray-400">Powered by Stripe</span>
                          </div>
                        </div>

                        {/* Pay Button - Premium */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            onClick={handleStripeCheckout}
                            disabled={isSubmitting}
                            className="relative w-full h-14 sm:h-16 bg-gradient-to-r from-[#635BFF] via-[#7C75FF] to-[#635BFF] hover:from-[#5851DB] hover:via-[#6B64FF] hover:to-[#5851DB] text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-[#635BFF]/25 transition-all duration-300 overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {isSubmitting ? (
                              <div className="relative flex items-center justify-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing Payment...</span>
                              </div>
                            ) : (
                              <div className="relative flex items-center justify-center gap-3">
                                <Lock className="w-5 h-5" />
                                <span>Pay ${total.toFixed(2)}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </Button>
                        </motion.div>

                        {/* Security Badges */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span>256-bit SSL Encryption</span>
                          </div>
                          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Lock className="w-4 h-4 text-emerald-500" />
                            <span>PCI DSS Compliant</span>
                          </div>
                          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span>Money-back Guarantee</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Back Navigation */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between pt-2"
                    >
                      <Button 
                        variant="ghost" 
                        onClick={prevStep} 
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Delivery
                      </Button>
                      <p className="text-xs text-gray-400 hidden sm:block">
                        By placing your order, you agree to our Terms of Service
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 shadow-sm sticky top-28">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-gray-900">Order Summary</h2>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-200 my-4" />

                  {/* Totals */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Pickup &amp; Dine-In Promo (10%)
                        </span>
                        <span className="font-medium text-emerald-600">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {isDelivery && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-600">FREE</span>
                          ) : (
                            <span className="text-gray-900">${deliveryFee.toFixed(2)}</span>
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 my-4" />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  {/* Free Delivery Notice */}
                  {isDelivery && subtotal < 30 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-xs text-amber-700">
                        <Package className="w-4 h-4 inline mr-1.5" />
                        Add ${(30 - subtotal).toFixed(2)} more for free delivery!
                      </p>
                    </div>
                  )}
                  {!isDelivery && orderingSettings.promoEnabled && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-xs text-emerald-700">
                        <Tag className="w-4 h-4 inline mr-1.5" />
                        10% off applied for Pickup &amp; Dine-In orders!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
