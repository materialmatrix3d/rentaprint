import { DELETE } from '../app/api/bookings/cancel/[id]/route'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '../lib/supabase/server'

jest.mock('@clerk/nextjs/server')
jest.mock('../lib/supabase/server')

describe('cancel booking API', () => {
  const mockSelect = jest.fn()
  const mockEq = jest.fn(() => ({ eq: mockEq, select: mockSelect }))
  const mockUpdate = jest.fn(() => ({ eq: mockEq }))
  const mockFrom = jest.fn(() => ({ update: mockUpdate }))

  beforeEach(() => {
    ;(createClient as jest.Mock).mockReturnValue({ from: mockFrom })
  })

  it('returns 401 if unauthenticated', async () => {
    ;(auth as jest.Mock).mockReturnValue({ userId: null })
    const res = await DELETE({} as any, { params: { id: '1' } })
    expect(res.status).toBe(401)
  })

  it('cancels booking for authenticated user', async () => {
    ;(auth as jest.Mock).mockReturnValue({ userId: 'user1' })
    mockSelect.mockResolvedValue({ data: [{}], error: null })
    const res = await DELETE({} as any, { params: { id: '1' } })
    expect(mockFrom).toHaveBeenCalledWith('bookings')
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'canceled' })
    expect(mockEq).toHaveBeenCalledWith('id', '1')
    expect(res.status).toBe(200)
  })

  it('returns 404 if booking missing', async () => {
    ;(auth as jest.Mock).mockReturnValue({ userId: 'user1' })
    mockSelect.mockResolvedValue({ data: null, error: null })
    const res = await DELETE({} as any, { params: { id: '1' } })
    expect(res.status).toBe(404)
  })
})
