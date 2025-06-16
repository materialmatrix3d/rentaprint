/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xpbWJpbmctYmVldGxlLTQwLmNsZXJrLmFjY291bnRzLmRldiQ',
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hkrtswewuazngzaupcdh.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcnRzd2V3dWF6bmd6YXVwY2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzMyOTEsImV4cCI6MjA2NTM0OTI5MX0.4NBv8Lg7rvSUvrTL7cpK3TrO4PALPRNqEw0Ei2g2sGw',
  },
};

module.exports = nextConfig;
