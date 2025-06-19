import { createAdminClient } from './supabase/admin'

export async function fetchAdminStats() {
  const supabase = createAdminClient()

  const { count: printerCount } = await supabase
    .from('printers')
    .select('*', { count: 'exact', head: true })

  const { count: bookingCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  const { count: patchCount } = await supabase
    .from('patch_notes')
    .select('*', { count: 'exact', head: true })

  const { data: bookingUsers } = await supabase
    .from('bookings')
    .select('clerk_user_id')

  const { data: printerUsers } = await supabase
    .from('printers')
    .select('clerk_user_id')

  const ids = new Set<string>()
  bookingUsers?.forEach(u => u.clerk_user_id && ids.add(u.clerk_user_id))
  printerUsers?.forEach(u => u.clerk_user_id && ids.add(u.clerk_user_id))

  return {
    printers: printerCount || 0,
    bookings: bookingCount || 0,
    patchNotes: patchCount || 0,
    users: ids.size,
  }
}

export async function fetchAllPrinters() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('printers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function fetchAllBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('id, printer_id, clerk_user_id, status, created_at, start_date, end_date, printers(name)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function fetchUniqueUsers() {
  const supabase = createAdminClient()
  const { data: bookingUsers } = await supabase
    .from('bookings')
    .select('clerk_user_id')
  const { data: printerUsers } = await supabase
    .from('printers')
    .select('clerk_user_id')
  const ids = new Set<string>()
  bookingUsers?.forEach(u => u.clerk_user_id && ids.add(u.clerk_user_id))
  printerUsers?.forEach(u => u.clerk_user_id && ids.add(u.clerk_user_id))
  return Array.from(ids)
}
