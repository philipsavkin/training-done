import { secondsToHours, secondsToMinutes, getDay } from 'date-fns'
import type { ActivityGroup, DayOfWeek } from './types'

export function formatDistance(distance: number) {
  return `${(distance / 1000).toFixed(1)} km`
}

export function formatDuration(seconds: number) {
  const hours = secondsToHours(seconds)
  const remainingSeconds = seconds - hours * 3600
  const minutes = secondsToMinutes(remainingSeconds)
  const hoursStr = hours > 0 ? `${hours}h` : ''
  const minutesStr = minutes > 0 ? `${minutes}m` : ''
  return `${hoursStr} ${minutesStr}`
}

const runTypes = ['Run', 'TrailRun', 'VirtualRun']
const rideTypes = ['Ride', 'GravelRide', 'MountainBikeRide', 'VirtualRide']

export function getActivityGroup(activityType: string): ActivityGroup {
  if (runTypes.includes(activityType)) {
    return 'Run'
  } else if (rideTypes.includes(activityType)) {
    return 'Ride'
  } else if (activityType === 'Swim') {
    return 'Swim'
  } else {
    return 'Other'
  }
}

/**
 * Returns day of week as 0-6, starting from Monday
 */
export function getDayOfWeek(date: Date) {
  const d = getDay(date)
  return (d === 0 ? 6 : d - 1) as DayOfWeek
}
