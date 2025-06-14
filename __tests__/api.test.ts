import { GET } from '../app/api/test/route'

describe('test route', () => {
  it('returns success', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('API routing')
  })
})
