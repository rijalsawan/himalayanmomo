import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
    const lastOrder = user.orders[0];
    const hasRecentOrder = lastOrder
      ? new Date(lastOrder.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : false;

    return NextResponse.json({
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
      orders: user.orders.map((order) => ({
        id: order.id,
        date: order.createdAt.toISOString().split('T')[0],
        items: order.items.length,
        total: order.total,
        status: order.status.toLowerCase(),
      })),
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

// PATCH - Update customer details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
