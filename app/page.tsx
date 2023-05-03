import Image from 'next/image'
import { Inter } from 'next/font/google'
import { TrainingLog } from './training-log'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-4">
      {/* @ts-expect-error Async Server Component */}
      <TrainingLog />
    </main>
  )
}
