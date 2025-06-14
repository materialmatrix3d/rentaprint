'use client';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <div className="p-8 text-red-500">Not logged in</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Welcome to your dashboard</h1>
      <p className="mt-2">
        You are signed in as: <strong>{user?.primaryEmailAddress?.emailAddress}</strong>
      </p>
    </main>
  );
}
