import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Supabase credentials are missing')
  process.exit(1)
}

const supabase = createClient(url, key)

async function sync() {
  const filePath = path.join(process.cwd(), 'patch_notes.json')
  const file = await fs.readFile(filePath, 'utf-8')
  const notes = JSON.parse(file)

  const { data: existing, error: fetchError } = await supabase
    .from('patch_notes')
    .select('title')

  if (fetchError) {
    console.error('Failed to fetch existing patch notes', fetchError)
    process.exit(1)
  }

  const existingTitles = new Set(existing?.map(n => n.title))
  const newNotes = notes.filter((n: { title: string }) => !existingTitles.has(n.title))

  if (newNotes.length === 0) {
    console.log('No new patch notes to add')
    return
  }

  const { error } = await supabase.from('patch_notes').insert(newNotes)

  if (error) {
    console.error('Failed to insert patch notes', error)
    process.exit(1)
  }

  console.log(`Inserted ${newNotes.length} patch note(s)`)
}

sync()
