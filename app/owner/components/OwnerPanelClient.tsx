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
  print_file_url?: string
  layer_height?: string | null
  infill?: string | null
  supports?: boolean | null
  print_notes?: string | null
  printers: { name: string } | { name: string }[]
}

interface ChangeRequest {
  id: string
  booking_id: string
  new_start_date: string
  new_end_date: string
  new_runtime_hours: number | null
  status: string
  bookings: {
    id: string
    printer_id: string
    start_date: string
    end_date: string
    estimated_runtime_hours?: number
    printers: { name: string } | { name: string }[]
  }
}

export default function OwnerPanel() {
  const { user } = useUser()
  const supabase = useMemo(() => createClientComponentClient(), [])

  const [printers, setPrinters] = useState<Printer[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([])
  const [loadingPrinters, setLoadingPrinters] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [runtimeModal, setRuntimeModal] = useState<{ id: string } | null>(null)
  const [actualRuntime, setActualRuntime] = useState('')
  const [sliceUploads, setSliceUploads] = useState<Record<string, File | null>>({})

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

  const toggleMaintenance = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('printers')
      .update({ is_under_maintenance: !current })
      .eq('id', id)
    if (error) {
      alert('Failed to update maintenance status')
    } else {
      setPrinters(printers.map(p => (
        p.id === id ? { ...p, is_under_maintenance: !current } : p
      )))
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

  const acceptBooking = async (booking: Booking) => {
    let next: BookingStatus = 'ready_to_print'
    if (booking.print_file_url) {
      const ext = booking.print_file_url.split('?')[0].split('.').pop()?.toLowerCase()
      if (ext === 'stl') next = 'awaiting_slice'
    }
    await updateStatus(booking.id, next)
  }

  const rejectBooking = async (id: string) => {
    await updateStatus(id, 'rejected')
  }

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

  const uploadSlice = async (bookingId: string) => {
    const file = sliceUploads[bookingId]
    if (!file) return
    const path = `booking-files/${bookingId}/sliced.gcode`
    const { error: uploadError } = await supabase.storage
      .from('print-files')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      alert('Failed to upload G-code')
      console.error(uploadError)
      return
    }
    const { data: signed, error } = await supabase.storage
      .from('print-files')
      .createSignedUrl(path, 60 * 60 * 24 * 7)
    if (error || !signed) {
      alert('Failed to sign G-code URL')
      return
    }
    await supabase
      .from('bookings')
      .update({ print_file_url: signed.signedUrl, status: 'ready_to_print' })
      .eq('id', bookingId)
    setBookings(
      bookings.map(b =>
        b.id === bookingId
          ? { ...b, print_file_url: signed.signedUrl, status: 'ready_to_print' }
          : b
      )
    )
    setSliceUploads({ ...sliceUploads, [bookingId]: null })
  }

  const handleRequest = async (req: ChangeRequest, approve: boolean) => {
    if (approve) {
      await supabase
        .from('bookings')
        .update({
          start_date: req.new_start_date,
          end_date: req.new_end_date,
          estimated_runtime_hours: req.new_runtime_hours,
        })
        .eq('id', req.booking_id)
    }
    await supabase
      .from('booking_change_requests')
      .update({ status: approve ? 'approved' : 'rejected' })
      .eq('id', req.id)
    setChangeRequests(changeRequests.filter(r => r.id !== req.id))
    if (approve) {
      setBookings(
        bookings.map(b =>
          b.id === req.booking_id
            ? { ...b, start_date: req.new_start_date, end_date: req.new_end_date, estimated_runtime_hours: req.new_runtime_hours ?? b.estimated_runtime_hours }
            : b
        )
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: printerData, error: printerError } = await supabase
        .from('printers')
        .select('*')
        .eq('clerk_user_id', user?.id)
        .eq('is_deleted', false)

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
          .select('id, printer_id, status, created_at, clerk_user_id, start_date, end_date, estimated_runtime_hours, actual_runtime_hours, print_file_url, layer_height, infill, supports, print_notes, printers(name)')
          .in('printer_id', ids)
          .eq('printers.is_deleted', false)
          .order('start_date', { ascending: false })

        if (bookingError)
          console.error(
            'Error fetching bookings:',
            bookingError.message,
            bookingError.details ?? ''
          )
        setBookings((bookingData || []) as Booking[])

        const { data: requestData, error: requestError } = await supabase
          .from('booking_change_requests')
          .select('*, bookings(id, printer_id, start_date, end_date, estimated_runtime_hours, printers(name))')
          .in('bookings.printer_id', ids)
          .eq('status', 'pending')

        if (requestError) {
          console.error('Error fetching change requests:', requestError)
        }
        setChangeRequests((requestData || []) as ChangeRequest[])
        setLoadingRequests(false)
      }
      setLoadingBookings(false)
    }

    if (user?.id) fetchData()
  }, [user])

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const sliceBookings = bookings.filter(b => b.status === 'awaiting_slice')
  const readyBookings = bookings.filter(b => b.status === 'ready_to_print')
  const printingBookings = bookings.filter(b => b.status === 'printing')
  const completeBookings = bookings.filter(b => b.status === 'complete')
  const rejectedBookings = bookings.filter(b => b.status === 'rejected')
  
  const pendingList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Pending Approvals</h2>
      {pendingBookings.length === 0 ? (
        <p>No pending bookings.</p>
      ) : (
        <ul className="space-y-3">
          {pendingBookings.map(b => (
            <li key={b.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
              <p className="font-medium">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers.name}</p>
              <p className="text-sm">Renter: {b.clerk_user_id}</p>
              <p className="text-sm">
                {new Date(b.start_date).toLocaleString()} - {new Date(b.end_date).toLocaleString()}
              </p>
              <div className="flex gap-2 pt-1">
                <button onClick={() => acceptBooking(b)} className="px-2 py-1 text-xs bg-green-600 text-gray-900 dark:text-white rounded">Accept</button>
                <button onClick={() => rejectBooking(b.id)} className="px-2 py-1 text-xs bg-red-600 text-gray-900 dark:text-white rounded">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  const sliceList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Awaiting Slice</h2>
      {sliceBookings.length === 0 ? (
        <p>No bookings need slicing.</p>
      ) : (
        <ul className="space-y-3">
          {sliceBookings.map(b => (
            <li key={b.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
              <p className="font-medium">Booking {b.id}</p>
              {b.print_file_url && (
                <a href={b.print_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 underline">
                  Download STL
                </a>
              )}
              <p className="text-sm">Layer Height: {b.layer_height || 'N/A'}</p>
              <p className="text-sm">Infill: {b.infill || 'N/A'}</p>
              <p className="text-sm">Supports: {b.supports ? 'Yes' : 'No'}</p>
              {b.print_notes && <p className="text-sm">Notes: {b.print_notes}</p>}
              <input
                type="file"
                accept=".gcode"
                onChange={e => setSliceUploads({ ...sliceUploads, [b.id]: e.target.files?.[0] || null })}
                className="block mt-1 w-full text-sm text-black dark:text-white"
              />
              <button
                onClick={() => uploadSlice(b.id)}
                disabled={!sliceUploads[b.id]}
                className="mt-2 px-2 py-1 text-xs bg-blue-600 text-gray-900 dark:text-white rounded disabled:opacity-50"
              >
                Mark Ready
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  const readyList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Ready to Print</h2>
      {readyBookings.length === 0 ? (
        <p>No jobs ready to print.</p>
      ) : (
        <ul className="space-y-3">
          {readyBookings.map(b => (
            <li key={b.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
              <p className="font-medium">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers.name}</p>
              {b.print_file_url && (
                <a href={b.print_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 underline">
                  Download G-code
                </a>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={() => updateStatus(b.id, 'printing')} className="px-2 py-1 text-xs bg-blue-500 text-gray-900 dark:text-white rounded">Start Job</button>
                <button onClick={() => updateStatus(b.id, 'complete')} className="px-2 py-1 text-xs bg-blue-600 text-gray-900 dark:text-white rounded">Mark Complete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  const printingList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Printing</h2>
      {printingBookings.length === 0 ? (
        <p>No active prints.</p>
      ) : (
        <ul className="space-y-3">
          {printingBookings.map(b => (
            <li key={b.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
              <p className="font-medium">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers.name}</p>
              {b.print_file_url && (
                <a href={b.print_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 underline">
                  Download G-code
                </a>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setRuntimeModal({ id: b.id })} className="px-2 py-1 text-xs bg-blue-600 text-gray-900 dark:text-white rounded">Complete Job</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  const completeList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Completed</h2>
      {completeBookings.length === 0 ? (
        <p>No completed bookings.</p>
      ) : (
        <ul className="space-y-3">
          {completeBookings.map(b => (
            <li key={b.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
              <p className="font-medium">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers.name}</p>
              <p className="text-sm">Runtime: {b.actual_runtime_hours ?? b.estimated_runtime_hours ?? ''} hrs</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  const rejectedList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Rejected</h2>
      {rejectedBookings.length === 0 ? (
        <p>No rejected bookings.</p>
      ) : (
        <ul className="space-y-3">
          {rejectedBookings.map(b => (
            <li key={b.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
              <p className="font-medium">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers.name}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

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
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
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
                    <button onClick={() => toggleMaintenance(printer.id, printer.is_under_maintenance ?? false)} className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500">
                      {printer.is_under_maintenance ? 'End Maintenance' : 'Start Maintenance'}
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
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <p className="font-medium">{Array.isArray(booking.printers) ? booking.printers[0]?.name : booking.printers.name}</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                bookingStatusClasses[booking.status]
                              }`}>{booking.status}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Booked {new Date(booking.created_at).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Renter: {booking.clerk_user_id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Start: {start.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Est: {booking.estimated_runtime_hours ?? hours} hrs{booking.actual_runtime_hours && ` • Actual: ${booking.actual_runtime_hours} hrs`}</p>
                          {booking.print_file_url && (
                            <a
                              href={booking.print_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 underline"
                            >
                              Download Print File
                            </a>
                          )}
                          <div className="flex gap-2 flex-wrap pt-1">
                            {booking.status === 'ready_to_print' && (
                              <button onClick={() => updateStatus(booking.id, 'printing')} className="px-2 py-1 text-xs bg-blue-500 text-gray-900 dark:text-white rounded">Start Job</button>
                            )}
                            {booking.status === 'printing' && (
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

  const requestList = (
    <section>
      <h2 className="text-xl font-semibold mb-2">Change Requests</h2>
      {loadingRequests ? (
        <p>Loading requests...</p>
      ) : changeRequests.length === 0 ? (
        <p>No pending change requests.</p>
      ) : (
        <ul className="space-y-3">
          {changeRequests.map(req => {
            const b = req.bookings
            const start = new Date(req.new_start_date)
            const hours = req.new_runtime_hours ?? Math.round((new Date(req.new_end_date).getTime() - start.getTime()) / 3600000)
            return (
              <li key={req.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-1">
                <p className="font-medium">{Array.isArray(b.printers) ? b.printers[0]?.name : b.printers.name}</p>
                <p className="text-sm">Proposed Start: {start.toLocaleString()}</p>
                <p className="text-sm">Proposed Duration: {hours} hrs</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleRequest(req, true)} className="px-2 py-1 text-xs bg-green-600 text-gray-900 dark:text-white rounded">Approve</button>
                  <button onClick={() => handleRequest(req, false)} className="px-2 py-1 text-xs bg-red-600 text-gray-900 dark:text-white rounded">Reject</button>
                </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">Owner Panel</h1>
            <Link
              href="/printers/new"
              className="px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded hover:bg-blue-700"
            >
              Create New Listing
            </Link>
          </div>
          {pendingList}
          {sliceList}
          {readyList}
          {printingList}
          {completeList}
          {rejectedList}
          {printerList}
          {requestList}
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
