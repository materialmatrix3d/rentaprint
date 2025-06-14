import { auth } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  const supabase = createClient();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", params.id)
    .eq("clerk_user_id", userId);

  if (error) return new Response("Failed to cancel booking", { status: 500 });

  return new Response("Booking canceled", { status: 200 });
}
