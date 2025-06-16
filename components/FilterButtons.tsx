
interface FilterButtonsProps {
  filters: string[];
  currentFilter: string;
  setFilter: (filter: string) => void;
}

export default function FilterButtons({ filters, currentFilter, setFilter }: FilterButtonsProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={`px-3 py-1 text-sm rounded transition-colors
            ${currentFilter === filter
              ? 'bg-blue-600 text-gray-900 dark:text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
