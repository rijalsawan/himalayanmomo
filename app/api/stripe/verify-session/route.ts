import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

// Verify a Stripe session and create order if not already created
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // Verify payment was successful
    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if order already exists for this session (prevent duplicates)
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        notes: { contains: sessionId },
      },
    });

    if (existingOrder) {
      return NextResponse.json({ 
        success: true, 
        orderId: existingOrder.id,
        message: 'Order already exists' 
      });
    }

    // Parse metadata
    const metadata = stripeSession.metadata || {};
    
    // Parse items from metadata
    let orderItems: { name: string; price: number; quantity: number; image: string | null }[] = [];
    
    if (metadata.items) {
      try {
        orderItems = JSON.parse(metadata.items);
      } catch (e) {
        console.error('Failed to parse items:', e);
      }
    }
    
    // Fallback to line items if metadata parsing failed
    if (orderItems.length === 0 && stripeSession.line_items?.data) {
      orderItems = stripeSession.line_items.data
        .filter(item => item.description !== 'Tax' && item.description !== 'Delivery Fee')
        .map(item => ({
          name: item.description || 'Unknown Item',
          price: (item.amount_total || 0) / 100 / (item.quantity || 1),
          quantity: item.quantity || 1,
          image: null,
        }));
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: 'No items found in order' },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        subtotal: parseFloat(metadata.subtotal || '0'),
        tax: parseFloat(metadata.tax || '0'),
        deliveryFee: parseFloat(metadata.deliveryFee || '0'),
        total: parseFloat(metadata.total || String((stripeSession.amount_total || 0) / 100)),
        address: metadata.deliveryAddress || 'Address not provided',
        phone: metadata.deliveryPhone || 'Phone not provided',
        notes: `Stripe Session: ${sessionId}. ${metadata.deliveryInstructions || ''}`.trim(),
        status: 'CONFIRMED',
        items: {
          create: orderItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('Order created:', order.id);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
