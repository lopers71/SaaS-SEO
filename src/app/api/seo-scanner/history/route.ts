import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: Request) {
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

    // Get user's SEO scans
    const scans = await prisma.seoScan.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(scans)
  } catch (error: any) {
    console.error('SEO Scanner History Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch SEO scan history' },
      { status: 500 }
    )
  }
} 