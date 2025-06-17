import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json()
  const { booking_id, new_start_date, new_end_date, reason } = body

  const supabase = createClient()
  const { error } = await supabase.from('booking_change_requests').insert({
    booking_id,
    new_start_date,
    new_end_date,
    reason,
  })

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
