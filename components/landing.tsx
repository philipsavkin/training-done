'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'

export function Landing() {
  return (
    <main className="min-h-screen p-24 pt-4">
      <h2>Landing</h2>
      <section>
        Our website creates training logs and stats based on user&apos;s activities from Strava. We collect personal
        information like your name and activity data from Strava, but we will never share it with third parties or use
        it for any other purpose. See details in our{' '}
        <Link href="/privacy" className="font-bold underline">
          Privacy Policy
        </Link>
      </section>
      <button
        onClick={() => signIn('strava', undefined, { scope: 'activity:read_all' })}
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Sign in with Strava
      </button>
    </main>
  )
}
