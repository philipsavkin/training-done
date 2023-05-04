import { getActivities } from '@/lib/strava-api'
import * as db from '@/database'
import 'dotenv/config'

async function main() {
  const activities = await getActivities(66213390)
  for (const activity of activities) {
    await db.activity.create(activity)
    console.log(`Activity ${activity.id} added to DB`)
  }
  console.log(`${activities.length} activities imported`)
}

main().then(() => console.log('Done'))
