'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  Clock,
  ChefHat,
  Truck,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  Download,
  RefreshCw,
  Loader2,
  Package,
  X,
  User,
  FileText,
  Receipt,
  Printer,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Pagination from '../components/Pagination';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar?: string;
  };
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
  total: number;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
    bgColor: 'bg-yellow-50',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircle,
    bgColor: 'bg-blue-50',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: ChefHat,
    bgColor: 'bg-indigo-50',
  },
  ready: {
    label: 'Ready',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Package,
    bgColor: 'bg-purple-50',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Truck,
    bgColor: 'bg-orange-50',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    bgColor: 'bg-red-50',
  },
};

type OrderStatus = keyof typeof statusConfig;

// Map status keys to stats keys
const statusToStatsKey: Record<string, keyof OrderStats> = {
  pending: 'pending',
  confirmed: 'confirmed',
  preparing: 'preparing',
  ready: 'ready',
  out_for_delivery: 'outForDelivery',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Paginated orders
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFilter !== 'all') params.set('dateRange', dateFilter);

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combined debounced fetch for all filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, searchQuery ? 300 : 0); // Only debounce for search queries
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/_/g, '_') as OrderStatus;
    return statusConfig[normalizedStatus] || statusConfig.pending;
  };

  const formatDate = (dateString: string) => {
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
            Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchOrders}>
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          {/* Mobile Filters - Icon buttons with dropdowns */}
          <div className="flex sm:hidden items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-9 h-9 p-0 justify-center [&>svg:last-child]:hidden">
                <Filter className={cn("w-4 h-4", statusFilter !== 'all' && "text-primary")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-9 h-9 p-0 justify-center [&>svg:last-child]:hidden">
                <Calendar className={cn("w-4 h-4", dateFilter !== 'all' && "text-primary")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                placeholder="Search orders by ID or customer name..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {/* Date Filter - Desktop only */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="hidden sm:flex w-full sm:w-44">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No orders found matching your criteria
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[150px]">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[200px]">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[200px]">
                        Items
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 w-[140px]">
                        Status
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 w-[100px]">
                        Total
                      </th>
                      <th className="py-4 px-4 w-[60px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => {
                      const config = getStatusConfig(order.status);
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          style={{ height: '60px' }}
                        >
                          <td className="py-3 px-6">
                            <div>
                              <p className="font-medium text-[#1A1A1A]">#{order.id.slice(-8).toUpperCase()}</p>
                              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                            </div>
                          </td>
                          <td className="py-3 px-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={order.customer.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {order.customer.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">
                                  {order.customer.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {order.customer.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-6">
                            <p className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">
                              {order.items.map(i => i.name).join(', ')}
                            </p>
                          </td>
                          <td className="py-3 px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    'h-auto py-1 px-2 gap-1',
                                    config.color
                                  )}
                                >
                                  <config.icon className="w-3 h-3" />
                                  {config.label}
                                  <ChevronDown className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                  <DropdownMenuItem
                                    key={key}
                                    className="gap-2 cursor-pointer"
                                    onClick={() => handleUpdateStatus(order.id, key)}
                                  >
                                    <cfg.icon className="w-4 h-4" />
                                    {cfg.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="py-3 px-6 text-right">
                            <span className="font-semibold text-[#1A1A1A]">
                              ${order.total.toFixed(2)}
                            </span>
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
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Empty rows to maintain consistent height */}
                    {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - paginatedOrders.length) }).map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-gray-50" style={{ height: '60px' }}>
                        <td colSpan={6} className="py-3 px-6">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginatedOrders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <div key={order.id} className="p-4">
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                          <AvatarImage src={order.customer.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {order.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-medium text-[#1A1A1A] truncate">{order.customer.name}</h3>
                              </div>
                              <p className="text-sm text-gray-500">#{order.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewOrder(order)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600 focus:text-red-600" 
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {/* Items and Total */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </span>
                            <span className="font-semibold text-[#1A1A1A]">${order.total.toFixed(2)}</span>
                          </div>

                          {/* Status and Date row */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    'h-auto py-1 px-2 gap-1 text-[10px]',
                                    config.color
                                  )}
                                >
                                  <config.icon className="w-3 h-3" />
                                  {config.label}
                                  <ChevronDown className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                  <DropdownMenuItem
                                    key={key}
                                    className="gap-2 cursor-pointer"
                                    onClick={() => handleUpdateStatus(order.id, key)}
                                  >
                                    <cfg.icon className="w-4 h-4" />
                                    {cfg.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {/* Pagination always at bottom */}
          <div className="mt-auto pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={orders.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} modal={true}>
        <DialogContent 
          className="w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-2xl p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl h-[85vh] sm:h-[600px] flex flex-col overflow-hidden"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {selectedOrder && (() => {
            const config = getStatusConfig(selectedOrder.status);
            return (
              <>
                {/* Modal Header */}
                <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-amber-50/50 to-white flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 pr-10">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <DialogTitle className="font-heading text-base sm:text-lg font-semibold text-[#1A1A1A]">
                          Order #{selectedOrder.id.slice(-8).toUpperCase()}
                        </DialogTitle>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] sm:text-xs py-0.5 px-2', config.color)}
                        >
                          <config.icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatDate(selectedOrder.createdAt)}
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

                <Tabs defaultValue="details" className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Tab Navigation */}
                  <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-0 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <TabsList className="inline-flex h-9 sm:h-10 items-center justify-start gap-0 bg-transparent p-0">
                      <TabsTrigger 
                        value="details" 
                        className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                      >
                        Order Details
                      </TabsTrigger>
                      <TabsTrigger 
                        value="customer" 
                        className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                      >
                        Customer
                      </TabsTrigger>
                      <TabsTrigger 
                        value="summary" 
                        className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent border-0 shadow-none rounded-none data-[state=active]:shadow-none after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200 whitespace-nowrap"
                      >
                        Summary
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tab Content - Fixed Height Container */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 py-4 sm:py-5 min-h-0">
                    {/* Order Details Tab */}
                    <TabsContent value="details" className="mt-0 space-y-4 data-[state=inactive]:hidden h-full">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items ({selectedOrder.items.length})</h4>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                              {/* Item Image */}
                              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                                {item.image ? (
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-2xl">
                                    🥟
                                  </div>
                                )}
                              </div>
                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                              </div>
                              {/* Item Total */}
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-[#1A1A1A]">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Notes */}
                      {selectedOrder.notes && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-amber-700 mb-1">Customer Note</p>
                              <p className="text-sm text-amber-800 break-words">{selectedOrder.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <button
                              type="button"
                              key={key}
                              onClick={() => {
                                handleUpdateStatus(selectedOrder.id, key);
                                setSelectedOrder({ ...selectedOrder, status: key });
                              }}
                              className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                                selectedOrder.status === key
                                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                              )}
                            >
                              <cfg.icon className="w-3 h-3" />
                              {cfg.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Customer Tab */}
                    <TabsContent value="customer" className="mt-0 space-y-4 data-[state=inactive]:hidden h-full">
                      {/* Customer Profile */}
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                            <AvatarImage src={selectedOrder.customer.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base font-semibold">
                              {selectedOrder.customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-[#1A1A1A] truncate">
                              {selectedOrder.customer.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {selectedOrder.customer.email}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Phone */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-sm font-medium text-[#1A1A1A] truncate">
                                {selectedOrder.customer.phone || 'Not provided'}
                              </p>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500">Delivery Address</p>
                              <p className="text-sm font-medium text-[#1A1A1A] break-words">
                                {selectedOrder.customer.address || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button type="button" variant="outline" size="sm" className="gap-2 h-10">
                          <Phone className="w-4 h-4" />
                          Call Customer
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="gap-2 h-10">
                          <User className="w-4 h-4" />
                          View Profile
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="mt-0 space-y-4 data-[state=inactive]:hidden h-full">
                      {/* Order Summary */}
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Payment Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-[#1A1A1A]">${selectedOrder.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="text-[#1A1A1A]">${selectedOrder.deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-[#1A1A1A]">${selectedOrder.tax.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-base font-semibold">
                            <span className="text-[#1A1A1A]">Total</span>
                            <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Order Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[#1A1A1A]">Order Placed</p>
                              <p className="text-xs text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                          </div>
                          {selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled' && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[#1A1A1A]">Last Updated</p>
                                <p className="text-xs text-gray-500">{formatDate(selectedOrder.updatedAt)}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                              config.bgColor
                            )}>
                              <config.icon className={cn('w-4 h-4', config.color.split(' ')[1])} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[#1A1A1A]">Current Status</p>
                              <p className="text-xs text-gray-500">{config.label}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                {/* Modal Footer */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between gap-3 flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel Order</span>
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button 
                      type="button"
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 gap-2"
                      onClick={() => setIsDetailsOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
