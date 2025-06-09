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
import { FaCheck, FaTimes, FaExclamationTriangle, FaCompare } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ExportResults from '../shared/ExportResults'
import CompareResults from '../shared/CompareResults'

const MotionBox = motion(Box)

interface CitationData {
  name: string
  address: string
  phone: string
  website: string
  status: 'verified' | 'unverified' | 'error'
  platforms: {
    name: string
    url: string
    status: 'found' | 'not_found' | 'error'
  }[]
}

interface CitationResult {
  id: string
  businessName: string
  citations: CitationData[]
  issues: {
    type: 'error' | 'warning' | 'info'
    message: string
  }[]
}

export default function CitationForm() {
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CitationResult[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/citation-management/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessName }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze business')
      }

      const data = await response.json()
      setResults(prev => [...prev, { ...data, id: Date.now().toString() }])
      setBusinessName('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze business. Please try again.',
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

  const getStatusColor = (status: 'verified' | 'unverified' | 'error') => {
    switch (status) {
      case 'verified':
        return 'green'
      case 'unverified':
        return 'orange'
      case 'error':
        return 'red'
    }
  }

  const getPlatformStatusColor = (status: 'found' | 'not_found' | 'error') => {
    switch (status) {
      case 'found':
        return 'green'
      case 'not_found':
        return 'orange'
      case 'error':
        return 'red'
    }
  }

  return (
    <VStack spacing={8} align="stretch" w="full">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Business Name</FormLabel>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
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
                leftIcon={<FaCompare />}
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
                      data={result.citations.map(citation => ({
                        Name: citation.name,
                        Address: citation.address,
                        Phone: citation.phone,
                        Website: citation.website,
                        Status: citation.status.toUpperCase(),
                        'Platforms Found': citation.platforms.filter(p => p.status === 'found').length,
                      }))}
                      filename={`citation-analysis-${new Date().toISOString().split('T')[0]}`}
                      type="citation"
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Business Information</Heading>
                    <VStack align="stretch" spacing={2}>
                      <Text><strong>Business Name:</strong> {result.businessName}</Text>
                      <Text><strong>Total Citations:</strong> {result.citations.length}</Text>
                      <Text><strong>Verified Citations:</strong> {result.citations.filter(c => c.status === 'verified').length}</Text>
                    </VStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Citations</Heading>
                    <List spacing={4}>
                      {result.citations.map((citation, index) => (
                        <ListItem key={index}>
                          <VStack align="stretch" spacing={2}>
                            <HStack>
                              <ListIcon as={FaCheck} color="green.500" />
                              <Text fontWeight="bold">{citation.name}</Text>
                              <Badge colorScheme={getStatusColor(citation.status)}>
                                {citation.status.toUpperCase()}
                              </Badge>
                            </HStack>
                            <Text pl={6}>Address: {citation.address}</Text>
                            <Text pl={6}>Phone: {citation.phone}</Text>
                            <Text pl={6}>Website: {citation.website}</Text>
                            <Box pl={6}>
                              <Text fontWeight="bold" mb={2}>Platforms:</Text>
                              <List spacing={2}>
                                {citation.platforms.map((platform, pIndex) => (
                                  <ListItem key={pIndex}>
                                    <HStack>
                                      <ListIcon as={FaCheck} color="green.500" />
                                      <Text>{platform.name}</Text>
                                      <Badge colorScheme={getPlatformStatusColor(platform.status)}>
                                        {platform.status.toUpperCase()}
                                      </Badge>
                                      {platform.url && (
                                        <Text fontSize="sm" color="blue.500">
                                          <a href={platform.url} target="_blank" rel="noopener noreferrer">
                                            View
                                          </a>
                                        </Text>
                                      )}
                                    </HStack>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </VStack>
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
          <ModalHeader>Compare Citation Analysis Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CompareResults
              type="citation"
              results={results}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
} 