import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all orders for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, subtotal, tax, deliveryFee, total, notes, address, phone } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order must have items" }, { status: 400 });
    }

    if (!address || !phone) {
      return NextResponse.json({ error: "Address and phone are required" }, { status: 400 });
    }

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        tax,
        deliveryFee: deliveryFee || 0,
        total,
        notes: notes || null,
        address,
        phone,
        items: {
          create: items.map((item: { name: string; price: number; quantity: number; image?: string }) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
