import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const PLAN_PRICES = {
  free: 0,
  basic: 2900, // $29.00
  pro: 9900, // $99.00
}

export async function POST(request: Request) {
  try {
    // Get token from cookie
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }

    // Get request body
    const { plan } = await request.json()

    if (!plan || !['free', 'basic', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Handle free plan
    if (plan === 'free') {
      if (user.subscription) {
        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            plan: 'free',
            status: 'active',
            endDate: null
          }
        })
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: 'free',
            status: 'active'
          }
        })
      }

      return NextResponse.json({ success: true })
    }

    // Create Stripe checkout session for paid plans
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            unit_amount: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      client_reference_id: user.id,
      customer_email: user.email,
    })

    return NextResponse.json({ paymentUrl: session.url })
  } catch (error: any) {
    console.error('Subscription Creation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
} 