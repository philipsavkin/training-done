import type { StravaAccount } from './strava-schema'
import * as db from '../database'
import { getActivities, getAthleteStats } from './strava-api'
import { findLastActivityTimestamp } from '@/database/activity'

export async function onSignup(account: StravaAccount) {
  const athleteId = account.athlete.id
  await Promise.all([db.athlete.create(account.athlete), db.token.create(athleteId, account)])

  const stats = await getAthleteStats(athleteId)
  await db.activityStats.create(athleteId, stats)

  const lastActivityTimestamp = await findLastActivityTimestamp(athleteId)
  const activities = await getActivities(athleteId, lastActivityTimestamp)
  console.log(`OnSignup: ${activities.length} activities fetched`)
  for (const activity of activities) {
    await db.activity.create(activity)
  }
}
