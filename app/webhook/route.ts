import { StravaWebhookDataSchema } from '@/lib/strava-schema'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const json = await request.json()
  const parseResult = StravaWebhookDataSchema.safeParse(json)
  if (!parseResult.success) {
    console.log('webhook event received, parsing failed', parseResult.error)
    return new Response('EVENT_RECEIVED')
  }

  console.log('webhook event received, successfully parsed!', parseResult.data)
  return new Response('EVENT_RECEIVED')
}

export async function GET(request: Request) {
  const verifyToken = process.env.STRAVA_VERIFY_TOKEN
  if (!verifyToken) {
    console.error('Verify token not set')
    return new Response('Verify token not set', { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified')
      return NextResponse.json({ 'hub.challenge': challenge })
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return new Response('', { status: 403 })
    }
  }
  return new Response('', { status: 400 })
}
