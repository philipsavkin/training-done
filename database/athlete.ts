import config from './mysql'
import { connect } from '@planetscale/database'
import type { StravaAthlete } from '../lib/strava-schema'

export async function findById(athleteId: number) {
  const conn = connect(config)
  const results = await conn.execute('select * from Athlete where athlete_id = ?', [athleteId])
  if (results.rows.length === 0) {
    return null
  }
  return results.rows[0] as StravaAthlete
}

export async function create(athlete: StravaAthlete) {
  const insertSql =
    'insert ignore into Athlete( \
    `athlete_id`, \
    `username`, \
    `resource_state`, \
    `firstname`, \
    `lastname`, \
    `premium`, \
    `profile_medium`, \
    `profile`) \
    values ( \
    :id, \
    :username, \
    :resource_state, \
    :firstname, \
    :lastname, \
    :premium, \
    :profile_medium, \
    :profile)'

  const conn = connect(config)
  await conn.execute(insertSql, athlete)
}
