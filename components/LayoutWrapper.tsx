
export default function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
