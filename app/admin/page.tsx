import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  const supabase = createClient()

  const clerk = await clerkClient()
  const userList = await clerk.users.getUserList({ limit: 1 })
  const totalUsers = (userList as any).total_count ?? (userList as any).totalCount ?? userList.data.length

  const { count: printerCount } = await supabase
    .from('printers')
    .select('id', { count: 'exact', head: true })
    .eq('is_deleted', false)

  const { count: bookingsCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })

  const { count: maintenanceCount } = await supabase
    .from('printers')
    .select('id', { count: 'exact', head: true })
    .eq('is_under_maintenance', true)
    .eq('is_deleted', false)

  const { count: activeBookings } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .in('status', ['pending', 'awaiting_slice', 'ready_to_print', 'printing'])

  const maintenancePercent = printerCount ? Math.round(((maintenanceCount ?? 0) / printerCount) * 100) : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold">{totalUsers}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
          <p className="text-sm text-gray-500">Total Printers</p>
          <p className="text-2xl font-semibold">{printerCount ?? 0}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-semibold">{bookingsCount ?? 0}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
          <p className="text-sm text-gray-500">% Printers in Maintenance</p>
          <p className="text-2xl font-semibold">{maintenancePercent}%</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
          <p className="text-sm text-gray-500">Active Bookings</p>
          <p className="text-2xl font-semibold">{activeBookings ?? 0}</p>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Netlify Usage</h2>
        <p>Requests used: --</p>
        <p>Function runtime used: --</p>
        <p className="text-sm text-gray-500">Live data integration coming soon</p>
      </div>
    </div>
  )
}
