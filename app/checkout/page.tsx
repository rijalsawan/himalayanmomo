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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthRequiredModal from '../components/AuthRequiredModal';

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
  <div className="min-h-screen bg-warm-light">
    <Navbar />
    <main className="pt-16 md:pt-20">
      <div className="bg-cream border-b-[1.5px] border-dark/10">
        <div className="container-custom py-4">
          <div className="h-4 w-32 bg-dark/10" />
        </div>
      </div>
      <div className="container-custom py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-48 bg-dark/10" />
            <div className="bg-warm-light border-[1.5px] border-dark/15 p-6 space-y-4">
              <div className="h-6 w-40 bg-dark/10" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-dark/10" />
                <div className="h-12 bg-dark/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-dark/10" />
                <div className="h-12 bg-dark/10" />
              </div>
            </div>
          </div>
          <div className="bg-warm-light border-[1.5px] border-dark/15 p-6 h-fit">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-dark/10" />
              <div className="h-20 bg-dark/5" />
              <div className="h-20 bg-dark/5" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

// Sign-in-required screen, shown instead of a silent redirect so the user
// understands why and can act from a modal without losing their cart.
const SignInRequired = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <div className="min-h-screen bg-warm-light">
    <Navbar />
    <main className="pt-16 md:pt-20">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 border-[1.5px] border-dark bg-cream shadow-brutal-sm flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-dark/30" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-3">
            Sign in to check out
          </h1>
          <p className="text-dark/50 mb-8">
            Your cart is saved. Sign in or create an account to continue to checkout.
          </p>
          <Button asChild size="lg" className="rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal font-bold uppercase tracking-[0.04em] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
            <Link href="/menu">
              Browse Menu
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
    <Footer />
    <AuthRequiredModal open={open} onClose={onClose} callbackUrl="/checkout" />
  </div>
);

