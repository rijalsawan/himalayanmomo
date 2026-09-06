'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface SiteSettings {
  heroLogo: string;
  siteName: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({ heroLogo: '/brandlogo.svg', siteName: 'Himalayan Momos' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setError('Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-light flex">
      {/* Left Side - Decorative brutalist panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />

        {/* Offset accent blocks */}
        <div className="absolute -top-20 -right-20 w-72 h-72 border-brutal bg-brand/90 rotate-12" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 border-brutal bg-golden/80 -rotate-6" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-16 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-14 h-14 border-brutal bg-warm-light shadow-brutal-golden overflow-hidden group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform">
                <Image
                  src={settings.heroLogo || '/brandlogo.svg'}
                  alt="Logo"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-extrabold text-warm-light">
                  {settings.siteName?.split(' ')[0] || 'Himalayan'}
                </span>
                <span className="font-accent text-sm text-golden -mt-0.5">
                  {settings.siteName?.split(' ').slice(1).join(' ') || 'Momos'}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <span className="eyebrow-brutal">
              <Sparkles className="w-3.5 h-3.5" />
              Authentic flavors await
            </span>

            <h1 className="font-heading text-4xl xl:text-5xl font-extrabold text-warm-light leading-[1.05]">
              Welcome back to<br />
              <span className="font-accent text-golden">delicious moments</span>
            </h1>

            <p className="text-warm-light/60 text-lg max-w-sm leading-relaxed">
              Sign in to access your orders, save favorites, and enjoy exclusive member benefits.
            </p>
          </motion.div>

          {/* Bottom Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3"
          >
            {[
              'Quick & easy ordering',
              'Track orders in real-time',
              'Exclusive member rewards',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 border-[1.5px] border-warm-light/30 bg-warm-light/5 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-golden" />
                </div>
                <span className="text-warm-light/60 text-sm">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-warm-light">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-3 justify-center">
              <div className="relative w-11 h-11 border-brutal bg-white shadow-brutal-sm p-1.5">
                <Image
                  src={settings.heroLogo || '/brandlogo.svg'}
                  alt="Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-heading text-lg font-extrabold text-dark">
                  {settings.siteName?.split(' ')[0] || 'Himalayan'}
                </span>
                <span className="font-accent text-xs text-brand -mt-0.5">
                  {settings.siteName?.split(' ').slice(1).join(' ') || 'Momos'}
                </span>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <span className="eyebrow-brutal mb-4">Account Access</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-dark">
              Sign in to your account
            </h2>
            <p className="text-dark/60 mt-2 text-sm sm:text-base">
              Enter your credentials to continue
            </p>
          </div>

          {/* Success Message */}
          {registered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border-brutal-thin bg-herb/10 text-herb text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Account created successfully! Please sign in.
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border-brutal-thin bg-brand/10 text-brand text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-none border-brutal-thin focus-visible:border-brand focus-visible:ring-0 bg-white text-base placeholder:text-dark/30"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono-brutal text-xs font-bold uppercase tracking-wide text-dark">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:text-brand-dark transition-colors font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 pr-12 rounded-none border-brutal-thin focus-visible:border-brand focus-visible:ring-0 bg-white text-base placeholder:text-dark/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-none border-brutal bg-dark hover:bg-dark text-warm-light font-heading font-bold text-sm uppercase tracking-wide shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-[1.5px] border-dark/15"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-warm-light font-mono-brutal text-dark/40 text-[11px] uppercase tracking-[0.08em]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full h-12 rounded-none border-brutal-thin bg-white hover:bg-cream text-dark font-heading font-bold text-sm transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                Google
              </>
            )}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-dark/60 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-brand hover:text-brand-dark transition-colors font-bold"
            >
              Create one
            </Link>
          </p>

          {/* Back to Home */}
          <p className="text-center mt-4 text-dark/40 text-xs font-mono-brutal uppercase tracking-wide">
            <Link
              href="/"
              className="hover:text-dark transition-colors"
            >
              ← Back to Home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="min-h-screen bg-warm-light flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-brutal bg-cream flex items-center justify-center mx-auto mb-4 shadow-brutal-sm">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
        </div>
        <p className="text-dark/60 text-sm font-mono-brutal uppercase tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
