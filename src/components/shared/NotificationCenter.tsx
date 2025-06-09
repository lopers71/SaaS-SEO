'use client'

import {
  Box,
  VStack,
  Text,
  Heading,
  Badge,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Button,
} from '@chakra-ui/react'
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const MotionBox = motion(Box)

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function NotificationCenter() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Fetch notifications from API
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      })
      if (!response.ok) throw new Error('Failed to mark notification as read')
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT',
      })
      if (!response.ok) throw new Error('Failed to mark all notifications as read')
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <FaCheck color="green" />
      case 'error':
        return <FaTimes color="red" />
      case 'warning':
        return <FaExclamationTriangle color="orange" />
      case 'info':
        return <FaBell color="blue" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'green'
      case 'error':
        return 'red'
      case 'warning':
        return 'orange'
      case 'info':
        return 'blue'
    }
  }

  return (
    <>
      <IconButton
        aria-label="Notifications"
        icon={
          <Box position="relative">
            <FaBell />
            {unreadCount > 0 && (
              <Badge
                position="absolute"
                top="-2"
                right="-2"
                colorScheme="red"
                borderRadius="full"
                minW="5"
                h="5"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {unreadCount}
              </Badge>
            )}
          </Box>
        }
        variant="ghost"
        onClick={onOpen}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack justify="space-between" align="center">
              <Heading size="md">Notifications</Heading>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {notifications.length === 0 ? (
                <Text color="gray.500" textAlign="center">
                  No notifications
                </Text>
              ) : (
                notifications.map((notification) => (
                  <MotionBox
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      p={4}
                      bg={notification.read ? 'gray.50' : 'white'}
                      borderRadius="md"
                      borderWidth={1}
                      borderColor={notification.read ? 'gray.200' : 'blue.200'}
                      position="relative"
                    >
                      <HStack spacing={3} align="start">
                        <Box pt={1}>
                          {getNotificationIcon(notification.type)}
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack justify="space-between" w="full">
                            <Heading size="sm">{notification.title}</Heading>
                            <Badge colorScheme={getNotificationColor(notification.type)}>
                              {notification.type.toUpperCase()}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm">{notification.message}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                      {!notification.read && (
                        <Button
                          size="xs"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </Box>
                  </MotionBox>
                ))
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
} 