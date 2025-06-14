import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // ensure database has any new notes from the JSON file
    const filePath = path.join(process.cwd(), 'patch_notes.json')
    const file = await fs.readFile(filePath, 'utf-8')
    const fileNotes: { id: string; title: string; description: string; created_at: string }[] = JSON.parse(file)

    const { data: existing, error: fetchError } = await supabase
      .from('patch_notes')
      .select('id')

    if (fetchError) {
      console.error('Error fetching existing patch notes', fetchError)
      return new Response('Failed to fetch patch notes', { status: 500 })
    }

    const existingIds = new Set(existing?.map(n => n.id))
    const newNotes = fileNotes.filter(n => !existingIds.has(n.id))

    if (newNotes.length > 0) {
      const { error: insertError } = await supabase.from('patch_notes').insert(newNotes)
      if (insertError) {
        console.error('Failed to insert new patch notes', insertError)
      }
    }

    const { data, error } = await supabase
      .from('patch_notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching patch notes', error)
      return new Response('Failed to fetch patch notes', { status: 500 })
    }

    return Response.json(data)
  } catch (err) {
    console.error('Unexpected error fetching patch notes', err)
    return new Response('Failed to fetch patch notes', { status: 500 })
  }
}
