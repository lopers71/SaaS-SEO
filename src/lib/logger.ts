import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Log file paths
const performanceLogPath = path.join(logsDir, 'performance.log')
const errorLogPath = path.join(logsDir, 'error.log')

// Helper to format timestamp
const getTimestamp = () => new Date().toISOString()

// Helper to write to log file
const writeToLog = (filePath: string, message: string) => {
  const logMessage = `[${getTimestamp()}] ${message}\n`
  fs.appendFileSync(filePath, logMessage)
}

// Performance monitoring
export const logPerformance = async (
  operation: string,
  startTime: number,
  endTime: number,
  additionalInfo?: Record<string, any>
) => {
  const duration = endTime - startTime
  const message = `PERFORMANCE: ${operation} took ${duration}ms${
    additionalInfo ? ` - ${JSON.stringify(additionalInfo)}` : ''
  }`
  writeToLog(performanceLogPath, message)
}

// Error logging
export const logError = (error: Error, context?: string) => {
  const message = `ERROR: ${context ? `[${context}] ` : ''}${error.message}\n${error.stack}`
  writeToLog(errorLogPath, message)
}

// Database operation wrapper with logging
export const withLogging = async <T>(
  operation: string,
  fn: () => Promise<T>,
  additionalInfo?: Record<string, any>
): Promise<T> => {
  const startTime = Date.now()
  try {
    const result = await fn()
    const endTime = Date.now()
    await logPerformance(operation, startTime, endTime, additionalInfo)
    return result
  } catch (error) {
    logError(error as Error, operation)
    throw error
  }
}

// Example usage:
/*
const getUser = async (id: string) => {
  return withLogging(
    'getUser',
    async () => {
      return prisma.user.findUnique({
        where: { id }
      })
    },
    { userId: id }
  )
}
*/ 