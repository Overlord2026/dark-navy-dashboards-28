-- Personas & sessions
create table personas(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  kind text not null check (kind in ('client','advisor','agent','guardian','coach','sponsor','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table personas enable row level security;

create policy "Users can manage their own personas"
  on personas for all
  using (auth.uid() = user_id);

create table persona_sessions(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  persona_id uuid not null references personas(id),
  active boolean default true,
  started_at timestamptz default now(),
  ended_at timestamptz,
  updated_at timestamptz default now()
);

alter table persona_sessions enable row level security;

create policy "Users can manage their own persona sessions"
  on persona_sessions for all
  using (auth.uid() = user_id);

-- Consent Tokens (VC-like)
create table consent_tokens(
  id uuid primary key default gen_random_uuid(),
  subject_user uuid not null references auth.users(id),
  issuer_user uuid references auth.users(id),
  scopes jsonb not null,              -- {jurisdiction, product/media/likeness, time, audience}
  conditions jsonb,                   -- {training, disclosures, conflicts}
  valid_from timestamptz default now(),
  valid_to timestamptz,
  vc_jwt text,                        -- optional signed VC
  status text default 'active' check (status in ('active','revoked','expired')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table consent_tokens enable row level security;

create policy "Users can view consent tokens they're subject or issuer of"
  on consent_tokens for select
  using (auth.uid() = subject_user or auth.uid() = issuer_user);

create policy "Users can create consent tokens as subject"
  on consent_tokens for insert
  with check (auth.uid() = subject_user);

create policy "Issuers can update their issued tokens"
  on consent_tokens for update
  using (auth.uid() = issuer_user);

-- Receipts & anchors
create table reason_receipts(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  persona_id uuid not null references personas(id),
  action_key text not null,           -- e.g., 'create_proposal','eSign','publish_ad'
  reason_code text not null,          -- e.g., 'OK_POLICY','BLOCK_CONFLICT','REQUIRE_DISCLOSURE'
  explanation text,
  hash text,                          -- sha256 of normalized receipt
  anchor_txid text,                   -- optional chain txid
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table reason_receipts enable row level security;

create policy "Users can view their own reason receipts"
  on reason_receipts for select
  using (auth.uid() = user_id);

create policy "System can create reason receipts"
  on reason_receipts for insert
  with check (auth.uid() = user_id);

-- Revocations + takedown
create table revocations(
  id uuid primary key default gen_random_uuid(),
  consent_id uuid not null references consent_tokens(id),
  reason text,
  propagated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table revocations enable row level security;

create policy "Users can view revocations for their consent tokens"
  on revocations for select
  using (consent_id in (
    select id from consent_tokens 
    where subject_user = auth.uid() or issuer_user = auth.uid()
  ));

create policy "Users can create revocations for their consent tokens"
  on revocations for insert
  with check (consent_id in (
    select id from consent_tokens 
    where subject_user = auth.uid() or issuer_user = auth.uid()
  ));

-- XR attestations (optional)
create table xr_attestations(
  id uuid primary key default gen_random_uuid(),
  consent_id uuid references consent_tokens(id),
  event jsonb,                        -- {venue, time, device, presence, likeness}
  receipt_id uuid references reason_receipts(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table xr_attestations enable row level security;

create policy "Users can view XR attestations for their consent tokens"
  on xr_attestations for select
  using (consent_id in (
    select id from consent_tokens 
    where subject_user = auth.uid() or issuer_user = auth.uid()
  ));

create policy "Users can create XR attestations for their consent tokens"
  on xr_attestations for insert
  with check (consent_id in (
    select id from consent_tokens 
    where subject_user = auth.uid() or issuer_user = auth.uid()
  ));

-- Indexes for performance
create index idx_personas_user_id on personas(user_id);
create index idx_persona_sessions_user_id on persona_sessions(user_id);
create index idx_persona_sessions_active on persona_sessions(active) where active = true;
create index idx_consent_tokens_subject on consent_tokens(subject_user);
create index idx_consent_tokens_issuer on consent_tokens(issuer_user);
create index idx_consent_tokens_status on consent_tokens(status);
create index idx_reason_receipts_user_id on reason_receipts(user_id);
create index idx_reason_receipts_persona_id on reason_receipts(persona_id);
create index idx_revocations_consent_id on revocations(consent_id);

-- Auto-update triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_personas_updated_at before update on personas
  for each row execute procedure update_updated_at_column();

create trigger update_persona_sessions_updated_at before update on persona_sessions
  for each row execute procedure update_updated_at_column();

create trigger update_consent_tokens_updated_at before update on consent_tokens
  for each row execute procedure update_updated_at_column();

create trigger update_reason_receipts_updated_at before update on reason_receipts
  for each row execute procedure update_updated_at_column();

create trigger update_revocations_updated_at before update on revocations
  for each row execute procedure update_updated_at_column();

create trigger update_xr_attestations_updated_at before update on xr_attestations
  for each row execute procedure update_updated_at_column();