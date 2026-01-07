'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  ChevronRight,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '../components/Navbar';

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

// Loading Skeleton
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F3]">
    <Navbar />
    <main className="pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-3 sm:py-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="container-custom py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <Card className="border border-gray-200 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
    return <ProfileSkeleton />;
  }

  if (!session) {
    return null;
  }

  const memberSince = profile ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }) : '';

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navbar />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-custom py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">My Profile</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    My Profile
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your account settings
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <Card className="border border-gray-200 shadow-sm mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                      {(formData.name || session?.user?.name || profile?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900 truncate">
                        {formData.name || session?.user?.name || 'User'}
                      </h2>
                      <p className="text-gray-500 text-sm truncate">{profile?.email || session?.user?.email}</p>
                      <Badge variant="secondary" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {profile && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-gray-500">Total Orders</span>
                    </div>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                      {profile._count.orders}
                    </span>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-gray-500">Member Since</span>
                    </div>
                    <span className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                      {memberSince}
                    </span>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl h-auto">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  onClick={() => setMessage(null)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile Info
                </TabsTrigger>
                <TabsTrigger 
                  value="password" 
                  className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  onClick={() => setMessage(null)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </TabsTrigger>
              </TabsList>

              {/* Profile Form */}
              <TabsContent value="profile">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* Email Field (Read-only) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="email"
                            value={profile?.email || session?.user?.email || ''}
                            className="pl-10 h-11 border-gray-200 bg-gray-50 text-gray-500"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* Address Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Delivery Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <textarea
                            name="address"
                            placeholder="123 Main St, City, State 12345"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white resize-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="w-full h-11 bg-primary hover:bg-primary/90"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Form */}
              <TabsContent value="password">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            placeholder="••••••••"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="••••••••"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">Must be at least 8 characters</p>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>
                        {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                          <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSaving || (passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword)}
                        className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Links */}
            <Card className="border border-gray-200 shadow-sm mt-6">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/orders"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          My Orders
                        </span>
                        <p className="text-xs text-gray-500">View order history</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>
                  <Link
                    href="/menu"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">🥟</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          Browse Menu
                        </span>
                        <p className="text-xs text-gray-500">Order delicious momos</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
