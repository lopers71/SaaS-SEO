'use client'

import { Box, Container, Heading, Text, VStack, Image } from '@chakra-ui/react'
import HeatMapForm from '@/components/keyword-heatmap/HeatMapForm'

export default function HeatMapPage() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="center">
        <VStack spacing={4} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, blue.400, teal.400)" bgClip="text">
            Keyword Heat Map
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Visualisasikan distribusi keyword di website Anda
          </Text>
        </VStack>

        <Box w="full" maxW="md">
          <HeatMapForm />
        </Box>

        <Box mt={8}>
          <Image src="/images/keyword-heatmap-illustration.svg" alt="Keyword Heat Map Illustration" maxW="400px" />
        </Box>
      </VStack>
    </Container>
  )
} 