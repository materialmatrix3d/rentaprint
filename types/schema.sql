
-- Bookings Table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  printer_id uuid references printers(id),
  clerk_user_id text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  estimated_runtime_hours numeric,
  actual_runtime_hours numeric,
  print_file_url text,
  layer_height text,
  infill text,
  supports boolean,
  print_notes text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

alter table bookings add column if not exists print_file_url text;
alter table bookings add column if not exists layer_height text;
alter table bookings add column if not exists infill text;
alter table bookings add column if not exists supports boolean;
alter table bookings add column if not exists print_notes text;

-- Printers table update
alter table printers add column if not exists is_available boolean default true;
alter table printers add column if not exists is_deleted boolean default false;
alter table printers add column if not exists is_under_maintenance boolean default false;
alter table printers add column if not exists min_runtime_hours numeric default 1;
alter table printers add column if not exists max_runtime_hours numeric default 24;

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

-- Booking Change Requests Table
create table if not exists booking_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  new_start_date timestamp with time zone,
  new_end_date timestamp with time zone,
  new_runtime_hours numeric,
  status text default 'pending',
  created_at timestamp with time zone default now()
);
