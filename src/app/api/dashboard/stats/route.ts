import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

interface SeoScan {
  id: string
  score: number
  [key: string]: any
}

interface HeatMap {
  id: string
  keywords: { [key: string]: number }
  [key: string]: any
}

interface Citation {
  id: string
  score: number
  citations: { [key: string]: { found: boolean } }
  [key: string]: any
}

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

    // Get user's analyses
    const [seoScans, heatMaps, citations] = await Promise.all([
      prisma.seoScan.findMany({
        where: { userId: decoded.userId }
      }),
      prisma.heatMap.findMany({
        where: { userId: decoded.userId }
      }),
      prisma.citation.findMany({
        where: { userId: decoded.userId }
      })
    ])

    // Calculate stats
    const totalScans = seoScans.length + heatMaps.length + citations.length
    
    const averageScore = totalScans > 0
      ? Math.round(
          (seoScans.reduce((sum: number, scan: SeoScan) => sum + scan.score, 0) +
           citations.reduce((sum: number, citation: Citation) => sum + citation.score, 0)) /
          (seoScans.length + citations.length)
        )
      : 0

    const totalKeywords = heatMaps.reduce((sum: number, map: HeatMap) => {
      const keywords = map.keywords as { [key: string]: number }
      return sum + Object.keys(keywords).length
    }, 0)

    const totalCitations = citations.reduce((sum: number, citation: Citation) => {
      const citations = citation.citations as { [key: string]: { found: boolean } }
      return sum + Object.values(citations).filter(c => c.found).length
    }, 0)

    return NextResponse.json({
      totalScans,
      averageScore,
      totalKeywords,
      totalCitations
    })
  } catch (error: any) {
    console.error('Dashboard Stats Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 