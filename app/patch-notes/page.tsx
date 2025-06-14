'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface PatchNote {
  id: string
  title: string
  description: string
  created_at: string
}

export default function PatchNotesPage() {
  const supabase = createClientComponentClient()
  const [notes, setNotes] = useState<PatchNote[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setNotes(data as PatchNote[])
      } else {
        console.error('Failed to fetch patch notes', error)
      }
    }
    fetchNotes()
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📘 Patch Notes</h1>
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
