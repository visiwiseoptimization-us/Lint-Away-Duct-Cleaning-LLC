-- Lint Away Duct Cleaning — lead capture schema
-- Run this in the Supabase SQL editor once, on the project you create.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  name          text not null check (char_length(name) between 2 and 120),
  phone         text not null check (char_length(phone) between 7 and 40),
  email         text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  city          text not null,
  service       text not null,
  message       text default '',

  -- attribution
  source_path   text,
  user_agent    text,
  submitted_at  timestamptz,

  -- pipeline
  status        text not null default 'new'
                check (status in ('new','contacted','quoted','booked','won','lost','spam')),
  notes         text,
  quoted_amount numeric(10,2),
  contacted_at  timestamptz
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_city_idx       on public.leads (city);
create index if not exists leads_service_idx    on public.leads (service);

-- Row Level Security is ON with NO permissive policy for anon or authenticated.
-- The API route writes with the service-role key, which bypasses RLS. That is
-- the point: the browser never talks to the database directly, so there is no
-- client-side key that could be used to read the lead list.
alter table public.leads enable row level security;

revoke all on public.leads from anon, authenticated;

-- Deduplicate rapid double-submits from the same person without blocking a
-- genuine second enquiry weeks later.
create unique index if not exists leads_dedupe_idx
  on public.leads (email, service, date_trunc('hour', created_at));

comment on table public.leads is
  'Quote requests from lintawayductcleaning.com. Written only by the /api/quote route using the service-role key.';

-- Convenience view for reporting: which city and service pairs actually convert.
-- This closes the loop on the geo pages — it tells you which programmatic pages
-- are earning their place and which need better content or should be removed.
create or replace view public.lead_performance as
select
  city,
  service,
  count(*)                                          as total,
  count(*) filter (where status = 'booked')         as booked,
  count(*) filter (where status = 'won')            as won,
  round(
    100.0 * count(*) filter (where status in ('booked','won')) / nullif(count(*), 0),
    1
  )                                                 as conversion_pct,
  max(created_at)                                   as most_recent
from public.leads
where status <> 'spam'
group by city, service
order by total desc;
