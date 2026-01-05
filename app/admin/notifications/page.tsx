'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, ShoppingBag, CheckCircle, AlertTriangle, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'NEW_ORDER' | 'ORDER_COMPLETED' | 'LOW_STOCK' | 'SYSTEM';
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
}

const typeConfig = {
  NEW_ORDER: {
    icon: ShoppingBag,
    color: 'bg-primary',
  },
  ORDER_COMPLETED: {
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  LOW_STOCK: {
    icon: AlertTriangle,
    color: 'bg-amber-500',
  },
  SYSTEM: {
    icon: Bell,
    color: 'bg-blue-500',
  },
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', { method: 'PATCH' });
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, { method: 'PATCH' });
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
      if (response.ok) {
        const notification = notifications.find(n => n.id === id);
        setNotifications(notifications.filter(n => n.id !== id));
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch('/api/admin/notifications', { method: 'DELETE' });
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchNotifications} className="gap-1.5">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          {notifications.length > 0 && (
            <>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
                  <Check className="w-4 h-4" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-500 hover:text-red-600">
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <Card className="border-gray-100">
        <CardContent className="p-0 divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 text-gray-300 mx-auto mb-3 animate-spin" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-4 transition-colors hover:bg-gray-50',
                    !notification.read && 'bg-primary/5'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0', config.color)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm', !notification.read ? 'font-medium text-gray-900' : 'text-gray-700')}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-gray-400 hover:text-primary"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-gray-400 hover:text-red-500"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
