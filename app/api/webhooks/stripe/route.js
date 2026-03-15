import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Campaign from '@/models/Campaign';
import { connectDB } from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle payment success
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const campaignId = session.metadata.campaignId;

      if (campaignId !== 'new') {
        await Campaign.findByIdAndUpdate(
          campaignId,
          {
            paymentStatus: 'completed',
            stripePaymentIntentId: session.payment_intent,
            paidAmount: session.amount_total / 100, // Convert from paise to rupees
            paidAt: new Date(),
          },
          { new: true }
        );
      }
    }

    // Handle payment failure
    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const campaignId = session.metadata.campaignId;

      if (campaignId !== 'new') {
        await Campaign.findByIdAndUpdate(
          campaignId,
          { paymentStatus: 'failed' },
          { new: true }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
