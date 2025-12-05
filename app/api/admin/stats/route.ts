import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const last7Days = subDays(today, 7);
    const last30Days = subDays(today, 30);

    // Get all orders
    const allOrders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Get all menu items
    const allMenuItems = await prisma.menuItem.findMany();

    // Today's stats
    const todayOrders = allOrders.filter(
      (order) => order.createdAt >= today && order.createdAt <= endOfDay(now)
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    // This week stats
    const weekOrders = allOrders.filter((order) => order.createdAt >= last7Days);
    const weekRevenue = weekOrders.reduce((sum, order) => sum + order.total, 0);

    // This month stats
    const monthOrders = allOrders.filter((order) => order.createdAt >= last30Days);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);

    // Order status counts
    const statusCounts = {
      PENDING: allOrders.filter((o) => o.status === "PENDING").length,
      CONFIRMED: allOrders.filter((o) => o.status === "CONFIRMED").length,
      PREPARING: allOrders.filter((o) => o.status === "PREPARING").length,
      READY: allOrders.filter((o) => o.status === "READY").length,
      OUT_FOR_DELIVERY: allOrders.filter((o) => o.status === "OUT_FOR_DELIVERY").length,
      DELIVERED: allOrders.filter((o) => o.status === "DELIVERED").length,
      CANCELLED: allOrders.filter((o) => o.status === "CANCELLED").length,
    };

    // Revenue by day (last 7 days)
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const dayOrders = allOrders.filter(
        (order) => order.createdAt >= dayStart && order.createdAt <= dayEnd
      );
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      revenueByDay.push({
        day: format(date, "EEE"),
        date: format(date, "MMM d"),
        revenue: Math.round(revenue * 100) / 100,
        orders: dayOrders.length,
      });
    }

    // Orders by hour (for today)
    const ordersByHour = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourOrders = todayOrders.filter((order) => {
        const orderHour = order.createdAt.getHours();
        return orderHour === hour;
      });
      if (hour >= 10 && hour <= 22) {
        ordersByHour.push({
          hour: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? "PM" : "AM"}`,
          orders: hourOrders.length,
          revenue: Math.round(hourOrders.reduce((sum, o) => sum + o.total, 0) * 100) / 100,
        });
      }
    }

    // Top selling items
    const itemSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemSales[item.name]) {
          itemSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        itemSales[item.name].quantity += item.quantity;
        itemSales[item.name].revenue += item.price * item.quantity;
      });
    });
    const topItems = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Category distribution
    const categoryStats = {
      momos: allMenuItems.filter((item) => item.category === "momos").length,
      sides: allMenuItems.filter((item) => item.category === "sides").length,
      drinks: allMenuItems.filter((item) => item.category === "drinks").length,
      desserts: allMenuItems.filter((item) => item.category === "desserts").length,
    };

    // New customers this week
    const newCustomersThisWeek = allUsers.filter(
      (user) => user.createdAt >= last7Days
    ).length;

    // Average order value
    const avgOrderValue =
      allOrders.length > 0
        ? Math.round((allOrders.reduce((sum, o) => sum + o.total, 0) / allOrders.length) * 100) / 100
        : 0;

    return NextResponse.json({
      overview: {
        todayRevenue,
        todayOrders: todayOrders.length,
        weekRevenue,
        weekOrders: weekOrders.length,
        monthRevenue,
        monthOrders: monthOrders.length,
        totalCustomers: allUsers.length,
        newCustomersThisWeek,
        avgOrderValue,
        totalMenuItems: allMenuItems.length,
      },
      statusCounts,
      revenueByDay,
      ordersByHour,
      topItems,
      categoryStats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
