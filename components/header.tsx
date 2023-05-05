import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ProfilePic from './profile-pic'
import * as db from '@/database'
import { StravaAthlete } from '@/lib/strava-schema'

export default async function Header() {
  const session = await getServerSession(authOptions)
  let athlete: StravaAthlete | null = null
  if (session) {
    // @ts-ignore
    athlete = await db.athlete.findById(session.userId)
  }
  return (
    <header className="flex justify-between p-4">
      <h2 className="text-2xl font-bold text-orange-600">Training log</h2>
      {athlete && (
        <ProfilePic
          username={athlete.username}
          firstname={athlete.firstname}
          lastname={athlete.lastname}
          id={athlete.id}
          profilePicUrl={athlete.profile}
        />
      )}
    </header>
  )
}
