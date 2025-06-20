'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Printer } from '@/lib/data';

export default function PrinterDetailPage() {
  const supabase = createClientComponentClient();
  const { id } = useParams();
  const [printer, setPrinter] = useState<Printer | null>(null);
  const [status, setStatus] = useState('available');

  useEffect(() => {
    const fetchPrinter = async () => {
      const { data: printerData } = await supabase
        .from('printers')
        .select('*')
        .eq('id', id)
        .single(); // Do not filter out soft-deleted printers here
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_date, end_date, status')
        .eq('printer_id', id);

      const now = new Date();
      let computedStatus = 'available';

      for (const b of bookings || []) {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        if ((b.status === 'printing' || b.status === 'ready_to_print') && start <= now && end >= now) {
          computedStatus = 'rented';
          break;
        }
        if ((b.status === 'pending' || b.status === 'awaiting_slice') && start >= now) {
          computedStatus = 'pending';
        }
      }

      setPrinter(printerData);
      setStatus(computedStatus);
    };
    if (id) fetchPrinter();
  }, [id]);

  if (!printer) return <p className="p-4">Loading printer info...</p>;

  const statusColors = {
    available: 'bg-green-600',
    pending: 'bg-yellow-500',
    rented: 'bg-red-600',
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white max-w-xl space-y-2">
      <nav className="text-sm mb-2">
        <Link href="/" className="underline">Home</Link> &gt;{' '}
        <Link href="/printers" className="underline">Printers</Link> &gt;{' '}
        <span>{printer.name}</span>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h1 className="text-2xl font-bold">
          {printer.name}{' '}
          {printer.is_deleted && (
            <span className="text-sm text-red-400">(This printer has been deleted)</span>
          )}
        </h1>
        <span className={`text-gray-900 dark:text-white text-xs px-2 py-1 rounded ${statusColors[status as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>
      <p><strong>Make/Model:</strong> {printer.make_model || 'N/A'}</p>
      <p><strong>Materials:</strong> {printer.materials?.join(', ')}</p>
      <p><strong>Max Print Size:</strong> {printer.build_volume}</p>
      <p><strong>Rate:</strong> ${printer.price_per_hour}/hr</p>
      <p><strong>Description:</strong> {printer.description}</p>
      {printer.is_under_maintenance && (
        <p className="text-red-500 mt-2">This printer is under maintenance.</p>
      )}
      {!printer.is_deleted && !printer.is_under_maintenance ? (
        <Link
          href={`/book/${printer.id}`}
          className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
        >
          Request Booking
        </Link>
      ) : (
        <button
          disabled
          className="inline-block mt-4 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
        >
          Booking Unavailable
        </button>
      )}
    </div>
  );
}
