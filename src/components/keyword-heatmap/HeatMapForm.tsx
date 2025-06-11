'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Divider,
  List,
  ListItem,
  ListIcon,
  Badge,
  HStack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { FaCheck, FaTimes, FaExclamationTriangle, FaExchangeAlt } from 'react-icons/fa'
import { FaCodeCompare } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import ExportResults from '../shared/ExportResults'
import CompareResults from '../shared/CompareResults'

const MotionBox = motion(Box)

interface KeywordData {
  keyword: string
  density: number
  position: number
  count: number
  relevance: 'high' | 'medium' | 'low'
}

interface HeatMapResult {
  id: string
  url: string
  keywords: KeywordData[]
  totalWords: number
  issues: {
    type: 'error' | 'warning' | 'info'
    message: string
  }[]
}

export default function HeatMapForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<HeatMapResult[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/keyword-heatmap/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze URL')
      }

      const data = await response.json()
      setResults(prev => [...prev, { ...data, id: Date.now().toString() }])
      setUrl('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze URL. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <FaTimes color="red" />
      case 'warning':
        return <FaExclamationTriangle color="orange" />
      case 'info':
        return <FaCheck color="green" />
    }
  }

  const getIssueColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'red'
      case 'warning':
        return 'orange'
      case 'info':
        return 'green'
    }
  }

  const getRelevanceColor = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return 'green'
      case 'medium':
        return 'orange'
      case 'low':
        return 'red'
    }
  }

  return (
    <VStack spacing={8} align="stretch" w="full">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Website URL</FormLabel>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Analyzing..."
            w="full"
          >
            Analyze
          </Button>
        </VStack>
      </form>

      {results.length > 0 && (
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Analysis History</Heading>
            {results.length >= 2 && (
              <Button
                leftIcon={<FaExchangeAlt />}
                colorScheme="purple"
                variant="outline"
                onClick={onOpen}
              >
                Compare Results
              </Button>
            )}
          </HStack>
          <VStack spacing={6} align="stretch">
            {results.map((result) => (
              <MotionBox
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" mb={4}>Analysis Results</Heading>
                    <ExportResults
                      data={result.keywords.map(kw => ({
                        Keyword: kw.keyword,
                        Density: `${kw.density.toFixed(2)}%`,
                        Position: kw.position,
                        Count: kw.count,
                        Relevance: kw.relevance.toUpperCase(),
                      }))}
                      filename={`keyword-heatmap-${new Date().toISOString().split('T')[0]}`}
                      type="heatMap"
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Page Information</Heading>
                    <VStack align="stretch" spacing={2}>
                      <Text><strong>URL:</strong> {result.url}</Text>
                      <Text><strong>Total Words:</strong> {result.totalWords}</Text>
                      <Text><strong>Keywords Found:</strong> {result.keywords.length}</Text>
                    </VStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Keywords</Heading>
                    <List spacing={2}>
                      {result.keywords.map((keyword, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <ListIcon as={FaCheck} color="green.500" />
                            <Text fontWeight="bold">{keyword.keyword}</Text>
                            <Badge colorScheme={getRelevanceColor(keyword.relevance)}>
                              {keyword.relevance.toUpperCase()}
                            </Badge>
                            <Text>Density: {keyword.density.toFixed(2)}%</Text>
                            <Text>Count: {keyword.count}</Text>
                            <Text>Position: {keyword.position}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Issues ({result.issues.length})</Heading>
                    <List spacing={2}>
                      {result.issues.map((issue, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <ListIcon as={() => getIssueIcon(issue.type)} />
                            <Badge colorScheme={getIssueColor(issue.type)}>
                              {issue.type.toUpperCase()}
                            </Badge>
                            <Text>{issue.message}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              </MotionBox>
            ))}
          </VStack>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Compare Keyword Heat Map Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CompareResults
              type="heatMap"
              results={results}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
} 