import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(req: NextRequest) {
  try {
    const { url, keywords } = await req.json()
    if (!url || !keywords) {
      return NextResponse.json({ error: 'URL dan keyword wajib diisi' }, { status: 400 })
    }

    // Fetch website content
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)
    const text = $('body').text().toLowerCase()

    // Proses keyword
    const keywordArr = keywords.split(',').map((k: string) => k.trim().toLowerCase()).filter(Boolean)
    const result: Record<string, number> = {}
    keywordArr.forEach((kw: string) => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
      result[kw] = (text.match(regex) || []).length
    })

    return NextResponse.json({
      url,
      keywords: result,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan' }, { status: 500 })
  }
} 