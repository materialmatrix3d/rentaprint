"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Printer, User, UploadCloud, Search, Star } from "lucide-react";
import Printer3dNozzleHeatIcon from "mdi-react/Printer3dNozzleHeatIcon";



export default function Home() {

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-16 text-gray-900 dark:text-gray-100">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-0 py-12 md:py-20"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 blur-2xl opacity-30"
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="space-y-6 text-center md:text-left px-4 md:px-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              Rent 3D Printers Near You — Fast, Flexible, On-Demand.
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Browse and book 3D printers by the hour. No ownership required. List your own to earn income.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                href="/printers"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Search className="h-5 w-5" />
                Browse Printers
              </Link>
              <Link
                href="/printers/new"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                <UploadCloud className="h-5 w-5" />
                List Your Printer
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex justify-center items-center w-full max-w-[200px] aspect-square rounded-xl drop-shadow-xl"
            >
              <Printer3dNozzleHeatIcon className="w-28 h-28 md:w-40 md:h-40 text-blue-400" />
            </motion.div>
          </div>
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
