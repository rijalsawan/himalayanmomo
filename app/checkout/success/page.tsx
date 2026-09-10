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
  Download,
  Printer,
  Clock,
  MapPin,
  Phone,
  FileText,
  ChevronRight,
  Store,
  UtensilsCrossed,
  Truck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

type FulfillmentType = 'PICKUP' | 'DINE_IN' | 'DELIVERY';

interface OrderData {
  id: string;
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  address: string;
  phone: string;
  fulfillmentType?: FulfillmentType;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }[];
}

// Small hand-drawn-style momo dumpling doodle, reused for celebratory / empty states.
const MomoDoodle = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
    <path
      d="M24 6c9 0 16 5.5 16 14 0 6-4 9-4 13 0 3.5-2.5 5-4 5H16c-1.5 0-4-1.5-4-5 0-4-4-7-4-13C8 11.5 15 6 24 6Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path d="M24 6c9 0 16 5.5 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M14 20c2-4 5.5-6 10-6s8 2 10 6" stroke="#00000022" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="8" r="1.6" fill="#00000033" />
  </svg>
);

// Rising steam swirl doodle used behind success/loading states.
const SteamSwirl = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 60" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 58c-4-6 4-10 0-16s4-10 0-16 4-10 0-16"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.35"
    />
  </svg>
);

