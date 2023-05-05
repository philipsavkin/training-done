import config from './mysql'
import { connect } from '@planetscale/database'
import type { TokenData } from '../lib/strava-schema'

export async function create(athleteId: number, tokenData: TokenData) {
  const insertSql =
    'replace into StravaTokens ( \
    `athlete_id`, \
    `access_token`, \
    `refresh_token`, \
    `expires_at`) \
    values ( \
    :athleteId, \
    :access_token, \
    :refresh_token, \
    :expires_at)'

  const conn = connect(config)
  await conn.execute(insertSql, { athleteId, ...tokenData })
}

export async function findByAthleteId(athleteId: number): Promise<TokenData> {
  const conn = connect(config)
  const results = await conn.execute(
    'select * from StravaTokens where athlete_id = ? order by created_at desc limit 1',
    [athleteId],
  )
  return results.rows[0] as TokenData
}
