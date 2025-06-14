import Link from 'next/link';

export default function PrinterCard({ printer, onEdit, onDelete }) {
  const statusColors = {
    available: 'bg-green-600',
    pending: 'bg-yellow-500',
    rented: 'bg-red-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 p-4 space-y-2 w-fit max-w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {printer.make_model}
        </h3>
        {printer.status && (
          <span className={`text-gray-900 dark:text-gray-900 dark:text-white text-xs px-2 py-1 rounded ${statusColors[printer.status]}`}>
            {printer.status}
          </span>
        )}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-900 dark:text-gray-900 dark:text-white">
        {printer.name}
      </h2>

      <div className="text-sm text-gray-800 dark:text-gray-100">
        <span className="font-medium">Materials:</span> {printer.materials?.join(', ')}
      </div>
      <div className="text-sm text-gray-800 dark:text-gray-100">
        <span className="font-medium">Max Print Size:</span> {printer.build_volume}
      </div>
      <div className="text-sm text-gray-800 dark:text-gray-100">
        <span className="font-medium">Hourly Rate:</span> ${printer.price_per_hour}/hr
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 pt-2">
        {printer.description}
      </p>

      <div className="flex gap-2 pt-4 flex-wrap">
        <Link
          href={`/printers/${printer.id}`}
          className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-black dark:text-gray-900 dark:text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          View Details
        </Link>
        <Link
          href={`/book/${printer.id}`}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-gray-900 dark:text-white rounded"
        >
          Book This Printer
        </Link>
        {onEdit && (
          <button
            onClick={() => onEdit(printer)}
            className="px-3 py-1 text-sm bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(printer.id)}
            className="px-3 py-1 text-sm bg-red-600 text-gray-900 dark:text-gray-900 dark:text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
