'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      router.push('/');
    }
  }, [isLoaded, user]);

  if (!isLoaded || user?.publicMetadata?.role !== 'admin') {
    return <p className="p-4">Redirecting...</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user.fullName || user.username}!</p>
      {/* Render your stats and tools here */}
    </div>
  );
}
