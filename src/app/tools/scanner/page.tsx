'use client'

import { Box, Container, Heading, Text, VStack, Image } from '@chakra-ui/react'
import ScannerForm from '@/components/seo-scanner/ScannerForm'

export default function ScannerPage() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="center">
        <VStack spacing={4} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, blue.400, teal.400)" bgClip="text">
            SEO Scanner
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Analisis website Anda dengan AI untuk meningkatkan performa SEO
          </Text>
        </VStack>

        <Box w="full" maxW="md">
          <ScannerForm />
        </Box>

        <Box mt={8}>
          <Image src="/images/seo-scanner-illustration.svg" alt="SEO Scanner Illustration" maxW="400px" />
        </Box>
      </VStack>
    </Container>
  )
} 