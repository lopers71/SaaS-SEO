import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the webpage content
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    // Analyze SEO elements
    const title = $('title').text()
    const metaDescription = $('meta[name="description"]').attr('content')
    const h1Tags = $('h1').length
    const h2Tags = $('h2').length
    const images = $('img').length
    const imagesWithoutAlt = $('img:not([alt])').length
    const links = $('a').length
    const internalLinks = $('a[href^="/"], a[href^="' + new URL(url).origin + '"]').length
    const externalLinks = links - internalLinks

    // Check for common SEO issues
    const issues = []
    if (!title) issues.push('Missing title tag')
    if (!metaDescription) issues.push('Missing meta description')
    if (h1Tags === 0) issues.push('No H1 tags found')
    if (h1Tags > 1) issues.push('Multiple H1 tags found')
    if (imagesWithoutAlt > 0) issues.push(`${imagesWithoutAlt} images missing alt text`)

    // Calculate basic SEO score
    let score = 100
    if (!title) score -= 20
    if (!metaDescription) score -= 15
    if (h1Tags === 0) score -= 15
    if (h1Tags > 1) score -= 10
    if (imagesWithoutAlt > 0) score -= Math.min(10, imagesWithoutAlt * 2)
    if (internalLinks === 0) score -= 10
    if (externalLinks === 0) score -= 10

    return NextResponse.json({
      url,
      title,
      metaDescription,
      headings: {
        h1: h1Tags,
        h2: h2Tags,
      },
      images: {
        total: images,
        withoutAlt: imagesWithoutAlt,
      },
      links: {
        total: links,
        internal: internalLinks,
        external: externalLinks,
      },
      issues,
      score: Math.max(0, score),
    })
  } catch (error: any) {
    console.error('SEO Scanner Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze URL' },
      { status: 500 }
    )
  }
} 