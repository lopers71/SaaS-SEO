'use client'

import { Box, Container, Heading, SimpleGrid, Text, VStack, Button, useColorModeValue, Image } from '@chakra-ui/react'
import { FaSearch, FaChartBar, FaLink } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function Home() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  const features = [
    {
      title: 'SEO Scanner',
      description: 'Analisis website Anda dengan AI untuk meningkatkan performa SEO',
      icon: FaSearch,
      image: '/images/seo-scanner.svg',
    },
    {
      title: 'Keyword Heat Map',
      description: 'Visualisasi distribusi keyword dan performa konten Anda',
      icon: FaChartBar,
      image: '/images/keyword-heatmap.svg',
    },
    {
      title: 'Citation Management',
      description: 'Kelola dan optimalkan backlink serta citations website Anda',
      icon: FaLink,
      image: '/images/citation-management.svg',
    },
  ]

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12} align="center">
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl" bgGradient="linear(to-r, blue.400, teal.400)" bgClip="text">
              Platform SEO Berbasis AI
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Tingkatkan performa SEO website Anda dengan tools canggih berbasis AI
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                p={8}
                bg={cardBg}
                rounded="xl"
                shadow="lg"
                _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VStack spacing={4} align="center">
                  <Box
                    p={4}
                    rounded="full"
                    bg="blue.500"
                    color="white"
                  >
                    <feature.icon size={24} />
                  </Box>
                  <Heading size="md">{feature.title}</Heading>
                  <Text textAlign="center" color="gray.600">
                    {feature.description}
                  </Text>
                  <Button colorScheme="blue" variant="outline" w="full">
                    Mulai Sekarang
                  </Button>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
} 