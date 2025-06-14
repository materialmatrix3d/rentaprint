'use client'

import { useEffect, useState } from 'react'

interface PatchNote {
  id: string
  title: string
  description: string
  created_at: string
}

export default function PatchNotesPage() {
  const [notes, setNotes] = useState<PatchNote[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/patch-notes')

        if (!res.ok) {
          throw new Error('Request failed')
        }

        const data: PatchNote[] = await res.json()
        setNotes(data)
      } catch (err) {
        console.error('Failed to fetch patch notes', err)
        setErrorMsg('Failed to load patch notes')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📘 Patch Notes</h1>
      {errorMsg && (
        <p className="text-red-500 mb-4">{errorMsg}</p>
      )}
      {loading && (
        <p className="mb-4">Loading patch notes…</p>
      )}
      {!loading && notes.length === 0 && !errorMsg && (
        <p className="mb-4">No patch notes available.</p>
      )}
      {notes.map(note => (
        <div
          key={note.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6 border border-gray-300 dark:border-gray-700"
        >
          <div className="text-xl font-semibold">{note.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {new Date(note.created_at).toLocaleString()}
          </div>
          <p>{note.description}</p>
        </div>
      ))}
    </main>
  )
}
