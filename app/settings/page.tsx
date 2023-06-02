import * as db from '@/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/settings-form'
import Header from '@/components/header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function Settings() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/')
  }

  // @ts-ignore
  const settings = await db.settings.findByAthleteId(session.userId)

  return (
    <main className="container mx-auto p-24 pt-4">
      <Header />
      <div className="p-4">
        <h2 className="text-xl font-bold">Settings</h2>
        <SettingsForm {...settings} />
      </div>
    </main>
  )
}
