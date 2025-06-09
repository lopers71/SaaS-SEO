import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const PLAN_LIMITS = {
  free: {
    seoScans: 5,
    heatMaps: 5,
    citations: 5,
  },
  basic: {
    seoScans: 50,
    heatMaps: 50,
    citations: 50,
  },
  pro: {
    seoScans: -1, // unlimited
    heatMaps: -1,
    citations: -1,
  },
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const plan = session.metadata?.plan || 'basic'

        // Update user's subscription
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: 'active',
            startDate: new Date(),
            endDate: null,
          },
          create: {
            userId,
            plan,
            status: 'active',
            startDate: new Date(),
          },
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Update user's subscription to free plan
          await prisma.subscription.update({
            where: { userId },
            data: {
              plan: 'free',
              status: 'active',
              endDate: null,
            },
          })
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Update subscription status
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: subscription.status === 'active' ? 'active' : 'cancelled',
              endDate: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
            },
          })
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe Webhook Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    )
  }
} 