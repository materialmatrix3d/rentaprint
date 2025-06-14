import React from "react";

const patchNotes = [
  {
    date: "June 12, 2025",
    version: "v0.1.0 – Booking & Owner Panel Overhaul",
    notes: [
      "Bookings now reflect rental status site-wide (pending, rented, available).",
      "Introduced global rental status logic.",
      "Fixed visual mismatch in Booking details vs card view.",
      "Added Patch Notes page & linked it.",
      "Reworked Navbar: Links added - My Printers, Patch Notes.",
      "Began work on central Owner Tools panel."
    ]
  },
  {
    date: "June 13, 2025",
    version: "v0.1.1 – UI & Bug Fixes",
    notes: [
      "Cleaned up global styles and removed stray files.",
      "Improved navbar text visibility in light mode.",
      "Fixed Patch Notes dark mode styling.",
      "Resolved booking page parameter issues."
    ]
  },
  {
    date: "June 13, 2025",
    version: "v0.2.0 – Dynamic Patch Notes",
    notes: [
      "Added API endpoint and database table for patch notes.",
      "Created dynamic Patch Notes page powered by Supabase.",
      "Updated navigation link to new patch notes route.",
      "Provided helper to log notes from the app."
    ]
  }
];

export default function PatchNotesPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📘 Patch Notes</h1>
      {patchNotes.map((patch, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6 border border-gray-300 dark:border-gray-700"
        >
          <div className="text-xl font-semibold">{patch.version}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{patch.date}</div>
          <ul className="list-disc list-inside space-y-1">
            {patch.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
