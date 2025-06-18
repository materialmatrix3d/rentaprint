import Link from "next/link";
import { listAppRoutes } from "@/lib/listRoutes";

export default async function AdminSystemPage() {
  const routes = await listAppRoutes();

  return (
    <div className="space-y-8">
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
  );
}
