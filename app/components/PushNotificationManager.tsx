'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, BellOff, BellRing, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported' | 'localhost';

interface PushNotificationManagerProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact';
}

export default function PushNotificationManager({
  className,
  showLabel = true,
  variant = 'default',
}: PushNotificationManagerProps) {
  const { data: session, status } = useSession();
  const [permission, setPermission] = useState<PermissionState>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vapidPublicKey, setVapidPublicKey] = useState<string>('');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check if we're on localhost (push may not work)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Check if push notifications are supported
  const isPushSupported = typeof window !== 'undefined' && 
    'serviceWorker' in navigator && 
    'PushManager' in window;

  // Register service worker
  useEffect(() => {
    if (!isPushSupported) {
      setPermission('unsupported');
      return;
    }

    // On localhost, show a warning but still allow trying
    if (isLocalhost) {
      setPermission('localhost');
    }

    const registerSW = async () => {
      try {
        // First, unregister any existing service workers to ensure clean state
        const existingRegs = await navigator.serviceWorker.getRegistrations();
        for (const reg of existingRegs) {
          if (reg.active?.scriptURL.includes('sw.js')) {
            // Keep our service worker, just update it
            await reg.update();
          }
        }

        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
        
        setRegistration(reg);
        
        // Check current permission
        const currentPermission = Notification.permission as PermissionState;
        setPermission(currentPermission);

        // Check if already subscribed
        const subscription = await reg.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerSW();
  }, [isPushSupported]);

  // Fetch VAPID public key
  useEffect(() => {
    const fetchVapidKey = async () => {
      try {
        const res = await fetch('/api/push/subscribe');
        if (res.ok) {
          const data = await res.json();
          setVapidPublicKey(data.vapidPublicKey);
          setIsSubscribed(data.isSubscribed);
        }
      } catch (error) {
        console.error('Failed to fetch VAPID key:', error);
      }
    };

    if (status === 'authenticated') {
      fetchVapidKey();
    }
  }, [status]);

  // Convert VAPID key to Uint8Array (Web Push standard format)
  const urlBase64ToUint8Array = (base64String: string): ArrayBuffer => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray.buffer;
  };

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!registration || !vapidPublicKey || !session?.user?.id) {
      console.log('Missing requirements:', { registration: !!registration, vapidPublicKey: !!vapidPublicKey, userId: session?.user?.id });
      return;
    }

    setIsLoading(true);
    try {
      // Request notification permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult as PermissionState);

      if (permissionResult !== 'granted') {
        console.log('Notification permission denied');
        setIsLoading(false);
        return;
      }

      // Wait for service worker to be active
      if (registration.installing || registration.waiting) {
        console.log('Waiting for service worker to become active...');
        await new Promise<void>((resolve) => {
          const sw = registration.installing || registration.waiting;
          if (sw) {
            sw.addEventListener('statechange', () => {
              if (sw.state === 'activated') {
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      }

      // Unsubscribe from any existing subscription first
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        console.log('Unsubscribing from existing subscription...');
        await existingSub.unsubscribe();
      }

      // Subscribe to push with the VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      console.log('VAPID key:', vapidPublicKey);
      console.log('Subscribing with key length:', applicationServerKey.byteLength, 'bytes');
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      console.log('Push subscription created:', subscription.endpoint);

      // Send subscription to server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        setPermission('granted');
        console.log('Push subscription saved to server');
      } else {
        const errorData = await res.json();
        console.error('Server error saving subscription:', errorData);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Failed to subscribe:', err.name, err.message);
      // On localhost, this is expected - don't show error
      if (isLocalhost) {
        setPermission('localhost');
      }
    } finally {
      setIsLoading(false);
    }
  }, [registration, vapidPublicKey, session?.user?.id, isLocalhost]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!registration) return;

    setIsLoading(true);
    try {
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe();
        
        // Remove from server
        await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
          method: 'DELETE',
        });
      }

      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setIsLoading(false);
    }
  }, [registration]);

  // Don't render if not authenticated or not supported
  if (status !== 'authenticated') return null;
  if (permission === 'unsupported') return null;

  // Localhost warning - show disabled state with tooltip
  if (permission === 'localhost' && !isSubscribed) {
    if (variant === 'compact') {
      return (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'h-10 w-10 rounded-xl border-amber-200 bg-amber-50/50 cursor-help',
            className
          )}
          disabled
          title="Push notifications require HTTPS. Deploy to Vercel to enable."
        >
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </Button>
      );
    }
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-9 border-amber-200 bg-amber-50/50 text-amber-700 cursor-help"
          disabled
          title="Push notifications require HTTPS"
        >
          <AlertTriangle className="h-4 w-4" />
          {showLabel && <span>Push needs HTTPS</span>}
        </Button>
        {showLabel && (
          <p className="text-xs text-amber-600">
            Deploy to Vercel to enable
          </p>
        )}
      </div>
    );
  }

  // Compact variant (just an icon button)
  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'h-10 w-10 rounded-xl border-gray-200 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200',
          isSubscribed && 'border-primary/30 bg-primary/5',
          className
        )}
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={isLoading || permission === 'denied'}
        title={
          permission === 'denied'
            ? 'Notifications blocked. Enable in browser settings.'
            : isSubscribed
            ? 'Disable browser notifications'
            : 'Enable browser notifications'
        }
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        ) : permission === 'denied' ? (
          <BellOff className="h-5 w-5 text-gray-400" />
        ) : isSubscribed ? (
          <BellRing className="h-5 w-5 text-primary" />
        ) : (
          <Bell className="h-5 w-5 text-gray-600" />
        )}
      </Button>
    );
  }

  // Default variant with label
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button
        variant={isSubscribed ? 'default' : 'outline'}
        size="sm"
        className={cn(
          'gap-2 h-9 transition-all duration-200',
          isSubscribed 
            ? 'bg-primary hover:bg-primary/90' 
            : 'border-gray-200 hover:bg-primary/5 hover:border-primary/30'
        )}
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={isLoading || permission === 'denied'}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : permission === 'denied' ? (
          <BellOff className="h-4 w-4" />
        ) : isSubscribed ? (
          <Check className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {showLabel && (
          <span>
            {permission === 'denied'
              ? 'Notifications Blocked'
              : isSubscribed
              ? 'Notifications Enabled'
              : 'Enable Notifications'}
          </span>
        )}
      </Button>
      
      {permission === 'denied' && showLabel && (
        <p className="text-xs text-gray-500">
          Enable in browser settings
        </p>
      )}
    </div>
  );
}
