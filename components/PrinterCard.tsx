import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import type { Printer } from '@/lib/data';

interface Props {
  printer: Printer
  onEdit?: (printer: Printer) => void
  onDelete?: (id: string) => void
  selectable?: boolean
  selected?: boolean
  onSelectChange?: (checked: boolean) => void
}

export default function PrinterCard({ printer, onEdit, onDelete, selectable, selected, onSelectChange }: Props) {
  const statusColors = {
    available: 'bg-green-600',
    pending: 'bg-yellow-500',
    rented: 'bg-red-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 p-4 space-y-2 w-full sm:w-fit relative">
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelectChange?.(e.target.checked)}
          className="absolute top-2 right-2"
        />
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {printer.make_model}
        </h3>
          {printer.status && (
            <span className={`text-gray-900 dark:text-white text-xs px-2 py-1 rounded ${statusColors[printer.status as keyof typeof statusColors]}`}>
            {printer.status}
          </span>
        )}
      </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {printer.name}{' '}
        {printer.is_verified && (
          <CheckCircle className="inline-block w-4 h-4 text-green-600" aria-label="Verified Printer" />
        )}
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
      {printer.tags && printer.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 text-xs pt-1">
          {printer.tags.map(tag => (
            <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-300 pt-2">
        {printer.description}
      </p>

      <div className="flex gap-2 pt-4 flex-wrap">
        <Link
          href={`/printers/${printer.id}`}
            className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          View Details
        </Link>
        <Link
          href={`/book/${printer.id}`}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded"
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
              className="px-3 py-1 text-sm bg-red-600 text-gray-900 dark:text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
