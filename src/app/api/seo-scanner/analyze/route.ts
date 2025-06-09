import { NextResponse } from 'next/server'
import { withLogging, logError } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Analyze URL with logging
    const result = await withLogging(
      'analyzeUrl',
      async () => {
        // Your existing analysis logic here
        const analysis = {
          url,
          title: 'Sample Title',
          metaDescription: 'Sample Description',
          h1Tags: ['H1 Tag 1', 'H1 Tag 2'],
          images: [
            { src: 'image1.jpg', alt: 'Image 1' },
            { src: 'image2.jpg', alt: '' }
          ],
          links: [
            { href: 'https://example.com/1', text: 'Link 1' },
            { href: 'https://example.com/2', text: 'Link 2' }
          ],
          issues: [
            { type: 'warning', message: 'Missing meta description' },
            { type: 'error', message: 'Image missing alt text' }
          ],
          score: 85
        }

        // Save to database with logging
        await withLogging(
          'saveSeoScan',
          async () => {
            // Get the current user (you'll need to implement this)
            const userId = 'current-user-id'

            return prisma.seoScan.create({
              data: {
                userId,
                url: analysis.url,
                title: analysis.title,
                metaDescription: analysis.metaDescription,
                headings: JSON.stringify({ h1: analysis.h1Tags.length }),
                images: JSON.stringify({
                  total: analysis.images.length,
                  withoutAlt: analysis.images.filter(img => !img.alt).length
                }),
                links: JSON.stringify({
                  total: analysis.links.length,
                  internal: analysis.links.filter(link => link.href.startsWith('/')).length,
                  external: analysis.links.filter(link => !link.href.startsWith('/')).length
                }),
                issues: JSON.stringify(analysis.issues.map(issue => issue.message)),
                score: analysis.score
              }
            })
          },
          { url }
        )

        return analysis
      },
      { url }
    )

    return NextResponse.json(result)
  } catch (error) {
    logError(error as Error, 'seo-scanner-analyze')
    return NextResponse.json(
      { error: 'Failed to analyze URL' },
      { status: 500 }
    )
  }
} 