export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'canceled';

export const bookingStatusClasses: Record<BookingStatus, string> = {
  pending: 'bg-yellow-400 text-black',
  approved: 'bg-green-600 text-gray-900 dark:text-white',
  rejected: 'bg-red-600 text-gray-900 dark:text-white',
  in_progress: 'bg-blue-500 text-gray-900 dark:text-white',
  completed: 'bg-blue-600 text-gray-900 dark:text-white',
  canceled: 'bg-red-600 text-gray-900 dark:text-white',
};
