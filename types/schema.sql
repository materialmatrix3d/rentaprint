
-- Bookings Table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id),
  printer_id uuid references printers(id),
  clerk_user_id text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Patch Notes Table
create table if not exists patch_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  created_at timestamp with time zone default now()
);
