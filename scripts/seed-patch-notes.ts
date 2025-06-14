import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Supabase credentials are missing')
  process.exit(1)
}

const supabase = createClient(url, key)

async function seed() {
  const { error } = await supabase.from('patch_notes').insert([
    { title: 'Initial release', description: 'First public version of RentAPrint' },
    { title: 'Bug fixes', description: 'Resolved booking issues and improved printer search.' }
  ])

  if (error) {
    console.error('Failed to insert patch notes', error)
  } else {
    console.log('Patch notes seeded')
  }
}

seed()
