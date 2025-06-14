'use client';

import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import PrinterCard from '@/components/PrinterCard';
import type { Printer } from '@/lib/data';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    const fetchPrinters = async () => {
      const supabase = createPagesBrowserClient();
      const { data } = await supabase.from('printers').select('*');
      setPrinters(data || []);
    };
    fetchPrinters();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Printers</h2>
      <div className="flex flex-col gap-4 items-start">
        {printers.map((printer) => (
          <PrinterCard key={printer.id} printer={printer} />
        ))}
      </div>
    </div>
  );
}
