import { promises as fs } from 'fs'

export const dynamic = 'force-dynamic'

const LOG_PATH = process.env.LOG_FILE || 'logs.txt'

export async function GET() {
  try {
    const data = await fs.readFile(LOG_PATH, 'utf8')
    return new Response(data, { status: 200 })
  } catch (err) {
    return new Response('No logs found', { status: 200 })
  }
}
