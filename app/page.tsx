"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Printer, User, UploadCloud, Search, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-16 text-gray-900 dark:text-gray-100">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold">
          Rent 3D Printers Near You — Fast, Flexible, On-Demand.
        </h1>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/printers"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Browse Printers
          </Link>
          <Link
            href="/printers/new"
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            List Your Printer
          </Link>
        </div>
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">[Hero Illustration]</span>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 text-center">
          <User className="mx-auto h-10 w-10 text-blue-500" />
          <h2 className="text-2xl font-semibold">For Renters</h2>
          <p>Find the perfect printer and pay only for what you use.</p>
          <Link
            href="/printers"
            className="inline-block mt-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Start Here
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 text-center">
          <UploadCloud className="mx-auto h-10 w-10 text-green-500" />
          <h2 className="text-2xl font-semibold">For Owners</h2>
          <p>Earn income from idle printers and manage bookings easily.</p>
          <Link
            href="/printers/new"
            className="inline-block mt-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Start Here
          </Link>
        </div>
      </motion.section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <UploadCloud className="h-8 w-8 text-blue-500" />
            <span className="font-medium text-sm">List Printer</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Search className="h-8 w-8 text-blue-500" />
            <span className="font-medium text-sm">Browse & Book</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Printer className="h-8 w-8 text-blue-500" />
            <span className="font-medium text-sm">Approve & Print</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Star className="h-8 w-8 text-blue-500" />
            <span className="font-medium text-sm">Review & Earn</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Why RentAPrint?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Affordable access</strong> to powerful 3D printers worldwide
          </li>
          <li>
            <strong>Decentralized production</strong> – make things locally,
            think globally
          </li>
          <li>
            <strong>Extra revenue</strong> for printer owners, hobbyists, and
            schools
          </li>
          <li>
            <strong>Sustainable printing</strong> by reducing idle equipment
          </li>
        </ul>
      </section>
    </main>
  )
}
