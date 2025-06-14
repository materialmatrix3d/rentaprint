'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
    >
      <span className="text-gray-900 dark:text-white font-medium">
        {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </span>
    </button>
  );
}
