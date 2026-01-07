'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Home, 
  Loader2, 
  XCircle,
  Download,
  Printer,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

interface OrderData {
  id: string;
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  address: string;
  phone: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }[];
}

// Receipt Component for printing/downloading
const Receipt = ({ order, onClose }: { order: OrderData; onClose: () => void }) => {
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
            .delivery-info { font-size: 12px; color: #6b7280; margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 8px; }
            .delivery-info p { margin-bottom: 4px; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; padding-top: 16px; border-top: 2px dashed #e5e7eb; }
            .footer p { margin-bottom: 4px; }
            .thank-you { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 8px; }
            .delivery-info { overflow: visible; }
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
            .delivery-info { font-size: 12px; color: #6b7280; margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 8px; }
            .delivery-info p { margin-bottom: 4px; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; padding-top: 16px; border-top: 2px dashed #e5e7eb; }
            .footer p { margin-bottom: 4px; }
            .thank-you { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 8px; }
            .delivery-info { overflow: visible; }
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

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#FDF8F3]">
    <Navbar />
    <main className="pt-20 flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
          Processing your order...
        </h2>
        <p className="text-gray-500">Please wait while we confirm your payment.</p>
      </div>
    </main>
    <Footer />
  </div>
);

// Error State
const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-[#FDF8F3]">
    <Navbar />
    <main className="pt-20">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-8">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/orders">Check My Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAndCreateOrder = async () => {
      if (!sessionId) {
        router.push('/checkout');
        return;
      }

      try {
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          clearCart();
          
          // Fetch full order details
          const orderRes = await fetch(`/api/orders/${data.orderId}`);
          if (orderRes.ok) {
            const order = await orderRes.json();
            setOrderData(order);
          }
          
          setStatus('success');
        } else {
          setErrorMessage(data.error || 'Failed to process order');
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setErrorMessage('An unexpected error occurred');
        setStatus('error');
      }
    };

    verifyAndCreateOrder();
  }, [sessionId, clearCart, router]);

  if (status === 'loading') return <LoadingSkeleton />;
  if (status === 'error') return <ErrorState message={errorMessage} />;

  const orderDate = orderData ? new Date(orderData.createdAt) : new Date();

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
              <span className="text-gray-900 font-medium">Order Confirmed</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              {orderData && (
                <p className="text-primary font-semibold text-lg">
                  Order #{orderData.id.slice(-8).toUpperCase()}
                </p>
              )}
              <p className="text-gray-500 mt-2">
                Thank you for your order. Your delicious momos are being prepared!
              </p>
            </div>

            {/* Order Details Card */}
            {orderData && (
              <Card className="border border-gray-200 shadow-sm mb-6">
                <CardContent className="p-4 sm:p-6">
                  {/* Order Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">
                        {orderDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <Clock className="w-3 h-3 mr-1" />
                      Est. 30-45 min
                    </Badge>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {orderData.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
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
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-900">${orderData.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery</span>
                      <span className="text-gray-900">
                        {orderData.deliveryFee === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `$${orderData.deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-primary">${orderData.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Delivery Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{orderData.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{orderData.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Receipt Button */}
            {orderData && (
              <Card className="border border-gray-200 shadow-sm mb-6">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order Receipt</p>
                        <p className="text-sm text-gray-500">Download or print your receipt</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowReceipt(true)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What's Next Card */}
            <Card className="border border-gray-200 shadow-sm mb-8">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900">What&apos;s Next?</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">Email Confirmation</p>
                      <p className="text-sm text-gray-500">You&apos;ll receive an email confirmation shortly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">Preparation</p>
                      <p className="text-sm text-gray-500">Our chefs will start preparing your order with care.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-500">Your order will be delivered fresh to your doorstep!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/orders">
                  View My Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Questions about your order?{' '}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Receipt Modal */}
      {showReceipt && orderData && (
        <Receipt order={orderData} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}
