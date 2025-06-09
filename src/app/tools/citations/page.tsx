'use client'

import { Box, Container, Heading, Text, VStack, Image } from '@chakra-ui/react'
import CitationForm from '@/components/citation-management/CitationForm'

export default function CitationsPage() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="center">
        <VStack spacing={4} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, blue.400, teal.400)" bgClip="text">
            Citation Management
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Kelola dan optimalkan backlink serta citations website Anda
          </Text>
        </VStack>

        <Box w="full" maxW="md">
          <CitationForm />
        </Box>

        <Box mt={8}>
          <Image src="/images/citation-management-illustration.svg" alt="Citation Management Illustration" maxW="400px" />
        </Box>
      </VStack>
    </Container>
  )
} 