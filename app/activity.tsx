import type { ActivityExt } from '@/lib/types'
import { formatDistance, formatDuration } from '../lib/util'

type ActivityProps = {
  initialActivity: ActivityExt
}

export function Activity({ initialActivity: activity }: ActivityProps) {
  let activityBgColor = ''
  let activityBorderColor = ''
  switch (activity.group) {
    case 'Run':
      activityBgColor = 'bg-red-100'
      activityBorderColor = 'border-red-700'
      break
    case 'Ride':
      activityBgColor = 'bg-green-100'
      activityBorderColor = 'border-green-700'
      break
    case 'Swim':
      activityBgColor = 'bg-sky-100'
      activityBorderColor = 'border-sky-700'
      break
    default:
      activityBgColor = 'bg-stone-100'
      activityBorderColor = 'border-stone-700'
      break
  }

  return (
    <div
      className={`${activityBgColor} ${activityBorderColor} my-1 inline-block w-32 overflow-hidden rounded-lg border-2 p-1 text-center`}
    >
      <div>{formatDistance(activity.distance)}</div>
      <div>{formatDuration(activity.elapsed_time)}</div>
    </div>
  )
}
