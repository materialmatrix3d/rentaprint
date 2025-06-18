import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/')
  const user = await currentUser()
  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    (Array.isArray(user?.publicMetadata?.roles) && user!.publicMetadata!.roles.includes('admin')) ||
    user?.privateMetadata?.role === 'admin' ||
    (Array.isArray(user?.privateMetadata?.roles) && user!.privateMetadata!.roles.includes('admin'))
  if (!isAdmin) redirect('/')

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-60 bg-gray-100 dark:bg-gray-800 p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Admin</h2>
        <nav className="flex flex-col space-y-1">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/printers">Printers</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/system">System</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  )
}
