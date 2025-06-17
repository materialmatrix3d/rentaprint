import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import OwnerPanel from './components/OwnerPanelClient'

export default async function OwnerPage() {
  const { userId, sessionId } = await auth()
  const supabase = createClient()

  if (!sessionId && !userId) {
    return <p>Not Authorized</p>
  }

  const { data: printers } = await supabase
    .from('printers')
    .select('id')
    .eq('clerk_user_id', userId)
    .eq('is_deleted', false)

  if (!printers || printers.length === 0) {
    return (
      <div className="p-6 text-gray-900 dark:text-white">
        <p>You don’t have any printers listed yet. Add one to get started.</p>
        <Link href="/new-listing">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Create New Listing</button>
        </Link>
      </div>
    )
  }

  return <OwnerPanel />
}
