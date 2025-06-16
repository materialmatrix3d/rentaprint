import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  context: any
) {
  const { params } = context as { params: { id: string } };
  const { userId } = await auth();
  const supabase = createClient();

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error, data } = await supabase
    .from('bookings')
    .delete()
    .eq('id', params.id)
    .eq('clerk_user_id', userId)
    .select();

  if (error) {
    console.error('Error deleting booking', error);
    return NextResponse.json({ error: `Failed to delete booking: ${error.message}` }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
}
