import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the webpage content
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    // Check for common citation platforms
    const citations = {
      google: {
        found: false,
        url: ''
      },
      facebook: {
        found: false,
        url: ''
      },
      twitter: {
        found: false,
        url: ''
      },
      linkedin: {
        found: false,
        url: ''
      },
      instagram: {
        found: false,
        url: ''
      }
    }

    // Check for Google Business Profile
    const googleLinks = $('a[href*="google.com/business"]')
    if (googleLinks.length > 0) {
      citations.google.found = true
      citations.google.url = googleLinks.first().attr('href') || ''
    }

    // Check for Facebook
    const facebookLinks = $('a[href*="facebook.com"]')
    if (facebookLinks.length > 0) {
      citations.facebook.found = true
      citations.facebook.url = facebookLinks.first().attr('href') || ''
    }

    // Check for Twitter
    const twitterLinks = $('a[href*="twitter.com"]')
    if (twitterLinks.length > 0) {
      citations.twitter.found = true
      citations.twitter.url = twitterLinks.first().attr('href') || ''
    }

    // Check for LinkedIn
    const linkedinLinks = $('a[href*="linkedin.com"]')
    if (linkedinLinks.length > 0) {
      citations.linkedin.found = true
      citations.linkedin.url = linkedinLinks.first().attr('href') || ''
    }

    // Check for Instagram
    const instagramLinks = $('a[href*="instagram.com"]')
    if (instagramLinks.length > 0) {
      citations.instagram.found = true
      citations.instagram.url = instagramLinks.first().attr('href') || ''
    }

    // Calculate citation score
    const totalPlatforms = Object.keys(citations).length
    const foundPlatforms = Object.values(citations).filter(c => c.found).length
    const score = Math.round((foundPlatforms / totalPlatforms) * 100)

    return NextResponse.json({
      url,
      citations,
      score
    })
  } catch (error: any) {
    console.error('Citation Management Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze citations' },
      { status: 500 }
    )
  }
} 