'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2, 
  ShoppingBag,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile');
    } else if (status === 'authenticated') {
      // Pre-fill with session data while loading
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          name: session.user.name || prev.name,
        }));
      }
      fetchProfile();
    }
  }, [status, router, session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/40 via-[#F4A261]/30 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#F4A261]/40 via-primary/30 to-transparent blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block mb-12">
              <div className="flex flex-col">
                <span className="font-heading text-3xl font-bold text-white">
                  Himalayan
                </span>
                <span className="font-accent text-xl text-[#F4A261] -mt-1">
                  Momos
                </span>
              </div>
            </Link>

            <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Your<br />
              <span className="text-primary">Profile</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Manage your account settings, update your information, and keep your preferences up to date.
            </p>

            {/* Stats */}
            {profile && (
              <div className="mt-12 grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="w-5 h-5 text-[#F4A261]" />
                    <span className="text-gray-400 text-sm">Total Orders</span>
                  </div>
                  <span className="text-white text-2xl font-bold">{profile._count.orders}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-[#F4A261]" />
                    <span className="text-gray-400 text-sm">Member Since</span>
                  </div>
                  <span className="text-white text-2xl font-bold">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex flex-col p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto"
        >
          {/* Back Button & Mobile Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="lg:hidden">
              <Link href="/" className="inline-block">
                <div className="flex flex-col items-end">
                  <span className="font-heading text-xl font-bold text-[#1A1A1A]">
                    Himalayan
                  </span>
                  <span className="font-accent text-sm text-primary -mt-1">
                    Momos
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* User Avatar & Name */}
          <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#F4A261] flex items-center justify-center text-white text-2xl font-bold">
              {(formData.name || session?.user?.name || profile?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1A1A1A]">
                {formData.name || session?.user?.name || 'User'}
              </h2>
              <p className="text-gray-500 text-sm">{profile?.email || session?.user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setActiveTab('profile');
                setMessage(null);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Info
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('password');
                setMessage(null);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'password'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </span>
            </button>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              {message.text}
            </motion.div>
          )}

          {/* Profile Form */}
          {activeTab === 'profile' && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleProfileSubmit}
              className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary bg-white"
                  />
                </div>
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={profile?.email || session?.user?.email || ''}
                    className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary bg-white"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    placeholder="123 Main St, City, State 12345"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white resize-none transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </span>
                )}
              </Button>
            </motion.form>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePasswordSubmit}
              className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary bg-white"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Must be at least 8 characters</p>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1A1A1A]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="pl-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary bg-white"
                    required
                  />
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSaving || passwordData.newPassword !== passwordData.confirmPassword}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Update Password
                  </span>
                )}
              </Button>
            </motion.form>
          )}

          {/* Quick Links */}
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/orders"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#FDF8F3] hover:bg-primary/10 transition-colors group"
              >
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="text-gray-700 group-hover:text-primary transition-colors">
                  View Orders
                </span>
              </Link>
              <Link
                href="/menu"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#FDF8F3] hover:bg-primary/10 transition-colors group"
              >
                <span className="text-xl">🥟</span>
                <span className="text-gray-700 group-hover:text-primary transition-colors">
                  Browse Menu
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
