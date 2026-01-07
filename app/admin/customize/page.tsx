'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Layout,
  Award,
  Users,
  Clock,
  Timer,
  Star,
  Trophy,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Shield,
  ThumbsUp,
  CheckCircle,
  Save,
  Loader2,
  Eye,
  RotateCcw,
  AlertCircle,
  Upload,
  ImageIcon,
  X,
  Link as LinkIcon,
  BookOpen,
  UtensilsCrossed,
  Flame,
  Leaf,
  Plus,
  GripVertical,
  Search,
  ChefHat,
  ScrollText,
  Truck,
  Coffee,
  Utensils,
  MapPin,
  Phone,
  Mail,
  Globe,
  Package,
  Rocket,
  Smile,
  Gift,
  BadgeCheck,
  MessageSquare,
  Quote,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Info,
  Link,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

// Available icons for stats
const availableIcons = [
  { name: 'Award', icon: Award, label: 'Award' },
  { name: 'Users', icon: Users, label: 'Users' },
  { name: 'Clock', icon: Clock, label: 'Clock' },
  { name: 'Timer', icon: Timer, label: 'Timer' },
  { name: 'Star', icon: Star, label: 'Star' },
  { name: 'Trophy', icon: Trophy, label: 'Trophy' },
  { name: 'Heart', icon: Heart, label: 'Heart' },
  { name: 'Zap', icon: Zap, label: 'Zap' },
  { name: 'Target', icon: Target, label: 'Target' },
  { name: 'TrendingUp', icon: TrendingUp, label: 'Trending' },
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'Shield', icon: Shield, label: 'Shield' },
  { name: 'ThumbsUp', icon: ThumbsUp, label: 'Thumbs Up' },
  { name: 'CheckCircle', icon: CheckCircle, label: 'Check' },
];

// Available icons for Why Choose Us features
const featureIcons = [
  { name: 'ChefHat', icon: ChefHat, label: 'Chef Hat' },
  { name: 'ScrollText', icon: ScrollText, label: 'Recipe' },
  { name: 'Leaf', icon: Leaf, label: 'Fresh/Organic' },
  { name: 'Truck', icon: Truck, label: 'Delivery' },
  { name: 'Award', icon: Award, label: 'Award' },
  { name: 'Star', icon: Star, label: 'Star' },
  { name: 'Heart', icon: Heart, label: 'Heart' },
  { name: 'Clock', icon: Clock, label: 'Clock' },
  { name: 'Shield', icon: Shield, label: 'Quality' },
  { name: 'Sparkles', icon: Sparkles, label: 'Special' },
  { name: 'Coffee', icon: Coffee, label: 'Coffee' },
  { name: 'Utensils', icon: Utensils, label: 'Utensils' },
  { name: 'MapPin', icon: MapPin, label: 'Location' },
  { name: 'Phone', icon: Phone, label: 'Phone' },
  { name: 'Globe', icon: Globe, label: 'Global' },
  { name: 'Package', icon: Package, label: 'Package' },
  { name: 'Rocket', icon: Rocket, label: 'Fast' },
  { name: 'Smile', icon: Smile, label: 'Happy' },
  { name: 'Gift', icon: Gift, label: 'Gift' },
  { name: 'BadgeCheck', icon: BadgeCheck, label: 'Verified' },
  { name: 'Users', icon: Users, label: 'Community' },
  { name: 'Trophy', icon: Trophy, label: 'Trophy' },
  { name: 'Target', icon: Target, label: 'Target' },
  { name: 'ThumbsUp', icon: ThumbsUp, label: 'Thumbs Up' },
];

interface SiteSettings {
  id: string;
  heroBadgeText: string;
  heroHeadingLine1: string;
  heroHighlightText: string;
  heroHeadingLine2: string;
  heroDescription: string;
  heroLogo: string;
  stat1Icon: string;
  stat1Value: string;
  stat1Label: string;
  stat2Icon: string;
  stat2Value: string;
  stat2Label: string;
  stat3Icon: string;
  stat3Value: string;
  stat3Label: string;
  // About/Story Section
  aboutImage1: string;
  aboutImage2: string;
  aboutImage3: string;
  aboutBadgeNumber: string;
  aboutBadgeText: string;
  aboutSubtitle: string;
  aboutHeadline: string;
  aboutParagraph: string;
  aboutStat1Value: string;
  aboutStat1Label: string;
  aboutStat2Value: string;
  aboutStat2Label: string;
  aboutStat3Value: string;
  aboutStat3Label: string;
  aboutStat4Value: string;
  aboutStat4Label: string;
  // Popular Dishes
  popularDishIds: string[];
  // Why Choose Us Section
  whySubtitle: string;
  whyHeadline: string;
  whyHighlightText: string;
  whyDescription: string;
  whyCtaText: string;
  whyFeature1Icon: string;
  whyFeature1Title: string;
  whyFeature1Desc: string;
  whyFeature2Icon: string;
  whyFeature2Title: string;
  whyFeature2Desc: string;
  whyFeature3Icon: string;
  whyFeature3Title: string;
  whyFeature3Desc: string;
  whyFeature4Icon: string;
  whyFeature4Title: string;
  whyFeature4Desc: string;
  // Testimonials Stats
  testimonialStat1Icon: string;
  testimonialStat1Value: string;
  testimonialStat1Label: string;
  testimonialStat2Icon: string;
  testimonialStat2Value: string;
  testimonialStat2Label: string;
  testimonialStat3Icon: string;
  testimonialStat3Value: string;
  testimonialStat3Label: string;
}

// Menu item interface for selection
interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isPopular: boolean;
  isNew: boolean;
}

// Testimonial interface
interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  location: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const defaultTestimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  avatar: '',
  rating: 5,
  text: '',
  location: '',
  isActive: true,
  order: 0,
};

