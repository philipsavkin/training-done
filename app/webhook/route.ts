import { getActivity, getAthleteStats } from '@/lib/strava-api'
import * as db from '../../database'
import { StravaWebhookDataSchema, type StravaWebhookData } from '@/lib/strava-schema'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const json = await request.json()
  const parseResult = StravaWebhookDataSchema.safeParse(json)
  if (!parseResult.success) {
    console.log('webhook event received, parsing failed', parseResult.error)
    return new Response('EVENT_RECEIVED')
  }

  const { data } = parseResult
  if (data.object_type === 'activity') {
    if (data.aspect_type === 'create') {
      await fetchActivityAndStats(data.object_id, data.owner_id)
    } else if (data.aspect_type === 'update') {
      await updateActivity(data.object_id, data.owner_id, data.updates)
    } else if (data.aspect_type === 'delete') {
      await deleteActivity(data.object_id, data.owner_id)
    }
  }
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

async function fetchActivityAndStats(activityId: number, athleteId: number) {
  const activity = await getActivity(activityId, athleteId)
  console.log(`Activity fetched from strava ${activity.name}}`)
  await db.activity.create(activity)
  const stats = await getAthleteStats(activity.athlete.id)
  console.log(`Stats fetched from Strava`)
  await db.activityStats.create(activity.athlete.id, stats)
}

async function updateActivity(activityId: number, athleteId: number, updates: StravaWebhookData['updates']) {
  if (updates?.title) {
    await db.activity.updateTitle(activityId, updates?.title)
  }
}

async function deleteActivity(activityId: number, athleteId: number) {
  await db.activity.deleteById(activityId)
  const stats = await getAthleteStats(athleteId)
  await db.activityStats.create(athleteId, stats)
}
