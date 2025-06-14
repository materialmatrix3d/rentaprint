
-- Bookings Table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id),
  printer_id uuid references printers(id),
  status text default 'pending',
  created_at timestamp with time zone default now()
);
