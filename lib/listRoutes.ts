import fs from 'fs/promises'
import path from 'path'

async function traverse(dir: string, base: string, routes: Set<string>) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await traverse(full, base, routes)
    } else if (/page\.(tsx|ts|js|jsx)$/.test(entry.name)) {
      let route = full
        .replace(base, '')
        .replace(/\/page\.(tsx|ts|js|jsx)$/, '')
        .replace(/\/index$/, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\[.+?\]/g, ':param')
      if (route === '') route = '/'
      routes.add(route)
    }
  }
}

export async function listAppRoutes() {
  const baseDir = path.join(process.cwd(), 'app')
  const routes = new Set<string>()
  await traverse(baseDir, baseDir, routes)
  return Array.from(routes).sort()
}
