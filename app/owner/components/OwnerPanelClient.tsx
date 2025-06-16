'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Printer } from '@/lib/data'
import { bookingStatusClasses, type BookingStatus } from '@/lib/bookings'

interface Booking {
  id: string
  printer_id: string
  clerk_user_id: string
  status: BookingStatus
  created_at: string
  start_date: string
  end_date: string
  estimated_runtime_hours?: number
  actual_runtime_hours?: number
  printers: { name: string } | { name: string }[]
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

  const toggleAvailability = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('printers')
      .update({ is_available: !current })
      .eq('id', id)
    if (error) {
      alert('Failed to update availability')
    } else {
      setPrinters(printers.map(p => (p.id === id ? { ...p, is_available: !current } : p)))
    }
  }

  const updateStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) {
      alert('Failed to update booking')
    } else {
      setBookings(bookings.map(b => (b.id === id ? { ...b, status } : b)))
    }
  }

  const submitRuntime = async () => {
    if (!runtimeModal) return
    const { error } = await supabase
      .from('bookings')
      .update({ actual_runtime_hours: parseFloat(actualRuntime), status: 'completed' })
      .eq('id', runtimeModal.id)

    if (error) {
      alert('Failed to set runtime')
      console.error(error)
    } else {
      setBookings(
        bookings.map(b =>
          b.id === runtimeModal.id ? { ...b, status: 'completed', actual_runtime_hours: parseFloat(actualRuntime) } : b
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

      if (printerError)
        console.error(
          'Error fetching printers:',
          printerError.message,
          printerError.details ?? ''
        )
      setPrinters(printerData || [])
      setLoadingPrinters(false)

      if (printerData && printerData.length > 0) {
        const ids = printerData.map((p) => p.id)
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('id, printer_id, status, created_at, clerk_user_id, start_date, end_date, estimated_runtime_hours, actual_runtime_hours, printers(name)')
          .in('printer_id', ids)
          .order('start_date', { ascending: false })

        if (bookingError)
          console.error(
            'Error fetching bookings:',
            bookingError.message,
            bookingError.details ?? ''
          )
        setBookings((bookingData || []) as Booking[])
      }
      setLoadingBookings(false)
    }

    if (user?.id) fetchData()
  }, [user])

  const printerList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Your Printers</h2>
      {loadingPrinters || loadingBookings ? (
        <p>Loading printers...</p>
      ) : printers.length === 0 ? (
        <p>You have no printers listed yet.</p>
      ) : (
        <ul className="space-y-3">
          {printers.map((printer) => {
            const printerBookings = bookings.filter(b => b.printer_id === printer.id)
            return (
              <li key={printer.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{printer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      Status:
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${printer.is_available ? 'bg-green-600 text-gray-900 dark:text-white' : 'bg-red-600 text-gray-900 dark:text-white'}`}>{printer.is_available ? 'available' : 'unavailable'}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${printer.price_per_hour}/hr</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/my-printers/${printer.id}/edit`} className="px-3 py-1 text-sm bg-yellow-400 text-black rounded hover:bg-yellow-500">Edit</Link>
                    <button onClick={() => toggleAvailability(printer.id, printer.is_available ?? true)} className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500">
                      {printer.is_available ? 'Set Unavailable' : 'Set Available'}
                    </button>
                  </div>
                </div>
                {printerBookings.length > 0 && (
                  <ul className="space-y-2">
                    {printerBookings.map((booking) => {
                      const start = new Date(booking.start_date)
                      const end = new Date(booking.end_date)
                      const hours = Math.round((end.getTime() - start.getTime()) / 3600000)
                      return (
                        <li key={booking.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{Array.isArray(booking.printers) ? booking.printers[0]?.name : booking.printers.name}</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                bookingStatusClasses[booking.status]
                              }`}>{booking.status}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Booked {new Date(booking.created_at).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Renter: {booking.clerk_user_id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Start: {start.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Est: {booking.estimated_runtime_hours ?? hours} hrs{booking.actual_runtime_hours && ` • Actual: ${booking.actual_runtime_hours} hrs`}</p>
                          <div className="flex gap-2 flex-wrap pt-1">
                            {booking.status === 'pending' && (
                              <>
                                <button onClick={() => updateStatus(booking.id, 'approved')} className="px-2 py-1 text-xs bg-green-600 text-gray-900 dark:text-white rounded">Approve</button>
                                <button onClick={() => updateStatus(booking.id, 'rejected')} className="px-2 py-1 text-xs bg-red-600 text-gray-900 dark:text-white rounded">Reject</button>
                              </>
                            )}
                            {booking.status === 'approved' && (
                              <button onClick={() => updateStatus(booking.id, 'in_progress')} className="px-2 py-1 text-xs bg-blue-500 text-gray-900 dark:text-white rounded">Start Job</button>
                            )}
                            {booking.status === 'in_progress' && (
                              <button onClick={() => setRuntimeModal({ id: booking.id })} className="px-2 py-1 text-xs bg-blue-600 text-gray-900 dark:text-white rounded">Complete Job</button>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
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
