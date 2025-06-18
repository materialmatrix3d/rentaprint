import Link from 'next/link'
import { listAppRoutes } from '@/lib/listRoutes'

function bytesToGB(bytes: number) {
  return bytes / (1024 ** 3)
}

function msToHours(ms: number) {
  return ms / 1000 / 60 / 60
}

type NetlifyUsage = {
  functions_invocations_count: number
  functions_execution_time_ms: number
  bandwidth_used: number
  build_minutes_used: number
}

type NetlifySite = {
  name: string
  ssl_url: string
}

async function fetchNetlifyUsage() {
  const token = process.env.NETLIFY_TOKEN
  if (!token) return null
  try {
    const res = await fetch(
      'https://api.netlify.com/api/v1/accounts/bc8df2c4-2079-4bd4-9a0c-8fe07b5c62aa/usage',
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    return (await res.json()) as NetlifyUsage
  } catch {
    return null
  }
}

async function fetchNetlifySite() {
  const siteId = process.env.NETLIFY_SITE_ID
  const token = process.env.NETLIFY_TOKEN
  if (!siteId || !token) return null
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
    if (!res.ok) return null
    return (await res.json()) as NetlifySite
  } catch {
    return null
  }
}

export default async function AdminSystemPage() {
  const usage = await fetchNetlifyUsage()
  const site = await fetchNetlifySite()
  const routes = await listAppRoutes()

  const functionInvocations = usage?.functions_invocations_count ?? 0
  const functionRuntimeHours = msToHours(usage?.functions_execution_time_ms ?? 0)
  const bandwidthGB = bytesToGB(usage?.bandwidth_used ?? 0)
  const buildMinutes = usage?.build_minutes_used ?? 0

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">Netlify Usage</h1>
        {site && (
          <p className="mb-4">
            <a href={site.ssl_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              {site.name}
            </a>
          </p>
        )}
        {usage ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Function Invocations</h2>
              <p>{functionInvocations.toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Function Runtime</h2>
              <p>{functionRuntimeHours.toFixed(2)} hrs</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Bandwidth Used</h2>
              <p>{bandwidthGB.toFixed(2)} GB</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Build Minutes</h2>
              <p>{buildMinutes}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Netlify usage unavailable.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">App Routes</h2>
        <ul className="list-disc pl-6 space-y-1">
          {routes.map((route) => (
            <li key={route}>
              <Link href={route} className="text-blue-600 hover:underline">
                {route}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Environment</h2>
        <p>Node {process.version}</p>
        <p>NPM {process.versions.npm}</p>
      </section>
    </div>
  )
}
