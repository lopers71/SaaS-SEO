import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { updateNotification } from '@/services/firebaseService'

export const runtime = 'nodejs'

// Define a specific type for the route context
type RouteContext = {
  params: {
    id: string
  }
}

export async function PUT(
  request: Request,
  context: RouteContext // Use the defined context type here
) {
  try {
    const { params } = context; // Destructure params from the context object
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Pastikan JWT_SECRET terdefinisi
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
    const userId = decoded.userId

    const notification = await updateNotification(params.id, userId, {
      read: true,
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
} 