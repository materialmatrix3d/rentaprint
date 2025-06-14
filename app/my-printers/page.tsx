"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Printer } from "@/lib/data";

export default function MyPrinters() {
  const { user } = useUser();
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [rented, setRented] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPrinters = async () => {
      const { data, error } = await supabase
        .from("printers")
        .select("*")
        .eq("clerk_user_id", user?.id);
      if (error) console.error("Error fetching printers", error);
      setPrinters(data || []);
      setLoading(false);
      const ids = data?.map(p => p.id) || [];
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

    if (user?.id) fetchPrinters();
  }, [user]);

  const deletePrinter = async (id: string) => {
    if (!confirm("Delete this printer?")) return;
    const res = await fetch(`/api/printers/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setPrinters(printers.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete printer");
    }
  };

  const printerCards = (
    <div className="grid gap-4">
      {printers.map((printer) => (
        <div key={printer.id} className="relative">
          <div
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {printer.name}
              </h2>
            {printer.status && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${{
                  available: "bg-green-600 text-gray-900 dark:text-white",
                  pending: "bg-yellow-500 text-black",
                  rented: "bg-red-600 text-gray-900 dark:text-white",
                }[printer.status]}`}
              >
                {printer.status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ${printer.price_per_hour}/hr &bull; {printer.build_volume}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Materials: {printer.materials?.join(", ")}
          </p>
          <div className="flex gap-2 flex-wrap pt-2">
            <Link
              href="/owner/bookings"
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
            >
              View Bookings
            </Link>
            <Link
              href={`/my-printers/${printer.id}/edit`}
              className="px-3 py-1 text-sm bg-yellow-400 text-black rounded hover:bg-yellow-500"
            >
              Edit
            </Link>
            <button
              onClick={() => deletePrinter(printer.id)}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white rounded"
            >
              Delete
            </button>
          </div>
          {rented[printer.id] && (
            <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center font-semibold pointer-events-none rounded">
              Currently Rented
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const emptyState = (
    <div className="space-y-2 text-gray-900 dark:text-white">
      <p>You haven\'t listed any printers yet.</p>
      <Link
        href="/new-listing"
        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
      >
        Create New Listing
      </Link>
    </div>
  );

  const content = loading ? (
    <p className="text-center p-8 text-gray-900 dark:text-white">Loading printers...</p>
  ) : printers.length === 0 ? (
    emptyState
  ) : (
    printerCards
  );

  return (
    <>
      <SignedIn>
        <main className="max-w-4xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Printers</h1>
          {content}
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
