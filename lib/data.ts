// lib/data.ts

export interface Printer {
  id: string
  ownerId: string
  name: string
  materials: string[]
  buildVolume: string
  pricePerHour: number
  description: string
}

export const printers: Printer[] = []
