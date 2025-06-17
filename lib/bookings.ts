export type BookingStatus =
  | 'pending'
  | 'awaiting_slice'
  | 'ready_to_print'
  | 'printing'
  | 'complete'
  | 'canceled';

export const bookingStatusClasses: Record<BookingStatus, string> = {
  pending: 'bg-yellow-400 text-black',
  awaiting_slice: 'bg-orange-500 text-gray-900 dark:text-white',
  ready_to_print: 'bg-green-600 text-gray-900 dark:text-white',
  printing: 'bg-blue-500 text-gray-900 dark:text-white',
  complete: 'bg-blue-600 text-gray-900 dark:text-white',
  canceled: 'bg-red-600 text-gray-900 dark:text-white',
};