// Ring of momo doodles + steam that pop in around the success checkmark.
const CelebrationGraphic = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {[
      { top: '-8%', left: '6%', size: 'w-7 h-7', color: 'text-golden', delay: '0ms' },
      { top: '4%', left: '86%', size: 'w-6 h-6', color: 'text-brand-light', delay: '120ms' },
      { top: '70%', left: '2%', size: 'w-5 h-5', color: 'text-herb', delay: '240ms' },
      { top: '78%', left: '90%', size: 'w-8 h-8', color: 'text-golden', delay: '80ms' },
      { top: '-4%', left: '46%', size: 'w-5 h-5', color: 'text-brand-light', delay: '200ms' },
    ].map((d, i) => (
      <MomoDoodle
        key={i}
        className={`absolute ${d.size} ${d.color} animate-in zoom-in fade-in duration-700`}
        style={{ top: d.top, left: d.left, animationDelay: d.delay }}
      />
    ))}
    <SteamSwirl className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-16 text-dark animate-in fade-in duration-1000" />
  </div>
);

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
            .logo { font-size: 24px; font-weight: bold; color: #B3060A; margin-bottom: 4px; }
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
            .logo { font-size: 24px; font-weight: bold; color: #B3060A; margin-bottom: 4px; }
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

  const fulfillment = order.fulfillmentType || 'PICKUP';

  return (
    <div className="fixed inset-0 bg-dark/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-warm-light border-[1.5px] sm:border-brutal border-dark shadow-brutal-lg max-w-md w-full my-auto rounded-none animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Receipt Preview */}
        <div ref={receiptRef} className="p-6 max-h-[65vh] overflow-y-auto scrollbar-hide">
          <div className="header text-center mb-6 pb-4 border-b-2 border-dashed border-dark/20">
            <div className="logo font-heading text-2xl font-bold text-brand">MO:MO Station</div>
            <div className="tagline text-xs text-dark/50">The taste of Nepal.</div>
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
            {order.deliveryFee > 0 && (
              <div className="total-row flex justify-between mb-1.5 text-sm">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row final flex justify-between font-heading text-lg font-bold pt-2 border-t-[1.5px] border-dark mt-2 text-dark">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="delivery-info text-xs text-dark/60 mb-5 p-3 bg-cream border-[1.5px] border-dark/10" style={{ overflow: 'visible' }}>
            <p className="mb-1"><strong>{fulfillment === 'DELIVERY' ? 'Delivery Address' : fulfillment === 'DINE_IN' ? 'Dine-In Location' : 'Pickup Location'}:</strong></p>
            <p className="mb-2" style={{ wordBreak: 'break-word' }}>{order.address}</p>
            <p style={{ wordBreak: 'break-word' }}><strong>Phone:</strong> {order.phone}</p>
          </div>

          <div className="footer text-center text-xs text-dark/50 pt-4 border-t-2 border-dashed border-dark/20">
            <p className="thank-you text-sm font-semibold text-dark mb-2">Thank you for your order!</p>
            <p className="mb-1">Questions? Contact us at support@momostation.com</p>
            <p>www.momostation.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t-[1.5px] border-dark bg-cream">
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="flex-1 rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal text-xs uppercase tracking-wide shadow-brutal-sm brutal-hover">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          <Button onClick={onClose} variant="ghost" className="w-full mt-2 rounded-none font-mono-brutal text-xs uppercase tracking-wide text-dark/60 hover:text-dark hover:bg-transparent">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-warm-light">
    <Navbar />
    <main className="pt-20 flex items-center justify-center min-h-[80vh]">
      <div className="text-center px-4">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-[1.5px] border-dark rounded-full border-t-brand animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <MomoDoodle className="w-9 h-9 text-golden" />
          </div>
          <SteamSwirl className="absolute -top-9 left-1/2 -translate-x-1/2 w-4 h-10 text-dark/40" />
        </div>
        <h2 className="font-heading text-xl font-bold text-dark mb-2">
          Processing your order...
        </h2>
        <p className="text-dark/50 font-mono-brutal text-xs uppercase tracking-wide">Please wait while we confirm your payment</p>
      </div>
    </main>
    <Footer />
  </div>
);

// Error State - friendly "dropped momo" graphic instead of a plain red X
const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-warm-light">
    <Navbar />
    <main className="pt-20">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-[1.5px] border-dark bg-cream shadow-brutal-sm flex items-center justify-center">
              <MomoDoodle className="w-12 h-12 text-brand -rotate-12" />
            </div>
            {[
              { top: '-4%', left: '-6%' },
              { top: '82%', left: '84%' },
              { top: '78%', left: '-8%' },
            ].map((d, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full bg-golden animate-ping"
                style={{ top: d.top, left: d.left, animationDelay: `${i * 150}ms`, animationDuration: '2s' }}
              />
            ))}
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-3">
            Oops, something went wrong
          </h2>
          <p className="text-dark/60 mb-8">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal text-xs uppercase tracking-wide shadow-brutal-sm brutal-hover">
              <Link href="/orders">Check My Orders</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
          <p className="text-dark/40 text-xs mt-6">
            Still stuck?{' '}
            <Link href="/#contact" className="text-brand hover:underline font-medium">
              Contact us
            </Link>{' '}
            and we&apos;ll sort it out.
          </p>
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
  const fulfillment: FulfillmentType = orderData?.fulfillmentType || 'PICKUP';
  const fulfillmentMeta = {
    PICKUP: { label: 'Pickup', icon: Store, eta: '15-20 min', detailsTitle: 'Pickup Details', addressLabel: 'Pickup Location' },
    DINE_IN: { label: 'Dine-In', icon: UtensilsCrossed, eta: '15-20 min', detailsTitle: 'Dine-In Details', addressLabel: 'Table Location' },
    DELIVERY: { label: 'Delivery', icon: Truck, eta: '30-45 min', detailsTitle: 'Delivery Details', addressLabel: 'Delivery Address' },
  }[fulfillment];
  const FulfillmentIcon = fulfillmentMeta.icon;

  return (
    <div className="min-h-screen bg-warm-light">
      <Navbar />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-cream border-b-[1.5px] border-dark/10">
          <div className="container-custom py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-sm text-dark/50">
              <Link href="/" className="hover:text-brand transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-dark font-medium">Order Confirmed</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8 relative">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
                <CelebrationGraphic />
                <div className="relative w-full h-full rounded-full border-[1.5px] border-dark bg-herb/15 shadow-brutal-golden flex items-center justify-center animate-in zoom-in-50 duration-500">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-herb" />
                </div>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-2">
                Order Confirmed!
                <Sparkles className="inline-block w-6 h-6 text-golden ml-2 -translate-y-2" />
              </h1>
              {orderData && (
                <p className="text-brand font-heading font-bold text-lg">
                  Order #{orderData.id.slice(-8).toUpperCase()}
                </p>
              )}
              <p className="text-dark/60 mt-2">
                Thank you for your order. Your delicious momos are being prepared!
              </p>
            </div>

            {/* Order Details Card */}
            {orderData && (
              <div className="border-[1.5px] border-dark bg-warm-light shadow-brutal-sm mb-6">
                <div className="p-4 sm:p-6">
                  {/* Order Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-[1.5px] border-dark/10">
                    <div>
                      <p className="font-mono-brutal text-xs uppercase tracking-wide text-dark/50">Order Date</p>
                      <p className="font-medium text-dark">
                        {orderDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-dark bg-herb/15 text-herb px-3 py-1.5 font-mono-brutal text-[11px] font-bold uppercase tracking-wide">
                      <Clock className="w-3 h-3" />
                      Est. {fulfillmentMeta.eta}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-mono-brutal text-xs font-bold text-dark/50 uppercase tracking-wide mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {orderData.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 border-[1.5px] border-dark/15 bg-cream overflow-hidden flex-shrink-0">
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
                                <Package className="w-5 h-5 text-dark/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-dark truncate">{item.name}</p>
                            <p className="text-sm text-dark/50">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-dark">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mb-6 pt-4 border-t-[1.5px] border-dark/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark/50">Subtotal</span>
                      <span className="text-dark">${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark/50">Tax</span>
                      <span className="text-dark">${orderData.tax.toFixed(2)}</span>
                    </div>
                    {orderData.deliveryFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-dark/50">Delivery Fee</span>
                        <span className="text-dark">${orderData.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-heading text-lg font-bold pt-2 border-t-[1.5px] border-dark">
                      <span className="text-dark">Total</span>
                      <span className="text-brand">${orderData.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Fulfillment Info */}
                  <div className="p-4 bg-cream border-[1.5px] border-dark/10">
                    <h3 className="font-mono-brutal text-xs font-bold text-dark/50 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <FulfillmentIcon className="w-3.5 h-3.5" />
                      {fulfillmentMeta.detailsTitle}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-dark/40 mt-0.5 flex-shrink-0" />
                        <span className="text-dark/80">{orderData.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-dark/40 flex-shrink-0" />
                        <span className="text-dark/80">{orderData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Button */}
            {orderData && (
              <div className="border-[1.5px] border-dark bg-warm-light shadow-brutal-sm mb-6">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 border-[1.5px] border-dark bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-brand" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-dark">Order Receipt</p>
                        <p className="text-sm text-dark/50">Download or print your receipt</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowReceipt(true)}
                      variant="outline"
                      className="rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-brand hover:text-warm-light hover:border-brand font-mono-brutal text-xs uppercase tracking-wide flex-shrink-0"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Receipt
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next Card */}
            <div className="border-[1.5px] border-dark bg-warm-light shadow-brutal-sm mb-8">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-brand" />
                  <h3 className="font-heading text-lg font-bold text-dark">What&apos;s Next?</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 border-[1.5px] border-dark bg-brand text-warm-light flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-dark">Email Confirmation</p>
                      <p className="text-sm text-dark/50">You&apos;ll receive an email confirmation shortly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 border-[1.5px] border-dark bg-brand text-warm-light flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-dark">Preparation</p>
                      <p className="text-sm text-dark/50">Our chefs will start preparing your order with care.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 border-[1.5px] border-dark bg-brand text-warm-light flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-dark">
                        {fulfillment === 'DELIVERY' ? 'Delivery' : fulfillment === 'DINE_IN' ? 'Enjoy!' : 'Pickup'}
                      </p>
                      <p className="text-sm text-dark/50">
                        {fulfillment === 'DELIVERY'
                          ? 'Your order will be delivered fresh to your doorstep!'
                          : fulfillment === 'DINE_IN'
                          ? "Grab a seat, we'll bring your momos fresh to your table."
                          : "Swing by and grab your order fresh and hot when it's ready!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-none border-[1.5px] border-dark bg-brand hover:bg-brand-dark text-warm-light font-mono-brutal text-xs uppercase tracking-wide shadow-brutal-sm brutal-hover">
                <Link href="/orders">
                  View My Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none border-[1.5px] border-dark bg-warm-light hover:bg-dark hover:text-warm-light font-mono-brutal text-xs uppercase tracking-wide">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t-[1.5px] border-dark/10 text-center">
              <p className="text-sm text-dark/50">
                Questions about your order?{' '}
                <Link href="/#contact" className="text-brand hover:underline font-medium">
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
