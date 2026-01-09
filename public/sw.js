// Service Worker for Push Notifications
// MO:MO Station - Real-time Order Updates

const CACHE_NAME = 'momo-station-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
  event.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');

  let data = {
    title: 'MO:MO Station',
    body: 'You have a new notification',
    icon: '/favicon-32.svg',
    badge: '/favicon-32.svg',
    tag: 'momo-notification',
    data: {},
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || payload.message || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        tag: payload.tag || payload.orderId || data.tag,
        data: payload.data || payload,
      };
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/favicon-32.svg',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    requireInteraction: true,
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Default action or 'view' action - open the orders page
  const urlToOpen = event.notification.data?.url || '/orders';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes('/orders') && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed');
});

// Background sync for offline support (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
});
