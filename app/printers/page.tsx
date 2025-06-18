'use client';

import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import PrinterCard from '@/components/PrinterCard';
import FilterButtons from '@/components/FilterButtons';
import type { Printer } from '@/lib/data';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [rented, setRented] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState('All');
  const [compare, setCompare] = useState<Record<string, boolean>>({});
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrinters = async () => {
      const supabase = createPagesBrowserClient();
      const { data } = await supabase
        .from('printers')
        .select('*')
        .eq('is_available', true)
        .eq('is_deleted', false);
      setPrinters(data || []);
      setCompare({});
      const tagSet = new Set<string>();
      data?.forEach((p: any) => {
        p.tags?.forEach((t: string) => tagSet.add(t));
      });
      setTags(['All', ...Array.from(tagSet)]);
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
          if ((b.status === 'printing' || b.status === 'ready_to_print') && start <= now && end >= now) {
            map[b.printer_id as string] = true;
          }
        });
        setRented(map);
      }
    };
    fetchPrinters();
  }, []);

  const filtered = printers.filter(p => filter === 'All' || p.tags?.includes(filter))

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Printers</h2>
      {tags.length > 1 && (
        <FilterButtons filters={tags} currentFilter={filter} setFilter={setFilter} />
      )}
      {printers.length === 0 ? (
        <div className="text-center mt-10 text-gray-400 flex flex-col items-center">
          <span className="text-6xl mb-2">🖨️</span>
          <p>No printers available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-start">
          {filtered.map(printer => (
            <div key={printer.id} className="relative">
              <PrinterCard
                printer={printer}
                selectable
                selected={!!compare[printer.id]}
                onSelectChange={checked =>
                  setCompare({ ...compare, [printer.id]: checked })
                }
              />
              {rented[printer.id] && (
                <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center font-semibold pointer-events-none rounded">
                  Currently Rented
                </span>
              )}
            </div>
          ))}
          {Object.keys(compare).filter(id => compare[id]).length > 1 && (
            <a
              href={`/printers/compare?ids=${Object.keys(compare)
                .filter(id => compare[id])
                .join(',')}`}
              className="px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded mt-2"
            >
              Compare Selected
            </a>
          )}
        </div>
      )}
    </div>
  );
}
