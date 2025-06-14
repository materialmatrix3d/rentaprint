'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Printer } from '@/lib/data'

export default function BookingPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [printer, setPrinter] = useState<Printer | null>(null)
  const [loading, setLoading] = useState(true)

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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to book a printer.')
      return
    }

    const { error } = await supabase.from('bookings').insert({
      printer_id: id,
      clerk_user_id: user.id,
      status: 'pending',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3600 * 1000).toISOString(),
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
        {printer.price_per_hour ? `$${parseFloat(printer.price_per_hour)}` : '$N/A'}
      </p>
      <p>
        <strong>Availability:</strong> {printer.availability || 'Not specified'}
      </p>
      <p>
        <strong>Make/Model:</strong> {printer.make_model || 'N/A'}
      </p>
      <button
        onClick={handleBooking}
        className="mt-4 px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </div>
  )
}
