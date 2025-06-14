'use client'

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function OwnerBookingsPage() {
  return (
    <>
      <SignedIn>
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Owner Panel</h1>
          <p>Here you can manage incoming booking requests.</p>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
