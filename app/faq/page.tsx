export const metadata = { title: 'FAQ - RentAPrint' }

export default function FAQPage() {
  return (
    <main className="prose dark:prose-invert max-w-2xl mx-auto p-6">
      <h1>Frequently Asked Questions</h1>
      <h2>What is RentAPrint?</h2>
      <p>RentAPrint lets makers rent 3D printers by the hour and allows owners to earn from idle machines.</p>
      <h2>How do bookings work?</h2>
      <p>Choose a printer, select your runtime, and upload your STL. The owner approves and prints your job.</p>
      <h2>Can I list my own printer?</h2>
      <p>Absolutely! Visit the Owner Panel to add your printer and start accepting bookings.</p>
    </main>
  )
}
