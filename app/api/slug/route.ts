import { NextResponse } from 'next/server'
import * as db from '@/database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return true
  }
  const available = await db.settings.isSlugAvailable(slug)
  return NextResponse.json({ available })
}
