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

interface SeoResult {
  id: string
  url: string
  title: string
  metaDescription: string
  h1Tags: string[]
  images: { src: string; alt: string }[]
  links: { href: string; text: string }[]
  issues: {
    type: 'error' | 'warning' | 'info'
    message: string
  }[]
}

export default function ScannerForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SeoResult[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/seo-scanner/analyze', {
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
                      data={[
                        {
                          URL: result.url,
                          Title: result.title,
                          'Meta Description': result.metaDescription,
                          'H1 Tags': result.h1Tags.join(', '),
                          'Image Count': result.images.length,
                          'Link Count': result.links.length,
                          'Issues Count': result.issues.length,
                        }
                      ]}
                      filename={`seo-scan-${new Date().toISOString().split('T')[0]}`}
                      type="seoScan"
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Page Information</Heading>
                    <VStack align="stretch" spacing={2}>
                      <Text><strong>Title:</strong> {result.title}</Text>
                      <Text><strong>Meta Description:</strong> {result.metaDescription}</Text>
                      <Text><strong>H1 Tags:</strong> {result.h1Tags.length}</Text>
                      <List spacing={2}>
                        {result.h1Tags.map((tag, index) => (
                          <ListItem key={index} pl={4}>
                            <ListIcon as={FaCheck} color="green.500" />
                            {tag}
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Images ({result.images.length})</Heading>
                    <List spacing={2}>
                      {result.images.map((image, index) => (
                        <ListItem key={index} pl={4}>
                          <ListIcon as={FaCheck} color="green.500" />
                          {image.alt || 'No alt text'} - {image.src}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm" mb={2}>Links ({result.links.length})</Heading>
                    <List spacing={2}>
                      {result.links.map((link, index) => (
                        <ListItem key={index} pl={4}>
                          <ListIcon as={FaCheck} color="green.500" />
                          {link.text} - {link.href}
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
          <ModalHeader>Compare SEO Analysis Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CompareResults
              type="seoScan"
              results={results}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
} 