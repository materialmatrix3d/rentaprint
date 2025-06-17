'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

interface Booking {
  id: string
  start_date: string
  end_date: string
  estimated_runtime_hours?: number
}

export default function ChangeRequestPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user } = useUser()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [runtime, setRuntime] = useState('')

  useEffect(() => {
    const loadBooking = async () => {
      if (!id || !user?.id) return
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .eq('clerk_user_id', user.id)
        .single()
      if (data) {
        setBooking(data)
        setStart(data.start_date)
        setEnd(data.end_date)
        setRuntime(
          data.estimated_runtime_hours ? String(data.estimated_runtime_hours) : ''
        )
      }
      setLoading(false)
    }
    loadBooking()
  }, [id, user])

  const submit = async () => {
    const { error } = await supabase.from('booking_change_requests').insert({
      booking_id: id,
      new_start_date: start,
      new_end_date: end,
      new_runtime_hours: runtime ? parseFloat(runtime) : null,
    })
    if (error) {
      alert('Failed to submit request')
    } else {
      alert('Change request submitted!')
      router.push('/bookings')
    }
  }

  if (loading) return <p>Loading booking...</p>
  if (!booking) return <p>Booking not found.</p>

  return (
    <div className="p-4 space-y-3 text-gray-900 dark:text-white">
      <h1 className="text-xl font-semibold">Request Booking Change</h1>
      <label className="block text-sm">
        New Start Date
        <input
          type="datetime-local"
          value={start.slice(0,16)}
          onChange={e => setStart(new Date(e.target.value).toISOString())}
          className="mt-1 w-full p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
        />
      </label>
      <label className="block text-sm">
        New End Date
        <input
          type="datetime-local"
          value={end.slice(0,16)}
          onChange={e => setEnd(new Date(e.target.value).toISOString())}
          className="mt-1 w-full p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
        />
      </label>
      <label className="block text-sm">
        New Runtime Hours
        <input
          type="number"
          step="0.1"
          min="0"
          value={runtime}
          onChange={e => setRuntime(e.target.value)}
          className="mt-1 w-full p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
        />
      </label>
      <div className="flex gap-2 pt-2">
        <button
          onClick={submit}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
        >
          Submit Request
        </button>
        <Link
          href="/bookings"
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}
