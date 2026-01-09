'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
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
  X,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const notificationTypeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  ORDER_CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  ORDER_PREPARING: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ORDER_READY: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ORDER_OUT_FOR_DELIVERY: { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  ORDER_DELIVERED: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  ORDER_CANCELLED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  PROMOTION: { icon: Gift, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  WELCOME: { icon: Sparkles, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  SYSTEM: { icon: Info, color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastCheckRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (status !== 'authenticated') return;
    
    try {
      setIsLoading(true);
      const res = await fetch('/api/notifications?limit=5');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Poll for new notifications (Vercel serverless compatible)
  useEffect(() => {
    if (status !== 'authenticated') return;

    const pollForUpdates = async () => {
      try {
        const url = lastCheckRef.current 
          ? `/api/notifications/stream?since=${encodeURIComponent(lastCheckRef.current)}`
          : '/api/notifications/stream';
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          
          // Update timestamp for next poll
          lastCheckRef.current = data.timestamp;
          
          // Update unread count
          setUnreadCount(data.unreadCount);
          
          // If we have new notifications, add them
          if (data.notifications.length > 0) {
            setNotifications((prev) => {
              const existingIds = new Set(prev.map(n => n.id));
              const newNotifs = data.notifications.filter(
                (n: Notification) => !existingIds.has(n.id)
              );
              if (newNotifs.length > 0) {
                return [...newNotifs, ...prev].slice(0, 5);
              }
              return prev;
            });
          }
        }
      } catch (error) {
        console.error('Error polling for notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();
    
    // Start polling every 5 seconds
    pollIntervalRef.current = setInterval(pollForUpdates, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [status, fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark single notification as read
  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="relative">
      {/* Notification Button */}
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        className={cn(
          'relative h-10 w-10 rounded-xl border-gray-200 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200',
          isOpen && 'bg-primary/5 border-primary/30'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className={cn('h-5 w-5 transition-colors', isOpen ? 'text-primary' : 'text-gray-600')} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-gray-500 hover:text-primary"
                    onClick={markAllAsRead}
                    disabled={isMarkingRead}
                  >
                    {isMarkingRead ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  We&apos;ll notify you about your orders here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => {
                  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.SYSTEM;
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group relative',
                        !notification.read && 'bg-orange-50/50'
                      )}
                      onClick={(e) => {
                        if (!notification.read) {
                          markAsRead(notification.id, e);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.bgColor)}>
                          <Icon className={cn('w-5 h-5', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              'text-sm line-clamp-1',
                              !notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                            )}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <Link
              href="/orders/notifications"
              className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
