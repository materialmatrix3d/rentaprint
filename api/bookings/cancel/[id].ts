import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const bookingId = params.id;

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
  }

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

  if (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
