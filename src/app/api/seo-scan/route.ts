import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: 'URL tidak boleh kosong' }, { status: 400 })
    }

    // Fetch website content
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)

    // Analisis sederhana
    const title = $('title').text()
    const metaDesc = $('meta[name="description"]').attr('content') || ''
    const h1 = $('h1').first().text()
    const wordCount = $('body').text().split(/\s+/).length

    return NextResponse.json({
      title,
      metaDesc,
      h1,
      wordCount,
      url,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan' }, { status: 500 })
  }
} 