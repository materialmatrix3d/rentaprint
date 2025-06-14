
'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/AuthButtons';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b">
      <div className="space-x-4">
        <Link href="/" className="font-bold text-lg text-black dark:text-white">RentAPrint</Link>
        <Link href="/printers" className="text-black dark:text-white">Printers</Link>
        <Link href="/printers/new" className="text-black dark:text-white">New Listing</Link>
        <Link href="/bookings" className="text-black dark:text-white">My Bookings</Link>
        <Link href="/owner" className="text-black dark:text-white">Owner Panel</Link>
        <Link href="/my-printers" className="text-black dark:text-white">My Printers</Link>
        <Link href="/patchnotes" className="text-black dark:text-white">Patch Notes</Link>
        <Link href="/profile" className="text-black dark:text-white">Profile</Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <AuthButtons />
      </div>
    </nav>
  );
}
