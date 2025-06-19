'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/AuthButtons';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import WhatsNewModal from '@/components/WhatsNewModal';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
          {[
            { href: '/printers', label: 'Printers' },
            { href: '/printers/new', label: 'New Listing' },
            { href: '/bookings', label: 'My Bookings' },
            { href: '/owner', label: 'Owner Panel' },
            { href: '/my-printers', label: 'My Printers' },
            { href: '/marketplace', label: 'Marketplace' },
            { href: '/patch-notes', label: 'Patch Notes' },
            { href: '/roadmap', label: 'Roadmap' },
            { href: '/profile', label: 'Profile' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'font-semibold underline'
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
          <WhatsNewModal />
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
