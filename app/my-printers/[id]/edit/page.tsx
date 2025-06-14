
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function EditPrinterPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState({
    name: '',
    materials: '',
    buildVolume: '',
    pricePerHour: '',
    description: ''
  })

  useEffect(() => {
    async function fetchPrinter() {
      const { data } = await supabase.from('printers').select('*').eq('id', id).single()
      if (data) {
        setForm({
          name: data.name,
          materials: data.materials.join(', '),
          buildVolume: data.build_volume,
          pricePerHour: data.price_per_hour.toString(),
          description: data.description
        })
      }
    }
    fetchPrinter()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.from('printers').update({
      name: form.name,
      materials: form.materials.split(',').map(m => m.trim()),
      build_volume: form.buildVolume,
      price_per_hour: parseFloat(form.pricePerHour),
      description: form.description
    }).eq('id', id)

    if (!error) router.push('/my-printers')
    else alert('Error: ' + error.message)
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Printer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Printer Name" className="w-full p-2 border rounded" required />
        <input name="materials" value={form.materials} onChange={handleChange} placeholder="Materials (comma separated)" className="w-full p-2 border rounded" required />
        <input name="buildVolume" value={form.buildVolume} onChange={handleChange} placeholder="Build Volume (e.g. 220x220x250mm)" className="w-full p-2 border rounded" required />
        <input name="pricePerHour" value={form.pricePerHour} onChange={handleChange} placeholder="Price per Hour ($)" type="number" step="0.01" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Printer Description" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded">Update Printer</button>
      </form>
    </main>
  )
}
