"use client"

import { useState } from 'react'

export default function DebugLockPage() {
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toISOString()}: ${msg}`])

  const testUnlock = async () => {
    addLog('🚀 Starting Request to /api/users/test-id/unlock')
    try {
      const res = await fetch('/api/users/test-id/unlock', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
      })
      addLog(`📡 Status: ${res.status} ${res.statusText}`)
      const data = await res.json()
      addLog(`📄 Body: ${JSON.stringify(data)}`)
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`)
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Debug Lock/Unlock API</h1>
      <button 
        onClick={testUnlock}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Call Unlock API (ID: test-id)
      </button>

      <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300 font-mono text-sm whitespace-pre-wrap">
        {log.length === 0 ? 'No logs yet...' : log.join('\n')}
      </div>
    </div>
  )
}
