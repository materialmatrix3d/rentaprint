import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
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
