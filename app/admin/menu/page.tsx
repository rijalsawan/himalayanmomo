'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      
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

  useEffect(() => {
    fetchMenuItems();
  }, [searchQuery, categoryFilter]);

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

  // Open dialog for adding new item
  const handleAddItem = () => {
    setEditingItem(null);
    setFormData(emptyFormData);
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

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.isAvailable).length,
    unavailable: menuItems.filter(i => !i.isAvailable).length,
    popular: menuItems.filter(i => i.isPopular).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Manage your menu items</p>
        </div>
        <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Items</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
            <p className="text-xs text-muted-foreground mt-1">Unavailable</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-primary">{stats.popular}</p>
            <p className="text-xs text-muted-foreground mt-1">Popular</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40 h-9">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading menu items...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Spice</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1A1A1A] flex items-center gap-1.5">
                              <span className="truncate">{item.name}</span>
                              {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                              {item.isPopular && <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4">Popular</Badge>}
                              {item.isNew && <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-4">New</Badge>}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px] hidden sm:block">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-muted-foreground capitalize">{item.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#1A1A1A]">${item.price.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <Badge variant="outline" className={cn('font-normal gap-1', spiceLevels.find(s => s.value === item.spiceLevel)?.color)}>
                          {item.spiceLevel > 0 && <Flame className="w-3 h-3" />}
                          {spiceLevels.find(s => s.value === item.spiceLevel)?.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn('font-normal', item.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200')}>
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
                              <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => handleToggleAvailability(item)}>
                                {item.isAvailable ? <><EyeOff className="w-4 h-4 mr-2" />Mark Unavailable</> : <><Eye className="w-4 h-4 mr-2" />Mark Available</>}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-sm text-red-600 focus:text-red-600" onClick={() => setDeleteItem(item)}>
                                <Trash2 className="w-4 h-4 mr-2" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && menuItems.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No items found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>

            <div className="min-h-[420px]">
              {/* Basic Tab */}
              <TabsContent value="basic" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                {/* Image Upload */}
                <div>
                  <Label className="text-sm">Image</Label>
                  <div className="mt-1.5 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <Image src={formData.image || '/images/placeholder-food.jpg'} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <Input 
                        placeholder="Image URL" 
                        value={formData.image} 
                        onChange={(e) => handleChange('image', e.target.value)}
                        className="mb-2"
                      />
                      <p className="text-xs text-muted-foreground">Enter image URL or upload path</p>
                    </div>
                  </div>
                </div>

                {/* Name & Slug */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Item name" 
                      value={formData.name} 
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input 
                      id="slug" 
                      placeholder="item-slug" 
                      value={formData.slug} 
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Brief description for cards" 
                    value={formData.description} 
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="mt-1.5" 
                    rows={2} 
                  />
                </div>

                {/* Long Description */}
                <div>
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea 
                    id="longDescription" 
                    placeholder="Detailed description for item page" 
                    value={formData.longDescription} 
                    onChange={(e) => handleChange('longDescription', e.target.value)}
                    className="mt-1.5" 
                    rows={3} 
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                    <Label htmlFor="category">Category</Label>
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
                  <Label className="text-sm">Spice Level</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {spiceLevels.map((level) => (
                      <Button 
                        key={level.value} 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className={cn('gap-1 h-8', formData.spiceLevel === level.value && 'ring-2 ring-primary')}
                        onClick={() => handleChange('spiceLevel', level.value)}
                      >
                        {level.value > 0 && <Flame className="w-3 h-3" />}
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                {/* Ingredients */}
                <div>
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea 
                    id="ingredients" 
                    placeholder="Comma-separated: Chicken, Flour, Garlic, Ginger..." 
                    value={formData.ingredients} 
                    onChange={(e) => handleChange('ingredients', e.target.value)}
                    className="mt-1.5" 
                    rows={3} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
                </div>

                {/* Allergens */}
                <div>
                  <Label htmlFor="allergens">Allergens</Label>
                  <Textarea 
                    id="allergens" 
                    placeholder="Comma-separated: Gluten, Dairy, Nuts..." 
                    value={formData.allergens} 
                    onChange={(e) => handleChange('allergens', e.target.value)}
                    className="mt-1.5" 
                    rows={3} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
                </div>

                {/* Preparation Time & Serving Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="preparationTime">Preparation Time</Label>
                    <div className="relative mt-1.5">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="preparationTime" 
                        placeholder="15-20 min" 
                        value={formData.preparationTime} 
                        onChange={(e) => handleChange('preparationTime', e.target.value)}
                        className="pl-9" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="servingSize">Serving Size</Label>
                    <div className="relative mt-1.5">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="servingSize" 
                        placeholder="Serves 1-2" 
                        value={formData.servingSize} 
                        onChange={(e) => handleChange('servingSize', e.target.value)}
                        className="pl-9" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">These details will be displayed on the item detail page.</p>
                </div>
              </TabsContent>

              {/* Nutrition Tab */}
              <TabsContent value="nutrition" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input 
                      id="calories" 
                      type="number" 
                      placeholder="350" 
                      value={formData.calories} 
                      onChange={(e) => handleChange('calories', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein</Label>
                    <Input 
                      id="protein" 
                      placeholder="25g" 
                      value={formData.protein} 
                      onChange={(e) => handleChange('protein', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="carbs">Carbs</Label>
                    <Input 
                      id="carbs" 
                      placeholder="30g" 
                      value={formData.carbs} 
                      onChange={(e) => handleChange('carbs', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat</Label>
                    <Input 
                      id="fat" 
                      placeholder="12g" 
                      value={formData.fat} 
                      onChange={(e) => handleChange('fat', e.target.value)}
                      className="mt-1.5" 
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">Nutrition information is optional and will display on the item detail page.</p>
                </div>
              </TabsContent>

              {/* Options Tab */}
              <TabsContent value="options" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Label htmlFor="isVegetarian" className="cursor-pointer font-medium">Vegetarian</Label>
                      <p className="text-xs text-muted-foreground">Mark this item as vegetarian</p>
                    </div>
                    <Switch 
                      id="isVegetarian" 
                      checked={formData.isVegetarian}
                      onCheckedChange={(v) => handleChange('isVegetarian', v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Label htmlFor="isAvailable" className="cursor-pointer font-medium">Available</Label>
                      <p className="text-xs text-muted-foreground">Item is visible and can be ordered</p>
                    </div>
                    <Switch 
                      id="isAvailable" 
                      checked={formData.isAvailable}
                      onCheckedChange={(v) => handleChange('isAvailable', v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Label htmlFor="isPopular" className="cursor-pointer font-medium">Popular</Label>
                      <p className="text-xs text-muted-foreground">Show in popular items section</p>
                    </div>
                    <Switch 
                      id="isPopular" 
                      checked={formData.isPopular}
                      onCheckedChange={(v) => handleChange('isPopular', v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Label htmlFor="isNew" className="cursor-pointer font-medium">New Item</Label>
                      <p className="text-xs text-muted-foreground">Display &quot;New&quot; badge</p>
                    </div>
                    <Switch 
                      id="isNew" 
                      checked={formData.isNew}
                      onCheckedChange={(v) => handleChange('isNew', v)}
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={handleSaveItem}
              disabled={isSaving || !formData.name || !formData.description || !formData.price}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
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
  );
}
