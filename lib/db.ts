import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function getSupabaseClient() {
  return createServerComponentClient({ cookies });
}
