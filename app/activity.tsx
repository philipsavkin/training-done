import * as db from '../database'
import { formatDistance } from '../lib/util'

type ActivityProps = {
  initialActivity: db.activity.Activity
}

export function Activity({ initialActivity: activity }: ActivityProps) {
  return (
    <div className="my-1 inline-block w-32 overflow-hidden rounded-lg border-2 border-black p-1 text-center">
      <div>{`${activity.name}, ${formatDistance(activity.distance)} km`}</div>
      <div>{activity.start_date_local}</div>
    </div>
  )
}
