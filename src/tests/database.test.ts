import { PrismaClient } from '@prisma/client'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

const prisma = new PrismaClient()

describe('Database Operations', () => {
  // Clean up database before tests
  beforeAll(async () => {
    await prisma.$connect()
    // Clean up existing data
    await prisma.citation.deleteMany()
    await prisma.heatMap.deleteMany()
    await prisma.seoScan.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()
    await prisma.googleAuthState.deleteMany()
  })

  // Close database connection after tests
  afterAll(async () => {
    await prisma.$disconnect()
  })

  // Test User Creation
  it('should create a new user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword123'
      }
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
  })

  // Test Subscription Creation
  it('should create a subscription for user', async () => {
    const user = await prisma.user.findFirst()
    expect(user).toBeDefined()

    if (user) {
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'basic',
          status: 'active'
        }
      })

      expect(subscription).toBeDefined()
      expect(subscription.plan).toBe('basic')
    }
  })

  // Test SEO Scan Creation
  it('should create an SEO scan', async () => {
    const user = await prisma.user.findFirst()
    expect(user).toBeDefined()

    if (user) {
      const seoScan = await prisma.seoScan.create({
        data: {
          userId: user.id,
          url: 'https://example.com',
          title: 'Test Page',
          metaDescription: 'Test Description',
          headings: JSON.stringify({ h1: 1, h2: 2 }),
          images: JSON.stringify({ total: 5, withoutAlt: 1 }),
          links: JSON.stringify({ total: 10, internal: 8, external: 2 }),
          issues: JSON.stringify(['Missing meta description', 'Slow loading']),
          score: 85
        }
      })

      expect(seoScan).toBeDefined()
      expect(seoScan.score).toBe(85)
    }
  })

  // Test Heat Map Creation
  it('should create a heat map', async () => {
    const user = await prisma.user.findFirst()
    expect(user).toBeDefined()

    if (user) {
      const heatMap = await prisma.heatMap.create({
        data: {
          userId: user.id,
          url: 'https://example.com',
          keywords: JSON.stringify({ 'test': 5, 'example': 3 }),
          density: JSON.stringify({ 'test': 2.5, 'example': 1.5 }),
          placement: JSON.stringify({
            'test': { inTitle: true, inH1: true, inMetaDescription: true }
          }),
          totalWords: 200
        }
      })

      expect(heatMap).toBeDefined()
      expect(heatMap.totalWords).toBe(200)
    }
  })

  // Test Citation Creation
  it('should create a citation', async () => {
    const user = await prisma.user.findFirst()
    expect(user).toBeDefined()

    if (user) {
      const citation = await prisma.citation.create({
        data: {
          userId: user.id,
          url: 'https://example.com',
          citations: JSON.stringify({
            'google': { found: true, url: 'https://google.com' },
            'facebook': { found: false, url: '' }
          }),
          score: 75
        }
      })

      expect(citation).toBeDefined()
      expect(citation.score).toBe(75)
    }
  })

  // Test Data Retrieval
  it('should retrieve user with related data', async () => {
    const user = await prisma.user.findFirst({
      include: {
        subscription: true,
        seoScans: true,
        heatMaps: true,
        citations: true
      }
    })

    expect(user).toBeDefined()
    expect(user?.subscription).toBeDefined()
    expect(user?.seoScans.length).toBeGreaterThan(0)
    expect(user?.heatMaps.length).toBeGreaterThan(0)
    expect(user?.citations.length).toBeGreaterThan(0)
  })
}) 