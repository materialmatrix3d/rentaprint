'use client'
import { useEffect, useState, useMemo } from 'react'
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Row {
  printer: string
  hours: number
  rate: number
  tip: number | null
}

export default function EarningsClient() {
  const { user } = useUser()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('estimated_runtime_hours, actual_runtime_hours, tip_amount, printers(name, price_per_hour)')
        .eq('printers.clerk_user_id', user?.id)
        .eq('status', 'complete')

      const list: Row[] = []
      ;(data as any[])?.forEach(b => {
        const runtime = b.actual_runtime_hours ?? b.estimated_runtime_hours ?? 0
        const printerName = Array.isArray(b.printers) ? b.printers[0]?.name : b.printers?.name
        const rate = Array.isArray(b.printers) ? b.printers[0]?.price_per_hour : b.printers?.price_per_hour
        list.push({ printer: printerName || 'Printer', hours: Number(runtime), rate: Number(rate), tip: b.tip_amount })
      })
      setRows(list)
      setLoading(false)
    }
    if (user?.id) load()
  }, [user])

  const total = rows.reduce((sum, r) => sum + r.hours * r.rate + (r.tip || 0), 0)

  return (
    <>
      <SignedIn>
        <main className="p-6 text-gray-900 dark:text-white space-y-4">
          <h1 className="text-2xl font-bold">Earnings</h1>
          {loading ? (
            <p>Loading...</p>
          ) : rows.length === 0 ? (
            <p>No completed bookings yet.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Printer</th>
                  <th className="p-2">Hours</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Tip</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.printer}</td>
                    <td className="p-2">{r.hours}</td>
                    <td className="p-2">${r.rate}</td>
                    <td className="p-2">{r.tip ? `$${r.tip}` : '-'}</td>
                    <td className="p-2">${(r.hours * r.rate + (r.tip || 0)).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border-t font-semibold">
                  <td className="p-2" colSpan={4}>Total</td>
                  <td className="p-2">${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
