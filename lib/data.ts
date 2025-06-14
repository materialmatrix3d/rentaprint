// lib/data.ts

export interface Printer {
  id: string
  make_model: string
  name: string
  materials: string[]
  build_volume: string
  price_per_hour: number
  description: string | null
  status?: string
}
