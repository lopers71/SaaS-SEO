import { NextResponse } from 'next/server'
import { PrismaClient, SeoScan, HeatMap, Citation } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const userId = decoded.id

    // Get the last 30 days of data
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get SEO scan results
    const seoScans = await prisma.seoScan.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get keyword heat maps
    const heatMaps = await prisma.heatMap.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get citation data
    const citations = await prisma.citation.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Process data for charts
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    const keywordRankings = dates.map(date => {
      const scan = seoScans.find((s: SeoScan) => s.createdAt.toISOString().split('T')[0] === date)
      return scan ? scan.averageRanking : null
    })

    const backlinks = dates.map(date => {
      const citation = citations.find((c: Citation) => c.createdAt.toISOString().split('T')[0] === date)
      return citation ? citation.totalBacklinks : null
    })

    const organicTraffic = dates.map(date => {
      const scan = seoScans.find((s: SeoScan) => s.createdAt.toISOString().split('T')[0] === date)
      return scan ? scan.organicTraffic : null
    })

    const pageSpeed = dates.map(date => {
      const scan = seoScans.find((s: SeoScan) => s.createdAt.toISOString().split('T')[0] === date)
      return scan ? scan.pageSpeedScore : null
    })

    return NextResponse.json({
      dates,
      keywordRankings,
      backlinks,
      organicTraffic,
      pageSpeed,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
} 