'use client';
import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user } = useUser();
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      {user ? (
        <p>You're signed in as <strong>{user.emailAddresses[0].emailAddress}</strong>.</p>
      ) : (
        <p>Loading user data...</p>
      )}
      <p className="mt-2">More profile features coming soon!</p>
    </main>
  );
}
