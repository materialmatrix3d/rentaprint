'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@clerk/nextjs'
import type { Printer } from '@/lib/data'

export default function BookingPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user } = useUser()
  const [printer, setPrinter] = useState<Printer | null>(null)
  const [loading, setLoading] = useState(true)
  const [runtime, setRuntime] = useState(1)

  useEffect(() => {
    const fetchPrinter = async () => {
      const { data, error } = await supabase
        .from('printers')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        console.error('Error fetching printer:', error)
        return
      }
      setPrinter(data)
      setLoading(false)
    }
    if (id) fetchPrinter()
  }, [id])

  const handleBooking = async () => {
    if (!user) {
      alert('You must be logged in to book a printer.')
      return
    }

    const start = new Date()
    const end = new Date(start.getTime() + runtime * 3600 * 1000)
    const { error } = await supabase.from('bookings').insert({
      printer_id: id,
      clerk_user_id: user.id,
      status: 'pending',
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      estimated_runtime_hours: runtime,
    })

    if (error) {
      console.error('Error creating booking:', error)
      alert('Booking failed.')
    } else {
      alert('Booking successful!')
      router.push('/bookings')
    }
  }

  if (loading) return <p>Loading printer...</p>
  if (!printer) return <p>Printer not found.</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Booking: {printer.name}</h1>
      <p>
        <strong>Location:</strong> {printer.location || 'Unknown'}
      </p>
      <p>
        <strong>Description:</strong> {printer.description || 'None provided'}
      </p>
      <p>
        <strong>Materials Supported:</strong>{' '}
        {printer.materials?.join(', ') || 'N/A'}
      </p>
      <p>
        <strong>Max Print Size:</strong> {printer.build_volume || 'N/A'}
      </p>
      <p>
        <strong>Hourly Rate:</strong>{' '}
        {printer.price_per_hour ? `$${printer.price_per_hour.toFixed(2)}` : '$N/A'}
      </p>
      <p>
        <strong>Availability:</strong> {printer.availability || 'Not specified'}
      </p>
      <p>
        <strong>Make/Model:</strong> {printer.make_model || 'N/A'}
      </p>
      <div className="pt-2 space-y-2">
        <label className="block text-sm">
          Estimated Runtime (hrs):
          <input
            type="number"
            step="0.1"
            min="0"
            value={runtime}
            onChange={e => setRuntime(parseFloat(e.target.value))}
            className="mt-1 w-full p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
          />
        </label>
        <p className="text-sm">
          Estimated Cost: ${'{'}(runtime * (printer.price_per_hour || 0)).toFixed(2){'}'}
        </p>
      </div>
      <button
        onClick={handleBooking}
        className="mt-4 px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </div>
  )
}
