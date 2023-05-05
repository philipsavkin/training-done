import 'dotenv/config'
import { TokenResponseSchema } from '../lib/strava-schema'
import config from '../database/mysql'
import { connect } from '@planetscale/database'

const code = '24b916b645d3290200077fda5013d2ac55773a6f'
const API_BASE_URL = 'https://www.strava.com/api/v3'

async function main() {
  const formData = new FormData()
  formData.append('client_id', process.env.STRAVA_CLIENT_ID ?? '')
  formData.append('client_secret', process.env.STRAVA_CLIENT_SECRET ?? '')
  formData.append('code', code)
  formData.append('grant_type', 'authorization_code')

  try {
    const response = await fetch(`${API_BASE_URL}/oauth/token`, {
      method: 'POST',
      body: formData,
    })

    console.log(`Fetch done, status ${response.status}`)
    if (response.status !== 200) {
      return console.error(`API returned status ${response.status}`)
    }
    const json = await response.json()
    if (json.errors) {
      return console.error('Failed to fetch a new access token from Strava', json)
    }

    const tokenData = TokenResponseSchema.parse(json)
    const conn = connect(config)
    await conn.execute('delete from StravaTokens')
    await conn.execute(
      'insert into StravaTokens (`access_token`, `refresh_token`, `expires_at`) values (:access_token, :refresh_token, :expires_at)',
      tokenData,
    )
    console.log('New token obtained', tokenData)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching token', message)
    throw error
  }
}

main().then(() => console.log('Done'))
