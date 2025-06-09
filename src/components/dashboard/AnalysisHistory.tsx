'use client'

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Button,
  useToast,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

type AnalysisType = 'seo' | 'heatmap' | 'citation'

interface Analysis {
  id: string
  url: string
  createdAt: string
  score?: number
  type: AnalysisType
}

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const [seoRes, heatmapRes, citationRes] = await Promise.all([
        axios.get('/api/seo-scanner/history'),
        axios.get('/api/keyword-heatmap/history'),
        axios.get('/api/citation-management/history')
      ])

      const allAnalyses = [
        ...seoRes.data.map((a: any) => ({ ...a, type: 'seo' as AnalysisType })),
        ...heatmapRes.data.map((a: any) => ({ ...a, type: 'heatmap' as AnalysisType })),
        ...citationRes.data.map((a: any) => ({ ...a, type: 'citation' as AnalysisType }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setAnalyses(allAnalyses)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch analysis history',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeLabel = (type: AnalysisType) => {
    switch (type) {
      case 'seo':
        return 'SEO Scanner'
      case 'heatmap':
        return 'Keyword Heat Map'
      case 'citation':
        return 'Citation Management'
      default:
        return type
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Analysis History</Heading>

        <Tabs>
          <TabList>
            <Tab>All</Tab>
            <Tab>SEO Scanner</Tab>
            <Tab>Keyword Heat Map</Tab>
            <Tab>Citation Management</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AnalysisTable
                analyses={analyses}
                getTypeLabel={getTypeLabel}
                getScoreColor={getScoreColor}
              />
            </TabPanel>
            <TabPanel>
              <AnalysisTable
                analyses={analyses.filter(a => a.type === 'seo')}
                getTypeLabel={getTypeLabel}
                getScoreColor={getScoreColor}
              />
            </TabPanel>
            <TabPanel>
              <AnalysisTable
                analyses={analyses.filter(a => a.type === 'heatmap')}
                getTypeLabel={getTypeLabel}
                getScoreColor={getScoreColor}
              />
            </TabPanel>
            <TabPanel>
              <AnalysisTable
                analyses={analyses.filter(a => a.type === 'citation')}
                getTypeLabel={getTypeLabel}
                getScoreColor={getScoreColor}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}

function AnalysisTable({
  analyses,
  getTypeLabel,
  getScoreColor,
}: {
  analyses: Analysis[]
  getTypeLabel: (type: AnalysisType) => string
  getScoreColor: (score: number) => string
}) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Type</Th>
          <Th>URL</Th>
          <Th>Date</Th>
          <Th>Score</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {analyses.map((analysis) => (
          <Tr key={analysis.id}>
            <Td>
              <Badge>{getTypeLabel(analysis.type)}</Badge>
            </Td>
            <Td>
              <Text noOfLines={1}>{analysis.url}</Text>
            </Td>
            <Td>{format(new Date(analysis.createdAt), 'MMM d, yyyy HH:mm')}</Td>
            <Td>
              {analysis.score !== undefined && (
                <Badge colorScheme={getScoreColor(analysis.score)}>
                  {analysis.score}%
                </Badge>
              )}
            </Td>
            <Td>
              <Button size="sm" colorScheme="blue">
                View Details
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
} 