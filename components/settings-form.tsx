'use client'

import useDebounce from '@/lib/debounce'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type SettingsFormProps = {
  slug: string
  share: boolean
}

export default function SettingsForm({ slug: initialSlug, share: initialShare }: SettingsFormProps) {
  const [slug, setSlug] = useState(initialSlug)
  const [share, setShare] = useState(initialShare)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugAvailable, setSlugAvailable] = useState(true)

  const debouncedSlug = useDebounce<string>(slug, 500)
  const router = useRouter()

  const publicUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/log/${debouncedSlug}`

  function handleSlugChangeEvent(e: ChangeEvent<HTMLInputElement>) {
    const newSlug = e.target.value
    if (newSlug.trim() === '') {
      setSlugError(null)
    } else if (!newSlug.match(/^(\w|-)+$/)) {
      setSlugError('Only letters, digits, _ and - symbols are allowed')
    } else {
      setSlugError(null)
    }
    setSlug(e.target.value)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    fetch('/api/settings', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: debouncedSlug,
        share: share,
      }),
    })
    router.push('/')
  }

  useEffect(() => {
    if (slugError || !debouncedSlug) {
      return
    }
    fetch(`/api/slug?slug=${debouncedSlug}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((json) => setSlugAvailable(json.available))
  }, [debouncedSlug, slugError])

  return (
    <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
      <div className="mb-6 flex items-center gap-5">
        <label htmlFor="slug" className="mb-2 font-medium text-stone-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={handleSlugChangeEvent}
          className="w-64 rounded-lg border border-stone-400 bg-stone-100 p-2 text-stone-700 focus:border-orange-500 focus:ring-orange-500"
        />

        {slug && !slugError && <span title="hren">{slugAvailable ? '✅' : '🚫'}</span>}

        <div className="flex items-center gap-2">
          <input
            id="share"
            type="checkbox"
            checked={share}
            onChange={(e) => setShare(e.target.checked)}
            className="focus:ring-3 h-4 w-4 rounded border border-stone-400 bg-gray-50 focus:ring-orange-300"
          />
          <label htmlFor="share" className="font-medium">
            Make my training log visible to everyone
          </label>
        </div>
      </div>
      {slugError && <div className="text-sm text-red-500">{slugError}</div>}

      {share && slug && (
        <div>
          <div className="mb-2 text-sm">This is your public training log url:</div>
          <div className="mb-6 w-1/2 rounded border border-orange-700 bg-stone-100 p-1">{publicUrl}</div>
        </div>
      )}

      <button
        type="submit"
        disabled={slugError !== null || !slugAvailable}
        className="mr-2 w-full rounded-lg border border-orange-700 bg-orange-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:border-stone-400 disabled:bg-stone-400 sm:w-auto"
      >
        Save
      </button>
      <a
        href="/"
        className="inline-block rounded-lg border border-orange-700 px-5 py-2.5 text-center  text-sm font-medium text-orange-700"
      >
        Cancel
      </a>
    </form>
  )
}