// Empty cart component
const EmptyCart = () => (
  <div className="min-h-screen bg-warm-light">
    <Navbar />
    <main className="pt-16 md:pt-20">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 border-[1.5px] border-dark bg-cream shadow-brutal-sm flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-dark/30" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-3">
            Your cart is empty
          </h1>
          <p className="text-dark/50 mb-8">
            Add some delicious momos to your cart before checking out!
          </p>
          <Button asChild size="lg" className="rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal font-bold uppercase tracking-[0.04em] shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
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
  const [orderingSettings, setOrderingSettings] = useState({
    deliveryEnabled: false,
    promoEnabled: true,
    businessName: 'MO:MO Station',
    businessAddress: {
      street: '123 Momo Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
    },
  });

  // Fetch admin-controlled ordering settings (delivery availability, promo & business info)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setOrderingSettings({
            deliveryEnabled: !!data.deliveryEnabled,
            promoEnabled: data.promoEnabled ?? true,
            businessName: data.footerBrandName || 'MO:MO Station',
            businessAddress: {
              street: data.contactAddressStreet || '123 Momo Street',
              city: data.contactAddressCity || 'San Francisco',
              state: data.contactAddressState || 'CA',
              zip: data.contactAddressZip || '94102',
            },
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

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowAuthModal(true);
    }
  }, [status]);

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
    const { street, city, state, zip } = orderingSettings.businessAddress;
    if (fulfillmentType === 'DINE_IN') {
      return `Dine-In at ${orderingSettings.businessName} — ${street}, ${city}, ${state} ${zip}`;
    }
    return `Pickup at ${orderingSettings.businessName} — ${street}, ${city}, ${state} ${zip}`;
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
  if (status === 'unauthenticated') {
    return <SignInRequired open={showAuthModal} onClose={() => setShowAuthModal(false)} />;
  }
  if (items.length === 0) return <EmptyCart />;

  const showError = (field: keyof FormErrors) =>
    errors[field] && (touched[field] || submitAttempted);

  return (
    <div className="min-h-screen bg-warm-light">
      <Navbar />

      <main className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="bg-cream border-b-[1.5px] border-dark/10">
          <div className="container-custom py-3 sm:py-4">
            <nav className="flex items-center gap-2 font-mono-brutal text-xs uppercase tracking-wide text-dark/50">
              <Link href="/menu" className="hover:text-brand transition-colors">
                Menu
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-dark font-bold">Checkout</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-6 sm:py-8 lg:py-12">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-2">
              Checkout
            </h1>
            {/* Progress Steps - Brutal Style */}
            <div className="flex items-center gap-2 mt-4 sm:mt-6">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <button
                      onClick={() => isComplete && setCurrentStep(step.id)}
                      disabled={!isComplete}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-[1.5px] border-dark font-mono-brutal text-xs font-bold uppercase tracking-wide transition-all ${
                        isComplete
                          ? 'bg-herb text-warm-light hover:bg-herb/90 cursor-pointer shadow-brutal-sm'
                          : isActive
                          ? 'bg-brand text-warm-light shadow-brutal-sm'
                          : 'bg-warm-light text-dark/40'
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
                      <div className={`w-8 sm:w-12 h-[2px] ${isComplete ? 'bg-herb' : 'bg-dark/15'}`} />
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
                    <div className="border-[1.5px] border-dark bg-warm-light shadow-brutal-sm max-sm:w-85">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Store className="w-5 h-5 text-brand" />
                          <h2 className="font-heading text-lg font-bold text-dark">
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
                                  className={`flex items-start gap-3 p-4 border-[1.5px] text-left transition-all ${
                                    isSelected
                                      ? 'border-dark bg-brand/5 shadow-brutal-sm'
                                      : 'border-dark/20 hover:border-dark/40'
                                  }`}
                                >
                                  <div
                                    className={`w-9 h-9 border-[1.5px] border-dark flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? 'bg-brand text-warm-light' : 'bg-cream text-dark/50'
                                    }`}
                                  >
                                    <option.icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className={`text-sm font-heading font-bold ${isSelected ? 'text-brand' : 'text-dark'}`}>
                                      {option.label}
                                    </p>
                                    <p className="text-xs text-dark/50 mt-0.5">{option.description}</p>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                        {!orderingSettings.deliveryEnabled && (
                          <p className="font-mono-brutal text-xs uppercase tracking-wide text-dark/50 mt-3 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-golden flex-shrink-0" />
                            Delivery isn&apos;t available just yet — pickup and dine-in orders get 10% off!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Form Card */}
                    <div className="border-[1.5px] border-dark bg-warm-light shadow-brutal-sm max-sm:w-85">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <MapPin className="w-5 h-5 text-brand" />
                          <h2 className="font-heading text-lg font-bold text-dark">
                            {isDelivery ? 'Delivery Information' : 'Contact Information'}
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {/* Name Fields */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                First Name <span className="text-brand">*</span>
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                                <Input
                                  name="firstName"
                                  placeholder="John"
                                  value={formData.firstName}
                                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                                  onFocus={() => handleFocus('firstName')}
                                  onBlur={() => handleBlur('firstName')}
                                  className={`pl-10 h-11 rounded-none focus-visible:ring-0 ${showError('firstName') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                                />
                              </div>
                              {showError('firstName') && (
                                <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                Last Name <span className="text-brand">*</span>
                              </label>
                              <Input
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                onFocus={() => handleFocus('lastName')}
                                onBlur={() => handleBlur('lastName')}
                                className={`h-11 rounded-none focus-visible:ring-0 ${showError('lastName') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                              />
                              {showError('lastName') && (
                                <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Contact Fields */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                Email <span className="text-brand">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                                <Input
                                  name="email"
                                  type="email"
                                  placeholder="john@example.com"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  onFocus={() => handleFocus('email')}
                                  onBlur={() => handleBlur('email')}
                                  className={`pl-10 h-11 rounded-none focus-visible:ring-0 ${showError('email') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                                />
                              </div>
                              {showError('email') && (
                                <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                Phone <span className="text-brand">*</span>
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                                <Input
                                  name="phone"
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  value={formData.phone}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  onFocus={() => handleFocus('phone')}
                                  onBlur={() => handleBlur('phone')}
                                  className={`pl-10 h-11 rounded-none focus-visible:ring-0 ${showError('phone') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                                />
                              </div>
                              {showError('phone') && (
                                <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
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
                            <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                              Street Address <span className="text-brand">*</span>
                            </label>
                            <div className="relative">
                              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                              <Input
                                name="address"
                                placeholder="123 Main Street"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                onFocus={() => handleFocus('address')}
                                onBlur={() => handleBlur('address')}
                                className={`pl-10 h-11 rounded-none focus-visible:ring-0 ${showError('address') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                              />
                            </div>
                            {showError('address') && (
                              <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
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
                            className="h-11 rounded-none border-brutal-thin focus-visible:border-brand focus-visible:ring-0"
                          />

                          {/* City, State, ZIP */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                City <span className="text-brand">*</span>
                              </label>
                              <Input
                                name="city"
                                placeholder="New York"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                onFocus={() => handleFocus('city')}
                                onBlur={() => handleBlur('city')}
                                className={`h-11 rounded-none focus-visible:ring-0 ${showError('city') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                              />
                              {showError('city') && (
                                <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.city}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                State
                              </label>
                              <Input
                                placeholder="NY"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className="h-11 rounded-none border-brutal-thin focus-visible:border-brand focus-visible:ring-0"
                              />
                            </div>
                            <div>
                              <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                                ZIP <span className="text-brand">*</span>
                              </label>
                              <Input
                                name="zipCode"
                                placeholder="10001"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                onFocus={() => handleFocus('zipCode')}
                                onBlur={() => handleBlur('zipCode')}
                                className={`h-11 rounded-none focus-visible:ring-0 ${showError('zipCode') ? 'border-[1.5px] border-brand bg-brand/5' : 'border-brutal-thin focus-visible:border-brand'}`}
                              />
                              {showError('zipCode') && (
                                <p className="text-brand text-xs mt-1 flex items-center gap-1 font-mono-brutal">
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
                            <div className="flex items-start gap-3 p-4 bg-brand/5 border-[1.5px] border-brand/20">
                              <Store className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                              <div className="text-sm text-dark/70">
                                <p className="font-heading font-bold text-dark">
                                  {fulfillmentType === 'DINE_IN' ? 'Dine-In at' : 'Pickup at'} {orderingSettings.businessName}
                                </p>
                                <p className="text-dark/50 mt-0.5">
                                  {orderingSettings.businessAddress.street}, {orderingSettings.businessAddress.city}, {orderingSettings.businessAddress.state} {orderingSettings.businessAddress.zip}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Instructions */}
                          <div>
                            <label className="block font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark mb-1.5">
                              {isDelivery ? 'Delivery Instructions (optional)' : 'Notes for the kitchen (optional)'}
                            </label>
                            <textarea
                              placeholder={isDelivery ? 'Ring doorbell, leave at door, etc.' : 'Any special requests?'}
                              value={formData.deliveryInstructions}
                              onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                              rows={3}
                              className="w-full rounded-none border-brutal-thin px-3 py-2.5 text-sm placeholder:text-dark/30 focus:outline-none focus:border-brand resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Summary */}
                    <AnimatePresence>
                      {submitAttempted && Object.keys(errors).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-brand/5 border-[1.5px] border-brand p-4"
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                            <div>
                              <p className="font-mono-brutal font-bold uppercase tracking-wide text-brand text-xs">
                                Please fix the following errors:
                              </p>
                              <ul className="mt-2 space-y-1">
                                {Object.values(errors).map((error, index) => (
                                  <li key={index} className="text-brand/80 text-xs flex items-center gap-1">
                                    <span className="w-1 h-1 bg-brand" />
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
                    <div className="flex justify-between pt-2 max-sm:w-85">
                      <Button asChild variant="outline" className="rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-cream text-dark font-mono-brutal font-bold uppercase tracking-wide text-xs">
                        <Link href="/menu">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Continue Shopping
                        </Link>
                      </Button>
                      <Button onClick={nextStep} className="rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal font-bold uppercase tracking-wide text-xs shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
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
                    {/* Delivery Details Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-warm-light border-[1.5px] border-dark shadow-brutal-sm overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-5 sm:px-6 py-4 border-b-[1.5px] border-dark/15 flex items-center justify-between bg-cream">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border-[1.5px] border-dark bg-herb flex items-center justify-center">
                            <Check className="w-4 h-4 text-warm-light" />
                          </div>
                          <h2 className="font-heading text-base sm:text-lg font-bold text-dark">
                            {fulfillmentType === 'DELIVERY' ? 'Delivery Details' : fulfillmentType === 'DINE_IN' ? 'Dine-In Details' : 'Pickup Details'}
                          </h2>
                        </div>
                        <button
                          onClick={prevStep}
                          className="font-mono-brutal text-xs font-bold uppercase tracking-wide text-brand hover:underline underline-offset-2 transition-all"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                          {/* Delivery / Pickup Address */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-mono-brutal text-[11px] font-bold text-dark/40 uppercase tracking-wide">
                              <MapPin className="w-3.5 h-3.5" />
                              {isDelivery ? 'Delivery Address' : fulfillmentType === 'DINE_IN' ? 'Dine-In Location' : 'Pickup Location'}
                            </div>
                            <div className="text-sm text-dark/70 leading-relaxed">
                              <p className="font-heading font-bold text-dark">{formData.firstName} {formData.lastName}</p>
                              {isDelivery ? (
                                <>
                                  <p>{formData.address}{formData.apartment && `, ${formData.apartment}`}</p>
                                  <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                                </>
                              ) : (
                                <>
                                  <p>{orderingSettings.businessName}</p>
                                  <p>{orderingSettings.businessAddress.street}, {orderingSettings.businessAddress.city}, {orderingSettings.businessAddress.state} {orderingSettings.businessAddress.zip}</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-mono-brutal text-[11px] font-bold text-dark/40 uppercase tracking-wide">
                              <User className="w-3.5 h-3.5" />
                              Contact
                            </div>
                            <div className="text-sm text-dark/70 space-y-1">
                              <p className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-dark/30" />
                                {formData.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-dark/30" />
                                {formData.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Instructions */}
                        {formData.deliveryInstructions && (
                          <div className="mt-5 pt-5 border-t-[1.5px] border-dashed border-dark/15">
                            <div className="flex items-center gap-2 font-mono-brutal text-[11px] font-bold text-dark/40 uppercase tracking-wide mb-2">
                              <Home className="w-3.5 h-3.5" />
                              {isDelivery ? 'Instructions' : 'Notes'}
                            </div>
                            <p className="text-sm text-dark/60 italic">&ldquo;{formData.deliveryInstructions}&rdquo;</p>
                          </div>
                        )}

                        {/* Estimated Time Banner */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-5 flex items-center gap-4 p-4 bg-herb/10 border-[1.5px] border-herb/30"
                        >
                          <div className="w-10 h-10 border-[1.5px] border-dark bg-warm-light shadow-brutal-sm flex items-center justify-center">
                            <Clock className="w-5 h-5 text-herb" />
                          </div>
                          <div>
                            <p className="font-mono-brutal text-[11px] font-bold text-herb uppercase tracking-wide">
                              {isDelivery ? 'Est. Delivery' : 'Est. Ready Time'}
                            </p>
                            <p className="text-lg font-heading font-bold text-dark">{isDelivery ? '30–45 min' : '15–20 min'}</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Payment Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-warm-light border-[1.5px] border-dark shadow-brutal-sm overflow-hidden"
                    >
                      {/* Dark Header */}
                      <div className="relative bg-dark px-5 sm:px-6 py-5 border-b-[3px] border-brand">
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border-[1.5px] border-warm-light/30 bg-warm-light/10 flex items-center justify-center">
                              <Lock className="w-5 h-5 text-warm-light" />
                            </div>
                            <div>
                              <h2 className="font-heading text-base sm:text-lg font-bold text-warm-light">
                                Secure Checkout
                              </h2>
                              <p className="font-mono-brutal text-[11px] uppercase tracking-wide text-warm-light/40">End-to-end encrypted</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-golden" />
                            <span className="font-mono-brutal text-[11px] uppercase tracking-wide text-golden hidden sm:inline">Protected</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Content */}
                      <div className="p-5 sm:p-6 space-y-5">
                        {/* Order Total - Highlighted */}
                        <div className="relative p-5 border-[1.5px] border-dark bg-cream">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono-brutal text-[11px] text-dark/40 uppercase tracking-wide font-bold">Total Amount</p>
                              <p className="text-3xl sm:text-4xl font-heading font-bold text-dark mt-1">
                                ${total.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono-brutal text-[11px] text-dark/30 uppercase tracking-wide">Includes</p>
                              <p className="text-sm text-dark/60">
                                Tax{isDelivery ? ` & ${deliveryFee === 0 ? 'Free' : ''} Delivery` : ''}{discountAmount > 0 ? ' & 10% Off' : ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-3">
                          <p className="font-mono-brutal text-[11px] text-dark/40 uppercase tracking-wide font-bold">
                            Accepted Payment Methods
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Visa */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-cream border-[1.5px] border-dark/15 hover:border-dark/40 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#1A1F71" />
                                <path d="M17.5 16l2-8h2l-2 8h-2zm8-8l-3 8h-2l1.5-3.5-2-4.5h2l1.5 3 1-3h2zm-12 8l-.5-1.5h-2.5L10 16H8l3-8h2l2.5 8H13zm-1.5-3h1.5l-.75-2.5-.75 2.5z" fill="white" />
                              </svg>
                              <span className="text-xs font-medium text-dark/60">Visa</span>
                            </div>
                            {/* Mastercard */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-cream border-[1.5px] border-dark/15 hover:border-dark/40 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#F7F7F7" />
                                <circle cx="15" cy="12" r="6" fill="#EB001B" />
                                <circle cx="25" cy="12" r="6" fill="#F79E1B" />
                                <path d="M20 7a5.98 5.98 0 012 5 5.98 5.98 0 01-2 5 5.98 5.98 0 01-2-5 5.98 5.98 0 012-5z" fill="#FF5F00" />
                              </svg>
                              <span className="text-xs font-medium text-dark/60">Mastercard</span>
                            </div>
                            {/* Amex */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-cream border-[1.5px] border-dark/15 hover:border-dark/40 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#006FCF" />
                                <path d="M8 15h3l.5-1.5h1l.5 1.5h7v-1l.5 1h3l.5-1v1h3V9h-3l-.5 1-.5-1h-7v1l-.5-1H12l-.5 1-.5-1H8v6z" fill="white" />
                              </svg>
                              <span className="text-xs font-medium text-dark/60">Amex</span>
                            </div>
                            {/* Apple Pay */}
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-cream border-[1.5px] border-dark/15 hover:border-dark/40 transition-colors">
                              <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
                                <rect width="40" height="24" rx="3" fill="#000" />
                                <path d="M14 8.5c.5-.6 1.2-1 1.8-1 .1.8-.2 1.5-.7 2-.5.6-1.1 1-1.8.9-.1-.7.3-1.4.7-1.9zm.8 2.2c1 0 1.5.7 1.5.7s-.8.5-.8 1.5c0 1.2 1 1.6 1 1.6s-.7 2-1.7 2c-.5 0-.8-.3-1.3-.3-.5 0-.9.3-1.3.3-.9 0-2-1.9-2-3.4 0-1.5 1-2.3 1.8-2.3.5 0 1 .3 1.3.3.4 0 .9-.4 1.5-.4z" fill="white" />
                                <path d="M21 9h1.2l2.3 5.5 2.3-5.5H28l-3.2 7h-1.3L21 9z" fill="white" />
                              </svg>
                              <span className="text-xs font-medium text-dark/60">Apple Pay</span>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-[1.5px] border-dark/15"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-warm-light px-3 font-mono-brutal text-[11px] uppercase tracking-wide text-dark/40">Powered by Stripe</span>
                          </div>
                        </div>

                        {/* Pay Button */}
                        <Button
                          onClick={handleStripeCheckout}
                          disabled={isSubmitting}
                          className="relative w-full h-14 sm:h-16 rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light text-base sm:text-lg font-mono-brutal font-bold uppercase tracking-wide shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
                        >
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

                        {/* Security Badges */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-1.5 font-mono-brutal text-[11px] uppercase tracking-wide text-dark/40">
                            <Shield className="w-4 h-4 text-herb" />
                            <span>256-bit SSL Encryption</span>
                          </div>
                          <div className="hidden sm:block w-1 h-1 bg-dark/20" />
                          <div className="flex items-center gap-1.5 font-mono-brutal text-[11px] uppercase tracking-wide text-dark/40">
                            <Lock className="w-4 h-4 text-herb" />
                            <span>PCI DSS Compliant</span>
                          </div>
                          <div className="hidden sm:block w-1 h-1 bg-dark/20" />
                          <div className="flex items-center gap-1.5 font-mono-brutal text-[11px] uppercase tracking-wide text-dark/40">
                            <Check className="w-4 h-4 text-herb" />
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
                        className="rounded-none text-dark/60 hover:text-dark hover:bg-cream gap-2 font-mono-brutal text-xs font-bold uppercase tracking-wide"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Delivery
                      </Button>
                      <p className="font-mono-brutal text-[11px] uppercase tracking-wide text-dark/30 hidden sm:block">
                        By placing your order, you agree to our Terms of Service
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 max-sm:w-85">
              <div className="border-[1.5px] border-dark bg-warm-light shadow-brutal-sm sticky top-28">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-bold text-dark">Order Summary</h2>
                    <span className="tag-mono bg-cream border-[1.5px] border-dark/20 text-dark/60">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex gap-3 p-3 bg-cream border-[1.5px] border-dark/10"
                      >
                        <div className="relative w-14 h-14 border-[1.5px] border-dark/15 overflow-hidden flex-shrink-0 bg-dark/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-heading font-bold text-dark truncate">{item.name}</h4>
                          <p className="text-sm font-mono-brutal font-bold text-brand">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 border-[1.5px] border-dark bg-warm-light flex items-center justify-center hover:bg-cream transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-mono-brutal font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 border-[1.5px] border-dark bg-warm-light flex items-center justify-center hover:bg-cream transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-dark/30 hover:text-brand transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="h-[1.5px] bg-dark/15 my-4" />

                  {/* Totals */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark/50">Subtotal</span>
                      <span className="font-mono-brutal font-bold text-dark">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-herb flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Pickup &amp; Dine-In Promo (10%)
                        </span>
                        <span className="font-mono-brutal font-bold text-herb">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {isDelivery && (
                      <div className="flex justify-between">
                        <span className="text-dark/50">Delivery</span>
                        <span className="font-mono-brutal font-bold">
                          {deliveryFee === 0 ? (
                            <span className="text-herb">FREE</span>
                          ) : (
                            <span className="text-dark">${deliveryFee.toFixed(2)}</span>
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-dark/50">Tax</span>
                      <span className="font-mono-brutal font-bold text-dark">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="h-[1.5px] bg-dark/15 my-4" />

                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-dark">Total</span>
                    <span className="text-xl sm:text-2xl font-heading font-bold text-brand">${total.toFixed(2)}</span>
                  </div>

                  {/* Free Delivery Notice */}
                  {isDelivery && subtotal < 30 && (
                    <div className="mt-4 p-3 bg-golden/10 border-[1.5px] border-golden/40">
                      <p className="text-xs text-dark/70">
                        <Package className="w-4 h-4 inline mr-1.5 text-golden" />
                        Add ${(30 - subtotal).toFixed(2)} more for free delivery!
                      </p>
                    </div>
                  )}
                  {!isDelivery && orderingSettings.promoEnabled && (
                    <div className="mt-4 p-3 bg-herb/10 border-[1.5px] border-herb/40">
                      <p className="text-xs text-dark/70">
                        <Tag className="w-4 h-4 inline mr-1.5 text-herb" />
                        10% off applied for Pickup &amp; Dine-In orders!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
