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
      const { data: printerData } = await supabase.from('printers').select('*').eq('id', id).single();
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_date, end_date, status')
        .eq('printer_id', id);

      const now = new Date();
      let computedStatus = 'available';

      for (const b of bookings || []) {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        if (b.status === 'approved' && start <= now && end >= now) {
          computedStatus = 'rented';
          break;
        }
        if (b.status === 'pending' && start >= now) {
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{printer.name}</h1>
        <span className={`text-gray-900 dark:text-white text-xs px-2 py-1 rounded ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <p><strong>Make/Model:</strong> {printer.make_model || 'N/A'}</p>
      <p><strong>Materials:</strong> {printer.materials?.join(', ')}</p>
      <p><strong>Max Print Size:</strong> {printer.build_volume}</p>
      <p><strong>Rate:</strong> ${printer.price_per_hour}/hr</p>
      <p><strong>Description:</strong> {printer.description}</p>
      <Link
        href={`/book/${printer.id}`}
        className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
      >
        Request Booking
      </Link>
    </div>
  );
}
