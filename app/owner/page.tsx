import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OwnerPanel from './components/OwnerPanelClient'

export default async function OwnerPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')
  const supabase = createClient()
  const { data } = await supabase.from('printers').select('id').eq('clerk_user_id', userId)
  if (!data || data.length === 0) {
    return <div className="p-6 text-gray-900 dark:text-white">Not Authorized</div>
  }
  return <OwnerPanel />
}
