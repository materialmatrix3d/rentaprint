import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  const supabase = createClient();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { error, data } = await supabase
    .from("bookings")
    .delete()
    .eq("id", params.id)
    .eq("clerk_user_id", userId)
    .select();

  if (error) {
    console.error("Error canceling booking", error);
    return new Response(`Failed to cancel booking: ${error.message}`, { status: 500 });
  }

  if (!data || data.length === 0) {
    return new Response("Booking not found", { status: 404 });
  }

  return new Response("Booking canceled", { status: 200 });
}
