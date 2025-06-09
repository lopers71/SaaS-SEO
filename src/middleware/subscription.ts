import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export async function checkSubscriptionLimit(
  request: NextRequest,
  userId: string,
  type: 'seoScans' | 'heatMaps' | 'citations'
) {
  try {
    // Get user's subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user || !user.subscription) {
      return {
        allowed: false,
        message: 'No active subscription found'
      }
    }

    const plan = user.subscription.plan as keyof typeof PLAN_LIMITS
    const limit = PLAN_LIMITS[plan][type]

    // Check if unlimited
    if (limit === -1) {
      return { allowed: true }
    }

    // Count usage
    let count = 0
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    switch (type) {
      case 'seoScans':
        count = await prisma.seoScan.count({
          where: {
            userId,
            createdAt: {
              gte: startOfMonth
            }
          }
        })
        break
      case 'heatMaps':
        count = await prisma.heatMap.count({
          where: {
            userId,
            createdAt: {
              gte: startOfMonth
            }
          }
        })
        break
      case 'citations':
        count = await prisma.citation.count({
          where: {
            userId,
            createdAt: {
              gte: startOfMonth
            }
          }
        })
        break
    }

    if (count >= limit) {
      return {
        allowed: false,
        message: `Monthly limit reached for ${type}. Please upgrade your plan.`
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Subscription Limit Check Error:', error)
    return {
      allowed: false,
      message: 'Failed to check subscription limit'
    }
  }
} 