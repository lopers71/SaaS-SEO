'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  List,
  ListItem,
  ListIcon,
  Icon,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      '5 SEO scans per month',
      'Basic keyword analysis',
      'Citation tracking',
      'Basic reports',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline',
  },
  {
    name: 'Basic',
    price: '29',
    features: [
      '50 SEO scans per month',
      'Advanced keyword analysis',
      'Citation management',
      'Detailed reports',
      'Email support',
    ],
    buttonText: 'Subscribe',
    buttonVariant: 'solid',
  },
  {
    name: 'Pro',
    price: '99',
    features: [
      'Unlimited SEO scans',
      'Advanced keyword research',
      'Full citation management',
      'Custom reports',
      'Priority support',
      'API access',
    ],
    buttonText: 'Subscribe',
    buttonVariant: 'solid',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    setIsLoading(plan)
    try {
      const response = await axios.post('/api/subscription/create', { plan })
      // Redirect to payment page or handle payment flow
      router.push(response.data.paymentUrl)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to process subscription',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        <Heading textAlign="center">Choose Your Plan</Heading>
        <Text textAlign="center" color="gray.600">
          Select the perfect plan for your SEO needs
        </Text>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}
          align="center"
          justify="center"
          w="full"
        >
          {plans.map((plan) => (
            <Box
              key={plan.name}
              bg={useColorModeValue('white', 'gray.800')}
              rounded="xl"
              shadow="lg"
              p={8}
              w={{ base: 'full', md: '300px' }}
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <VStack spacing={4} align="stretch">
                <Heading size="md">{plan.name}</Heading>
                <Text fontSize="3xl" fontWeight="bold">
                  ${plan.price}
                  <Text as="span" fontSize="md" fontWeight="normal">
                    /month
                  </Text>
                </Text>

                <List spacing={3}>
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListIcon as={CheckIcon} color="green.500" />
                      {feature}
                    </ListItem>
                  ))}
                </List>

                <Button
                  colorScheme="blue"
                  variant={plan.buttonVariant as any}
                  size="lg"
                  w="full"
                  onClick={() => handleSubscribe(plan.name.toLowerCase())}
                  isLoading={isLoading === plan.name.toLowerCase()}
                >
                  {plan.buttonText}
                </Button>
              </VStack>
            </Box>
          ))}
        </Stack>
      </VStack>
    </Container>
  )
} 