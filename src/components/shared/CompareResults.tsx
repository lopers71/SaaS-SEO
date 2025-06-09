'use client'

import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Heading,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Select,
} from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface CompareResultsProps {
  type: 'seoScan' | 'heatMap' | 'citation'
  results: any[]
  onClose: () => void
}

export default function CompareResults({ type, results, onClose }: CompareResultsProps) {
  const [selectedResults, setSelectedResults] = useState<string[]>([])
  const toast = useToast()

  const handleCompare = () => {
    if (selectedResults.length < 2) {
      toast({
        title: 'Error',
        description: 'Please select at least 2 results to compare',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Logic for comparison will be implemented based on type
  }

  const renderComparisonTable = () => {
    switch (type) {
      case 'seoScan':
        return (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Metric</Th>
                {selectedResults.map((resultId) => (
                  <Th key={resultId}>
                    {results.find(r => r.id === resultId)?.url}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Title Length</Td>
                {selectedResults.map((resultId) => (
                  <Td key={resultId}>
                    {results.find(r => r.id === resultId)?.title?.length || 0}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Meta Description Length</Td>
                {selectedResults.map((resultId) => (
                  <Td key={resultId}>
                    {results.find(r => r.id === resultId)?.metaDescription?.length || 0}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>H1 Tags Count</Td>
                {selectedResults.map((resultId) => (
                  <Td key={resultId}>
                    {results.find(r => r.id === resultId)?.h1Tags?.length || 0}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Images Count</Td>
                {selectedResults.map((resultId) => (
                  <Td key={resultId}>
                    {results.find(r => r.id === resultId)?.images?.length || 0}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Links Count</Td>
                {selectedResults.map((resultId) => (
                  <Td key={resultId}>
                    {results.find(r => r.id === resultId)?.links?.length || 0}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Issues Count</Td>
                {selectedResults.map((resultId) => (
                  <Td key={resultId}>
                    {results.find(r => r.id === resultId)?.issues?.length || 0}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        )

      case 'heatMap':
        return (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Keyword</Th>
                {selectedResults.map((resultId) => (
                  <Th key={resultId}>
                    {results.find(r => r.id === resultId)?.url}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {results[0]?.keywords?.map((keyword: any, index: number) => (
                <Tr key={index}>
                  <Td>{keyword.keyword}</Td>
                  {selectedResults.map((resultId) => {
                    const result = results.find(r => r.id === resultId)
                    const keywordData = result?.keywords?.find((k: any) => k.keyword === keyword.keyword)
                    return (
                      <Td key={resultId}>
                        <VStack align="start" spacing={1}>
                          <Text>Density: {keywordData?.density?.toFixed(2)}%</Text>
                          <Text>Count: {keywordData?.count}</Text>
                          <Badge colorScheme={
                            keywordData?.relevance === 'high' ? 'green' :
                            keywordData?.relevance === 'medium' ? 'orange' : 'red'
                          }>
                            {keywordData?.relevance?.toUpperCase()}
                          </Badge>
                        </VStack>
                      </Td>
                    )
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )

      case 'citation':
        return (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Platform</Th>
                {selectedResults.map((resultId) => (
                  <Th key={resultId}>
                    {results.find(r => r.id === resultId)?.businessName}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {results[0]?.citations?.map((citation: any, index: number) => (
                <Tr key={index}>
                  <Td>{citation.name}</Td>
                  {selectedResults.map((resultId) => {
                    const result = results.find(r => r.id === resultId)
                    const citationData = result?.citations?.find((c: any) => c.name === citation.name)
                    return (
                      <Td key={resultId}>
                        <VStack align="start" spacing={1}>
                          <Badge colorScheme={
                            citationData?.status === 'verified' ? 'green' :
                            citationData?.status === 'unverified' ? 'orange' : 'red'
                          }>
                            {citationData?.status?.toUpperCase()}
                          </Badge>
                          <Text fontSize="sm">{citationData?.address}</Text>
                          <Text fontSize="sm">{citationData?.phone}</Text>
                        </VStack>
                      </Td>
                    )
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )

      default:
        return null
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={4}>Compare Results</Heading>
          <Text mb={4}>Select results to compare:</Text>
          <Select
            multiple
            value={selectedResults}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value)
              setSelectedResults(values)
            }}
            size="lg"
          >
            {results.map((result) => (
              <option key={result.id} value={result.id}>
                {type === 'seoScan' ? result.url :
                 type === 'heatMap' ? result.url :
                 result.businessName}
              </option>
            ))}
          </Select>
        </Box>

        <Button
          colorScheme="blue"
          onClick={handleCompare}
          isDisabled={selectedResults.length < 2}
        >
          Compare Selected Results
        </Button>

        {selectedResults.length >= 2 && (
          <>
            <Divider />
            {renderComparisonTable()}
          </>
        )}

        <Button
          variant="outline"
          onClick={onClose}
        >
          Close Comparison
        </Button>
      </VStack>
    </MotionBox>
  )
} 