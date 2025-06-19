import { fetchAllBookings } from '@/lib/admin'

export default async function AdminBookingsPage() {
  const bookings = await fetchAllBookings()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Printer</th>
              <th className="p-2">User</th>
              <th className="p-2">Status</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-t">
                <td className="p-2 text-xs">{b.id}</td>
                <td className="p-2">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers?.name}</td>
                <td className="p-2 text-xs">{b.clerk_user_id}</td>
                <td className="p-2 text-xs">{b.status}</td>
                <td className="p-2 text-xs">{new Date(b.start_date).toLocaleString()}</td>
                <td className="p-2 text-xs">{new Date(b.end_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
