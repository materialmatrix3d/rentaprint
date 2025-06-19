import Link from 'next/link'
import { listAppRoutes } from '@/lib/listRoutes'
import ApiTester from '@/components/admin/ApiTester'

export default async function AdminSystemPage() {
  const routes = await listAppRoutes()
  const env = Object.entries(process.env)
    .filter(([k]) => k.startsWith('NEXT_PUBLIC_'))
    .sort((a, b) => a[0].localeCompare(b[0]))

  return (
    <div className="space-y-8">
      {process.env.NEXT_PUBLIC_SHOW_ADMIN_ROUTES === 'true' && (
        <section>
          <h2 className="text-xl font-bold mb-2">App Routes</h2>
          <ul className="list-disc pl-6 space-y-1">
            {routes.map(route => (
              <li key={route}>
                <Link href={route} className="text-blue-600 hover:underline">
                  {route}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-xl font-bold mb-2">Environment</h2>
        <p>Node {process.version}</p>
        <p>NPM {process.versions.npm}</p>
        {env.length > 0 && (
          <div className="pt-2">
            <h3 className="font-semibold mb-1">Public Env Vars</h3>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              {env.map(([k, v]) => (
                <li key={k}>
                  {k} = {v}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">API Test</h2>
        <ApiTester />
      </section>
    </div>
  )
}
