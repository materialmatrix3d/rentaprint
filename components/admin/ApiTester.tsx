'use client'
import { useState } from 'react'

export default function ApiTester() {
  const [result, setResult] = useState<string | null>(null)
  const run = async () => {
    try {
      const res = await fetch('/api/test')
      const text = await res.text()
      setResult(`${res.status}: ${text}`)
    } catch (err: any) {
      setResult('Error: ' + err.message)
    }
  }
  return (
    <div className="space-y-1">
      <button onClick={run} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded">Run API Test</button>
      {result && <p className="text-sm">{result}</p>}
    </div>
  )
}
