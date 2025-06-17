'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/AuthButtons';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b">
      <div className="space-x-4">
        <Link href="/" className="font-bold text-lg text-gray-900 dark:text-white">RentAPrint</Link>
        <Link href="/printers" className="text-gray-900 dark:text-white">Printers</Link>
        <Link href="/printers/new" className="text-gray-900 dark:text-white">New Listing</Link>
        <Link href="/bookings" className="text-gray-900 dark:text-white">My Bookings</Link>
        <Link href="/owner" className="text-gray-900 dark:text-white">Owner Panel</Link>
        <Link href="/my-printers" className="text-gray-900 dark:text-white">My Printers</Link>
        <Link href="/patch-notes" className="text-gray-900 dark:text-white">Patch Notes</Link>
        <Link href="/roadmap" className="text-gray-900 dark:text-white">Roadmap</Link>
        <Link href="/profile" className="text-gray-900 dark:text-white">Profile</Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <AuthButtons />
      </div>
    </nav>
  );
}
