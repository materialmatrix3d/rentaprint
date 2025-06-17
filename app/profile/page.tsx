'use client'

import { useEffect, useState, useMemo } from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, useUser, UserButton, useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { bookingStatusClasses, type BookingStatus } from '@/lib/bookings'

interface Booking {
  id: string
  printer_id?: string
  status?: BookingStatus
  created_at?: string
  start_date: string
  end_date: string
  printers: { name: string } | { name: string }[]
}

export default function ProfilePage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const supabase = useMemo(() => createClientComponentClient(), [])

  const [stats, setStats] = useState({ printers: 0, bookings: 0, hours: 0 })
  const [loadingStats, setLoadingStats] = useState(true)
  const [upcoming, setUpcoming] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadStats = async () => {
      const { count: printerCount } = await supabase
        .from('printers')
        .select('*', { count: 'exact', head: true })
        .eq('clerk_user_id', user.id)
        .eq('is_deleted', false)

      const { data: bookingData, count: bookingCount } = await supabase
        .from('bookings')
        .select('start_date, end_date', { count: 'exact' })
        .eq('clerk_user_id', user.id)

      let hours = 0
      bookingData?.forEach(b => {
        const start = new Date(b.start_date)
        const end = new Date(b.end_date)
        hours += (end.getTime() - start.getTime()) / 3600000
      })

      setStats({
        printers: printerCount || 0,
        bookings: bookingCount || 0,
        hours: Math.round(hours)
      })
      setLoadingStats(false)
    }

    const loadUpcoming = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('id, printer_id, status, created_at, start_date, end_date, printers(name)')
        .eq('clerk_user_id', user.id)
        .eq('printers.is_deleted', false)
        .gt('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })

      setUpcoming((data || []) as Booking[])
      setLoadingBookings(false)
    }

    loadStats()
    loadUpcoming()
  }, [user])

  return (
    <>
      <SignedIn>
        <main className="space-y-6">
          {/* User Info */}
          <section className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-6 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
            {user && (
              <div className="space-y-1 text-gray-900 dark:text-white">
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
                <p><strong>Clerk ID:</strong> {user.id}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <UserButton afterSignOutUrl="/" />
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white rounded"
              >
                Sign Out
              </button>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Statistics</h2>
            {loadingStats ? (
              <p className="text-gray-900 dark:text-white">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm">Printers</p>
                  <p className="text-2xl font-bold">{stats.printers}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm">Bookings</p>
                  <p className="text-2xl font-bold">{stats.bookings}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm">Hours Rented</p>
                  <p className="text-2xl font-bold">{stats.hours}</p>
                </div>
              </div>
            )}
          </section>

          {/* Upcoming Bookings */}
          <section className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h2>
            {loadingBookings ? (
              <p className="text-gray-900 dark:text-white">Loading...</p>
            ) : upcoming.length === 0 ? (
              <p className="text-gray-900 dark:text-white">No upcoming bookings</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map(b => {
                  const start = new Date(b.start_date)
                  const hours = Math.round((new Date(b.end_date).getTime() - start.getTime()) / 3600000)
                  return (
                    <li key={b.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {Array.isArray(b.printers)
                        ? b.printers[0]?.name
                        : b.printers?.name}
                    </p>
                    {b.status && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        bookingStatusClasses[b.status]
                      }`}>{b.status}</span>
                    )}
                  </div>
                  {b.created_at && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Booked {new Date(b.created_at).toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm">Start: {start.toLocaleString()}</p>
                      <p className="text-sm">Duration: {hours} hrs</p>
                      {b.status !== 'rejected' && (
                        <Link
                          href={`/bookings/change/${b.id}`}
                          className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
                        >
                          Request Change
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
