import { SlackService } from '@/lib/services'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message } = await request.json()
  try {
    await SlackService.sendMessage(message)
    return NextResponse.json({ message: 'Message sent' })
  } catch (error) {
    return NextResponse.json(
      { message: `Error sending message: ${JSON.stringify(error)}` },
      { status: 500 },
    )
  }
}
