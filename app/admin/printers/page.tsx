import { fetchAllPrinters } from '@/lib/admin'
import Link from 'next/link'

export default async function AdminPrintersPage() {
  const printers = await fetchAllPrinters()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Printers</h1>
      {printers.length === 0 ? (
        <p>No printers found.</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {printers.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-xs">{p.clerk_user_id}</td>
                <td className="p-2 text-xs">{p.is_deleted ? 'deleted' : p.is_available ? 'available' : 'unavailable'}</td>
                <td className="p-2">
                  <Link href={`/printers/${p.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
