'use client'

import { Box, Container, Text, VStack, HStack, Link, Icon } from '@chakra-ui/react'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <Box as="footer" py={8} bg="gray.50" borderTop="1px" borderColor="gray.200">
      <Container maxW="container.xl">
        <VStack spacing={4}>
          <HStack spacing={4}>
            <Link href="#" isExternal>
              <Icon as={FaGithub} w={6} h={6} />
            </Link>
            <Link href="#" isExternal>
              <Icon as={FaTwitter} w={6} h={6} />
            </Link>
            <Link href="#" isExternal>
              <Icon as={FaLinkedin} w={6} h={6} />
            </Link>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            © 2024 SEO SaaS Platform. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
} 