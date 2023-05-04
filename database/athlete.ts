import config from '../app/mysql'
import { connect } from '@planetscale/database'
import type { StravaAthlete } from '../lib/strava-schema'

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
