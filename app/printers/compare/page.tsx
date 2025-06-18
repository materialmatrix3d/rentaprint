import { Suspense } from 'react'
import ComparePrintersPage from './CompareClient'

export default function Page() {
  return (
    <Suspense>
      <ComparePrintersPage />
    </Suspense>
  )
}
