import webpush from 'web-push';
import { prisma } from './prisma';

// VAPID keys should be generated once and stored in environment variables
// Generate with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:hello@momostation.com';

// Configure web-push
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  orderId?: string;
  data?: Record<string, unknown>;
}

/**
 * Send push notification to a specific user
 */
export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
): Promise<{ success: number; failed: number }> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('VAPID keys not configured. Push notifications disabled.');
    return { success: 0, failed: 0 };
  }

  try {
    // Get all push subscriptions for this user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      return { success: 0, failed: 0 };
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon-32.svg',
      badge: payload.badge || '/favicon-32.svg',
      tag: payload.tag || payload.orderId || 'momo-notification',
      data: {
        url: payload.url || '/orders',
        orderId: payload.orderId,
        ...payload.data,
      },
    });

    let success = 0;
    let failed = 0;

    // Send to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: { id: string; endpoint: string; p256dh: string; auth: string }) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, notificationPayload);
          return { success: true, id: sub.id };
        } catch (error: unknown) {
          const webPushError = error as { statusCode?: number };
          // If subscription is invalid (410 Gone or 404), remove it
          if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
          throw error;
        }
      })
    );

    results.forEach((result: PromiseSettledResult<{ success: boolean; id: string }>) => {
      if (result.status === 'fulfilled') {
        success++;
      } else {
        failed++;
        console.error('Push notification failed:', result.reason);
      }
    });

    return { success, failed };
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  payload: PushNotificationPayload
): Promise<{ success: number; failed: number }> {
  let totalSuccess = 0;
  let totalFailed = 0;

  const results = await Promise.all(
    userIds.map((userId) => sendPushNotification(userId, payload))
  );

  results.forEach((result) => {
    totalSuccess += result.success;
    totalFailed += result.failed;
  });

  return { success: totalSuccess, failed: totalFailed };
}

/**
 * Get VAPID public key for client-side subscription
 */
export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}
