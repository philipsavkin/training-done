import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { TrainingLog } from '../components/training-log'
import { Landing } from '../components/landing'

export default async function Home() {
  const session = await getServerSession(authOptions)
  /* @ts-expect-error Async Server Component */
  return session ? <TrainingLog athleteId={session.userId} /> : <Landing />
}
