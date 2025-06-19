'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WhatsNewModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm bg-purple-600 text-white rounded"
      >
        What's New
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's New</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Check out recent updates and upcoming features.
            </p>
            <div className="flex gap-2">
              <Link href="/patch-notes" className="underline" onClick={() => setOpen(false)}>
                Patch Notes
              </Link>
              <Link href="/roadmap" className="underline" onClick={() => setOpen(false)}>
                Roadmap
              </Link>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
