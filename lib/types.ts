import * as db from '../database'

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type ActivityGroup = 'Run' | 'Ride' | 'Swim' | 'Other'

export type ActivityExt = db.activity.Activity & {
  activityDate: Date
  activityWeekDay: DayOfWeek
  group: ActivityGroup
}
