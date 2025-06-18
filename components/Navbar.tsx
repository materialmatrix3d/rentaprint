'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/AuthButtons';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  return (
    <nav className="relative p-4 bg-gray-100 dark:bg-gray-900 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900 dark:text-white">
          RentAPrint
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 rounded border text-gray-900 dark:text-white"
          aria-label="Toggle menu"
        >
          ☰
        </button>
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-10 sm:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <div
          className={`${
            open ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 fixed sm:static inset-y-0 left-0 w-64 sm:w-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-0 flex flex-col sm:flex-row gap-4 z-20 transition-transform`}
        >
          <Link href="/printers">Printers</Link>
          <Link href="/printers/new">New Listing</Link>
          <Link href="/bookings">My Bookings</Link>
          <Link href="/owner">Owner Panel</Link>
          <Link href="/my-printers">My Printers</Link>
          <Link href="/patch-notes">Patch Notes</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/profile">Profile</Link>
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
