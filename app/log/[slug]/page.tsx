import * as db from '@/database'
import { TrainingLog } from '@/components/training-log'
import { notFound } from 'next/navigation'

export default async function LogPage({ params }: { params: { slug: string } }) {
  const settings = await db.settings.findBySlugShared(params.slug)
  if (!settings) {
    notFound()
  } else {
    return <TrainingLog athleteId={settings.athlete_id} />
  }
}
