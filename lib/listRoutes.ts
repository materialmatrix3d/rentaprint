import fs from 'fs/promises'
import path from 'path'

async function traverse(dir: string, base: string, routes: Set<string>) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await traverse(full, base, routes)
    } else if (/page\.(tsx|ts|js|jsx)$/.test(entry.name)) {
      let route = full.replace(base, '')
      route = route.replace(/\/page\.(tsx|ts|js|jsx)$/, '')
      route = route.replace(/\/index$/, '')
      route = route.replace(/\(.*?\)/g, '')
      route = route.replace(/\[\.\.\..+?\]/g, ':param')
      route = route.replace(/\[.+?\]/g, ':param')
      route = route.replace(/\/+/g, '/')
      if (route === '') route = '/'
      if (!route.startsWith('/')) route = `/${route}`
      routes.add(route)
    }
  }
}

export async function listAppRoutes() {
  let baseDir = path.join(process.cwd(), 'app')
  try {
    const stat = await fs.stat(baseDir)
    if (!stat.isDirectory()) throw new Error('not dir')
  } catch {
    const builtDir = path.join(process.cwd(), '.next/server/app')
    baseDir = builtDir
  }
  const routes = new Set<string>()
  await traverse(baseDir, baseDir, routes)
  return Array.from(routes).sort()
}
