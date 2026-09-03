import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  console.log('=== Webhook received ===');

  if (!signature) {
    console.error('No stripe signature in header');
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('Webhook verified, event type:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const sessionFromEvent = event.data.object;
      console.log('Checkout session completed, session ID:', sessionFromEvent.id);
      
      try {
        // Fetch the complete session with all data from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionFromEvent.id, {
          expand: ['line_items'],
        });
        
        console.log('Full session retrieved');
        console.log('Customer email:', session.customer_email);
        console.log('Session metadata:', JSON.stringify(session.metadata, null, 2));
        
        const metadata = session.metadata || {};
        
        // Get user from metadata email or customer_email
        const userEmail = metadata.userEmail || session.customer_email;
        console.log('Looking for user with email:', userEmail);
        
        if (!userEmail) {
          console.error('No customer email found in session');
          // Return 200 to acknowledge receipt even if we can't process
          return NextResponse.json({ received: true, error: 'No email' });
        }

        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (!user) {
          console.error('User not found for email:', userEmail);
          return NextResponse.json({ received: true, error: 'User not found' });
        }

        console.log('Found user:', user.id, user.email);

        // Get items from line items (filter out Tax and Delivery Fee)
        let orderItems: { name: string; price: number; quantity: number; image: string | null }[] = [];
        
        if (session.line_items?.data) {
          orderItems = session.line_items.data
            .filter(item => {
              const name = item.description || '';
              return name !== 'Tax' && name !== 'Delivery Fee';
            })
            .map(item => ({
              name: item.description || 'Unknown Item',
              price: (item.amount_total || 0) / 100 / (item.quantity || 1),
              quantity: item.quantity || 1,
              image: null,
            }));
          console.log('Parsed order items from line items:', orderItems.length, 'items');
        }

        if (orderItems.length === 0) {
          console.error('No order items found');
          return NextResponse.json({ received: true, error: 'No items' });
        }

        // Check if order already exists for this Stripe session (prevent duplicates)
        const existingOrder = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existingOrder) {
          console.log('Order already exists for session:', session.id);
          return NextResponse.json({ received: true, message: 'Order already exists' });
        }

        console.log('Creating order with', orderItems.length, 'items');

        // Create order in database
        const rawSubtotal = parseFloat(metadata.subtotal || '0');
        const discountAmount = parseFloat(metadata.discountAmount || '0');
        const discountedSubtotal = Math.max(rawSubtotal - discountAmount, 0);
        const fulfillmentType = (metadata.fulfillmentType as 'PICKUP' | 'DINE_IN' | 'DELIVERY') || 'PICKUP';
        const order = await prisma.order.create({
          data: {
            userId: user.id,
            subtotal: discountedSubtotal,
            tax: parseFloat(metadata.tax || '0'),
            deliveryFee: parseFloat(metadata.deliveryFee || '0'),
            total: parseFloat(metadata.total || String((session.amount_total || 0) / 100)),
            address: metadata.deliveryAddress || 'Address not provided',
            phone: metadata.deliveryPhone || 'Phone not provided',
            notes: metadata.deliveryInstructions || null,
            fulfillmentType,
            stripeSessionId: session.id,
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

        console.log('✅ Order created successfully:', order.id);
        console.log('Order total:', order.total);
        console.log('Order items:', order.items.length);

        // Create notification for new order
        const itemsSummary = orderItems.slice(0, 3).map(item => `${item.name} x${item.quantity}`).join(', ');
        const moreItems = orderItems.length > 3 ? ` +${orderItems.length - 3} more` : '';
        
        await prisma.notification.create({
          data: {
            type: 'NEW_ORDER',
            title: `New Order #${order.id.slice(-8).toUpperCase()}`,
            message: itemsSummary + moreItems,
            orderId: order.id,
          },
        });
        console.log('✅ Notification created for order');
        
      } catch (error) {
        console.error('Error processing checkout session:', error);
        return NextResponse.json({ received: true, error: 'Processing failed' });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
