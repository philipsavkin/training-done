import { getActivities } from '@/app/strava-api'
import * as db from '@/app/db'
import 'dotenv/config'

async function main() {
  const activities = await getActivities()
  for (const activity of activities) {
    await db.activity.create(activity)
    console.log(`Activity ${activity.id} added to DB`)
  }
  console.log(`${activities.length} activities imported`)
}

main().then(() => console.log('Done'))
