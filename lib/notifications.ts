import { prisma } from './prisma';
import { UserNotificationType } from '@prisma/client';
import { sendPushNotification } from './web-push';
import { getSiteSettings } from './getSiteSettings';

// Map order status to notification details
const orderStatusMessages: Record<string, { type: UserNotificationType; title: string; getMessage: (orderId: string) => string }> = {
  CONFIRMED: {
    type: 'ORDER_CONFIRMED',
    title: 'Order Confirmed! 🎉',
    getMessage: (orderId: string) => `Your order #${orderId.slice(-8)} has been confirmed and is being prepared.`
  },
  PREPARING: {
    type: 'ORDER_PREPARING',
    title: 'Order Being Prepared 👨‍🍳',
    getMessage: (orderId: string) => `Good news! Your order #${orderId.slice(-8)} is now being prepared.`
  },
  READY: {
    type: 'ORDER_READY',
    title: 'Order Ready! 🚀',
    getMessage: (orderId: string) => `Your order #${orderId.slice(-8)} is ready for pickup!`
  },
  OUT_FOR_DELIVERY: {
    type: 'ORDER_OUT_FOR_DELIVERY',
    title: 'Out for Delivery 🚗',
    getMessage: (orderId: string) => `Your order #${orderId.slice(-8)} is on its way to you!`
  },
  DELIVERED: {
    type: 'ORDER_DELIVERED',
    title: 'Order Delivered ✅',
    getMessage: (orderId: string) => `Your order #${orderId.slice(-8)} has been delivered. Enjoy your meal!`
  },
  CANCELLED: {
    type: 'ORDER_CANCELLED',
    title: 'Order Cancelled ❌',
    getMessage: (orderId: string) => `Your order #${orderId.slice(-8)} has been cancelled. Please contact us if you have questions.`
  }
};

// Create a notification when order status changes
export async function createOrderStatusNotification(
  orderId: string,
  userId: string,
  newStatus: string
): Promise<void> {
  const statusInfo = orderStatusMessages[newStatus];
  
  if (!statusInfo) {
    console.log(`No notification mapping for status: ${newStatus}`);
    return;
  }

  try {
    // Create in-app notification
    await prisma.userNotification.create({
      data: {
        userId,
        type: statusInfo.type,
        title: statusInfo.title,
        message: statusInfo.getMessage(orderId),
        orderId,
      }
    });

    // Get site settings for brand logo
    const siteSettings = await getSiteSettings();
    const iconUrl = siteSettings.heroLogo || '/brandlogo.svg';

    // Send browser push notification
    await sendPushNotification(userId, {
      title: statusInfo.title,
      body: statusInfo.getMessage(orderId),
      icon: iconUrl,
      badge: iconUrl,
      tag: `order-${orderId}`,
      data: {
        url: '/orders',
        orderId
      }
    });

    console.log(`Created notification for user ${userId} - Order ${orderId} status: ${newStatus}`);
  } catch (error) {
    console.error('Error creating order status notification:', error);
    throw error;
  }
}

// Get unread notification count for a user
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.userNotification.count({
    where: {
      userId,
      read: false
    }
  });
}

// Mark notifications as read
export async function markNotificationsAsRead(userId: string, notificationIds?: string[]): Promise<void> {
  if (notificationIds && notificationIds.length > 0) {
    await prisma.userNotification.updateMany({
      where: {
        id: { in: notificationIds },
        userId
      },
      data: { read: true }
    });
  } else {
    await prisma.userNotification.updateMany({
      where: { userId },
      data: { read: true }
    });
  }
}

// Get user notifications with pagination
export async function getUserNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;
  
  const [notifications, total] = await Promise.all([
    prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.userNotification.count({ where: { userId } })
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Create a welcome notification for new users
export async function createWelcomeNotification(userId: string, userName?: string): Promise<void> {
  try {
    const displayName = userName || 'there';
    
    await prisma.userNotification.create({
      data: {
        userId,
        type: 'WELCOME',
        title: 'Welcome to MO:MO Station! 🎉',
        message: `Hey ${displayName}! Thanks for joining us. Browse our menu and enjoy authentic Nepali momos delivered to your door.`,
      }
    });

    // Get site settings for brand logo
    const siteSettings = await getSiteSettings();
    const iconUrl = siteSettings.heroLogo || '/brandlogo.svg';

    // Send welcome push notification
    await sendPushNotification(userId, {
      title: 'Welcome to MO:MO Station! 🎉',
      body: `Hey ${displayName}! Thanks for joining us. Explore our delicious momos!`,
      icon: iconUrl,
      badge: iconUrl,
      tag: 'welcome',
      data: {
        url: '/menu',
      }
    });

    console.log(`Created welcome notification for user ${userId}`);
  } catch (error) {
    console.error('Error creating welcome notification:', error);
    // Don't throw - welcome notification is not critical
  }
}