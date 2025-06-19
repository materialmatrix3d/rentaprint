'use client'
import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Message {
  id: string
  sender_id: string
  message: string
  timestamp: string
}

interface Booking {
  id: string
  status: string
  printers: { name: string } | { name: string }[]
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const { user } = useUser()
  const supabase = useMemo(() => createClientComponentClient(), [])

  const [booking, setBooking] = useState<Booking | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  const load = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('id,status,printers(name)')
      .eq('id', id)
      .single()
    setBooking(data as Booking)

    const res = await fetch(`/api/bookings/messages/${id}`)
    if (res.ok) {
      setMessages(await res.json())
    }
  }

  useEffect(() => {
    if (id) {
      load()
      const t = setInterval(load, 10000)
      return () => clearInterval(t)
    }
  }, [id])

  const send = async () => {
    if (!text) return
    await fetch(`/api/bookings/messages/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })
    setText('')
    load()
  }

  return (
    <>
      <SignedIn>
        <main className="max-w-2xl mx-auto p-6 space-y-4 text-gray-900 dark:text-white">
          {booking && (
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Booking {booking.id}</h1>
              <p>Printer: {Array.isArray(booking.printers) ? booking.printers[0]?.name : booking.printers?.name}</p>
              <p>Status: {booking.status}</p>
            </div>
          )}
          <div className="border rounded p-4 space-y-3 max-h-96 overflow-y-auto bg-white dark:bg-gray-800">
            {messages.map(m => (
              <div key={m.id} className="text-sm">
                <span className="font-semibold">{m.sender_id === user?.id ? 'You' : 'Them'}:</span> {m.message}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="flex-grow p-2 border rounded text-black dark:text-white dark:bg-neutral-800"
            />
            <button onClick={send} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded">
              Send
            </button>
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
