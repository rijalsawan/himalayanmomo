import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all customers for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const dateRange = searchParams.get('dateRange');

    // Build date filter
    let dateFilter: Date | undefined;
    if (dateRange === 'today') {
      dateFilter = new Date();
      dateFilter.setHours(0, 0, 0, 0);
    } else if (dateRange === 'week') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (dateRange === 'month') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    // Build where clause
    const whereClause: {
      role?: 'USER' | 'ADMIN';
      createdAt?: { gte: Date };
    } = {};
    
    if (role && role !== 'all') {
      whereClause.role = role.toUpperCase() as 'USER' | 'ADMIN';
    }
    
    if (dateFilter) {
      whereClause.createdAt = { gte: dateFilter };
    }

    // Get all users with their order aggregates
    const users = await prisma.user.findMany({
      where: whereClause,
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
        role: user.role,
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

    // Calculate overall stats
    const stats = {
      totalCustomers: customers.length,
      totalAdmins: customers.filter((c) => c.role === 'ADMIN').length,
      totalUsers: customers.filter((c) => c.role === 'USER').length,
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
