'use client'
import { useEffect, useState } from 'react'

export default function SystemConsole() {
  const [logs, setLogs] = useState('')

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs')
      const text = await res.text()
      setLogs(text)
    } catch (err: any) {
      setLogs('Error loading logs: ' + err.message)
    }
  }

  useEffect(() => {
    fetchLogs()
    const id = setInterval(fetchLogs, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <textarea
      readOnly
      className="w-full h-64 bg-black text-green-400 font-mono text-xs p-2"
      value={logs}
    />
  )
}
