
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabaseClient'

export default function ReviewForm({ printerId }) {
  const { user } = useUser()
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('reviews').insert({
      clerk_user_id: user?.id,
      printer_id: printerId,
      rating,
      comment,
    })
    if (!error) {
      alert('Review submitted!')
      router.refresh()
    } else {
      alert('Error: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <h3 className="text-lg font-bold">Leave a Review</h3>
      <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
      </select>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Your review"
        className="w-full p-2 border rounded"
      />
        <button type="submit" className="bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded">Submit Review</button>
    </form>
  )
}
