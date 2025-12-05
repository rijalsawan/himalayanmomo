'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Eye,
  Ban,
  Download,
  Filter,
  User,
  MapPin,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CustomerOrder {
  id: string;
  date: string;
  items: number;
  total: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string | null;
  joinedAt: string;
  status: 'active' | 'inactive';
  orders: CustomerOrder[];
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const response = await fetch(`/api/admin/customers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            Customers
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage your customer base
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" className="gap-2" onClick={fetchCustomers}>
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stats?.totalCustomers ?? 0}</p>
              <p className="text-sm text-gray-500">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stats?.activeCustomers ?? 0}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4A261]/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#F4A261]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">${(stats?.totalRevenue ?? 0).toFixed(0)}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2D6A4F]/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#2D6A4F]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">${(stats?.avgOrderValue ?? 0).toFixed(2)}</p>
              <p className="text-sm text-gray-500">Avg. Order</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50"
              />
            </div>
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 hidden lg:table-cell">
                      Orders
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Total Spent
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 hidden md:table-cell">
                      Status
                    </th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        No customers found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={customer.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-[#1A1A1A]">{customer.name}</p>
                              <p className="text-xs text-gray-400 md:hidden">{customer.email}</p>
                              <p className="text-xs text-gray-400">
                                Joined {formatDate(customer.joinedAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {customer.phone || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-[#1A1A1A]">{customer.totalOrders}</span>
                            <span className="text-gray-400">orders</span>
                          </div>
                          {customer.lastOrder && (
                            <p className="text-xs text-gray-400 mt-1">
                              Last: {formatDateTime(customer.lastOrder)}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-[#1A1A1A]">
                            ${customer.totalSpent.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              customer.status === 'active'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            )}
                          >
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleViewCustomer(customer)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Ban className="w-4 h-4 mr-2" />
                                {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Customer Details
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
              </TabsList>

              <div className="min-h-[380px]">
                <TabsContent value="overview" className="space-y-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                  {/* Customer Info */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedCustomer.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-[#1A1A1A]">
                          {selectedCustomer.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            selectedCustomer.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          )}
                        >
                          {selectedCustomer.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedCustomer.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedCustomer.phone || 'N/A'}
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {selectedCustomer.address || 'No address provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-primary">
                        {selectedCustomer.totalOrders}
                      </p>
                      <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-[#2D6A4F]">
                        ${selectedCustomer.totalSpent.toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-[#F4A261]">
                        ${selectedCustomer.totalOrders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(0) : '0'}
                      </p>
                      <p className="text-sm text-gray-500">Avg. Order</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-lg font-bold text-[#1A1A1A]">
                        {formatDate(selectedCustomer.joinedAt)}
                      </p>
                      <p className="text-sm text-gray-500">Member Since</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="mt-6 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                  <div className="space-y-3">
                    {selectedCustomer.orders.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No orders yet</p>
                    ) : (
                      selectedCustomer.orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-[#1A1A1A]">#{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.date)} · {order.items} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#1A1A1A]">
                              ${order.total.toFixed(2)}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                order.status === 'delivered'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : order.status === 'cancelled'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              )}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
