import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'canceled' })
    .eq('id', params.id)
    .eq('clerk_user_id', userId)
    .select();

  if (error) {
    console.error('Error canceling booking', error);
    return NextResponse.json({ error: `Failed to cancel booking: ${error.message}` }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
