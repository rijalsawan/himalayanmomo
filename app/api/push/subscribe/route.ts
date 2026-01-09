import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getVapidPublicKey } from '@/lib/web-push';

// GET - Get VAPID public key and check subscription status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    const vapidPublicKey = getVapidPublicKey();
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        vapidPublicKey,
        isSubscribed: false,
      });
    }

    // Check if user has any push subscriptions
    const subscriptionCount = await prisma.pushSubscription.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      vapidPublicKey,
      isSubscribed: subscriptionCount > 0,
      subscriptionCount,
    });
  } catch (error) {
    console.error('Error getting push subscription status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Subscribe to push notifications
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscription, userAgent } = body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    // Check if this endpoint already exists
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    });

    if (existing) {
      // Update existing subscription
      await prisma.pushSubscription.update({
        where: { endpoint: subscription.endpoint },
        data: {
          userId: session.user.id,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent: userAgent || null,
        },
      });
    } else {
      // Create new subscription
      await prisma.pushSubscription.create({
        data: {
          userId: session.user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent: userAgent || null,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Subscribed to push notifications' });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Unsubscribe from push notifications
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (endpoint) {
      // Delete specific subscription
      await prisma.pushSubscription.deleteMany({
        where: {
          userId: session.user.id,
          endpoint,
        },
      });
    } else {
      // Delete all subscriptions for user
      await prisma.pushSubscription.deleteMany({
        where: { userId: session.user.id },
      });
    }

    return NextResponse.json({ success: true, message: 'Unsubscribed from push notifications' });
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
