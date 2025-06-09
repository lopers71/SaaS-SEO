'use client'

import { Box, Heading, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyticsData {
  dates: string[]
  keywordRankings: number[]
  backlinks: number[]
  organicTraffic: number[]
  pageSpeed: number[]
}

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  const keywordRankingsData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Average Keyword Ranking',
        data: data.keywordRankings,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const backlinksData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Total Backlinks',
        data: data.backlinks,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  }

  const organicTrafficData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Organic Traffic',
        data: data.organicTraffic,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  }

  const pageSpeedData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Page Speed Score',
        data: data.pageSpeed,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)'),
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)'),
        },
      },
    },
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Analytics Overview
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          p={6}
          bg={bgColor}
          rounded="lg"
          shadow="base"
        >
          <Heading size="md" mb={4}>
            Keyword Rankings
          </Heading>
          <Line data={keywordRankingsData} options={chartOptions} />
        </Box>
        <Box
          p={6}
          bg={bgColor}
          rounded="lg"
          shadow="base"
        >
          <Heading size="md" mb={4}>
            Backlinks Growth
          </Heading>
          <Bar data={backlinksData} options={chartOptions} />
        </Box>
        <Box
          p={6}
          bg={bgColor}
          rounded="lg"
          shadow="base"
        >
          <Heading size="md" mb={4}>
            Organic Traffic
          </Heading>
          <Line data={organicTrafficData} options={chartOptions} />
        </Box>
        <Box
          p={6}
          bg={bgColor}
          rounded="lg"
          shadow="base"
        >
          <Heading size="md" mb={4}>
            Page Speed Score
          </Heading>
          <Bar data={pageSpeedData} options={chartOptions} />
        </Box>
      </SimpleGrid>
    </Box>
  )
} 