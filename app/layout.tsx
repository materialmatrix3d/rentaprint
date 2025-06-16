import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <Navbar />
            <main className="max-w-7xl mx-auto p-4">{children}</main>
            <footer className="text-center text-sm text-gray-500 py-4">
              Open source by RentAPrint. Powered by the community. Visit{' '}
              <a href="https://rentaprint.net" className="underline">
                rentaprint.net
              </a>{' '}for the official version.
            </footer>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
