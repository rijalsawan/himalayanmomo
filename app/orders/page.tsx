'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  ChefHat,
  ClipboardCheck,
  ChevronRight,
  Search,
  Calendar,
  Filter,
  X,
  SlidersHorizontal,
  FileText,
  ArrowUpDown,
  Home,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Navbar from '../components/Navbar';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  notes: string | null;
  address: string;
  phone: string;
  createdAt: string;
  items: OrderItem[];
}

type StatusFilter = 'all' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
type DateFilter = 'all' | 'today' | 'week' | 'month' | '3months';
type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low';

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  PENDING: { color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: ClipboardCheck, label: 'Confirmed' },
  PREPARING: { color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', icon: ChefHat, label: 'Preparing' },
  READY: { color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', icon: Package, label: 'Ready' },
  OUT_FOR_DELIVERY: { color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-200', icon: Truck, label: 'On the Way' },
  DELIVERED: { color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', icon: XCircle, label: 'Cancelled' },
};

const dateFilterOptions: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: '3months', label: 'Last 3 Months' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
];

// Loading Skeleton
const OrderSkeleton = () => (
  <Card className="border border-gray-200 shadow-sm">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Receipt Component for printing/downloading
const Receipt = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const orderDate = new Date(order.createdAt);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - Order #${order.id.slice(-8).toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px dashed #e5e7eb; }
            .logo { font-size: 24px; font-weight: bold; color: #D94F04; margin-bottom: 4px; }
            .tagline { font-size: 12px; color: #6b7280; }
            .order-info { margin-bottom: 20px; }
            .order-id { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
            .order-date { font-size: 12px; color: #6b7280; }
            .section-title { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
            .items { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
            .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .item-name { flex: 1; }
            .item-qty { color: #6b7280; margin: 0 8px; }
            .item-price { font-weight: 500; }
            .totals { margin-bottom: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .total-row.final { font-size: 18px; font-weight: bold; padding-top: 8px; border-top: 2px solid #111; margin-top: 8px; }
            .delivery-info { font-size: 12px; color: #6b7280; margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 8px; overflow: visible; }
            .delivery-info p { margin-bottom: 4px; word-break: break-word; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; padding-top: 16px; border-top: 2px dashed #e5e7eb; }
            .footer p { margin-bottom: 4px; }
            .thank-you { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 8px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - Order #${order.id.slice(-8).toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px dashed #e5e7eb; }
            .logo { font-size: 24px; font-weight: bold; color: #D94F04; margin-bottom: 4px; }
            .tagline { font-size: 12px; color: #6b7280; }
            .order-info { margin-bottom: 20px; }
            .order-id { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
            .order-date { font-size: 12px; color: #6b7280; }
            .section-title { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
            .items { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
            .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .item-name { flex: 1; }
            .item-qty { color: #6b7280; margin: 0 8px; }
            .item-price { font-weight: 500; }
            .totals { margin-bottom: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .total-row.final { font-size: 18px; font-weight: bold; padding-top: 8px; border-top: 2px solid #111; margin-top: 8px; }
            .delivery-info { font-size: 12px; color: #6b7280; margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 8px; overflow: visible; }
            .delivery-info p { margin-bottom: 4px; word-break: break-word; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; padding-top: 16px; border-top: 2px dashed #e5e7eb; }
            .footer p { margin-bottom: 4px; }
            .thank-you { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order.id.slice(-8).toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full my-auto">
        {/* Receipt Preview */}
        <div ref={receiptRef} className="p-6 max-h-[65vh] overflow-y-auto scrollbar-hide">
          <div className="header text-center mb-6 pb-4 border-b-2 border-dashed border-gray-200">
            <div className="logo text-2xl font-bold text-primary">MO:MO Station</div>
            <div className="tagline text-xs text-gray-500">The taste of Nepal.</div>
          </div>

          <div className="order-info mb-5">
            <div className="order-id text-sm font-semibold">Order #{order.id.slice(-8).toUpperCase()}</div>
            <div className="order-date text-xs text-gray-500">
              {orderDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="section-title text-xs font-semibold text-gray-500 uppercase mb-2">Items</div>
          <div className="items mb-5 pb-4 border-b border-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="item flex justify-between mb-2 text-sm">
                <span className="item-name flex-1">{item.name}</span>
                <span className="item-qty text-gray-500 mx-2">x{item.quantity}</span>
                <span className="item-price font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="totals mb-5">
            <div className="total-row flex justify-between mb-1.5 text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row flex justify-between mb-1.5 text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="total-row flex justify-between mb-1.5 text-sm">
              <span>Delivery</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="total-row final flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-900 mt-2">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="delivery-info text-xs text-gray-500 mb-5 p-3 bg-gray-50 rounded-lg" style={{ overflow: 'visible' }}>
            <p className="mb-1"><strong>Delivery Address:</strong></p>
            <p className="mb-2" style={{ wordBreak: 'break-word' }}>{order.address}</p>
            <p style={{ wordBreak: 'break-word' }}><strong>Phone:</strong> {order.phone}</p>
          </div>

          <div className="footer text-center text-xs text-gray-500 pt-4 border-t-2 border-dashed border-gray-200">
            <p className="thank-you text-sm font-semibold text-gray-900 mb-2">Thank you for your order!</p>
            <p className="mb-1">Questions? Contact us at support@momostation.com</p>
            <p>www.momostation.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="flex-1 bg-primary hover:bg-primary/90">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          <Button onClick={onClose} variant="ghost" className="w-full mt-2">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  // Receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrder(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (res.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'CANCELLED' } : order
        ));
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setCancellingOrder(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case 'today':
            return orderDate >= startOfDay;
          case 'week':
            const weekAgo = new Date(startOfDay);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(startOfDay);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          case '3months':
            const threeMonthsAgo = new Date(startOfDay);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return orderDate >= threeMonthsAgo;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-high':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'price-low':
        result.sort((a, b) => a.total - b.total);
        break;
    }

    return result;
  }, [orders, searchQuery, statusFilter, dateFilter, sortBy]);

  // Count active filters
  const activeFilterCount = [
    statusFilter !== 'all',
    dateFilter !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('newest');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Navbar />
        <main className="pt-20">
          <div className="bg-white border-b border-gray-100">
            <div className="container-custom py-3 sm:py-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="container-custom py-8 sm:py-12">
            <div className="max-w-4xl mx-auto space-y-4">
              {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
              <span className="text-gray-900 font-medium">My Orders</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    My Orders
                  </h1>
                  <p className="text-sm text-gray-500">
                    {orders.length} order{orders.length !== 1 ? 's' : ''} in total
                  </p>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <Card className="border border-gray-200 shadow-sm mb-6">
              <CardContent className="p-4">
                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by order ID or item name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Desktop Filters */}
                  <div className="hidden sm:flex items-center gap-2">
                    {/* Status Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 gap-2 border-gray-200">
                          <ClipboardCheck className="w-4 h-4" />
                          Status
                          {statusFilter !== 'all' && (
                            <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/10 px-1.5 py-0 text-xs">
                              1
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setStatusFilter('all')}
                          className={statusFilter === 'all' ? 'bg-primary/10' : ''}
                        >
                          All Statuses
                        </DropdownMenuItem>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => setStatusFilter(key as StatusFilter)}
                            className={statusFilter === key ? 'bg-primary/10' : ''}
                          >
                            <config.icon className={`w-4 h-4 mr-2 ${config.color}`} />
                            {config.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Date Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 gap-2 border-gray-200">
                          <Calendar className="w-4 h-4" />
                          Date
                          {dateFilter !== 'all' && (
                            <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/10 px-1.5 py-0 text-xs">
                              1
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {dateFilterOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setDateFilter(option.value)}
                            className={dateFilter === option.value ? 'bg-primary/10' : ''}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 gap-2 border-gray-200">
                          <ArrowUpDown className="w-4 h-4" />
                          Sort
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Sort Orders</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sortOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={sortBy === option.value ? 'bg-primary/10' : ''}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile Filter Button */}
                  <Button 
                    variant="outline" 
                    className="sm:hidden h-10 gap-2 border-gray-200"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 bg-primary text-white px-1.5 py-0 text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobileFilters && (
                  <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 space-y-4">
                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            statusFilter === 'all'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <button
                            key={key}
                            onClick={() => setStatusFilter(key as StatusFilter)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              statusFilter === key
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                      <div className="flex flex-wrap gap-2">
                        {dateFilterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setDateFilter(option.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              dateFilter === option.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                      <div className="flex flex-wrap gap-2">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              sortBy === option.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Filters */}
                {(activeFilterCount > 0 || searchQuery) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1 bg-gray-100 hover:bg-gray-200">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery('')}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {statusFilter !== 'all' && (
                      <Badge variant="secondary" className="gap-1 bg-gray-100 hover:bg-gray-200">
                        Status: {statusConfig[statusFilter]?.label}
                        <button onClick={() => setStatusFilter('all')}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {dateFilter !== 'all' && (
                      <Badge variant="secondary" className="gap-1 bg-gray-100 hover:bg-gray-200">
                        Date: {dateFilterOptions.find(o => o.value === dateFilter)?.label}
                        <button onClick={() => setDateFilter('all')}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  {orders.length === 0 ? (
                    <>
                      <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                        No orders yet
                      </h2>
                      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You haven&apos;t placed any orders yet. Start exploring our delicious momos!
                      </p>
                      <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/menu">Browse Menu</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                        No orders found
                      </h2>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your search or filters to find what you&apos;re looking for.
                      </p>
                      <Button onClick={clearFilters} variant="outline">
                        Clear Filters
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <Card key={order.id} className="border border-gray-200 shadow-sm overflow-hidden">
                      {/* Order Header */}
                      <div
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`p-2.5 sm:p-3 rounded-xl ${statusInfo.bgColor} border flex-shrink-0`}>
                              <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${statusInfo.color}`} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  Order #{order.id.slice(-8).toUpperCase()}
                                </h3>
                                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border text-xs`}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase">Total</p>
                              <p className="font-heading text-lg font-bold text-primary">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                            <div className="p-2 rounded-lg bg-gray-100 hidden sm:block">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      {isExpanded && (
                        <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
                          {/* Order Items */}
                          <div className="pt-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Items
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      ${item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Subtotal</span>
                              <span className="text-gray-700">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Tax</span>
                              <span className="text-gray-700">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Delivery Fee</span>
                              <span className="text-gray-700">
                                {order.deliveryFee === 0 ? (
                                  <span className="text-emerald-600">FREE</span>
                                ) : (
                                  `$${order.deliveryFee.toFixed(2)}`
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                              <span className="font-semibold text-gray-900">Total</span>
                              <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="mt-6 p-4 rounded-xl">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Delivery Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{order.address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700">{order.phone}</span>
                              </div>
                              
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderForReceipt(order);
                                setShowReceipt(true);
                              }}
                              variant="outline"
                              className="flex-1 h-10 border-primary text-primary hover:bg-primary hover:text-white"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Receipt
                            </Button>
                            {order.status === 'PENDING' && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelOrder(order.id);
                                }}
                                disabled={cancellingOrder === order.id}
                                variant="outline"
                                className="flex-1 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                              >
                                {cancellingOrder === order.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Cancel Order
                                  </span>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/menu">
                  <Package className="w-4 h-4 mr-2" />
                  Order More Momos
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      {showReceipt && selectedOrderForReceipt && (
        <Receipt 
          order={selectedOrderForReceipt} 
          onClose={() => {
            setShowReceipt(false);
            setSelectedOrderForReceipt(null);
          }} 
        />
      )}
    </div>
  );
}
