import { PrismaClient } from '@prisma/client'
import { beforeAll, afterAll } from 'vitest'

const prisma = new PrismaClient()

// Setup before all tests
beforeAll(async () => {
  // Clean up database
  await prisma.citation.deleteMany()
  await prisma.heatMap.deleteMany()
  await prisma.seoScan.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()
  await prisma.googleAuthState.deleteMany()
})

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect()
}) 