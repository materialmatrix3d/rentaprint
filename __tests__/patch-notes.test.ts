import { GET } from '../app/api/patch-notes/route'

jest.mock('@supabase/auth-helpers-nextjs', () => {
  const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null })
  const mockSelect = jest.fn(() => ({ order: mockOrder }))
  const mockInsert = jest.fn().mockResolvedValue({ error: null })
  const mockFrom = jest.fn(() => ({ select: mockSelect, insert: mockInsert }))
  return {
    createRouteHandlerClient: jest.fn(() => ({ from: mockFrom }))
  }
})

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({}))
}))

describe('patch notes API', () => {
  it('returns an array of notes', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })
})
