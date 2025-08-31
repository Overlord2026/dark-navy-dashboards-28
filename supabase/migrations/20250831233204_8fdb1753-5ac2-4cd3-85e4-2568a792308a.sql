-- Pro Inquiries table for advisor/CPA contact forms
create table if not exists public.pro_inquiries(
  id uuid primary key default gen_random_uuid(),
  pro_id uuid not null,
  persona text not null,
  full_name text not null,
  email text not null,
  phone text,
  message text,
  consent_tos boolean default false,
  created_at timestamptz default now(),
  receipt_hash text
);

-- Enable RLS
alter table public.pro_inquiries enable row level security;

-- Drop existing policies if they exist
drop policy if exists pro_inquiries_owner on public.pro_inquiries;

-- Create policies
create policy pro_inquiries_owner on public.pro_inquiries
  for all using (auth.uid() is not null) 
  with check (auth.uid() is not null);

-- Grant permissions
grant select,insert on public.pro_inquiries to authenticated;