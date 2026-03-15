import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Campaign from '@/models/Campaign';
import { connectDB } from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await connectDB();
    const { campaignId, amount, campaignName, businessName } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Campaign: ${campaignName}`,
              description: `Business: ${businessName}`,
              images: ['https://via.placeholder.com/300'],
            },
            unit_amount: Math.round(amount * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${campaignId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/new?payment=cancelled`,
      metadata: {
        campaignId: campaignId || 'new',
      },
    });

    // Update campaign with session ID if it exists
    if (campaignId) {
      await Campaign.findByIdAndUpdate(
        campaignId,
        { stripeSessionId: session.id },
        { new: true }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