const defaultSettings: SiteSettings = {
  id: 'default',
  heroBadgeText: 'Authentic Nepali Mo:Mo',
  heroHeadingLine1: 'Taste the',
  heroHighlightText: 'Himalayan',
  heroHeadingLine2: 'Magic in Every Bite',
  heroDescription: 'Handcrafted momos made fresh daily using traditional family recipes passed down through generations. Experience the authentic flavors of Nepal.',
  heroLogo: '/brandlogo.svg',
  stat1Icon: 'Award',
  stat1Value: '15+',
  stat1Label: 'Years Experience',
  stat2Icon: 'Users',
  stat2Value: '50K+',
  stat2Label: 'Happy Customers',
  stat3Icon: 'Clock',
  stat3Value: '20min',
  stat3Label: 'Avg. Prep Time',
  // About/Story Section
  aboutImage1: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
  aboutImage2: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
  aboutImage3: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
  aboutBadgeNumber: '15+',
  aboutBadgeText: 'Years of Excellence',
  aboutSubtitle: 'Our Story',
  aboutHeadline: 'A Journey of Authentic Flavors',
  aboutParagraph: 'What started as a small family kitchen in the heart of Nepal has grown into a beloved destination for momo enthusiasts. Our founder, inspired by generations of family recipes, brought the authentic taste of Himalayan momos to share with the world.',
  aboutStat1Value: '15+',
  aboutStat1Label: 'Years',
  aboutStat2Value: '50K+',
  aboutStat2Label: 'Customers',
  aboutStat3Value: '25+',
  aboutStat3Label: 'Recipes',
  aboutStat4Value: '100%',
  aboutStat4Label: 'Fresh Daily',
  // Popular Dishes
  popularDishIds: [],
  // Why Choose Us Section
  whySubtitle: 'Why Choose Us',
  whyHeadline: 'What Makes Us',
  whyHighlightText: 'Special',
  whyDescription: "We're not just a restaurant — we're a family dedicated to bringing you the most authentic Nepali dining experience.",
  whyCtaText: 'Ready to experience the difference?',
  whyFeature1Icon: 'ChefHat',
  whyFeature1Title: 'Handmade Fresh Daily',
  whyFeature1Desc: 'Every momo is handcrafted by our skilled chefs each morning using traditional techniques.',
  whyFeature2Icon: 'ScrollText',
  whyFeature2Title: 'Authentic Family Recipes',
  whyFeature2Desc: 'Recipes passed down through generations, straight from the heart of Nepal.',
  whyFeature3Icon: 'Leaf',
  whyFeature3Title: 'Premium Ingredients',
  whyFeature3Desc: 'We source the freshest local ingredients and authentic Himalayan spices.',
  whyFeature4Icon: 'Truck',
  whyFeature4Title: 'Fast Delivery',
  whyFeature4Desc: 'Hot and fresh momos delivered to your doorstep in 30 minutes or less.',
  // Testimonials Stats
  testimonialStat1Icon: 'Users',
  testimonialStat1Value: '500+',
  testimonialStat1Label: 'Happy Customers',
  testimonialStat2Icon: 'Star',
  testimonialStat2Value: '4.9',
  testimonialStat2Label: 'Average Rating',
  testimonialStat3Icon: 'CheckCircle',
  testimonialStat3Value: '100%',
  testimonialStat3Label: 'Authentic Recipes',
};

