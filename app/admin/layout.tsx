'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Bell,
  Search,
  ShieldX,
  Home,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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

const notificationTypeConfig = {
  NEW_ORDER: { color: 'bg-primary' },
  ORDER_COMPLETED: { color: 'bg-[#2D6A4F]' },
  LOW_STOCK: { color: 'bg-[#F4A261]' },
  SYSTEM: { color: 'bg-blue-500' },
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

const sidebarLinks = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    badgeKey: 'pendingOrders' as const,
  },
  {
    name: 'Menu Items',
    href: '/admin/menu',
    icon: UtensilsCrossed,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

// Unauthorized Access Component
function UnauthorizedAccess() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, you don&apos;t have permission to access the admin dashboard. 
          This area is restricted to administrators only.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-[#B8420A] text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-primary/30 transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please contact the system administrator.
        </p>
      </div>
    </div>
  );
}

// Loading Component
function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-[#B8420A] flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">HM</span>
        </div>
        <p className="text-gray-600 font-medium">Loading admin panel...</p>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const pathname = usePathname();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications?unreadOnly=true&limit=5');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // Fetch pending orders count
  const fetchPendingOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders?status=PENDING&limit=1');
      if (response.ok) {
        const data = await response.json();
        setPendingOrdersCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchNotifications();
      fetchPendingOrders();
      
      // Poll every 30 seconds for new notifications
      const interval = setInterval(() => {
        fetchNotifications();
        fetchPendingOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session, fetchNotifications, fetchPendingOrders]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state while checking session
  if (status === 'loading') {
    return <AdminLoading />;
  }

  // Check if user is authenticated and has admin role
  if (!session || session.user?.role !== 'ADMIN') {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#B8420A] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              HM
            </div>
            {sidebarOpen && (
              <span className="font-heading font-bold text-lg text-[#1A1A1A]">
                Admin
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-gray-500 hover:text-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 transition-transform',
                !sidebarOpen && 'rotate-180'
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== '/admin' && pathname.startsWith(link.href));
            const badgeCount = link.badgeKey === 'pendingOrders' ? pendingOrdersCount : 0;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-gray-600 hover:bg-[#FDF8F3] hover:text-primary'
                )}
              >
                <link.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-white')} />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{link.name}</span>
                    {badgeCount > 0 && (
                      <Badge
                        className={cn(
                          'ml-auto',
                          isActive
                            ? 'bg-white text-primary'
                            : 'bg-primary text-white'
                        )}
                      >
                        {badgeCount}
                      </Badge>
                    )}
                  </>
                )}
                {!sidebarOpen && badgeCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {badgeCount}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search orders, customers..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:text-primary"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-heading flex items-center justify-between">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-xs font-normal text-gray-500">{unreadCount} unread</span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifications.slice(0, 3).map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn('w-2 h-2 rounded-full', notificationTypeConfig[notification.type].color)} />
                          <span className="font-medium">{notification.title}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-4 line-clamp-1">
                          {notification.message}
                        </span>
                        <span className="text-xs text-gray-400 ml-4">{formatTimeAgo(notification.createdAt)}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <Link href="/admin/notifications">
                    <DropdownMenuItem className="text-center text-primary cursor-pointer justify-center">
                      View all notifications
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 hover:bg-gray-100"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.user?.image || '/images/admin-avatar.jpg'} alt="Admin" />
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {session.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium text-[#1A1A1A]">
                        {session.user?.name || 'Admin'}
                      </span>
                      <span className="text-xs text-gray-500">Administrator</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
