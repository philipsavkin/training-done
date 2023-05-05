import * as db from '@/database'
import { TrainingLog } from '@/components/training-log'
import { notFound } from 'next/navigation'

export default async function LogPage({ params }: { params: { slug: string } }) {
  // TODO lookup slug in Settings, show notFound() if not found
  const athleteId = Number(params.slug)
  const athlete = await db.athlete.findById(athleteId)
  if (!athlete) {
    notFound()
  } else {
    /* @ts-expect-error Async Server Component */
    return <TrainingLog athleteId={athleteId} />
  }
}
