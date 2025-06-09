'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react'
import AnalyticsCharts from '../../components/dashboard/AnalyticsCharts'

interface DashboardStats {
  totalScans: number
  totalKeywords: number
  totalBacklinks: number
  averageRanking: number
  rankingChange: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/analytics')
        ])

        if (!statsRes.ok || !analyticsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [statsData, analyticsData] = await Promise.all([
          statsRes.json(),
          analyticsRes.json()
        ])

        setStats(statsData)
        setAnalyticsData(analyticsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Box p={8}>Loading...</Box>
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box p={6} bg={bgColor} rounded="lg" shadow="base">
          <Stat>
            <StatLabel>Total Scans</StatLabel>
            <StatNumber>{stats?.totalScans || 0}</StatNumber>
          </Stat>
        </Box>
        <Box p={6} bg={bgColor} rounded="lg" shadow="base">
          <Stat>
            <StatLabel>Total Keywords</StatLabel>
            <StatNumber>{stats?.totalKeywords || 0}</StatNumber>
          </Stat>
        </Box>
        <Box p={6} bg={bgColor} rounded="lg" shadow="base">
          <Stat>
            <StatLabel>Total Backlinks</StatLabel>
            <StatNumber>{stats?.totalBacklinks || 0}</StatNumber>
          </Stat>
        </Box>
        <Box p={6} bg={bgColor} rounded="lg" shadow="base">
          <Stat>
            <StatLabel>Average Ranking</StatLabel>
            <StatNumber>{stats?.averageRanking || 0}</StatNumber>
            <StatHelpText>
              <StatArrow type={stats?.rankingChange > 0 ? 'increase' : 'decrease'} />
              {Math.abs(stats?.rankingChange || 0)}%
            </StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      {analyticsData && <AnalyticsCharts data={analyticsData} />}
    </Container>
  )
} 