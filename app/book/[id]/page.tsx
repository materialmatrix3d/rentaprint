"use client";

import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function BookingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking: Runtime Mode</h1>
      <p className="mb-2">You're booking printer ID: {id}</p>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Estimated Runtime (hours):</label>
        <input
          type="number"
          className="w-full px-3 py-2 border rounded text-black"
          min="0"
          step="0.1"
        />
      </div>
      <p>More runtime-based booking functionality coming soon.</p>
    </div>
  );
}
