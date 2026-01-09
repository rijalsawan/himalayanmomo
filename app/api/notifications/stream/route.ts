import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Use Node.js runtime (Prisma compatible)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Polling endpoint for notifications (Vercel serverless compatible)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since'); // ISO timestamp for incremental updates

  try {
    // Get unread count
    const unreadCount = await prisma.userNotification.count({
      where: { userId, read: false },
    });

    // Build query for notifications
    const whereClause: { userId: string; createdAt?: { gt: Date } } = { userId };
    
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        whereClause.createdAt = { gt: sinceDate };
      }
    }

    // Get notifications (new ones if 'since' provided, otherwise recent 10)
    const notifications = await prisma.userNotification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: since ? 50 : 10, // More if checking for new, less for initial load
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        read: true,
        createdAt: true,
        orderId: true,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching notification stream:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
