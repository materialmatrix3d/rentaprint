
import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-12 text-gray-900 dark:text-gray-100">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Welcome to RentAPrint</h1>
        <p className="text-lg">
          Unlock the power of 3D printing — anywhere, anytime. RentAPrint is a global peer-to-peer platform that lets
          anyone access 3D printers without owning one.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">For Renters</h2>
            <p>
              Whether you're a student, designer, engineer, or hobbyist — find the perfect 3D printer for your project
              near you. Book by the hour and only pay for what you use.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-green-500">For Owners</h2>
            <p>
              List your idle 3D printers and earn passive income. Control bookings, approve users, and share your
              equipment with a growing creative community.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>List a Printer:</strong> Add printer details like supported materials, volume, and rates.</li>
          <li><strong>Browse & Book:</strong> Search printers by features or location. Submit a booking request.</li>
          <li><strong>Approve & Print:</strong> Owners approve bookings. Arrange file transfer or access.</li>
          <li><strong>Review & Earn:</strong> Leave feedback and build a reputation on the platform.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Why RentAPrint?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Affordable access</strong> to powerful 3D printers worldwide</li>
          <li><strong>Decentralized production</strong> – make things locally, think globally</li>
          <li><strong>Extra revenue</strong> for printer owners, hobbyists, and schools</li>
          <li><strong>Sustainable printing</strong> by reducing idle equipment</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Get Started</h2>
        <div className="flex gap-4 flex-wrap">
          <Link href="/printers/new" className="bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-blue-700">List Your Printer</Link>
          <Link href="/printers" className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600">Browse Printers</Link>
        </div>
      </section>
    </main>
  )
}
