'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Search,
  MoreHorizontal,
  Phone,
  ShoppingBag,
  Eye,
  Download,
  Filter,
  Mail,
  MapPin,
  Loader2,
  RefreshCw,
  Calendar,
  Users,
  X,
  CheckCircle,
  Shield,
  ShieldOff,
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
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Pagination from '../components/Pagination';

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
  role: 'USER' | 'ADMIN';
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

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Paginated customers
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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

  // Combined debounced fetch for all filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, searchQuery ? 300 : 0); // Only debounce for search queries
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleToggleRole = async (customer: Customer) => {
    // Prevent admin from removing their own admin role
    if (customer.id === currentUserId && customer.role === 'ADMIN') {
      return;
    }

    const newRole = customer.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Update local state
        setCustomers(prev => 
          prev.map(c => c.id === customer.id ? { ...c, role: newRole } : c)
        );
        // Update selected customer if viewing details
        if (selectedCustomer?.id === customer.id) {
          setSelectedCustomer(prev => prev ? { ...prev, role: newRole } : null);
        }
      }
    } catch (error) {
      console.error('Error updating customer role:', error);
    }
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
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchCustomers}>
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          {/* Mobile Filters - Icon buttons with dropdowns */}
          <div className="flex sm:hidden items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-9 h-9 p-0 justify-center [&>svg:last-child]:hidden">
                <Users className={cn("w-4 h-4", statusFilter !== 'all' && "text-primary")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
            {/* Status Filter - Desktop only */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="hidden sm:flex w-full sm:w-44">
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
          ) : paginatedCustomers.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No customers found matching your criteria
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[220px]">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[200px]">
                        Contact
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[150px]">
                        Orders
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[120px]">
                        Total Spent
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[100px]">
                        Status
                      </th>
                      <th className="py-4 px-4 w-[60px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        style={{ height: '60px' }}
                      >
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={customer.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-[#1A1A1A]">{customer.name}</p>
                              <p className="text-xs text-gray-400">
                                Joined {formatDate(customer.joinedAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
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
                        <td className="py-3 px-6">
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
                        <td className="py-3 px-6">
                          <span className="font-semibold text-[#1A1A1A]">
                            ${customer.totalSpent.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-6">
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
                          {customer.role === 'ADMIN' && (
                            <Badge className="ml-1 bg-purple-50 text-purple-700 border-purple-200">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
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
                              {/* Only show admin toggle if not current user trying to remove own admin */}
                              {!(customer.id === currentUserId && customer.role === 'ADMIN') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className={cn(
                                      "cursor-pointer",
                                      customer.role === 'ADMIN' 
                                        ? "text-orange-600 focus:text-orange-600" 
                                        : "text-purple-600 focus:text-purple-600"
                                    )}
                                    onClick={() => handleToggleRole(customer)}
                                  >
                                    {customer.role === 'ADMIN' ? (
                                      <>
                                        <ShieldOff className="w-4 h-4 mr-2" />
                                        Remove Admin
                                      </>
                                    ) : (
                                      <>
                                        <Shield className="w-4 h-4 mr-2" />
                                        Make Admin
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to maintain consistent height */}
                    {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - paginatedCustomers.length) }).map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-gray-50" style={{ height: '60px' }}>
                        <td colSpan={6} className="py-3 px-6">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginatedCustomers.map((customer) => (
                  <div key={customer.id} className="p-4">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <Avatar className="w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-medium text-[#1A1A1A] truncate">{customer.name}</h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] px-1.5 py-0',
                                  customer.status === 'active'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                )}
                              >
                                {customer.status}
                              </Badge>
                              {customer.role === 'ADMIN' && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-purple-50 text-purple-700 border-purple-200">
                                  <Shield className="w-2.5 h-2.5 mr-0.5" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewCustomer(customer)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {/* Only show admin toggle if not current user trying to remove own admin */}
                              {!(customer.id === currentUserId && customer.role === 'ADMIN') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className={cn(
                                      "cursor-pointer",
                                      customer.role === 'ADMIN' 
                                        ? "text-orange-600 focus:text-orange-600" 
                                        : "text-purple-600 focus:text-purple-600"
                                    )}
                                    onClick={() => handleToggleRole(customer)}
                                  >
                                    {customer.role === 'ADMIN' ? (
                                      <>
                                        <ShieldOff className="w-4 h-4 mr-2" />
                                        Remove Admin
                                      </>
                                    ) : (
                                      <>
                                        <Shield className="w-4 h-4 mr-2" />
                                        Make Admin
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Orders and Spent */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{customer.totalOrders} orders</span>
                          </div>
                          <span className="font-semibold text-[#1A1A1A]">${customer.totalSpent.toFixed(2)}</span>
                        </div>

                        {/* Phone and Join Date row */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {formatDate(customer.joinedAt)}</span>
                          </div>
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
              totalItems={customers.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} modal={true}>
        <DialogContent 
          className="w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-2xl p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl h-[85vh] sm:h-[600px] flex flex-col overflow-hidden"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {selectedCustomer && (
            <>
              {/* Modal Header */}
              <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-amber-50/50 to-white shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 pr-10">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                    <AvatarImage src={selectedCustomer.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <DialogTitle className="font-heading text-base sm:text-lg font-semibold text-[#1A1A1A]">
                        {selectedCustomer.name}
                      </DialogTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] sm:text-xs py-0.5 px-2',
                          selectedCustomer.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        )}
                      >
                        {selectedCustomer.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {selectedCustomer.status}
                      </Badge>
                      {selectedCustomer.role === 'ADMIN' && (
                        <Badge className="text-[10px] sm:text-xs py-0.5 px-2 bg-purple-50 text-purple-700 border-purple-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Tab Navigation */}
                <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-0 border-b border-gray-100 bg-gray-50/50 shrink-0">
                  <TabsList className="inline-flex h-9 sm:h-10 items-center justify-start gap-0 bg-transparent p-0">
                    <TabsTrigger 
                      value="overview" 
                      className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="orders" 
                      className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                    >
                      Order History
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content - Scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 py-4 sm:py-5 min-h-0">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0 space-y-4 data-[state=inactive]:hidden h-full">
                    {/* Contact Information */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-[#1A1A1A] truncate">{selectedCustomer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-[#1A1A1A] truncate">{selectedCustomer.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="text-sm font-medium text-[#1A1A1A] break-words">{selectedCustomer.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Statistics</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white border border-gray-100 text-center">
                          <p className="text-2xl font-bold text-primary">{selectedCustomer.totalOrders}</p>
                          <p className="text-xs text-gray-500">Total Orders</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white border border-gray-100 text-center">
                          <p className="text-2xl font-bold text-emerald-600">${selectedCustomer.totalSpent.toFixed(0)}</p>
                          <p className="text-xs text-gray-500">Total Spent</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white border border-gray-100 text-center">
                          <p className="text-2xl font-bold text-amber-500">
                            ${selectedCustomer.totalOrders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(0) : '0'}
                          </p>
                          <p className="text-xs text-gray-500">Avg. Order</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white border border-gray-100 text-center">
                          <p className="text-sm font-bold text-[#1A1A1A]">{formatDate(selectedCustomer.joinedAt)}</p>
                          <p className="text-xs text-gray-500">Member Since</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {/* Only show admin toggle if not current user trying to remove own admin */}
                    {!(selectedCustomer.id === currentUserId && selectedCustomer.role === 'ADMIN') && (
                      <div className="flex justify-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            "gap-2 h-10 w-full max-w-xs",
                            selectedCustomer.role === 'ADMIN' 
                              ? "text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                              : "text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                          )}
                          onClick={() => handleToggleRole(selectedCustomer)}
                        >
                          {selectedCustomer.role === 'ADMIN' ? (
                            <>
                              <ShieldOff className="w-4 h-4" />
                              <span>Remove Admin</span>
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              <span>Make Admin</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Orders Tab */}
                  <TabsContent value="orders" className="mt-0 data-[state=inactive]:hidden h-full">
                    {selectedCustomer.orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No orders yet</p>
                        <p className="text-sm text-gray-400">This customer hasn&apos;t placed any orders</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedCustomer.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              order.status === 'delivered' ? 'bg-emerald-100' :
                              order.status === 'cancelled' ? 'bg-red-100' : 'bg-amber-100'
                            )}>
                              <ShoppingBag className={cn(
                                "w-5 h-5",
                                order.status === 'delivered' ? 'text-emerald-600' :
                                order.status === 'cancelled' ? 'text-red-600' : 'text-amber-600'
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1A1A1A]">#{order.id.slice(-8).toUpperCase()}</p>
                              <p className="text-xs text-gray-500">{formatDate(order.date)} · {order.items} items</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-semibold text-[#1A1A1A]">${order.total.toFixed(2)}</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] px-1.5 py-0',
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
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-end shrink-0">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
