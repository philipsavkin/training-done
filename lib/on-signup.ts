import type { StravaAccount } from './strava-schema'
import * as db from '../database'

export async function onSignup(account: StravaAccount) {
  // TODO fetch stats from Strava and save to DB
  // TODO fetch Strava activities

  await Promise.all([db.athlete.create(account.athlete), db.token.create(account.athlete.id, account)])
}
