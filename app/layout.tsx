"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="description" content="Rent 3D printers near you" />
          <meta property="og:title" content="RentAPrint" />
          <meta property="og:description" content="Book printers or list your own" />
        </head>
        <body className={inter.className}>
          <Providers>
            <Navbar />
            <main className="max-w-7xl mx-auto p-4">{children}</main>
            <footer className="text-center text-sm text-gray-500 py-4 space-y-2">
              <p>
                Open source by RentAPrint. Powered by the community. Visit{' '}
                <a href="https://rentaprint.net" className="underline">rentaprint.net</a>{' '}for the official version.
              </p>
              <p>
                <Link href="/terms" className="underline mr-2">Terms</Link>
                <Link href="/privacy" className="underline">Privacy</Link>
              </p>
            </footer>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
