import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import * as db from '@/database'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('', { status: 401 })
  }
  const data = await request.json()

  await db.settings.createOrUpdate({
    // @ts-ignore
    athlete_id: session.userId,
    slug: data.slug,
    share: data.share,
  })
  return NextResponse.json({})
}
