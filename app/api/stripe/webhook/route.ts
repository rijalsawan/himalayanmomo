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

        // Parse items from metadata
        let orderItems: { name: string; price: number; quantity: number; image: string | null }[] = [];
        
        if (metadata.items) {
          try {
            orderItems = JSON.parse(metadata.items);
            console.log('Parsed order items from metadata:', orderItems.length, 'items');
          } catch (parseError) {
            console.error('Failed to parse items from metadata:', parseError);
          }
        }
        
        // Fallback: get items from line items if metadata parse failed
        if (orderItems.length === 0 && session.line_items?.data) {
          console.log('Using line items as fallback');
          orderItems = session.line_items.data
            .filter(item => item.description !== 'Tax' && item.description !== 'Delivery Fee')
            .map(item => ({
              name: item.description || 'Unknown Item',
              price: (item.amount_total || 0) / 100 / (item.quantity || 1),
              quantity: item.quantity || 1,
              image: null,
            }));
        }

        if (orderItems.length === 0) {
          console.error('No order items found');
          return NextResponse.json({ received: true, error: 'No items' });
        }

        console.log('Creating order with', orderItems.length, 'items');

        // Create order in database
        const order = await prisma.order.create({
          data: {
            userId: user.id,
            subtotal: parseFloat(metadata.subtotal || '0'),
            tax: parseFloat(metadata.tax || '0'),
            deliveryFee: parseFloat(metadata.deliveryFee || '0'),
            total: parseFloat(metadata.total || String((session.amount_total || 0) / 100)),
            address: metadata.deliveryAddress || 'Address not provided',
            phone: metadata.deliveryPhone || 'Phone not provided',
            notes: metadata.deliveryInstructions || null,
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
