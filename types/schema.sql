
-- Bookings Table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  printer_id uuid references printers(id),
  clerk_user_id uuid,
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
alter table bookings add column if not exists estimated_material_grams numeric;

-- Printers table update
alter table printers add column if not exists is_available boolean default true;
alter table printers add column if not exists is_deleted boolean default false;
alter table printers add column if not exists is_under_maintenance boolean default false;
alter table printers add column if not exists min_runtime_hours numeric default 1;
alter table printers add column if not exists max_runtime_hours numeric default 24;
alter table printers add column if not exists cost_per_gram numeric default 0;
alter table printers add column if not exists tags text[];

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
  clerk_user_id uuid,
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

-- Enable row level security
alter table bookings enable row level security;
alter table printers enable row level security;
alter table reviews enable row level security;
alter table booking_change_requests enable row level security;
alter table patch_notes enable row level security;

-- Printers RLS Policies
create policy "Public select printers" on printers
  for select using (true);

create policy "Insert own printer" on printers
  for insert with check (auth.uid() = clerk_user_id);

create policy "Update own printer" on printers
  for update using (auth.uid() = clerk_user_id) with check (auth.uid() = clerk_user_id);

create policy "Delete own printer" on printers
  for delete using (auth.uid() = clerk_user_id);

-- Bookings RLS Policies
create policy "Select bookings for owners" on bookings
  for select using (
    auth.uid() = clerk_user_id or
    exists (select 1 from printers p where p.id = printer_id and p.clerk_user_id = auth.uid())
  );

create policy "Insert own booking" on bookings
  for insert with check (auth.uid() = clerk_user_id);

create policy "Update own or printer booking" on bookings
  for update using (
    auth.uid() = clerk_user_id or
    exists (select 1 from printers p where p.id = printer_id and p.clerk_user_id = auth.uid())
  ) with check (
    auth.uid() = clerk_user_id or
    exists (select 1 from printers p where p.id = printer_id and p.clerk_user_id = auth.uid())
  );

create policy "Delete own or printer booking" on bookings
  for delete using (
    auth.uid() = clerk_user_id or
    exists (select 1 from printers p where p.id = printer_id and p.clerk_user_id = auth.uid())
  );

-- Reviews RLS Policies
create policy "Public select reviews" on reviews
  for select using (true);

create policy "Insert own review" on reviews
  for insert with check (auth.uid() = clerk_user_id);

create policy "Update own review" on reviews
  for update using (auth.uid() = clerk_user_id) with check (auth.uid() = clerk_user_id);

create policy "Delete own review" on reviews
  for delete using (auth.uid() = clerk_user_id);

-- Booking Change Requests RLS Policies
create policy "Select change requests" on booking_change_requests
  for select using (
    exists (select 1 from bookings b where b.id = booking_id and b.clerk_user_id = auth.uid()) or
    exists (
      select 1 from bookings b join printers p on p.id = b.printer_id
      where b.id = booking_id and p.clerk_user_id = auth.uid()
    )
  );

create policy "Insert change request" on booking_change_requests
  for insert with check (
    exists (select 1 from bookings b where b.id = booking_id and b.clerk_user_id = auth.uid())
  );

create policy "Update request status" on booking_change_requests
  for update using (
    exists (
      select 1 from bookings b join printers p on p.id = b.printer_id
      where b.id = booking_id and p.clerk_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from bookings b join printers p on p.id = b.printer_id
      where b.id = booking_id and p.clerk_user_id = auth.uid()
    )
  );

-- Patch Notes RLS Policies
create policy "Public select patch notes" on patch_notes
  for select using (true);

create policy "Authenticated insert patch note" on patch_notes
  for insert with check (auth.uid() is not null);
