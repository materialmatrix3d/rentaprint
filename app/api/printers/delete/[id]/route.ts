import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  const supabase = createClient();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { error, data } = await supabase
    .from('printers')
    .delete()
    .eq('id', params.id)
    .eq('clerk_user_id', userId)
    .select();

  if (error) {
    console.error('Error deleting printer', error);
    return new Response(`Failed to delete printer: ${error.message}`, { status: 500 });
  }

  if (!data || data.length === 0) {
    return new Response('Printer not found', { status: 404 });
  }

  return new Response('Printer deleted', { status: 200 });
}
