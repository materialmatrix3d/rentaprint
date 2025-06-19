import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('booking_messages')
    .select('*')
    .eq('booking_id', params.id)
    .order('timestamp', { ascending: true })
  if (error) return new Response('Failed', { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  const { message } = await req.json()
  const supabase = createClient()
  const { error } = await supabase.from('booking_messages').insert({
    booking_id: params.id,
    sender_id: userId,
    message,
  })
  if (error) return new Response('Failed', { status: 500 })
  return new Response('ok')
}
