'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Package,
  ChefHat,
  Truck,
  CheckCircle,
  XCircle,
  Gift,
  Sparkles,
  Info,
  Trash2,
  Check,
  ChevronRight,
  Loader2,
  RefreshCw,
  Filter,
  ArrowLeft,
  Calendar,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId: string | null;
  read: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'unread' | 'orders' | 'promotions';

const notificationTypeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; category: string }> = {
  ORDER_CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100', category: 'orders' },
  ORDER_PREPARING: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100', category: 'orders' },
  ORDER_READY: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100', category: 'orders' },
  ORDER_OUT_FOR_DELIVERY: { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-100', category: 'orders' },
  ORDER_DELIVERED: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-100', category: 'orders' },
  ORDER_CANCELLED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', category: 'orders' },
  PROMOTION: { icon: Gift, color: 'text-pink-600', bgColor: 'bg-pink-100', category: 'promotions' },
  WELCOME: { icon: Sparkles, color: 'text-amber-600', bgColor: 'bg-amber-100', category: 'promotions' },
  SYSTEM: { icon: Info, color: 'text-gray-600', bgColor: 'bg-gray-100', category: 'system' },
};

const ITEMS_PER_PAGE = 15;

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Loading Skeleton
const NotificationSkeleton = () => (
  <Card className="border border-gray-200 shadow-sm">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async (refresh = false) => {
    if (status !== 'authenticated') return;
    
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: offset.toString(),
        ...(filter === 'unread' && { unreadOnly: 'true' }),
      });

      const res = await fetch(`/api/notifications?${params}`);
      if (res.ok) {
        const data = await res.json();
        let filteredNotifications = data.notifications;

        // Apply client-side filtering for categories
        if (filter === 'orders') {
          filteredNotifications = filteredNotifications.filter((n: Notification) => 
            notificationTypeConfig[n.type]?.category === 'orders'
          );
        } else if (filter === 'promotions') {
          filteredNotifications = filteredNotifications.filter((n: Notification) => 
            notificationTypeConfig[n.type]?.category === 'promotions'
          );
        }

        setNotifications(filteredNotifications);
        setTotalCount(data.totalCount);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [status, currentPage, filter]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, fetchNotifications, router]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      setIsMarkingRead(true);
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsMarkingRead(false);
    }
  };

  // Delete single notification
  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const notification = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setTotalCount((prev) => prev - 1);
        if (!notification?.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Clear all read notifications
  const clearReadNotifications = async () => {
    try {
      setIsClearing(true);
      const res = await fetch('/api/notifications', { method: 'DELETE' });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
            <div className="max-w-3xl mx-auto space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <NotificationSkeleton key={i} />
              ))}
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
              <Link href="/orders" className="hover:text-primary transition-colors">
                My Orders
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Notifications</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link href="/orders">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-gray-200 hover:bg-primary/5 hover:border-primary/30"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                      Notifications
                    </h1>
                    <p className="text-sm text-gray-500">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-gray-200"
                    onClick={() => fetchNotifications(true)}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                  
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2 border-gray-200 text-primary hover:text-primary hover:bg-primary/5"
                      onClick={markAllAsRead}
                      disabled={isMarkingRead}
                    >
                      {isMarkingRead ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Mark all read
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-200">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                        {filter !== 'all' && (
                          <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/10 px-1.5 py-0 text-xs">
                            1
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilter('all')}>
                        <span className={cn(filter === 'all' && 'font-semibold text-primary')}>
                          All Notifications
                        </span>
                        {filter === 'all' && <Check className="ml-auto h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('unread')}>
                        <span className={cn(filter === 'unread' && 'font-semibold text-primary')}>
                          Unread Only
                        </span>
                        {filter === 'unread' && <Check className="ml-auto h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('orders')}>
                        <span className={cn(filter === 'orders' && 'font-semibold text-primary')}>
                          Order Updates
                        </span>
                        {filter === 'orders' && <Check className="ml-auto h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('promotions')}>
                        <span className={cn(filter === 'promotions' && 'font-semibold text-primary')}>
                          Promotions
                        </span>
                        {filter === 'promotions' && <Check className="ml-auto h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </CardContent>
              </Card>
              <Card className={cn('border-gray-200', unreadCount > 0 && 'border-primary/30 bg-primary/5')}>
                <CardContent className="p-4 text-center">
                  <p className={cn('text-2xl font-bold', unreadCount > 0 ? 'text-primary' : 'text-gray-900')}>
                    {unreadCount}
                  </p>
                  <p className="text-xs text-gray-500">Unread</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter((n) => notificationTypeConfig[n.type]?.category === 'orders').length}
                  </p>
                  <p className="text-xs text-gray-500">Orders</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter((n) => notificationTypeConfig[n.type]?.category === 'promotions').length}
                  </p>
                  <p className="text-xs text-gray-500">Promos</p>
                </CardContent>
              </Card>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">No notifications</h3>
                    <p className="text-gray-500 text-sm">
                      {filter === 'unread' 
                        ? "You're all caught up! No unread notifications."
                        : filter === 'orders'
                        ? "No order updates yet. Place an order to get started!"
                        : filter === 'promotions'
                        ? "No promotions at the moment. Stay tuned!"
                        : "We'll notify you about your orders and special offers here."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => {
                  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.SYSTEM;
                  const Icon = config.icon;

                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        'border transition-all duration-200 hover:shadow-md group',
                        !notification.read 
                          ? 'border-primary/30 bg-gradient-to-r from-orange-50/80 to-amber-50/50 shadow-sm' 
                          : 'border-gray-200'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                            config.bgColor
                          )}>
                            <Icon className={cn('w-6 h-6', config.color)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className={cn(
                                  'text-base',
                                  !notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                                )}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-primary"
                                    onClick={() => markAsRead(notification.id)}
                                    title="Mark as read"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-red-500"
                                  onClick={() => deleteNotification(notification.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatFullDate(notification.createdAt)}</span>
                              </div>
                              
                              {notification.orderId && (
                                <Link href="/orders">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs border-primary/30 text-primary hover:bg-primary/5 cursor-pointer"
                                  >
                                    View Order
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                  </Badge>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* Clear Read Button */}
            {totalCount > 0 && totalCount - unreadCount > 0 && (
              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={clearReadNotifications}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Clear read notifications
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
