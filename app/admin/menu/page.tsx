'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Leaf,
  Filter,
  DollarSign,
  Clock,
  Users,
  Loader2,
  RefreshCw,
  Star,
  Sparkles,
  UtensilsCrossed,
  X,
  Upload,
  ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Pagination from '../components/Pagination';

interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string | null;
  price: number;
  category: string;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isPopular: boolean;
  isNew: boolean;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  calories?: number | null;
  protein?: string | null;
  carbs?: string | null;
  fat?: string | null;
  preparationTime?: string | null;
  servingSize?: string | null;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: string;
  category: string;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isPopular: boolean;
  isNew: boolean;
  isAvailable: boolean;
  ingredients: string;
  allergens: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  preparationTime: string;
  servingSize: string;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'momos', label: 'Momos' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'sides', label: 'Sides' },
  { value: 'desserts', label: 'Desserts' },
];

const spiceLevels = [
  { value: 0, label: 'None', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  { value: 1, label: 'Mild', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 2, label: 'Medium', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 3, label: 'Spicy', color: 'bg-red-50 text-red-700 border-red-200' },
];

const emptyFormData: FormData = {
  name: '',
  slug: '',
  description: '',
  longDescription: '',
  price: '',
  category: 'momos',
  image: '/images/placeholder-food.jpg',
  spiceLevel: 0,
  isVegetarian: false,
  isPopular: false,
  isNew: false,
  isAvailable: true,
  ingredients: '',
  allergens: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  preparationTime: '',
  servingSize: '',
};

const ITEMS_PER_PAGE = 10;

// Cloudinary types
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: Error | null, result: { event: string; info: { secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paginated menu items
  const totalPages = Math.ceil(menuItems.length / ITEMS_PER_PAGE);
  const paginatedItems = menuItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, availabilityFilter]);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (availabilityFilter !== 'all') params.set('availability', availabilityFilter);
      
      const response = await fetch(`/api/admin/menu?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combined debounced fetch for all filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuItems();
    }, searchQuery ? 300 : 0); // Only debounce for search queries
    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, availabilityFilter]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Handle form data change
  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Auto-generate slug when name changes (only for new items)
      if (field === 'name' && !editingItem) {
        newData.slug = generateSlug(value as string);
      }
      return newData;
    });
  };

  // Handle file upload to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        handleChange('image', data.url);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Open Cloudinary upload widget
  const openCloudinaryWidget = async () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is still loading. Please try again.');
      return;
    }

    try {
      // Get signature from server
      const response = await fetch('/api/upload');
      if (!response.ok) {
        throw new Error('Failed to get upload signature');
      }
      const { cloudName, apiKey, signature, timestamp } = await response.json();

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder: 'momo-station/menu',
          sources: ['local', 'url', 'camera', 'google_drive', 'dropbox', 'instagram', 'facebook'],
          multiple: false,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          cropping: true,
          croppingAspectRatio: 4 / 3,
          croppingShowDimensions: true,
          showSkipCropButton: false,
          theme: 'minimal',
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#E5E7EB',
              tabIcon: '#D94F04',
              menuIcons: '#6B7280',
              textDark: '#1A1A1A',
              textLight: '#6B7280',
              link: '#D94F04',
              action: '#D94F04',
              inactiveTabIcon: '#9CA3AF',
              error: '#EF4444',
              inProgress: '#D94F04',
              complete: '#22C55E',
              sourceBg: '#F9FAFB',
            },
            fonts: {
              default: null,
              "'Inter', sans-serif": {
                url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
                active: true,
              },
            },
          },
        },
        (error: Error | null, result: { event: string; info: { secure_url: string } }) => {
          if (!error && result && result.event === 'success') {
            handleChange('image', result.info.secure_url);
          }
        }
      );
      widget.open();
    } catch (error) {
      console.error('Widget error:', error);
      alert('Failed to open upload widget');
    }
  };

  // Open dialog for adding new item
  const handleAddItem = () => {
    setEditingItem(null);
    setFormData(emptyFormData);
    setImageInputMode('upload');
    setIsDialogOpen(true);
  };

  // Open dialog for editing item
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description,
      longDescription: item.longDescription || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      spiceLevel: item.spiceLevel,
      isVegetarian: item.isVegetarian,
      isPopular: item.isPopular,
      isNew: item.isNew,
      isAvailable: item.isAvailable,
      ingredients: item.ingredients.join(', '),
      allergens: item.allergens.join(', '),
      calories: item.calories?.toString() || '',
      protein: item.protein || '',
      carbs: item.carbs || '',
      fat: item.fat || '',
      preparationTime: item.preparationTime || '',
      servingSize: item.servingSize || '',
    });
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(emptyFormData);
  };

  // Save item (create or update)
  const handleSaveItem = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        spiceLevel: formData.spiceLevel,
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        allergens: formData.allergens.split(',').map(s => s.trim()).filter(Boolean),
        calories: formData.calories ? parseInt(formData.calories) : null,
      };

      const url = editingItem 
        ? `/api/admin/menu/${editingItem.id}`
        : '/api/admin/menu';
      
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        handleCloseDialog();
        fetchMenuItems();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });

      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  // Delete item
  const handleDeleteItem = async () => {
    if (!deleteItem) return;

    try {
      const response = await fetch(`/api/admin/menu/${deleteItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteItem(null);
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      {/* Cloudinary Upload Widget Script */}
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={() => setCloudinaryReady(true)}
      />
      
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              Menu Items
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your restaurant menu items
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={fetchMenuItems}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            {/* Mobile Filters - Icon buttons with dropdowns */}
            <div className="flex sm:hidden items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-9 h-9 p-0 justify-center [&>svg:last-child]:hidden">
                  <Filter className={cn("w-4 h-4", categoryFilter !== 'all' && "text-primary")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-9 h-9 p-0 justify-center [&>svg:last-child]:hidden">
                <Eye className={cn("w-4 h-4", availabilityFilter !== 'all' && "text-primary")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button size="sm" onClick={handleAddItem} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Item</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-100">
        <CardContent className="">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50"
              />
            </div>
            {/* Category Filter - Desktop only */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="hidden sm:flex w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Availability Filter - Desktop only */}
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="hidden sm:flex w-full sm:w-44">
                <Eye className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading menu items...</p>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No menu items found matching your criteria
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[280px]">
                        Item
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[120px]">
                        Category
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[100px]">
                        Price
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[100px]">
                        Spice
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[110px]">
                        Status
                      </th>
                      <th className="py-4 px-4 w-[80px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        style={{ height: '60px' }}
                      >
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-[#1A1A1A] truncate">{item.name}</p>
                                {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {item.isPopular && (
                                  <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                    <Star className="w-2.5 h-2.5" />
                                    Popular
                                  </Badge>
                                )}
                                {item.isNew && (
                                  <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <span className="text-gray-600 capitalize">{item.category}</span>
                        </td>
                        <td className="py-3 px-6">
                          <span className="font-semibold text-[#1A1A1A]">${item.price.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-6">
                          <Badge variant="outline" className={cn('font-normal gap-1', spiceLevels.find(s => s.value === item.spiceLevel)?.color)}>
                            {item.spiceLevel > 0 && <Flame className="w-3 h-3" />}
                            {spiceLevels.find(s => s.value === item.spiceLevel)?.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-6">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'font-normal',
                              item.isAvailable 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            )}
                          >
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleEditItem(item)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleAvailability(item)}>
                                  {item.isAvailable ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Mark Unavailable
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Mark Available
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600 focus:text-red-600" 
                                  onClick={() => setDeleteItem(item)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to maintain consistent height */}
                    {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - paginatedItems.length) }).map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-gray-50" style={{ height: '60px' }}>
                        <td colSpan={6} className="py-3 px-6">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginatedItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-medium text-[#1A1A1A] truncate">{item.name}</h3>
                              {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditItem(item)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleAvailability(item)}>
                                {item.isAvailable ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Mark Unavailable
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Mark Available
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600 focus:text-red-600" 
                                onClick={() => setDeleteItem(item)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Price and badges */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-[#1A1A1A]">${item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1.5">
                            {item.isPopular && (
                              <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4">Popular</Badge>
                            )}
                            {item.isNew && (
                              <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-4">New</Badge>
                            )}
                          </div>
                        </div>

                        {/* Status row */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn('font-normal gap-1 text-[10px]', spiceLevels.find(s => s.value === item.spiceLevel)?.color)}>
                              {item.spiceLevel > 0 && <Flame className="w-2.5 h-2.5" />}
                              {spiceLevels.find(s => s.value === item.spiceLevel)?.label}
                            </Badge>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'font-normal text-[10px]',
                              item.isAvailable 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            )}
                          >
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* Pagination always at bottom */}
          <div className="mt-auto pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={menuItems.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog} modal={true}>
        <DialogContent 
          className="w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-2xl p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl"
          showCloseButton={false}
        >
          {/* Modal Header */}
          <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2 sm:gap-3 pr-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="font-heading text-base sm:text-lg font-semibold text-[#1A1A1A]">
                  {editingItem ? 'Edit Menu Item' : 'Add New Item'}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {editingItem ? 'Update the details below' : 'Fill in the details to create a new menu item'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseDialog}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <Tabs defaultValue="basic" className="w-full">
            {/* Tab Navigation */}
            <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-0 border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex h-9 sm:h-10 items-center justify-start gap-0 bg-transparent p-0 min-w-max">
                <TabsTrigger 
                  value="basic" 
                  className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="nutrition" 
                  className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                >
                  Nutrition
                </TabsTrigger>
                <TabsTrigger 
                  value="options" 
                  className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                >
                  Options
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content - FIXED HEIGHT Container (constant across all tabs) */}
            <div className="h-[320px] sm:h-[420px] overflow-y-auto scrollbar-hide px-4 sm:px-6 py-4 sm:py-5">
              {/* Basic Tab */}
              <TabsContent value="basic" className="mt-0 space-y-4 sm:space-y-5 data-[state=inactive]:hidden">
                {/* Image Upload */}
                <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                    {/* Image Preview */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0 shadow-sm group">
                      {formData.image && formData.image !== '/images/placeholder-food.jpg' ? (
                        <>
                          <Image src={formData.image} alt="Preview" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => handleChange('image', '/images/placeholder-food.jpg')}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Upload Options */}
                    <div className="flex-1 min-w-0 w-full">
                      <Label className="text-sm font-medium text-gray-700">Item Image</Label>
                      
                      {/* Mode Toggle */}
                      <div className="flex gap-1 mt-2 p-1 bg-gray-100 rounded-lg w-fit">
                        <button
                          type="button"
                          onClick={() => setImageInputMode('upload')}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                            imageInputMode === 'upload' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          )}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('url')}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                            imageInputMode === 'url' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          )}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          URL
                        </button>
                      </div>

                      {imageInputMode === 'upload' ? (
                        <div className="mt-3 space-y-2">
                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          
                          {/* Upload Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="gap-1.5"
                            >
                              {isUploading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              From Device
                            </Button>
                            
                          </div>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, WebP or GIF. Max 5MB.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            value={formData.image === '/images/placeholder-food.jpg' ? '' : formData.image} 
                            onChange={(e) => handleChange('image', e.target.value || '/images/placeholder-food.jpg')}
                            className="bg-white"
                          />
                          <p className="text-xs text-gray-500 mt-1.5">Enter a valid image URL</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Chicken Momo" 
                      value={formData.name} 
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-sm font-medium text-gray-700">URL Slug</Label>
                    <Input 
                      id="slug" 
                      placeholder="chicken-momo" 
                      value={formData.slug} 
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Short Description <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description" 
                    placeholder="A brief description that appears on menu cards" 
                    value={formData.description} 
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="mt-1.5 resize-none" 
                    rows={2} 
                  />
                </div>

                {/* Long Description */}
                <div>
                  <Label htmlFor="longDescription" className="text-sm font-medium text-gray-700">Full Description</Label>
                  <Textarea 
                    id="longDescription" 
                    placeholder="Detailed description for the item detail page" 
                    value={formData.longDescription} 
                    onChange={(e) => handleChange('longDescription', e.target.value)}
                    className="mt-1.5 resize-none" 
                    rows={2} 
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price <span className="text-red-500">*</span></Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="price" 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={formData.price} 
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="pl-9" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="momos">Momos</SelectItem>
                        <SelectItem value="drinks">Drinks</SelectItem>
                        <SelectItem value="sides">Sides</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Spice Level</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {spiceLevels.map((level) => (
                      <button 
                        key={level.value} 
                        type="button"
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                          formData.spiceLevel === level.value 
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/25' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                        )}
                        onClick={() => handleChange('spiceLevel', level.value)}
                      >
                        {level.value > 0 && <Flame className="w-3.5 h-3.5" />}
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-0 space-y-5 data-[state=inactive]:hidden">
                {/* Ingredients */}
                <div>
                  <Label htmlFor="ingredients" className="text-sm font-medium text-gray-700">Ingredients</Label>
                  <Textarea 
                    id="ingredients" 
                    placeholder="Chicken, Flour, Garlic, Ginger, Onions, Cilantro..." 
                    value={formData.ingredients} 
                    onChange={(e) => handleChange('ingredients', e.target.value)}
                    className="mt-1.5 resize-none" 
                    rows={3} 
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Separate ingredients with commas</p>
                </div>

                {/* Allergens */}
                <div>
                  <Label htmlFor="allergens" className="text-sm font-medium text-gray-700">Allergens</Label>
                  <Textarea 
                    id="allergens" 
                    placeholder="Gluten, Dairy, Soy, Nuts..." 
                    value={formData.allergens} 
                    onChange={(e) => handleChange('allergens', e.target.value)}
                    className="mt-1.5 resize-none" 
                    rows={3} 
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Separate allergens with commas</p>
                </div>

                {/* Preparation Time & Serving Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preparationTime" className="text-sm font-medium text-gray-700">Prep Time</Label>
                    <div className="relative mt-1.5">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="preparationTime" 
                        placeholder="15-20 minutes" 
                        value={formData.preparationTime} 
                        onChange={(e) => handleChange('preparationTime', e.target.value)}
                        className="pl-9" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="servingSize" className="text-sm font-medium text-gray-700">Serving Size</Label>
                    <div className="relative mt-1.5">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="servingSize" 
                        placeholder="Serves 1-2 people" 
                        value={formData.servingSize} 
                        onChange={(e) => handleChange('servingSize', e.target.value)}
                        className="pl-9" 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Nutrition Tab */}
              <TabsContent value="nutrition" className="mt-0 space-y-5 data-[state=inactive]:hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <Label htmlFor="calories" className="text-sm font-medium text-orange-700">Calories</Label>
                    <Input 
                      id="calories" 
                      type="number" 
                      placeholder="350" 
                      value={formData.calories} 
                      onChange={(e) => handleChange('calories', e.target.value)}
                      className="mt-2 bg-white border-orange-200 focus:border-orange-400" 
                    />
                    <p className="text-xs text-orange-600 mt-1">kcal per serving</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                    <Label htmlFor="protein" className="text-sm font-medium text-red-700">Protein</Label>
                    <Input 
                      id="protein" 
                      placeholder="25g" 
                      value={formData.protein} 
                      onChange={(e) => handleChange('protein', e.target.value)}
                      className="mt-2 bg-white border-red-200 focus:border-red-400" 
                    />
                    <p className="text-xs text-red-600 mt-1">grams per serving</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <Label htmlFor="carbs" className="text-sm font-medium text-amber-700">Carbs</Label>
                    <Input 
                      id="carbs" 
                      placeholder="30g" 
                      value={formData.carbs} 
                      onChange={(e) => handleChange('carbs', e.target.value)}
                      className="mt-2 bg-white border-amber-200 focus:border-amber-400" 
                    />
                    <p className="text-xs text-amber-600 mt-1">grams per serving</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Label htmlFor="fat" className="text-sm font-medium text-emerald-700">Fat</Label>
                    <Input 
                      id="fat" 
                      placeholder="12g" 
                      value={formData.fat} 
                      onChange={(e) => handleChange('fat', e.target.value)}
                      className="mt-2 bg-white border-emerald-200 focus:border-emerald-400" 
                    />
                    <p className="text-xs text-emerald-600 mt-1">grams per serving</p>
                  </div>
                </div>
              </TabsContent>

              {/* Options Tab */}
              <TabsContent value="options" className="mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <Label htmlFor="isVegetarian" className="cursor-pointer font-medium text-emerald-900">Vegetarian</Label>
                      <p className="text-xs text-emerald-600">Mark this item as vegetarian</p>
                    </div>
                  </div>
                  <Switch 
                    id="isVegetarian" 
                    checked={formData.isVegetarian}
                    onCheckedChange={(v) => handleChange('isVegetarian', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Label htmlFor="isAvailable" className="cursor-pointer font-medium text-blue-900">Available</Label>
                      <p className="text-xs text-blue-600">Item is visible and can be ordered</p>
                    </div>
                  </div>
                  <Switch 
                    id="isAvailable" 
                    checked={formData.isAvailable}
                    onCheckedChange={(v) => handleChange('isAvailable', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="isPopular" className="cursor-pointer font-medium text-[#1A1A1A]">Popular</Label>
                      <p className="text-xs text-gray-500">Show in popular items section</p>
                    </div>
                  </div>
                  <Switch 
                    id="isPopular" 
                    checked={formData.isPopular}
                    onCheckedChange={(v) => handleChange('isPopular', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <Label htmlFor="isNew" className="cursor-pointer font-medium text-amber-900">New Item</Label>
                      <p className="text-xs text-amber-600">Display &quot;New&quot; badge on this item</p>
                    </div>
                  </div>
                  <Switch 
                    id="isNew" 
                    checked={formData.isNew}
                    onCheckedChange={(v) => handleChange('isNew', v)}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Modal Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={handleCloseDialog}
              className="px-4 sm:px-5 rounded-xl border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              className="px-4 sm:px-5 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" 
              onClick={handleSaveItem}
              disabled={isSaving || !formData.name || !formData.description || !formData.price}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteItem?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
