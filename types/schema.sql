-- Create All Tables First
create table if not exists patch_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  created_at timestamp with time zone default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id uuid,
  printer_id uuid references printers(id),
  rating numeric,
  comment text,
  created_at timestamp with time zone default now()
);

create table if not exists booking_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  new_start_date timestamp with time zone,
  new_end_date timestamp with time zone,
  new_runtime_hours numeric,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists booking_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  sender_id uuid,
  message text,
  timestamp timestamp with time zone default now()
);

-- Now safely drop all policies referencing clerk_user_id
drop policy if exists "Insert own printer" on printers;
drop policy if exists "Update own printer" on printers;
drop policy if exists "Delete own printer" on printers;
drop policy if exists "Select bookings for owners" on bookings;
drop policy if exists "Insert own booking" on bookings;
drop policy if exists "Update own or printer booking" on bookings;
drop policy if exists "Delete own or printer booking" on bookings;
drop policy if exists "Insert own review" on reviews;
drop policy if exists "Update own review" on reviews;
drop policy if exists "Delete own review" on reviews;
drop policy if exists "Select change requests" on booking_change_requests;
drop policy if exists "Insert change request" on booking_change_requests;
drop policy if exists "Update request status" on booking_change_requests;
drop policy if exists "Select booking messages" on booking_messages;
drop policy if exists "Insert booking message" on booking_messages;

-- Then safely alter the column types
alter table printers alter column clerk_user_id type uuid using clerk_user_id::uuid;
alter table bookings alter column clerk_user_id type uuid using clerk_user_id::uuid;
alter table reviews alter column clerk_user_id type uuid using clerk_user_id::uuid;
