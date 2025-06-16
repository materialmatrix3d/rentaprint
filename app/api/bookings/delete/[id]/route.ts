import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from 'next/server'
import type { RouteHandlerContext } from 'next/dist/server/future/route-modules/app-route/types'

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, context: RouteHandlerContext) {
  const { userId } = auth();
  const supabase = createClient();

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error, data } = await supabase
    .from('bookings')
    .delete()
    .eq('id', context.params.id)
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
