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
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchPrinter = async () => {
      const { data, error } = await supabase
        .from('printers')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
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
    if (printer?.is_under_maintenance) {
      alert('This printer is currently under maintenance and cannot be booked.')
      return
    }
    if (!user) {
      alert('You must be logged in to book a printer.')
      return
    }

    if (!runtime || isNaN(runtime) || runtime <= 0) {
      alert('Please enter a valid runtime in hours.')
      return
    }
    if (
      printer &&
      (runtime < (printer.min_runtime_hours ?? 1) ||
        runtime > (printer.max_runtime_hours ?? 24))
    ) {
      alert(
        `Please enter a runtime between ${
          printer.min_runtime_hours ?? 1
        } and ${printer.max_runtime_hours ?? 24} hours.`
      )
      return
    }

    if (file && file.size > 100 * 1024 * 1024) {
      alert('File must be under 100MB.')
      return
    }

    const start = new Date()
    const end = new Date(start.getTime() + runtime * 3600 * 1000)
    const { data: inserted, error } = await supabase
      .from('bookings')
      .insert({
        printer_id: id,
        clerk_user_id: user.id,
        status: 'pending',
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        estimated_runtime_hours: runtime,
      })
      .select()
      .single()

    if (error || !inserted) {
      console.error('Error creating booking:', error)
      alert(`Booking failed: ${error?.message}`)
      return
    }

    if (file) {
      setUploading(true)
      const path = `booking-files/${inserted.id}/${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('print-files')
        .upload(path, file)

      if (uploadError) {
        console.error('File upload failed:', uploadError)
        const msg =
          uploadError.message === 'Bucket not found'
            ? 'Print file bucket missing. Please create a "print-files" bucket in Supabase.'
            : 'File upload failed'
        alert(msg)
        setUploading(false)
      } else {
        const { data: signed, error: signError } = await supabase.storage
          .from('print-files')
          .createSignedUrl(path, 60 * 60 * 24 * 7)
        if (signError) {
          console.error('URL signing failed:', signError)
        } else {
          await supabase
            .from('bookings')
            .update({ print_file_url: signed.signedUrl })
            .eq('id', inserted.id)
        }
        setUploading(false)
      }
    }

    alert('Booking successful!')
    router.push('/bookings')
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
      {printer.is_under_maintenance && (
        <p className="text-red-500 mt-2">This printer is under maintenance.</p>
      )}
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
          {`Runtime must be between ${printer.min_runtime_hours ?? 1} and ${
            printer.max_runtime_hours ?? 24
          } hours.`}
        </p>
        <p className="text-sm">
          {`Estimated Cost: $${(runtime * (printer.price_per_hour || 0)).toFixed(2)}`}
        </p>
        <label className="block text-sm">
          Optional Print File:
          <input
            type="file"
            accept=".stl,.gcode,.zip"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
          />
        </label>
        {uploading && <p className="text-sm">Uploading file...</p>}
      </div>
      <button
        onClick={handleBooking}
        disabled={printer.is_under_maintenance}
        className="mt-4 px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Confirm Booking
      </button>
    </div>
  )
}
