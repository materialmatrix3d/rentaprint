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
  status: string
  estimated_runtime_hours?: number
  actual_runtime_hours?: number
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
  const [runtimeModal, setRuntimeModal] = useState<{ id: string } | null>(null)
  const [actualRuntime, setActualRuntime] = useState('')

  const submitRuntime = async () => {
    if (!runtimeModal) return
    const { error } = await supabase
      .from('bookings')
      .update({ actual_runtime_hours: parseFloat(actualRuntime), status: 'complete' })
      .eq('id', runtimeModal.id)

    if (error) {
      alert('Failed to set runtime')
      console.error(error)
    } else {
      setBookings(
        bookings.map(b =>
          b.id === runtimeModal.id ? { ...b, status: 'complete', actual_runtime_hours: parseFloat(actualRuntime) } : b
        )
      )
    }
    setActualRuntime('')
    setRuntimeModal(null)
  }

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
          .select('id, clerk_user_id, start_date, end_date, status, estimated_runtime_hours, actual_runtime_hours, printers(name)')
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
            const now = new Date()
            const active = booking.status === 'approved' && start <= now && end >= now
            return (
              <li
                key={booking.id}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white space-y-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{booking.printers.name}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${{
                      pending: 'bg-yellow-400 text-black',
                      approved: 'bg-green-600 text-gray-900 dark:text-white',
                      complete: 'bg-blue-600 text-gray-900 dark:text-white',
                      canceled: 'bg-red-600 text-gray-900 dark:text-white',
                    }[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Renter: {booking.clerk_user_id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start: {start.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Est: {booking.estimated_runtime_hours ?? hours} hrs
                  {booking.actual_runtime_hours && ` • Actual: ${booking.actual_runtime_hours} hrs`}
                </p>
                {active && (
                  <button
                    onClick={() => setRuntimeModal({ id: booking.id })}
                    className="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
                  >
                    Set Final Runtime
                  </button>
                )}
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
        {runtimeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Set Final Runtime</h3>
              <input
                type="number"
                step="0.1"
                min="0"
                value={actualRuntime}
                onChange={e => setActualRuntime(e.target.value)}
                className="w-full p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRuntimeModal(null)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRuntime}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
