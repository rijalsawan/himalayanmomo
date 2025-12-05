import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all customers (users with orders) for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Get users with their order aggregates
    const users = await prisma.user.findMany({
      where: {
        orders: {
          some: {}, // Only users who have placed at least one order
        },
      },
      include: {
        orders: {
          include: {
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform and calculate stats for each customer
    let customers = users.map((user) => {
      const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
      const lastOrder = user.orders[0];
      const hasRecentOrder = lastOrder 
        ? new Date(lastOrder.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        : false;

      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.image || '',
        totalOrders: user._count.orders,
        totalSpent,
        lastOrder: lastOrder?.createdAt.toISOString() || null,
        joinedAt: user.createdAt.toISOString(),
        status: hasRecentOrder ? 'active' : 'inactive',
        orders: user.orders.slice(0, 5).map((order) => ({
          id: order.id,
          date: order.createdAt.toISOString().split('T')[0],
          items: order.items.length,
          total: order.total,
          status: order.status.toLowerCase(),
        })),
      };
    });

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      customers = customers.filter((customer) => customer.status === status);
    }

    // Calculate overall stats
    const stats = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter((c) => c.status === 'active').length,
      inactiveCustomers: customers.filter((c) => c.status === 'inactive').length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    };

    const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

    return NextResponse.json({
      customers,
      stats: {
        ...stats,
        avgOrderValue,
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
