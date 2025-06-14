'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function BookingsPage() {
  const { user } = useUser();
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, printers(*)')
        .eq('clerk_user_id', user?.id);

      if (error) console.error(error);
      else setBookings(data || []);
      setLoading(false);
    };

    if (user?.id) fetchBookings();
  }, [user, supabase]);

  const cancelBooking = async (bookingId: string) => {
    const res = await fetch(`/api/bookings/cancel/${bookingId}`, { method: 'DELETE' });
    if (res.ok) {
      alert("Booking canceled ✅");
      setBookings(bookings.filter(b => b.id !== bookingId));
    } else {
      alert("Failed to cancel booking ❌");
    }
  };

  if (loading) return <p className="text-center p-8 text-gray-900 dark:text-white">Loading bookings...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-900 dark:text-white">You have no bookings.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded p-4 mb-4 shadow space-y-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{booking.printers.name}</h2>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${{
                  pending: 'bg-yellow-400 text-black',
                  approved: 'bg-green-600 text-gray-900 dark:text-white',
                  canceled: 'bg-red-600 text-gray-900 dark:text-white',
                }[booking.status] || 'bg-gray-300 text-black'}`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href={`/printers/${booking.printer_id}`}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
              >
                View Printer
              </a>
              <button
                onClick={() => cancelBooking(booking.id)}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white rounded"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
