import { createClient } from './supabase/server'

export async function updatePrinterStatus(printerId: string) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('printer_id', printerId)
    .eq('start_date', today)

  if (bookings && bookings.length > 0) {
    await supabase
      .from('printers')
      .update({ status: 'rented' })
      .eq('id', printerId)
  }
}
