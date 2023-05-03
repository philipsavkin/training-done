import config from './mysql'
import { connect } from '@planetscale/database'
import { fromUnixTime, subMinutes, isAfter, formatDistance, getUnixTime } from 'date-fns'
import { StravaActivitiesSchema, TokenResponseSchema } from './strava-schema'
import type { TokenData } from './strava-schema'

const API_BASE_URL = 'https://www.strava.com/api/v3'

async function getAccessToken() {
  const conn = connect(config)
  const results = await conn.execute('select * from StravaTokens order by created_at desc limit 1')
  const token = results.rows[0] as TokenData
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
      })
      if (response.status !== 200) {
        console.error(`API returned status ${response.status}`)
      }
      const json = await response.json()
      if (json.errors) {
        throw new Error('Failed to fetch a new access token from Strava', json)
      }

      const newTokenData = TokenResponseSchema.parse(json)
      await conn.execute(
        'insert into StravaTokens (`access_token`, `refresh_token`, `expires_at`) values (:access_token, :refresh_token, :expires_at)',
        newTokenData,
      )
      return newTokenData.access_token
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error fetching token', message)
      throw error
    }
  }
}

export async function getProfileData() {
  const accessToken = await getAccessToken()
  const response = await fetch(`${API_BASE_URL}/athlete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const json = await response.json()
  return json
}

export async function getActivities() {
  const accessToken = await getAccessToken()
  const before = getUnixTime(new Date())

  const response = await fetch(`${API_BASE_URL}/athlete/activities?before=${before}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const json = await response.json()
  return StravaActivitiesSchema.parse(json)
}
