'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  User,
  Camera,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Upload,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch profile data
  useEffect(() => {
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

    fetchProfile();
  }, []);

  // Track changes
  useEffect(() => {
    if (profile) {
      const changed =
        formData.name !== (profile.name || '') ||
        formData.phone !== (profile.phone || '') ||
        formData.address !== (profile.address || '');
      setHasChanges(changed);
    }
  }, [formData, profile]);

  // Get initials from name or email
  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'AD';
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSaveMessage({ type: 'error', text: 'Please upload a valid image (JPG, PNG, GIF, or WebP)' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Image size should be less than 2MB' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsUploadingPhoto(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'avatar');

    try {
      // Upload to Cloudinary
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { url } = await uploadRes.json();

      // Update profile with new image
      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: url }),
      });

      if (!updateRes.ok) throw new Error('Failed to update profile');

      const updatedProfile = await updateRes.json();
      setProfile(updatedProfile);
      
      // Update session to reflect new image
      await updateSession({ image: url });

      setSaveMessage({ type: 'success', text: 'Profile photo updated!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setSaveMessage({ type: 'error', text: 'Failed to upload photo' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  // Handle form save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      
      // Update session if name changed
      if (formData.name !== session?.user?.name) {
        await updateSession({ name: formData.name });
      }

      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage({ type: 'error', text: 'Failed to update profile' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your admin profile
          </p>
        </div>
        {saveMessage && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              saveMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {saveMessage.text}
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        {/* Profile Header with gradient */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary via-orange-500 to-amber-500 relative">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        </div>

        <CardContent className="relative pt-0 pb-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16 mb-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={profile?.image || undefined} 
                  alt={profile?.name || 'Admin'} 
                />
                <AvatarFallback className="bg-primary text-white text-2xl sm:text-3xl font-heading">
                  {getInitials(profile?.name || null, profile?.email || null)}
                </AvatarFallback>
              </Avatar>
              
              {/* Upload overlay */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            <div className="text-center sm:text-left sm:pb-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                  {profile?.name || 'Admin User'}
                </h2>
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
            </div>

            <div className="sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <p className="font-semibold text-gray-900">
                {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mb-1">
                <ShoppingBag className="w-4 h-4" />
                Total Orders
              </div>
              <p className="font-semibold text-gray-900">
                {profile?._count?.orders || 0}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mb-1">
                <Mail className="w-4 h-4" />
                Email Status
              </div>
              <p className="font-semibold text-emerald-600 flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle className="w-4 h-4" />
                Verified
              </p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mb-1">
                <Shield className="w-4 h-4" />
                Account Type
              </div>
              <p className="font-semibold text-primary">Administrator</p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="h-11 pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your address"
                      className="pl-10 min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {hasChanges ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    You have unsaved changes
                  </span>
                ) : (
                  'All changes saved'
                )}
              </p>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card className="border-gray-100 shadow-sm pb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            Details about your admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Account ID</p>
              <p className="font-mono text-sm text-gray-900 truncate" title={profile?.id}>
                {profile?.id || 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {profile?.role || 'ADMIN'}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Login Method</p>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                {profile?.image?.includes('googleusercontent') ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Email & Password
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
