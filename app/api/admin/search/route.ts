import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MenuCategory } from '@prisma/client';

interface SearchResult {
  id: string;
  type: 'order' | 'customer' | 'menuItem';
  title: string;
  subtitle: string;
  meta?: string;
  status?: string;
  href: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim().toLowerCase() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: SearchResult[] = [];

    // Search Orders - by ID or user name/email
    try {
      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { id: { contains: query, mode: 'insensitive' } },
            { user: { name: { contains: query, mode: 'insensitive' } } },
            { user: { email: { contains: query, mode: 'insensitive' } } },
            { phone: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
          items: {
            take: 3,
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      for (const order of orders) {
        results.push({
          id: order.id,
          type: 'order',
          title: `Order #${order.id.slice(-8).toUpperCase()}`,
          subtitle: order.user?.name || order.user?.email || 'Guest',
          meta: `$${order.total.toFixed(2)}`,
          status: order.status,
          href: `/admin/orders?orderId=${order.id}`,
        });
      }
    } catch (orderError) {
      console.error('Order search error:', orderError);
    }

    // Search Customers - by name, email, or phone
    try {
      const customers = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      for (const customer of customers) {
        results.push({
          id: customer.id,
          type: 'customer',
          title: customer.name || 'Unnamed Customer',
          subtitle: customer.email || 'No email',
          meta: `${customer._count.orders} order${customer._count.orders !== 1 ? 's' : ''}`,
          href: `/admin/customers?customerId=${customer.id}`,
        });
      }
    } catch (customerError) {
      console.error('Customer search error:', customerError);
    }

    // Search Menu Items - by name, slug, or description
    try {
      // Check if query matches a category
      const categoryValues: MenuCategory[] = ['momos', 'sides', 'drinks', 'desserts'];
      const matchingCategory = categoryValues.find(cat => 
        cat.toLowerCase().includes(query) || query.includes(cat.toLowerCase())
      );

      const menuItems = await prisma.menuItem.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            ...(matchingCategory ? [{ category: matchingCategory }] : []),
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          isAvailable: true,
        },
        orderBy: { name: 'asc' },
        take: 5,
      });

      for (const item of menuItems) {
        results.push({
          id: item.id,
          type: 'menuItem',
          title: item.name,
          subtitle: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          meta: `$${item.price.toFixed(2)}`,
          status: item.isAvailable ? undefined : 'UNAVAILABLE',
          href: `/admin/menu?itemId=${item.id}`,
        });
      }
    } catch (menuError) {
      console.error('Menu search error:', menuError);
    }

    // Sort results: orders first, then customers, then menu items
    const sortOrder = { order: 0, customer: 1, menuItem: 2 };
    results.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);

    // Limit total results
    const limitedResults = results.slice(0, 12);

    return NextResponse.json({ results: limitedResults, query });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search', details: String(error) },
      { status: 500 }
    );
  }
}
