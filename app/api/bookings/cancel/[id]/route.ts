import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, context: Params) {
  const supabase = createClient();
  const bookingId = context.params.id;

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
