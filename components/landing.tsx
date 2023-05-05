'use client'
import { signIn } from 'next-auth/react'

export function Landing() {
  return (
    <main className="min-h-screen p-24 pt-4">
      <h2>Landing</h2>
      <button
        onClick={() => signIn('strava')}
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Sign in with Strava
      </button>
    </main>
  )
}
