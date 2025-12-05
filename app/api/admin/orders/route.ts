import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all orders for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Date range filtering
    if (dateRange) {
      const now = new Date();
      let startDate: Date | undefined;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }

      if (startDate) {
        where.createdAt = { gte: startDate };
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Apply search filter in memory (for order ID and customer name)
    let filteredOrders = orders;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.user.name?.toLowerCase().includes(searchLower) ||
          order.user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Transform orders for frontend
    const transformedOrders = filteredOrders.map((order) => ({
      id: order.id,
      customer: {
        id: order.user.id,
        name: order.user.name || 'Unknown',
        email: order.user.email || '',
        phone: order.phone,
        address: order.address,
        avatar: order.user.image,
      },
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.deliveryFee,
      status: order.status.toLowerCase(),
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    // Calculate stats
    const stats = {
      pending: orders.filter((o) => o.status === 'PENDING').length,
      confirmed: orders.filter((o) => o.status === 'CONFIRMED').length,
      preparing: orders.filter((o) => o.status === 'PREPARING').length,
      ready: orders.filter((o) => o.status === 'READY').length,
      outForDelivery: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
      total: orders.length,
    };

    return NextResponse.json({ orders: transformedOrders, stats });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
