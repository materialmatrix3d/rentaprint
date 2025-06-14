import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import ThemeToggle from "../components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <nav className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 shadow mb-6">
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-xl font-bold">
                  <Link href="/">RentAPrint</Link>
                </div>
                <ul className="flex gap-5 items-center text-sm font-medium">
                  <li><Link href="/printers">Printers</Link></li>
                  <li><Link href="/new-listing">New Listing</Link></li>
                  <li><Link href="/bookings">My Bookings</Link></li>
                  <li><Link href="/owner">Owner Panel</Link></li>
                  <li><Link href="/my-printers">My Printers</Link></li>
                  <li><Link href="/patch-notes">Patch Notes</Link></li>
                  <li><Link href="/profile">Profile</Link></li>
                  <li><ThemeToggle /></li>
                  <SignedIn>
                    <li><UserButton afterSignOutUrl="/" /></li>
                  </SignedIn>
                  <SignedOut>
                    <li><SignInButton /></li>
                  </SignedOut>
                </ul>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto p-4">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
