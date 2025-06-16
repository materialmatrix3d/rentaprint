
-- Bookings Table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  printer_id uuid references printers(id),
  clerk_user_id text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  estimated_runtime_hours numeric,
  actual_runtime_hours numeric,
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

-- Reviews Table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text,
  printer_id uuid references printers(id),
  rating numeric,
  comment text,
  created_at timestamp with time zone default now()
);
