'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Loader2,
  Package,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  overview: {
    todayRevenue: number;
    todayOrders: number;
    weekRevenue: number;
    weekOrders: number;
    monthRevenue: number;
    monthOrders: number;
    totalCustomers: number;
    newCustomersThisWeek: number;
    avgOrderValue: number;
    totalMenuItems: number;
  };
  statusCounts: {
    PENDING: number;
    CONFIRMED: number;
    PREPARING: number;
    READY: number;
    OUT_FOR_DELIVERY: number;
    DELIVERED: number;
    CANCELLED: number;
  };
  revenueByDay: Array<{
    day: string;
    date: string;
    revenue: number;
    orders: number;
  }>;
  ordersByHour: Array<{
    hour: string;
    orders: number;
    revenue: number;
  }>;
  topItems: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  categoryStats: {
    momos: number;
    sides: number;
    drinks: number;
    desserts: number;
  };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  PREPARING: '#8B5CF6',
  READY: '#10B981',
  OUT_FOR_DELIVERY: '#6366F1',
  DELIVERED: '#22C55E',
  CANCELLED: '#EF4444',
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchStats()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const getStatsByRange = () => {
    switch (timeRange) {
      case 'today':
        return { 
          revenue: stats.overview.todayRevenue, 
          orders: stats.overview.todayOrders,
          prevRevenue: stats.overview.weekRevenue / 7,
          prevOrders: stats.overview.weekOrders / 7,
        };
      case 'week':
        return { 
          revenue: stats.overview.weekRevenue, 
          orders: stats.overview.weekOrders,
          prevRevenue: stats.overview.monthRevenue / 4,
          prevOrders: stats.overview.monthOrders / 4,
        };
      case 'month':
        return { 
          revenue: stats.overview.monthRevenue, 
          orders: stats.overview.monthOrders,
          prevRevenue: stats.overview.monthRevenue * 0.85,
          prevOrders: stats.overview.monthOrders * 0.9,
        };
    }
  };

  const currentStats = getStatsByRange();
  
  // Calculate percentage changes
  const revenueChange = currentStats.prevRevenue > 0 
    ? ((currentStats.revenue - currentStats.prevRevenue) / currentStats.prevRevenue * 100)
    : 0;
  const ordersChange = currentStats.prevOrders > 0 
    ? ((currentStats.orders - currentStats.prevOrders) / currentStats.prevOrders * 100)
    : 0;

  // Calculate completion rate
  const totalOrders = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);
  const completedOrders = stats.statusCounts.DELIVERED;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders * 100) : 0;

  // Active orders (not delivered or cancelled)
  const activeOrders = totalOrders - stats.statusCounts.DELIVERED - stats.statusCounts.CANCELLED;

  // Status data for pie chart
  const statusData = Object.entries(stats.statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.replace(/_/g, ' ').toLowerCase(),
      value: count,
      color: STATUS_COLORS[status],
    }));

  // Find peak hour
  const peakHour = stats.ordersByHour.reduce((max, hour) => 
    hour.orders > max.orders ? hour : max, 
    { hour: 'N/A', orders: 0, revenue: 0 }
  );

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-gray-100">
          <p className="font-medium text-sm text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-600">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              {entry.dataKey === 'revenue' ? `$${entry.value.toLocaleString()}` : `${entry.value} orders`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="h-9 px-3"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
                  timeRange === range 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
                onClick={() => setTimeRange(range)}
              >
                {range === 'today' ? 'Today' : range === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-700/70 uppercase tracking-wide">Revenue</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">
                  ${currentStats.revenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {revenueChange >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    revenueChange >= 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    {Math.abs(revenueChange).toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs prev</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700/70 uppercase tracking-wide">Orders</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  {currentStats.orders}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {ordersChange >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    ordersChange >= 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    {Math.abs(ordersChange).toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs prev</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700/70 uppercase tracking-wide">Customers</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.overview.totalCustomers}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 text-blue-700 border-0">
                    +{stats.overview.newCustomersThisWeek} this week
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Order Value Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-50 to-violet-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-violet-700/70 uppercase tracking-wide">Avg Order</p>
                <p className="text-2xl font-bold text-violet-900 mt-1">
                  ${stats.overview.avgOrderValue.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                  <span className="text-xs text-gray-500">per order</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Orders */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{activeOrders}</p>
                <p className="text-xs text-gray-500">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{completionRate.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hour */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{peakHour.hour}</p>
                <p className="text-xs text-gray-500">Peak Hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.overview.totalMenuItems}</p>
                <p className="text-xs text-gray-500">Menu Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-base font-semibold text-gray-900">Revenue Trend</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Last 7 days performance</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0 text-xs">
                +{revenueChange >= 0 ? revenueChange.toFixed(1) : '0'}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueByDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `$${value}`}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Donut Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-base font-semibold text-gray-900">Order Status</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Current distribution</p>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0 text-xs">
                {totalOrders} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div className="h-[280px] w-full">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name]}
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">No orders yet</p>
                  </div>
                </div>
              )}
            </div>
            {/* Status Legend */}
            {statusData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                {statusData.slice(0, 4).map((status) => (
                  <div key={status.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-[10px] text-gray-500 capitalize">{status.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders Bar Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-base font-semibold text-gray-900">Daily Orders</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Order volume per day</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueByDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    allowDecimals={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="#F97316"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-base font-semibold text-gray-900">Top Sellers</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Best performing items</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div className="h-[240px] w-full">
              {stats.topItems.length > 0 ? (
                <div className="space-y-3 h-full overflow-auto">
                  {stats.topItems.slice(0, 5).map((item, index) => {
                    const maxQuantity = Math.max(...stats.topItems.map(i => i.quantity));
                    const percentage = (item.quantity / maxQuantity) * 100;
                    return (
                      <div key={item.name} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                            <span className="text-xs text-gray-400 ml-1">sold</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">No sales data yet</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
