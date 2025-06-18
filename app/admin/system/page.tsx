import Link from 'next/link'
import { listAppRoutes } from '@/lib/listRoutes'

type NetlifyUsage = {
  capabilities: {
    functions?: { used: number }
    functions_gb_hour?: { used: number }
    bandwidth?: { used: number }
    build_minutes?: { used: number }
  }
}

type NetlifySite = {
  name: string
  ssl_url: string
}

async function fetchNetlifyUsage() {
  const accountId = process.env.NETLIFY_ACCOUNT_ID
  const token = process.env.NETLIFY_AUTH_TOKEN
  if (!accountId || !token) return null
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/accounts/${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
    if (!res.ok) return null
    return (await res.json()) as NetlifyUsage
  } catch {
    return null
  }
}

async function fetchNetlifySite() {
  const siteId = process.env.NETLIFY_SITE_ID
  const token = process.env.NETLIFY_AUTH_TOKEN
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

  const functionInvocations = usage?.capabilities?.functions?.used ?? 'N/A'
  const functionRuntime = usage?.capabilities?.functions_gb_hour?.used ?? 'N/A'
  const bandwidth = usage?.capabilities?.bandwidth?.used ?? 'N/A'
  const buildMinutes = usage?.capabilities?.build_minutes?.used ?? 'N/A'

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
              <p>{functionInvocations}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Function GB-Hours</h2>
              <p>{functionRuntime}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Bandwidth Used</h2>
              <p>{bandwidth}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h2 className="font-semibold">Build Minutes</h2>
              <p>{buildMinutes}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Netlify credentials not configured.</p>
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
      </section>
    </div>
  )
}
