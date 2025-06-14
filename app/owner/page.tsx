'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Printer } from '@/lib/data'

interface Booking {
  id: string
  clerk_user_id: string
  start_date: string
  end_date: string
  printers: {
    name: string
  }
}

export default function OwnerPanel() {
  const { user } = useUser()
  const supabase = useMemo(() => createClientComponentClient(), [])

  const [printers, setPrinters] = useState<Printer[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingPrinters, setLoadingPrinters] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: printerData, error: printerError } = await supabase
        .from('printers')
        .select('*')
        .eq('clerk_user_id', user?.id)

      if (printerError) console.error('Error fetching printers:', printerError)
      setPrinters(printerData || [])
      setLoadingPrinters(false)

      if (printerData && printerData.length > 0) {
        const ids = printerData.map((p) => p.id)
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('id, clerk_user_id, start_date, end_date, printers(name)')
          .in('printer_id', ids)
          .order('start_date', { ascending: false })

        if (bookingError) console.error('Error fetching bookings:', bookingError)
        setBookings(bookingData || [])
      }
      setLoadingBookings(false)
    }

    if (user?.id) fetchData()
  }, [user])

  const printerList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Your Printers</h2>
      {loadingPrinters ? (
        <p>Loading printers...</p>
      ) : printers.length === 0 ? (
        <p>You have no printers listed yet.</p>
      ) : (
        <ul className="space-y-3">
          {printers.map((printer) => (
            <li
              key={printer.id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {printer.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {printer.status || 'available'} &bull; ${' '}
                  {printer.price_per_hour}/hr
                </p>
              </div>
              <button className="px-3 py-1 text-sm bg-yellow-400 text-black rounded hover:bg-yellow-500">
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  const bookingList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Recent Bookings</h2>
      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings for your printers yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            const start = new Date(booking.start_date)
            const end = new Date(booking.end_date)
            const hours = Math.round((end.getTime() - start.getTime()) / 3600000)
            return (
              <li
                key={booking.id}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"
              >
                <p className="font-medium">{booking.printers.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Renter: {booking.clerk_user_id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start: {start.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {hours} hrs
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )

  return (
    <>
      <SignedIn>
        <main className="space-y-8 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Owner Panel</h1>
            <Link
              href="/printers/new"
              className="px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded hover:bg-blue-700"
            >
              Create New Listing
            </Link>
          </div>
          {printerList}
          {bookingList}
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
