'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'

export function Landing() {
  return (
    <main className="mx-auto mt-20 min-h-screen max-w-4xl px-16 text-center">
      <h2 className="mb-6 bg-gradient-to-r from-orange-700 to-orange-400 bg-clip-text p-4 text-6xl font-extrabold text-transparent drop-shadow-md">
        TrainingDone
      </h2>

      <section className="mx-auto mb-16 max-w-3xl">
        Track your progress and achieve your fitness goals with personalized training logs and data-driven insights from{' '}
        <a target="_blank" className="font-bold text-orange-500 hover:underline" href="https://strava.com">
          Strava
        </a>
      </section>

      <button
        onClick={() => signIn('strava', undefined, { scope: 'activity:read_all' })}
        type="button"
        className="rounded-lg bg-orange-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        Sign in with Strava
      </button>

      <div className="mx-auto my-2 w-32">- OR -</div>
      <div className="mx-auto my-2 w-64">
        <a href="" className="font-bold text-orange-500 hover:underline">
          Check an example
        </a>
      </div>

      <section className="m-auto mt-16 max-w-3xl text-sm">
        Our website creates training logs and stats based on user&apos;s activities from Strava. We collect personal
        information like your name and activity data from Strava, but we will never share it with third parties or use
        it for any other purpose. See details in our{' '}
        <Link href="/privacy" className="font-bold text-orange-500 hover:underline">
          Privacy Policy
        </Link>
      </section>
      <section className="m-auto mt-2 max-w-3xl text-sm">
        The source code is available on{' '}
        <a className="font-bold hover:underline" href="https://github.com/philipsavkin/training-done">
          <span>GitHub</span>{' '}
          <Image className="-mt-1 inline" src="/github-mark.png" width={16} height={16} alt="GitHub logo" />
        </a>
      </section>
    </main>
  )
}