export default function CustomizePage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Menu items for Popular Dishes selection
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'url'>('upload');
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  
  // Story section upload states
  const [isUploadingAboutImage1, setIsUploadingAboutImage1] = useState(false);
  const [isUploadingAboutImage2, setIsUploadingAboutImage2] = useState(false);
  const [isUploadingAboutImage3, setIsUploadingAboutImage3] = useState(false);
  const [aboutImage1Mode, setAboutImage1Mode] = useState<'upload' | 'url'>('upload');
  const [aboutImage2Mode, setAboutImage2Mode] = useState<'upload' | 'url'>('upload');
  const [aboutImage3Mode, setAboutImage3Mode] = useState<'upload' | 'url'>('upload');
  const aboutImage1Ref = useRef<HTMLInputElement>(null);
  const aboutImage2Ref = useRef<HTMLInputElement>(null);
  const aboutImage3Ref = useRef<HTMLInputElement>(null);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState(defaultTestimonial);
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);
  const [isDeletingTestimonial, setIsDeletingTestimonial] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarInputMode, setAvatarInputMode] = useState<'upload' | 'url'>('upload');
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
    fetchMenuItems();
    fetchTestimonials();
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/site-settings');
      if (res.ok) {
        const data = await res.json();
        // Ensure popularDishIds is always an array
        setSettings({
          ...data,
          popularDishIds: data.popularDishIds || [],
        });
        setOriginalSettings({
          ...data,
          popularDishIds: data.popularDishIds || [],
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    setIsLoadingMenu(true);
    try {
      const res = await fetch('/api/admin/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data.items || data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const fetchTestimonials = async () => {
    setIsLoadingTestimonials(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  const openNewTestimonialDialog = () => {
    setEditingTestimonial(null);
    setTestimonialForm(defaultTestimonial);
    setAvatarInputMode('upload');
    setIsTestimonialDialogOpen(true);
  };

  const openEditTestimonialDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      avatar: testimonial.avatar,
      rating: testimonial.rating,
      text: testimonial.text,
      location: testimonial.location || '',
      isActive: testimonial.isActive,
      order: testimonial.order,
    });
    setAvatarInputMode('url');
    setIsTestimonialDialogOpen(true);
  };

  const handleSaveTestimonial = async () => {
    if (!testimonialForm.name || !testimonialForm.text) {
      setSaveMessage({ type: 'error', text: 'Name and review text are required' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSavingTestimonial(true);
    try {
      const url = editingTestimonial 
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : '/api/admin/testimonials';
      
      const res = await fetch(url, {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testimonialForm.name,
          avatar: testimonialForm.avatar || '',
          rating: testimonialForm.rating,
          text: testimonialForm.text,
          location: testimonialForm.location || null,
          isActive: testimonialForm.isActive,
          order: testimonialForm.order,
        }),
      });

      if (res.ok) {
        await fetchTestimonials();
        setIsTestimonialDialogOpen(false);
        setTestimonialForm(defaultTestimonial);
        setSaveMessage({ 
          type: 'success', 
          text: editingTestimonial ? 'Testimonial updated!' : 'Testimonial created!' 
        });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Save testimonial error:', errorData);
        throw new Error(errorData.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save testimonial error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save testimonial' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    setIsDeletingTestimonial(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchTestimonials();
        setSaveMessage({ type: 'success', text: 'Testimonial deleted' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('Failed to delete');
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to delete testimonial' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsDeletingTestimonial(null);
    }
  };

  const handleToggleTestimonialActive = async (testimonial: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testimonial, isActive: !testimonial.isActive }),
      });

      if (res.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error('Error toggling testimonial:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setTestimonialForm(prev => ({ ...prev, avatar: data.url }));
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to upload image' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setOriginalSettings(data);
        setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setSaveMessage(null);
  };

  const handleResetToDefault = () => {
    setSettings(defaultSettings);
  };

  // Reset Story section to defaults
  const handleResetStoryToDefault = () => {
    setSettings(prev => ({
      ...prev,
      aboutImage1: defaultSettings.aboutImage1,
      aboutImage2: defaultSettings.aboutImage2,
      aboutImage3: defaultSettings.aboutImage3,
      aboutBadgeNumber: defaultSettings.aboutBadgeNumber,
      aboutBadgeText: defaultSettings.aboutBadgeText,
      aboutSubtitle: defaultSettings.aboutSubtitle,
      aboutHeadline: defaultSettings.aboutHeadline,
      aboutParagraph: defaultSettings.aboutParagraph,
      aboutStat1Value: defaultSettings.aboutStat1Value,
      aboutStat1Label: defaultSettings.aboutStat1Label,
      aboutStat2Value: defaultSettings.aboutStat2Value,
      aboutStat2Label: defaultSettings.aboutStat2Label,
      aboutStat3Value: defaultSettings.aboutStat3Value,
      aboutStat3Label: defaultSettings.aboutStat3Label,
      aboutStat4Value: defaultSettings.aboutStat4Value,
      aboutStat4Label: defaultSettings.aboutStat4Label,
    }));
  };

  // Reset Why Choose Us section to defaults
  const handleResetWhyToDefault = () => {
    setSettings(prev => ({
      ...prev,
      whySubtitle: defaultSettings.whySubtitle,
      whyHeadline: defaultSettings.whyHeadline,
      whyHighlightText: defaultSettings.whyHighlightText,
      whyDescription: defaultSettings.whyDescription,
      whyCtaText: defaultSettings.whyCtaText,
      whyFeature1Icon: defaultSettings.whyFeature1Icon,
      whyFeature1Title: defaultSettings.whyFeature1Title,
      whyFeature1Desc: defaultSettings.whyFeature1Desc,
      whyFeature2Icon: defaultSettings.whyFeature2Icon,
      whyFeature2Title: defaultSettings.whyFeature2Title,
      whyFeature2Desc: defaultSettings.whyFeature2Desc,
      whyFeature3Icon: defaultSettings.whyFeature3Icon,
      whyFeature3Title: defaultSettings.whyFeature3Title,
      whyFeature3Desc: defaultSettings.whyFeature3Desc,
      whyFeature4Icon: defaultSettings.whyFeature4Icon,
      whyFeature4Title: defaultSettings.whyFeature4Title,
      whyFeature4Desc: defaultSettings.whyFeature4Desc,
    }));
  };

  const updateSetting = (key: keyof SiteSettings, value: string | string[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Popular dishes management
  const togglePopularDish = (itemId: string) => {
    const currentIds = settings.popularDishIds || [];
    if (currentIds.includes(itemId)) {
      // Remove from selection
      updateSetting('popularDishIds', currentIds.filter(id => id !== itemId));
    } else if (currentIds.length < 6) {
      // Add to selection (max 6)
      updateSetting('popularDishIds', [...currentIds, itemId]);
    } else {
      setSaveMessage({ type: 'error', text: 'Maximum 6 dishes can be selected' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const removePopularDish = (itemId: string) => {
    const currentIds = settings.popularDishIds || [];
    updateSetting('popularDishIds', currentIds.filter(id => id !== itemId));
  };

  const movePopularDish = (itemId: string, direction: 'up' | 'down') => {
    const currentIds = [...(settings.popularDishIds || [])];
    const index = currentIds.indexOf(itemId);
    if (direction === 'up' && index > 0) {
      [currentIds[index], currentIds[index - 1]] = [currentIds[index - 1], currentIds[index]];
      updateSetting('popularDishIds', currentIds);
    } else if (direction === 'down' && index < currentIds.length - 1) {
      [currentIds[index], currentIds[index + 1]] = [currentIds[index + 1], currentIds[index]];
      updateSetting('popularDishIds', currentIds);
    }
  };

  const getSelectedMenuItems = () => {
    return (settings.popularDishIds || [])
      .map(id => menuItems.find(item => item.id === id))
      .filter((item): item is MenuItem => item !== undefined);
  };

  const getIconComponent = (iconName: string) => {
    const found = availableIcons.find(i => i.name === iconName);
    return found ? found.icon : Award;
  };

  // Handle logo file upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateSetting('heroLogo', data.url);
        setSaveMessage({ type: 'success', text: 'Logo uploaded successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        const error = await response.json();
        setSaveMessage({ type: 'error', text: error.error || 'Failed to upload logo' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to upload logo' });
    } finally {
      setIsUploadingLogo(false);
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  // Remove logo and reset to default
  const handleRemoveLogo = () => {
    updateSetting('heroLogo', '/brandlogo.svg');
  };

  // Handle About section image upload
  const handleAboutImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: 'aboutImage1' | 'aboutImage2' | 'aboutImage3',
    setUploading: (val: boolean) => void,
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateSetting(imageKey, data.url);
        setSaveMessage({ type: 'success', text: 'Image uploaded successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        const error = await response.json();
        setSaveMessage({ type: 'error', text: error.error || 'Failed to upload image' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
      if (ref.current) {
        ref.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            Customize
          </h1>
          <p className="text-gray-500 mt-1">
            Personalize your landing page content and appearance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview Site</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
          <TabsTrigger
            value="hero"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Hero Section</span>
          </TabsTrigger>
          <TabsTrigger
            value="story"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Our Story</span>
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span className="hidden sm:inline">Popular Dishes</span>
          </TabsTrigger>
          <TabsTrigger
            value="whychoose"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Why Choose Us</span>
          </TabsTrigger>
          <TabsTrigger
            value="testimonials"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Testimonials</span>
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          {/* Hero Text Content */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Hero Content</CardTitle>
              <CardDescription>Customize the main headline and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badge Text */}
              <div>
                <Label htmlFor="heroBadgeText">Badge Text</Label>
                <Input
                  id="heroBadgeText"
                  value={settings.heroBadgeText}
                  onChange={(e) => updateSetting('heroBadgeText', e.target.value)}
                  placeholder="e.g., Authentic Nepali Mo:Mo"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The small badge shown above the main headline
                </p>
              </div>

              <Separator />

              {/* Headline */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Main Headline</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="heroHeadingLine1" className="text-xs text-gray-500">
                      Line 1 (before highlight)
                    </Label>
                    <Input
                      id="heroHeadingLine1"
                      value={settings.heroHeadingLine1}
                      onChange={(e) => updateSetting('heroHeadingLine1', e.target.value)}
                      placeholder="e.g., Taste the"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroHighlightText" className="text-xs text-gray-500">
                      Highlighted Word (orange)
                    </Label>
                    <Input
                      id="heroHighlightText"
                      value={settings.heroHighlightText}
                      onChange={(e) => updateSetting('heroHighlightText', e.target.value)}
                      placeholder="e.g., Himalayan"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroHeadingLine2" className="text-xs text-gray-500">
                      Line 2 (after highlight)
                    </Label>
                    <Input
                      id="heroHeadingLine2"
                      value={settings.heroHeadingLine2}
                      onChange={(e) => updateSetting('heroHeadingLine2', e.target.value)}
                      placeholder="e.g., Magic in Every Bite"
                      className="mt-1"
                    />
                  </div>
                </div>
                {/* Preview */}
                <div className="p-4 bg-[#FDF8F3] rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                    {settings.heroHeadingLine1}{' '}
                    <span className="text-primary">{settings.heroHighlightText}</span>
                    <br />
                    {settings.heroHeadingLine2}
                  </h2>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  value={settings.heroDescription}
                  onChange={(e) => updateSetting('heroDescription', e.target.value)}
                  placeholder="Enter the hero section description..."
                  rows={3}
                  className="mt-1 resize-none"
                />
                
              </div>
            </CardContent>
          </Card>

          {/* Hero Logo */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Brand Logo</CardTitle>
              <CardDescription>Upload your custom logo for the hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Logo Preview */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Current Logo</Label>
                  <div className="relative aspect-square max-w-[200px] rounded-2xl bg-[#FDF8F3] border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                    {settings.heroLogo ? (
                      <>
                        <Image
                          src={settings.heroLogo}
                          alt="Hero Logo"
                          fill
                          className="object-contain p-4"
                        />
                        {settings.heroLogo !== '/brandlogo.svg' && (
                          <button
                            onClick={handleRemoveLogo}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No logo uploaded</p>
                      </div>
                    )}
                  </div>
                  {settings.heroLogo !== '/brandlogo.svg' && (
                    <p className="text-xs text-gray-500">Click the X to reset to default logo</p>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={logoInputMode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLogoInputMode('upload')}
                      className={logoInputMode === 'upload' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={logoInputMode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLogoInputMode('url')}
                      className={logoInputMode === 'url' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL
                    </Button>
                  </div>

                  {logoInputMode === 'upload' ? (
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          isUploadingLogo
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }`}
                      >
                        {isUploadingLogo ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <span className="text-sm text-gray-500">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-600">
                              Click to upload logo
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG, SVG, WebP (max 5MB)
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="logoUrl" className="text-xs text-gray-500">
                        Enter logo URL
                      </Label>
                      <Input
                        id="logoUrl"
                        type="url"
                        value={settings.heroLogo}
                        onChange={(e) => updateSetting('heroLogo', e.target.value)}
                        placeholder="https://example.com/logo.png"
                      />
                      <p className="text-xs text-gray-500">
                        Enter a direct URL to your logo image
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700">
                      <strong>Tip:</strong> For best results, use a square or circular logo with a transparent background. SVG format is recommended for crisp display at all sizes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Preview in Hero</Label>
                <div className="p-6 bg-[#FDF8F3] rounded-xl">
                  <div className="relative mx-auto w-[150px] h-[150px]">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />
                    <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300/20" />
                    {/* Logo container */}
                    <div className="absolute inset-4 rounded-full overflow-hidden shadow-lg bg-white flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src={settings.heroLogo || '/brandlogo.svg'}
                          alt="Logo Preview"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Stats */}
          <Card className="border-gray-100 shadow-sm pb-4">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Statistics</CardTitle>
              <CardDescription>Customize the stats displayed in the hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stat 1 */}
              <div className="p-4  rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Stat 1</Label>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {(() => {
                      const IconComp = getIconComponent(settings.stat1Icon);
                      return <IconComp className="w-5 h-5 text-primary" />;
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.stat1Icon}
                      onValueChange={(value) => updateSetting('stat1Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input
                      value={settings.stat1Value}
                      onChange={(e) => updateSetting('stat1Value', e.target.value)}
                      placeholder="e.g., 15+"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                      value={settings.stat1Label}
                      onChange={(e) => updateSetting('stat1Label', e.target.value)}
                      placeholder="e.g., Years Experience"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Stat 2</Label>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {(() => {
                      const IconComp = getIconComponent(settings.stat2Icon);
                      return <IconComp className="w-5 h-5 text-primary" />;
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.stat2Icon}
                      onValueChange={(value) => updateSetting('stat2Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input
                      value={settings.stat2Value}
                      onChange={(e) => updateSetting('stat2Value', e.target.value)}
                      placeholder="e.g., 50K+"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                      value={settings.stat2Label}
                      onChange={(e) => updateSetting('stat2Label', e.target.value)}
                      placeholder="e.g., Happy Customers"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4  rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Stat 3</Label>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {(() => {
                      const IconComp = getIconComponent(settings.stat3Icon);
                      return <IconComp className="w-5 h-5 text-primary" />;
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.stat3Icon}
                      onValueChange={(value) => updateSetting('stat3Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input
                      value={settings.stat3Value}
                      onChange={(e) => updateSetting('stat3Value', e.target.value)}
                      placeholder="e.g., 20min"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                      value={settings.stat3Label}
                      onChange={(e) => updateSetting('stat3Label', e.target.value)}
                      placeholder="e.g., Avg. Prep Time"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="p-4 bg-[#FDF8F3] rounded-xl">
                <p className="text-xs text-gray-500 mb-4">Preview:</p>
                <div className="flex flex-wrap gap-6 sm:gap-10">
                  {[
                    { icon: settings.stat1Icon, value: settings.stat1Value, label: settings.stat1Label },
                    { icon: settings.stat2Icon, value: settings.stat2Value, label: settings.stat2Label },
                    { icon: settings.stat3Icon, value: settings.stat3Value, label: settings.stat3Label },
                  ].map((stat, index) => {
                    const IconComp = getIconComponent(stat.icon);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A]/5 flex items-center justify-center">
                          <IconComp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-[#1A1A1A] font-heading">
                            {stat.value || '—'}
                          </div>
                          <div className="text-gray-500 text-sm">{stat.label || 'Label'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleResetToDefault}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                Discard Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Story Section Tab */}
        <TabsContent value="story" className="space-y-6">
          {/* Story Images */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Story Images</CardTitle>
              <CardDescription>Upload 3 images for the About section gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image 1 - Main Large Image */}
                <div className="lg:col-span-2 space-y-4">
                  <Label className="text-sm font-medium">Main Image (Large)</Label>
                  <div className="relative aspect-video rounded-2xl bg-[#FDF8F3] border-2 border-dashed border-gray-200 overflow-hidden">
                    {settings.aboutImage1 ? (
                      <>
                        <Image
                          src={settings.aboutImage1}
                          alt="Story Image 1"
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => updateSetting('aboutImage1', '')}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">No image uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={aboutImage1Mode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAboutImage1Mode('upload')}
                      className={aboutImage1Mode === 'upload' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={aboutImage1Mode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAboutImage1Mode('url')}
                      className={aboutImage1Mode === 'url' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL
                    </Button>
                  </div>
                  {aboutImage1Mode === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        ref={aboutImage1Ref}
                        onChange={(e) => handleAboutImageUpload(e, 'aboutImage1', setIsUploadingAboutImage1, aboutImage1Ref)}
                        accept="image/*"
                        className="hidden"
                        id="about-image-1"
                      />
                      <label
                        htmlFor="about-image-1"
                        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          isUploadingAboutImage1
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }`}
                      >
                        {isUploadingAboutImage1 ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <span className="text-sm text-gray-500">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">Click to upload main image</span>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <Input
                      type="url"
                      value={settings.aboutImage1}
                      onChange={(e) => updateSetting('aboutImage1', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  )}
                </div>

                {/* Image 2 & 3 - Smaller Images */}
                <div className="space-y-4">
                  {/* Image 2 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Secondary Image 1</Label>
                    <div className="relative aspect-square rounded-2xl bg-[#FDF8F3] border-2 border-dashed border-gray-200 overflow-hidden">
                      {settings.aboutImage2 ? (
                        <>
                          <Image
                            src={settings.aboutImage2}
                            alt="Story Image 2"
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => updateSetting('aboutImage2', '')}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={aboutImage2Mode === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAboutImage2Mode('upload')}
                        className={`flex-1 ${aboutImage2Mode === 'upload' ? 'bg-primary hover:bg-primary/90' : ''}`}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant={aboutImage2Mode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAboutImage2Mode('url')}
                        className={`flex-1 ${aboutImage2Mode === 'url' ? 'bg-primary hover:bg-primary/90' : ''}`}
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        URL
                      </Button>
                    </div>
                    {aboutImage2Mode === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          ref={aboutImage2Ref}
                          onChange={(e) => handleAboutImageUpload(e, 'aboutImage2', setIsUploadingAboutImage2, aboutImage2Ref)}
                          accept="image/*"
                          className="hidden"
                          id="about-image-2"
                        />
                        <label
                          htmlFor="about-image-2"
                          className={`flex items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                            isUploadingAboutImage2
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                          }`}
                        >
                          {isUploadingAboutImage2 ? (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 text-gray-400" />
                          )}
                        </label>
                      </div>
                    ) : (
                      <Input
                        type="url"
                        value={settings.aboutImage2}
                        onChange={(e) => updateSetting('aboutImage2', e.target.value)}
                        placeholder="Image URL"
                        className="text-sm"
                      />
                    )}
                  </div>

                  {/* Image 3 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Secondary Image 2</Label>
                    <div className="relative aspect-square rounded-2xl bg-[#FDF8F3] border-2 border-dashed border-gray-200 overflow-hidden">
                      {settings.aboutImage3 ? (
                        <>
                          <Image
                            src={settings.aboutImage3}
                            alt="Story Image 3"
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => updateSetting('aboutImage3', '')}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={aboutImage3Mode === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAboutImage3Mode('upload')}
                        className={`flex-1 ${aboutImage3Mode === 'upload' ? 'bg-primary hover:bg-primary/90' : ''}`}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant={aboutImage3Mode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAboutImage3Mode('url')}
                        className={`flex-1 ${aboutImage3Mode === 'url' ? 'bg-primary hover:bg-primary/90' : ''}`}
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        URL
                      </Button>
                    </div>
                    {aboutImage3Mode === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          ref={aboutImage3Ref}
                          onChange={(e) => handleAboutImageUpload(e, 'aboutImage3', setIsUploadingAboutImage3, aboutImage3Ref)}
                          accept="image/*"
                          className="hidden"
                          id="about-image-3"
                        />
                        <label
                          htmlFor="about-image-3"
                          className={`flex items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                            isUploadingAboutImage3
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                          }`}
                        >
                          {isUploadingAboutImage3 ? (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 text-gray-400" />
                          )}
                        </label>
                      </div>
                    ) : (
                      <Input
                        type="url"
                        value={settings.aboutImage3}
                        onChange={(e) => updateSetting('aboutImage3', e.target.value)}
                        placeholder="Image URL"
                        className="text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Image Layout Preview */}
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Layout Preview</Label>
                <div className="p-6 bg-[#FDF8F3] rounded-xl">
                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                    <div className="col-span-2 row-span-2 aspect-video rounded-xl bg-white shadow-sm overflow-hidden relative">
                      {settings.aboutImage1 ? (
                        <Image src={settings.aboutImage1} alt="Main" fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Main Image</span>
                        </div>
                      )}
                      {/* Badge Preview */}
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-xl p-2 shadow-lg">
                        <div className="text-sm font-bold">{settings.aboutBadgeNumber || '15+'}</div>
                        <div className="text-[8px]">{settings.aboutBadgeText || 'Years'}</div>
                      </div>
                    </div>
                    <div className="aspect-square rounded-xl bg-white shadow-sm overflow-hidden relative">
                      {settings.aboutImage2 ? (
                        <Image src={settings.aboutImage2} alt="Secondary 1" fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] text-gray-400">Image 2</span>
                        </div>
                      )}
                    </div>
                    <div className="aspect-square rounded-xl bg-white shadow-sm overflow-hidden relative">
                      {settings.aboutImage3 ? (
                        <Image src={settings.aboutImage3} alt="Secondary 2" fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] text-gray-400">Image 3</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Badge */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Experience Badge</CardTitle>
              <CardDescription>The floating badge that appears on the image gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="aboutBadgeNumber">Badge Number</Label>
                  <Input
                    id="aboutBadgeNumber"
                    value={settings.aboutBadgeNumber}
                    onChange={(e) => updateSetting('aboutBadgeNumber', e.target.value)}
                    placeholder="e.g., 15+"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">The prominent number (e.g., 15+)</p>
                </div>
                <div>
                  <Label htmlFor="aboutBadgeText">Badge Text</Label>
                  <Input
                    id="aboutBadgeText"
                    value={settings.aboutBadgeText}
                    onChange={(e) => updateSetting('aboutBadgeText', e.target.value)}
                    placeholder="e.g., Years of Excellence"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Description below the number</p>
                </div>
              </div>
              {/* Badge Preview */}
              <div className="p-4 bg-[#FDF8F3] rounded-xl">
                <p className="text-xs text-gray-500 mb-3">Preview:</p>
                <div className="flex justify-center">
                  <div className="bg-primary text-white rounded-2xl px-6 py-4 shadow-xl">
                    <div className="text-3xl font-bold font-heading">{settings.aboutBadgeNumber || '15+'}</div>
                    <div className="text-sm opacity-90">{settings.aboutBadgeText || 'Years of Excellence'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Content */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Story Content</CardTitle>
              <CardDescription>Customize the text content of your About section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="aboutSubtitle">Subtitle</Label>
                <Input
                  id="aboutSubtitle"
                  value={settings.aboutSubtitle}
                  onChange={(e) => updateSetting('aboutSubtitle', e.target.value)}
                  placeholder="e.g., Our Story"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">The small text above the headline</p>
              </div>

              <Separator />

              <div>
                <Label htmlFor="aboutHeadline">Headline</Label>
                <Input
                  id="aboutHeadline"
                  value={settings.aboutHeadline}
                  onChange={(e) => updateSetting('aboutHeadline', e.target.value)}
                  placeholder="e.g., A Journey of Authentic Flavors"
                  className="mt-1"
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="aboutParagraph">Story Paragraph</Label>
                <Textarea
                  id="aboutParagraph"
                  value={settings.aboutParagraph}
                  onChange={(e) => updateSetting('aboutParagraph', e.target.value)}
                  placeholder="Tell your story..."
                  rows={4}
                  className="mt-1 resize-none"
                />
              </div>

              {/* Content Preview */}
              <div className="p-4 bg-[#FDF8F3] rounded-xl">
                <p className="text-xs text-gray-500 mb-3">Preview:</p>
                <div className="space-y-3">
                  <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {settings.aboutSubtitle || 'Our Story'}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-[#1A1A1A]">
                    {settings.aboutHeadline || 'A Journey of Authentic Flavors'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {settings.aboutParagraph || 'Your story will appear here...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Stats */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Story Statistics</CardTitle>
              <CardDescription>4 key stats displayed at the bottom of the About section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stat 1 */}
                <div className="p-4  rounded-xl space-y-3">
                  <Label className="font-medium">Stat 1</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Value</Label>
                      <Input
                        value={settings.aboutStat1Value}
                        onChange={(e) => updateSetting('aboutStat1Value', e.target.value)}
                        placeholder="e.g., 15+"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Label</Label>
                      <Input
                        value={settings.aboutStat1Label}
                        onChange={(e) => updateSetting('aboutStat1Label', e.target.value)}
                        placeholder="e.g., Years"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-4  rounded-xl space-y-3">
                  <Label className="font-medium">Stat 2</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Value</Label>
                      <Input
                        value={settings.aboutStat2Value}
                        onChange={(e) => updateSetting('aboutStat2Value', e.target.value)}
                        placeholder="e.g., 50K+"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Label</Label>
                      <Input
                        value={settings.aboutStat2Label}
                        onChange={(e) => updateSetting('aboutStat2Label', e.target.value)}
                        placeholder="e.g., Customers"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="p-4  rounded-xl space-y-3">
                  <Label className="font-medium">Stat 3</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Value</Label>
                      <Input
                        value={settings.aboutStat3Value}
                        onChange={(e) => updateSetting('aboutStat3Value', e.target.value)}
                        placeholder="e.g., 25+"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Label</Label>
                      <Input
                        value={settings.aboutStat3Label}
                        onChange={(e) => updateSetting('aboutStat3Label', e.target.value)}
                        placeholder="e.g., Recipes"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="p-4  rounded-xl space-y-3">
                  <Label className="font-medium">Stat 4</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Value</Label>
                      <Input
                        value={settings.aboutStat4Value}
                        onChange={(e) => updateSetting('aboutStat4Value', e.target.value)}
                        placeholder="e.g., 100%"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Label</Label>
                      <Input
                        value={settings.aboutStat4Label}
                        onChange={(e) => updateSetting('aboutStat4Label', e.target.value)}
                        placeholder="e.g., Fresh Daily"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-4">Preview:</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: settings.aboutStat1Value, label: settings.aboutStat1Label },
                    { value: settings.aboutStat2Value, label: settings.aboutStat2Label },
                    { value: settings.aboutStat3Value, label: settings.aboutStat3Label },
                    { value: settings.aboutStat4Value, label: settings.aboutStat4Label },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-3 rounded-xl">
                      <div className="text-xl font-bold text-primary font-heading">
                        {stat.value || '—'}
                      </div>
                      <div className="text-xs text-gray-500">{stat.label || 'Label'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleResetStoryToDefault}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                Discard Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Popular Dishes Tab */}
        <TabsContent value="popular" className="space-y-6">
          {/* Dish Selection */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="font-heading text-lg">Featured Dishes</CardTitle>
                  <CardDescription>
                    Select 6 dishes to showcase on your homepage
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-sm px-3 py-1 ${
                    (settings.popularDishIds?.length || 0) === 6 
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50' 
                      : 'border-primary text-primary'
                  }`}
                >
                  {settings.popularDishIds?.length || 0} / 6 selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingMenu ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
                    const selectedId = settings.popularDishIds?.[slotIndex];
                    const selectedItem = selectedId ? menuItems.find(item => item.id === selectedId) : null;
                    const usedIds = settings.popularDishIds || [];
                    const availableItems = menuItems.filter(item => !usedIds.includes(item.id) || item.id === selectedId);
                    
                    return (
                      <div key={slotIndex} className="relative">
                        <Label className="text-xs text-gray-500 mb-2 block">
                          Dish {slotIndex + 1}
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={selectedId || ''}
                            onValueChange={(value) => {
                              const newIds = [...(settings.popularDishIds || [])];
                              if (value === '__clear__') {
                                // Remove from this slot
                                newIds.splice(slotIndex, 1);
                              } else if (selectedId) {
                                // Replace existing
                                newIds[slotIndex] = value;
                              } else {
                                // Add new (ensure it goes to the right position)
                                while (newIds.length < slotIndex) {
                                  newIds.push('');
                                }
                                newIds[slotIndex] = value;
                              }
                              // Filter out empty strings and update
                              updateSetting('popularDishIds', newIds.filter(id => id !== ''));
                            }}
                          >
                            <SelectTrigger className={`flex-1 h-auto min-h-[56px] ${selectedItem ? 'pr-2' : ''}`}>
                              <SelectValue placeholder="Select a dish...">
                                {selectedItem ? (
                                  <div className="flex items-center gap-3 py-1">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image 
                                        src={selectedItem.image} 
                                        alt={selectedItem.name} 
                                        fill 
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-sm truncate">{selectedItem.name}</span>
                                        {selectedItem.isVegetarian && (
                                          <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="capitalize">{selectedItem.category}</span>
                                        <span>•</span>
                                        <span className="font-semibold text-primary">${selectedItem.price.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Select a dish...</span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {selectedId && (
                                <SelectItem value="__clear__" className="text-gray-400">
                                  <span className="flex items-center gap-2">
                                    <X className="w-4 h-4" />
                                    Clear selection
                                  </span>
                                </SelectItem>
                              )}
                              {availableItems.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  <div className="flex items-center gap-3 py-1">
                                    <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                                      <Image 
                                        src={item.image} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-sm">{item.name}</span>
                                        {item.isVegetarian && (
                                          <Leaf className="w-3 h-3 text-emerald-600" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="capitalize">{item.category}</span>
                                        <span>•</span>
                                        <span className="text-primary font-medium">${item.price.toFixed(2)}</span>
                                        {item.spiceLevel > 0 && (
                                          <>
                                            <span>•</span>
                                            <div className="flex items-center">
                                              {[1, 2, 3].map((i) => (
                                                <Flame
                                                  key={i}
                                                  className={`w-2.5 h-2.5 ${
                                                    i <= item.spiceLevel 
                                                      ? 'text-red-500 fill-red-500' 
                                                      : 'text-gray-300'
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Preview</CardTitle>
              <CardDescription>How your selected dishes will appear on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-warm-light rounded-xl">
                {(settings.popularDishIds?.length || 0) === 0 ? (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">Select dishes to see the preview</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getSelectedMenuItems().map((item, index) => (
                      <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative aspect-[4/3]">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <Badge className="bg-primary text-white text-[10px]">
                              <Star className="w-2.5 h-2.5 mr-1 fill-white" />
                              Popular
                            </Badge>
                            {item.isVegetarian && (
                              <Badge className="bg-emerald-600 text-white text-[10px]">
                                <Leaf className="w-2.5 h-2.5" />
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 text-primary flex items-center justify-center text-xs font-bold shadow">
                            {index + 1}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm text-dark truncate">{item.name}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-primary font-bold text-sm">${item.price.toFixed(2)}</p>
                            {item.spiceLevel > 0 && (
                              <div className="flex items-center">
                                {[1, 2, 3].map((i) => (
                                  <Flame
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i <= item.spiceLevel 
                                        ? 'text-red-500 fill-red-500' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => updateSetting('popularDishIds', [])}
              className="gap-2"
              disabled={(settings.popularDishIds?.length || 0) === 0}
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                Discard Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Why Choose Us Tab */}
        <TabsContent value="whychoose" className="space-y-6">
          {/* Section Header */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Section Header</CardTitle>
              <CardDescription>Customize the main heading and description for this section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subtitle */}
              <div>
                <Label htmlFor="whySubtitle">Subtitle</Label>
                <Input
                  id="whySubtitle"
                  value={settings.whySubtitle}
                  onChange={(e) => updateSetting('whySubtitle', e.target.value)}
                  placeholder="e.g., Why Choose Us"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Small text displayed above the headline
                </p>
              </div>

              <Separator />

              {/* Headline */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Main Headline</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whyHeadline" className="text-xs text-gray-500">First Part</Label>
                    <Input
                      id="whyHeadline"
                      value={settings.whyHeadline}
                      onChange={(e) => updateSetting('whyHeadline', e.target.value)}
                      placeholder="e.g., What Makes Us"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whyHighlightText" className="text-xs text-gray-500">Highlighted Text</Label>
                    <Input
                      id="whyHighlightText"
                      value={settings.whyHighlightText}
                      onChange={(e) => updateSetting('whyHighlightText', e.target.value)}
                      placeholder="e.g., Special"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">This text will have a gradient effect</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <Label htmlFor="whyDescription">Description</Label>
                <Textarea
                  id="whyDescription"
                  value={settings.whyDescription}
                  onChange={(e) => updateSetting('whyDescription', e.target.value)}
                  placeholder="Enter the section description..."
                  className="mt-1 min-h-[80px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supporting text displayed below the headline
                </p>
              </div>

              <Separator />

              {/* CTA Text */}
              <div>
                <Label htmlFor="whyCtaText">Call-to-Action Text</Label>
                <Input
                  id="whyCtaText"
                  value={settings.whyCtaText}
                  onChange={(e) => updateSetting('whyCtaText', e.target.value)}
                  placeholder="e.g., Ready to experience the difference?"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Text displayed above the action buttons
                </p>
              </div>

              {/* Header Preview */}
              <div className="p-4 bg-dark rounded-xl mt-4">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Preview</p>
                <div className="text-center">
                  <span className="text-primary font-medium text-xs uppercase tracking-widest">
                    {settings.whySubtitle || 'Why Choose Us'}
                  </span>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-2">
                    {settings.whyHeadline || 'What Makes Us'}{' '}
                    <span className="text-primary">{settings.whyHighlightText || 'Special'}</span>
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
                    {settings.whyDescription || "We're not just a restaurant..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Features</CardTitle>
              <CardDescription>Customize the 4 feature cards displayed in this section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feature 1 */}
              <div className="p-4 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Feature 1</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.whyFeature1Icon}
                      onValueChange={(value) => updateSetting('whyFeature1Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const iconData = featureIcons.find(i => i.name === settings.whyFeature1Icon);
                              const Icon = iconData?.icon || ChefHat;
                              return (
                                <>
                                  <Icon className="w-4 h-4" />
                                  <span>{iconData?.label || 'Chef Hat'}</span>
                                </>
                              );
                            })()}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {featureIcons.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-500">Title</Label>
                    <Input
                      value={settings.whyFeature1Title}
                      onChange={(e) => updateSetting('whyFeature1Title', e.target.value)}
                      placeholder="Feature title"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Description</Label>
                  <Textarea
                    value={settings.whyFeature1Desc}
                    onChange={(e) => updateSetting('whyFeature1Desc', e.target.value)}
                    placeholder="Feature description"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Feature 2</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.whyFeature2Icon}
                      onValueChange={(value) => updateSetting('whyFeature2Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const iconData = featureIcons.find(i => i.name === settings.whyFeature2Icon);
                              const Icon = iconData?.icon || ScrollText;
                              return (
                                <>
                                  <Icon className="w-4 h-4" />
                                  <span>{iconData?.label || 'Recipe'}</span>
                                </>
                              );
                            })()}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {featureIcons.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-500">Title</Label>
                    <Input
                      value={settings.whyFeature2Title}
                      onChange={(e) => updateSetting('whyFeature2Title', e.target.value)}
                      placeholder="Feature title"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Description</Label>
                  <Textarea
                    value={settings.whyFeature2Desc}
                    onChange={(e) => updateSetting('whyFeature2Desc', e.target.value)}
                    placeholder="Feature description"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Feature 3</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.whyFeature3Icon}
                      onValueChange={(value) => updateSetting('whyFeature3Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const iconData = featureIcons.find(i => i.name === settings.whyFeature3Icon);
                              const Icon = iconData?.icon || Leaf;
                              return (
                                <>
                                  <Icon className="w-4 h-4" />
                                  <span>{iconData?.label || 'Fresh/Organic'}</span>
                                </>
                              );
                            })()}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {featureIcons.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-500">Title</Label>
                    <Input
                      value={settings.whyFeature3Title}
                      onChange={(e) => updateSetting('whyFeature3Title', e.target.value)}
                      placeholder="Feature title"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Description</Label>
                  <Textarea
                    value={settings.whyFeature3Desc}
                    onChange={(e) => updateSetting('whyFeature3Desc', e.target.value)}
                    placeholder="Feature description"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-4 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Feature 4</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.whyFeature4Icon}
                      onValueChange={(value) => updateSetting('whyFeature4Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const iconData = featureIcons.find(i => i.name === settings.whyFeature4Icon);
                              const Icon = iconData?.icon || Truck;
                              return (
                                <>
                                  <Icon className="w-4 h-4" />
                                  <span>{iconData?.label || 'Delivery'}</span>
                                </>
                              );
                            })()}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {featureIcons.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-gray-500">Title</Label>
                    <Input
                      value={settings.whyFeature4Title}
                      onChange={(e) => updateSetting('whyFeature4Title', e.target.value)}
                      placeholder="Feature title"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Description</Label>
                  <Textarea
                    value={settings.whyFeature4Desc}
                    onChange={(e) => updateSetting('whyFeature4Desc', e.target.value)}
                    placeholder="Feature description"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Preview</CardTitle>
              <CardDescription>See how your features will look on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-dark rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: settings.whyFeature1Icon, title: settings.whyFeature1Title, desc: settings.whyFeature1Desc },
                    { icon: settings.whyFeature2Icon, title: settings.whyFeature2Title, desc: settings.whyFeature2Desc },
                    { icon: settings.whyFeature3Icon, title: settings.whyFeature3Title, desc: settings.whyFeature3Desc },
                    { icon: settings.whyFeature4Icon, title: settings.whyFeature4Title, desc: settings.whyFeature4Desc },
                  ].map((feature, index) => {
                    const iconData = featureIcons.find(i => i.name === feature.icon);
                    const Icon = iconData?.icon || ChefHat;
                    return (
                      <div 
                        key={index}
                        className="p-4 bg-white/5 rounded-xl text-center border border-white/10"
                      >
                        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/30">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-heading text-sm font-semibold text-white mt-4 line-clamp-1">
                          {feature.title || 'Feature Title'}
                        </h3>
                        <p className="text-gray-400 mt-2 text-xs leading-relaxed line-clamp-2">
                          {feature.desc || 'Feature description goes here...'}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center mt-6 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    {settings.whyCtaText || 'Ready to experience the difference?'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleResetWhyToDefault}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                Discard Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-6">
          {/* Testimonials Management Card */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Manage Testimonials
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or remove customer reviews displayed on your landing page
                  </CardDescription>
                </div>
                <Button
                  onClick={openNewTestimonialDialog}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTestimonials ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-gray-700 mb-2">
                    No Testimonials Yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Default testimonials will be shown. Add your first custom testimonial to override them.
                  </p>
                  <Button
                    onClick={openNewTestimonialDialog}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Testimonial
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`p-4 rounded-xl border transition-all ${
                        testimonial.isActive 
                          ? 'bg-white border-gray-200 shadow-sm' 
                          : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-orange-200 flex items-center justify-center">
                              <span className="text-xl font-bold text-primary">
                                {testimonial.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-heading font-semibold text-gray-900 truncate">
                              {testimonial.name}
                            </h4>
                            <Badge 
                              variant={testimonial.isActive ? "default" : "secondary"}
                              className={testimonial.isActive ? "bg-green-100 text-green-700" : ""}
                            >
                              {testimonial.isActive ? 'Active' : 'Hidden'}
                            </Badge>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= testimonial.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({testimonial.rating}/5)
                            </span>
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            &quot;{testimonial.text}&quot;
                          </p>

                          {/* Location */}
                          {testimonial.location && (
                            <p className="text-xs text-gray-400">
                              📍 {testimonial.location}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={testimonial.isActive}
                              onCheckedChange={() => handleToggleTestimonialActive(testimonial)}
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditTestimonialDialog(testimonial)}
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              disabled={isDeletingTestimonial === testimonial.id}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              {isDeletingTestimonial === testimonial.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Order indicator */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Display Order: #{index + 1}
                        </span>
                        <span className="text-xs text-gray-400">
                          Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Testimonial Stats Card */}
          <Card className="border-gray-100 shadow-sm pb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Trust Stats
                  </CardTitle>
                  <CardDescription>
                    Customize the statistics displayed below testimonials
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSetting('testimonialStat1Icon', 'Users');
                    updateSetting('testimonialStat1Value', '500+');
                    updateSetting('testimonialStat1Label', 'Happy Customers');
                    updateSetting('testimonialStat2Icon', 'Star');
                    updateSetting('testimonialStat2Value', '4.9');
                    updateSetting('testimonialStat2Label', 'Average Rating');
                    updateSetting('testimonialStat3Icon', 'CheckCircle');
                    updateSetting('testimonialStat3Value', '100%');
                    updateSetting('testimonialStat3Label', 'Authentic Recipes');
                  }}
                  className="gap-2 text-gray-600 hover:text-primary"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Stats
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat 1 */}
                <div className="space-y-4 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <span className="font-medium text-gray-700">First Stat</span>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.testimonialStat1Icon}
                      onValueChange={(value) => updateSetting('testimonialStat1Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input
                      value={settings.testimonialStat1Value}
                      onChange={(e) => updateSetting('testimonialStat1Value', e.target.value)}
                      placeholder="e.g., 500+"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                      value={settings.testimonialStat1Label}
                      onChange={(e) => updateSetting('testimonialStat1Label', e.target.value)}
                      placeholder="e.g., Happy Customers"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="space-y-4 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <span className="font-medium text-gray-700">Second Stat</span>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.testimonialStat2Icon}
                      onValueChange={(value) => updateSetting('testimonialStat2Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input
                      value={settings.testimonialStat2Value}
                      onChange={(e) => updateSetting('testimonialStat2Value', e.target.value)}
                      placeholder="e.g., 4.9"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                      value={settings.testimonialStat2Label}
                      onChange={(e) => updateSetting('testimonialStat2Label', e.target.value)}
                      placeholder="e.g., Average Rating"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="space-y-4 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <span className="font-medium text-gray-700">Third Stat</span>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Icon</Label>
                    <Select
                      value={settings.testimonialStat3Icon}
                      onValueChange={(value) => updateSetting('testimonialStat3Icon', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input
                      value={settings.testimonialStat3Value}
                      onChange={(e) => updateSetting('testimonialStat3Value', e.target.value)}
                      placeholder="e.g., 100%"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Label</Label>
                    <Input
                      value={settings.testimonialStat3Label}
                      onChange={(e) => updateSetting('testimonialStat3Label', e.target.value)}
                      placeholder="e.g., Authentic Recipes"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Preview</Label>
                <div className="p-6 bg-warm-light rounded-xl">
                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                    {/* Stat 1 Preview */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = availableIcons.find(i => i.name === settings.testimonialStat1Icon)?.icon || Users;
                        return <IconComponent className="w-5 h-5 text-primary" />;
                      })()}
                      <div className="text-sm">
                        <span className="font-semibold text-dark">{settings.testimonialStat1Value}</span>
                        <span className="text-gray-500 ml-1">{settings.testimonialStat1Label}</span>
                      </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-8 bg-gray-300" />
                    
                    {/* Stat 2 Preview */}
                    <div className="flex items-center gap-2">
                      {settings.testimonialStat2Icon === 'Star' ? (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      ) : (
                        (() => {
                          const IconComponent = availableIcons.find(i => i.name === settings.testimonialStat2Icon)?.icon || Star;
                          return <IconComponent className="w-5 h-5 text-primary" />;
                        })()
                      )}
                      <div className="text-sm">
                        <span className="font-semibold text-dark">{settings.testimonialStat2Value}</span>
                        <span className="text-gray-500 ml-1">{settings.testimonialStat2Label}</span>
                      </div>
                    </div>
                    
                    <div className="hidden sm:block w-px h-8 bg-gray-300" />
                    
                    {/* Stat 3 Preview */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = availableIcons.find(i => i.name === settings.testimonialStat3Icon)?.icon || CheckCircle;
                        return <IconComponent className="w-5 h-5 text-primary" />;
                      })()}
                      <div className="text-sm">
                        <span className="font-semibold text-dark">{settings.testimonialStat3Value}</span>
                        <span className="text-gray-500 ml-1">{settings.testimonialStat3Label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          
        </TabsContent>

        {/* Add/Edit Testimonial Dialog */}
        <Dialog modal={true} open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial 
                  ? 'Update the customer review details below.'
                  : 'Fill in the details for the new customer testimonial.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Customer Name */}
              <div>
                <Label htmlFor="testimonial-name" className="text-sm font-medium">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="testimonial-name"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sarah K."
                  className="mt-1.5"
                />
              </div>

              {/* Avatar */}
              <div>
                <Label className="text-sm font-medium">Customer Photo (Optional)</Label>
                <div className="mt-3">
                  {/* Avatar Preview & Upload Area */}
                  <div className="flex items-start gap-4">
                    {/* Avatar Preview */}
                    <div className="relative">
                      {testimonialForm.avatar ? (
                        <div className="relative group">
                          <img
                            src={testimonialForm.avatar}
                            alt="Customer avatar"
                            className="w-20 h-20 rounded-full object-cover border-3 border-primary/20 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setTestimonialForm(prev => ({ ...prev, avatar: '' }))}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Options */}
                    <div className="flex-1 space-y-3">
                      {/* Toggle Tabs */}
                      <div className="inline-flex rounded-lg bg-gray-100 p-1">
                        <button
                          type="button"
                          onClick={() => setAvatarInputMode('upload')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            avatarInputMode === 'upload'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setAvatarInputMode('url')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            avatarInputMode === 'url'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          URL
                        </button>
                      </div>

                      {avatarInputMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            ref={avatarFileInputRef}
                          />
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Click to upload image
                              </>
                            )}
                          </button>
                          <p className="text-xs text-gray-400 mt-1.5">PNG, JPG up to 5MB</p>
                        </div>
                      ) : (
                        <div>
                          <Input
                            value={testimonialForm.avatar}
                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, avatar: e.target.value }))}
                            placeholder="https://example.com/photo.jpg"
                            className="text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1.5">Enter a direct link to the image</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium">Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= testimonialForm.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {testimonialForm.rating}/5
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="testimonial-text" className="text-sm font-medium">
                  Review Text <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="testimonial-text"
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Write the customer's review here..."
                  rows={4}
                  className="mt-1.5 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {testimonialForm.text.length}/300 characters
                </p>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="testimonial-location" className="text-sm font-medium">
                  Location (Optional)
                </Label>
                <Input
                  id="testimonial-location"
                  value={testimonialForm.location || ''}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., New York, NY"
                  className="mt-1.5"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Show on Landing Page</Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Toggle to display this testimonial publicly
                  </p>
                </div>
                <Switch
                  checked={testimonialForm.isActive}
                  onCheckedChange={(checked) => setTestimonialForm(prev => ({ ...prev, isActive: checked }))}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsTestimonialDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTestimonial}
                disabled={isSavingTestimonial || !testimonialForm.name || !testimonialForm.text}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                {isSavingTestimonial ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
}
