'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Printer } from '@/lib/data'

export default function Page() {
  return (
    <Suspense>
      <ComparePrintersPage />
    </Suspense>
  )
}

function ComparePrintersPage() {
  const params = useSearchParams()
  const ids = params.get('ids')?.split(',') ?? []
  const [printers, setPrinters] = useState<Printer[]>([])

  useEffect(() => {
    const fetch = async () => {
      if (ids.length === 0) return
      const supabase = createPagesBrowserClient()
      const { data } = await supabase
        .from('printers')
        .select('*')
        .in('id', ids)
      setPrinters(data || [])
    }
    fetch()
  }, [ids])

  if (ids.length === 0) return <p className="p-4">No printers selected.</p>

  return (
    <div className="p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Printer Comparison</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Feature</th>
            {printers.map(p => (
              <th key={p.id} className="border px-2 py-1">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">Price/hr</td>
            {printers.map(p => (
              <td key={p.id} className="border px-2 py-1">${p.price_per_hour}</td>
            ))}
          </tr>
          <tr>
            <td className="border px-2 py-1">Materials</td>
            {printers.map(p => (
              <td key={p.id} className="border px-2 py-1">{p.materials?.join(', ')}</td>
            ))}
          </tr>
          <tr>
            <td className="border px-2 py-1">Build Volume</td>
            {printers.map(p => (
              <td key={p.id} className="border px-2 py-1">{p.build_volume}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}