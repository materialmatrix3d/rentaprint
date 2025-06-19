import { currentUser } from '@clerk/nextjs/server'
import { fetchAdminStats } from '@/lib/admin'

export default async function AdminPage() {
  const user = await currentUser()
  const stats = await fetchAdminStats()

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user?.fullName || user?.username}!</p>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm">Printers</p>
          <p className="text-2xl font-bold">{stats.printers}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm">Bookings</p>
          <p className="text-2xl font-bold">{stats.bookings}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm">Users</p>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm">Patch Notes</p>
          <p className="text-2xl font-bold">{stats.patchNotes}</p>
        </div>
      </div>
    </div>
  )
}
