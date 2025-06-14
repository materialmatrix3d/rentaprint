import { auth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient()
  const { title, description } = await request.json()

  if (!title || !description) {
    return new Response('Missing title or description', { status: 400 })
  }

  const { error } = await supabase.from('patch_notes').insert({ title, description })

  if (error) {
    console.error('Error inserting patch note', error)
    return new Response('Failed to add patch note', { status: 500 })
  }

  return new Response('Patch note added', { status: 200 })
}
