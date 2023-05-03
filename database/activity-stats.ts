import type { StravaActivityStats, StravaActivityTotal } from '@/lib/strava-schema'
import config from '../app/mysql'
import { connect } from '@planetscale/database'

type ActivityStats = {
  athlete_id: number
  period: 'all' | 'ytd' | 'recent'
  activity_type: 'run' | 'ride' | 'swim'
  count: number
  distance: number
  moving_time: number
  elapsed_time: number
  elevation_gain: number
}

export async function create(athleteId: number, stats: StravaActivityStats) {
  const conn = connect(config)
  const sql =
    'replace into ActivityStats (`athlete_id`, `period`, `activity_type`, `count`, `distance`, `moving_time`, `elapsed_time`, `elevation_gain`) values (?,?,?,?,?,?,?,?)'

  await conn.execute(sql, [athleteId, 'recent', 'run', ...makeTotalValues(stats.recent_run_totals)])
  await conn.execute(sql, [athleteId, 'recent', 'ride', ...makeTotalValues(stats.recent_ride_totals)])
  await conn.execute(sql, [athleteId, 'recent', 'swim', ...makeTotalValues(stats.recent_swim_totals)])
  await conn.execute(sql, [athleteId, 'ytd', 'run', ...makeTotalValues(stats.ytd_run_totals)])
  await conn.execute(sql, [athleteId, 'ytd', 'ride', ...makeTotalValues(stats.ytd_ride_totals)])
  await conn.execute(sql, [athleteId, 'ytd', 'swim', ...makeTotalValues(stats.ytd_swim_totals)])
  await conn.execute(sql, [athleteId, 'all', 'run', ...makeTotalValues(stats.all_run_totals)])
  await conn.execute(sql, [athleteId, 'all', 'ride', ...makeTotalValues(stats.all_ride_totals)])
  await conn.execute(sql, [athleteId, 'all', 'swim', ...makeTotalValues(stats.all_swim_totals)])
}

function makeTotalValues(totals: StravaActivityTotal) {
  return [totals.count, totals.distance, totals.moving_time, totals.elapsed_time, totals.elevation_gain]
}

export async function findAllByAthleteId(athleteId: number): Promise<ActivityStats[]> {
  const conn = connect(config)
  const results = await conn.execute('select * from ActivityStats where athlete_id = ?', [athleteId])
  return results.rows.map((row) => row as ActivityStats)
}
