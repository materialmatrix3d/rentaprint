import { POST } from '../app/api/bookings/request-change/route'
import { createClient } from '../lib/supabase/server'

jest.mock('../lib/supabase/server')

describe('booking change request API', () => {
  const mockInsert = jest.fn()
  const mockFrom = jest.fn(() => ({ insert: mockInsert }))

  beforeEach(() => {
    ;(createClient as jest.Mock).mockReturnValue({ from: mockFrom })
  })

  it('inserts change request and returns success', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const res = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ booking_id: '1', new_start_date: '2024', new_end_date: '2025', reason: 'test' }),
      })
    )
    expect(mockFrom).toHaveBeenCalledWith('booking_change_requests')
    expect(mockInsert).toHaveBeenCalled()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('returns 500 on insert error', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'fail' } })
    const res = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ booking_id: '1', new_start_date: '2024', new_end_date: '2025', reason: 'test' }),
      })
    )
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})
