'use client';

import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import PrinterCard from '@/components/PrinterCard';
import type { Printer } from '@/lib/data';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [rented, setRented] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPrinters = async () => {
      const supabase = createPagesBrowserClient();
      const { data } = await supabase
        .from('printers')
        .select('*')
        .eq('is_available', true)
        .eq('is_deleted', false);
      setPrinters(data || []);
      const ids = data?.map((p: any) => p.id) || [];
      if (ids.length > 0) {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('printer_id,start_date,end_date,status')
          .in('printer_id', ids);
        const now = new Date();
        const map: Record<string, boolean> = {};
        bookings?.forEach(b => {
          const start = new Date(b.start_date as string);
          const end = new Date(b.end_date as string);
          if (b.status === 'approved' && start <= now && end >= now) {
            map[b.printer_id as string] = true;
          }
        });
        setRented(map);
      }
    };
    fetchPrinters();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Printers</h2>
      <div className="flex flex-col gap-4 items-start">
        {printers.map((printer) => (
          <div key={printer.id} className="relative">
            <PrinterCard printer={printer} />
            {rented[printer.id] && (
              <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center font-semibold pointer-events-none rounded">
                Currently Rented
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
