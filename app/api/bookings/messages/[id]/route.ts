import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  context: any
) {
  const { params } = context as { params: { id: string } }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('booking_messages')
    .select('*')
    .eq('booking_id', params.id)
    .order('timestamp', { ascending: true })
  if (error) return NextResponse.json('Failed', { status: 500 })
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  context: any
) {
  const { params } = context as { params: { id: string } }
  const { userId } = await auth()
  if (!userId) return NextResponse.json('Unauthorized', { status: 401 })
  const { message } = await req.json()
  const supabase = createClient()
  const { error } = await supabase.from('booking_messages').insert({
    booking_id: params.id,
    sender_id: userId,
    message,
  })
  if (error) return NextResponse.json('Failed', { status: 500 })
  return NextResponse.json('ok')
}
