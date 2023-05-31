import { Activity } from '../app/activity'
import { format, parse, getWeek, startOfWeek, endOfWeek } from 'date-fns'
import * as db from '../database'
import { formatDistance, formatDuration, getActivityGroup, getDayOfWeek } from '../lib/util'
import RunningIcon from '@/components/icons/running'
import CyclingIcon from '@/components/icons/cycling'
import SwimmingIcon from '@/components/icons/swimming'
import type { ComponentType } from 'react'
import type { ActivityExt } from '@/lib/types'
import { PropsWithChildren } from 'react'
import Header from './header'

type WeekSummaryProps = {
  weekTotals: WeekTotals
  Icon: ComponentType<{ className?: string }>
}

type WeekTotals = {
  distance: number
  duration: number
}

function WeekSummary({ weekTotals, Icon }: WeekSummaryProps) {
  if (weekTotals.distance === 0 && weekTotals.duration === 0) {
    return <></>
  }
  return (
    <div className="text-xs">
      <Icon className="mr-1 inline h-4 w-4" />
      <span className="mr-2">{formatDistance(weekTotals.distance)}</span>
      <span>{formatDuration(weekTotals.duration)}</span>
    </div>
  )
}

function LogGridItem({ children }: PropsWithChildren) {
  return <div className="self-stretch border-b-2 p-4 text-center">{children}</div>
}

type TrainingLogWeekProps = {
  startDate: Date
  endDate: Date
  activities: ActivityExt[]
}

function TrainingLogWeek(props: TrainingLogWeekProps) {
  const weekTotals: WeekTotals = { distance: 0, duration: 0 }
  const runTotals: WeekTotals = { distance: 0, duration: 0 }
  const rideTotals: WeekTotals = { distance: 0, duration: 0 }
  const swimTotals: WeekTotals = { distance: 0, duration: 0 }

  for (const activity of props.activities) {
    weekTotals.distance += activity.distance
    weekTotals.duration += activity.elapsed_time
    if (activity.group === 'Run') {
      runTotals.distance += activity.distance
      runTotals.duration += activity.elapsed_time
    } else if (activity.group === 'Ride') {
      rideTotals.distance += activity.distance
      rideTotals.duration += activity.elapsed_time
    } else if (activity.group === 'Swim') {
      swimTotals.distance += activity.distance
      swimTotals.duration += activity.elapsed_time
    }
  }

  return (
    <>
      <LogGridItem>
        <div className="font-bold">{`${format(props.startDate, 'MMM d')}-${format(props.endDate, 'MMM d')}`}</div>
        <div className="mb-2">
          <span className="mr-2 text-sm">{formatDistance(weekTotals.distance)}</span>
          <span className="text-sm">{formatDuration(weekTotals.duration)}</span>
        </div>
        <WeekSummary Icon={RunningIcon} weekTotals={runTotals} />
        <WeekSummary Icon={CyclingIcon} weekTotals={rideTotals} />
        <WeekSummary Icon={SwimmingIcon} weekTotals={swimTotals} />
      </LogGridItem>

      {[0, 1, 2, 3, 4, 5, 6].map((day) => {
        const activities = props.activities.filter((activity) => activity.activityWeekDay === day)
        activities.sort((a, b) => a.activityDate.getTime() - b.activityDate.getTime())
        return activities.length > 0 ? (
          <LogGridItem key={activities[0].id}>
            {activities.map((activity) => (
              <Activity key={activity.id} initialActivity={activity} />
            ))}
          </LogGridItem>
        ) : (
          <LogGridItem key={day}>
            <div className="text-stone-400">Rest</div>
          </LogGridItem>
        )
      })}
    </>
  )
}

export type TrainingLogProps = {
  athleteId: number
}

export async function TrainingLog({ athleteId }: TrainingLogProps) {
  const activities = await db.activity.findByAthleteId(athleteId)
  const weekActivities = groupActivitiesByWeek(activities)
  return (
    <main className="container mx-auto p-24 pt-4">
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <div className="align-items grid grid-cols-8 items-center">
        <div className="border-b-2 border-t-2 py-2 text-center">Week</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Mon</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Tue</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Wed</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Thu</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Fri</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Sat</div>
        <div className="border-b-2 border-t-2 py-2 text-center">Sun</div>
        {weekActivities.map((weekProps, i) => (
          <TrainingLogWeek key={i} {...weekProps} />
        ))}
      </div>
    </main>
  )
}

function groupActivitiesByWeek(activities: db.activity.Activity[]): TrainingLogWeekProps[] {
  const weekOptions = { weekStartsOn: 1 } as const
  const referenceDate = new Date()
  const weekProps: TrainingLogWeekProps[] = []
  let currentWeekNum = -1
  let trainingLogWeekProps: TrainingLogWeekProps | undefined = undefined
  for (const activity of activities) {
    const activityDate = parse(activity.start_date_local, 'yyyy-MM-dd HH:mm:ss', referenceDate)
    const activityWeekDay = getDayOfWeek(activityDate)
    const activityExt = {
      ...activity,
      activityDate,
      activityWeekDay,
      group: getActivityGroup(activity.sport_type),
    }

    const weekNum = getWeek(activityDate, weekOptions)
    if (weekNum !== currentWeekNum) {
      currentWeekNum = weekNum
      trainingLogWeekProps = {
        startDate: startOfWeek(activityDate, weekOptions),
        endDate: endOfWeek(activityDate, weekOptions),
        activities: [activityExt],
      }
      weekProps.push(trainingLogWeekProps)
    } else {
      trainingLogWeekProps?.activities.unshift(activityExt)
    }
  }

  return weekProps
}
