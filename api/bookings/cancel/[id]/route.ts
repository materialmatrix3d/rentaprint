import { auth } from "@clerk/nextjs";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  const supabase = createRouteHandlerClient({ cookies });

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", params.id)
    .eq("clerk_user_id", userId);

  if (error) return new Response("Failed to cancel booking", { status: 500 });

  return new Response("Booking canceled", { status: 200 });
}
