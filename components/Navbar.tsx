'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/AuthButtons';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
        <div
          className={`${
            open ? 'flex' : 'hidden'
          } sm:flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 absolute sm:static top-full left-0 w-full sm:w-auto bg-gray-100 dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent p-4 sm:p-0 border-b sm:border-0`}
        >
          <Link href="/printers" className="text-gray-900 dark:text-white">
            Printers
          </Link>
          <Link href="/printers/new" className="text-gray-900 dark:text-white">
            New Listing
          </Link>
          <Link href="/bookings" className="text-gray-900 dark:text-white">
            My Bookings
          </Link>
          <Link href="/owner" className="text-gray-900 dark:text-white">
            Owner Panel
          </Link>
          <Link href="/my-printers" className="text-gray-900 dark:text-white">
            My Printers
          </Link>
          <Link href="/patch-notes" className="text-gray-900 dark:text-white">
            Patch Notes
          </Link>
          <Link href="/roadmap" className="text-gray-900 dark:text-white">
            Roadmap
          </Link>
          <Link href="/profile" className="text-gray-900 dark:text-white">
            Profile
          </Link>
          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
