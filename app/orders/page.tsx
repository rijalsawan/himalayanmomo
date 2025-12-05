'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  ChefHat,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  PENDING: { color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: ClipboardCheck, label: 'Confirmed' },
  PREPARING: { color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', icon: ChefHat, label: 'Preparing' },
  READY: { color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', icon: Package, label: 'Ready' },
  OUT_FOR_DELIVERY: { color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-200', icon: Truck, label: 'On the Way' },
  DELIVERED: { color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', icon: XCircle, label: 'Cancelled' },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

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

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] relative overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/40 via-[#F4A261]/30 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#F4A261]/40 via-primary/30 to-transparent blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[#F4A261] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                  My Orders
                </h1>
                <p className="text-gray-400 mt-1">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} in total
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start exploring our delicious momos!
            </p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12">
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${statusInfo.bgColor} border`}>
                          <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-[#1A1A1A]">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} border`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-heading text-lg font-bold text-primary">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-100">
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
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
                          {/* Order Items */}
                          <div className="pt-4 space-y-3">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                              Items
                            </h4>
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-[#FDF8F3] flex items-center justify-center text-xl">
                                    🥟
                                  </div>
                                  <div>
                                    <p className="font-medium text-[#1A1A1A]">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      ${item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold text-[#1A1A1A]">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
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
                            {order.deliveryFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="text-gray-700">${order.deliveryFee.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-100">
                              <span className="font-semibold text-[#1A1A1A]">Total</span>
                              <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="mt-6 p-4 bg-[#FDF8F3] rounded-xl space-y-3">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                              Delivery Details
                            </h4>
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{order.address}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                              <p className="text-gray-700">{order.phone}</p>
                            </div>
                            {order.notes && (
                              <div className="flex items-start gap-3 pt-2 border-t border-[#F4A261]/20">
                                <AlertCircle className="w-5 h-5 text-[#F4A261] mt-0.5 flex-shrink-0" />
                                <p className="text-gray-600 text-sm">{order.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Cancel Button */}
                          {order.status === 'PENDING' && (
                            <div className="mt-6">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelOrder(order.id);
                                }}
                                disabled={cancellingOrder === order.id}
                                variant="outline"
                                className="w-full h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                              >
                                {cancellingOrder === order.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Cancel Order
                                  </span>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/menu">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12">
              <span className="flex items-center gap-2">
                <span className="text-lg">🥟</span>
                Order More Momos
              </span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-12 border-gray-300 hover:bg-gray-50">
              <span className="flex items-center gap-2">
                Go to Profile
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
