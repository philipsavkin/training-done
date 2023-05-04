import * as db from '../database'
import { fromUnixTime, subMinutes, isAfter, formatDistance, getUnixTime } from 'date-fns'
import {
  StravaActivitiesSchema,
  StravaActivitySchema,
  StravaActivityStatsSchema,
  TokenResponseSchema,
} from './strava-schema'

const API_BASE_URL = 'https://www.strava.com/api/v3'

// NextJS App Router fetch caches data forever by default
const API_FETCH_OPTIONS = { cache: 'no-store' } as const

async function getAccessToken(athleteId: number) {
  const token = await db.token.findByAthleteId(athleteId)
  const tokenExpireDate = fromUnixTime(token.expires_at)

  if (isAfter(subMinutes(tokenExpireDate, 30), new Date())) {
    console.log(`Using existing token, token valid for ${formatDistance(tokenExpireDate, new Date())}`)
    return token.access_token
  } else {
    console.log(`Requesting new token`)

    const formData = new FormData()
    formData.append('client_id', process.env.STRAVA_CLIENT_ID ?? '')
    formData.append('client_secret', process.env.STRAVA_CLIENT_SECRET ?? '')
    formData.append('grant_type', 'refresh_token')
    formData.append('refresh_token', token.refresh_token)

    try {
      const response = await fetch(`${API_BASE_URL}/oauth/token`, {
        method: 'POST',
        body: formData,
        ...API_FETCH_OPTIONS,
      })
      if (response.status !== 200) {
        console.error(`API returned status ${response.status}`)
      }
      const json = await response.json()
      if (json.errors) {
        throw new Error('Failed to fetch a new access token from Strava', json)
      }

      const newTokenData = TokenResponseSchema.parse(json)
      await db.token.create(athleteId, newTokenData)
      return newTokenData.access_token
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error fetching token', message)
      throw error
    }
  }
}

export async function getProfileData(athleteId: number) {
  const accessToken = await getAccessToken(athleteId)
  const response = await fetch(`${API_BASE_URL}/athlete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    ...API_FETCH_OPTIONS,
  })

  const json = await response.json()
  return json
}

export async function getActivities(athleteId: number) {
  const accessToken = await getAccessToken(athleteId)
  const before = getUnixTime(new Date())

  const response = await fetch(`${API_BASE_URL}/athlete/activities?before=${before}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    ...API_FETCH_OPTIONS,
  })

  const json = await response.json()
  return StravaActivitiesSchema.parse(json)
}

export async function getAthleteStats(athleteId: number) {
  const accessToken = await getAccessToken(athleteId)
  const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}/stats`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    ...API_FETCH_OPTIONS,
  })

  const json = await response.json()
  return StravaActivityStatsSchema.parse(json)
}

export async function getActivity(activityId: number, athleteId: number) {
  const accessToken = await getAccessToken(athleteId)
  const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    ...API_FETCH_OPTIONS,
  })

  const json = await response.json()
  return StravaActivitySchema.parse(json)
}
