import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user notifications
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const whereClause = {
      userId: session.user.id,
      ...(unreadOnly && { read: false }),
    };

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.userNotification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.userNotification.count({ where: { userId: session.user.id } }),
      prisma.userNotification.count({ where: { userId: session.user.id, read: false } }),
    ]);

    return NextResponse.json({
      notifications,
      totalCount,
      unreadCount,
      hasMore: offset + notifications.length < totalCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Mark all notifications as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.userNotification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Clear all read notifications
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clearAll = searchParams.get('all') === 'true';

    if (clearAll) {
      await prisma.userNotification.deleteMany({
        where: { userId: session.user.id },
      });
    } else {
      await prisma.userNotification.deleteMany({
        where: { userId: session.user.id, read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
