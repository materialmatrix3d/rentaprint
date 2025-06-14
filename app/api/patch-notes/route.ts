import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
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
