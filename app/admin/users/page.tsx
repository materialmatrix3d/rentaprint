import { fetchUniqueUsers } from '@/lib/admin'

export default async function AdminUsersPage() {
  const users = await fetchUniqueUsers()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="list-disc pl-6">
          {users.map(id => (
            <li key={id} className="text-xs">{id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
