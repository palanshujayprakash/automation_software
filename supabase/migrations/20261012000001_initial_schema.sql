-- ====================================================================
-- FlowPilot Initial Database Schema & Row-Level Security Policies
-- Migration: 20261012000001_initial_schema.sql
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (User Metadata)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Integrations Table (OAuth token storage with encryption)
create table if not exists public.integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service text not null check (service in ('gmail', 'calendar', 'sheets')),
  status text not null check (status in ('connected', 'disconnected', 'error')),
  account_email text,
  granted_scopes text[] not null default '{}',
  encrypted_access_token text,
  encrypted_refresh_token text,
  token_expires_at timestamp with time zone,
  last_verified_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, service)
);

alter table public.integrations enable row level security;

create policy "Users can view own integrations"
  on public.integrations for select
  using (auth.uid() = user_id);

create policy "Users can insert own integrations"
  on public.integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own integrations"
  on public.integrations for update
  using (auth.uid() = user_id);

create policy "Users can delete own integrations"
  on public.integrations for delete
  using (auth.uid() = user_id);

-- 3. Workflows Table
create table if not exists public.workflows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text default '' not null,
  status text not null check (status in ('draft', 'active', 'paused', 'error')),
  prompt_proposal text,
  steps jsonb not null default '[]'::jsonb,
  is_approved boolean not null default false,
  requires_approval_for_runs boolean not null default true,
  last_run_at timestamp with time zone,
  next_scheduled_run_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.workflows enable row level security;

create policy "Users can view own workflows"
  on public.workflows for select
  using (auth.uid() = user_id);

create policy "Users can insert own workflows"
  on public.workflows for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workflows"
  on public.workflows for update
  using (auth.uid() = user_id);

create policy "Users can delete own workflows"
  on public.workflows for delete
  using (auth.uid() = user_id);

-- 4. Execution Runs Table
create table if not exists public.execution_runs (
  id uuid default gen_random_uuid() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null check (status in ('succeeded', 'failed', 'running', 'queued', 'awaiting_approval', 'cancelled')),
  trigger_source text not null check (trigger_source in ('manual', 'scheduled', 'webhook', 'ai_test')),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  duration_ms integer,
  step_results jsonb not null default '[]'::jsonb,
  sanitized_error text,
  retry_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.execution_runs enable row level security;

create policy "Users can view own execution runs"
  on public.execution_runs for select
  using (auth.uid() = user_id);

create policy "Users can insert own execution runs"
  on public.execution_runs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own execution runs"
  on public.execution_runs for update
  using (auth.uid() = user_id);

-- 5. Approval Records Table
create table if not exists public.approval_records (
  id uuid default gen_random_uuid() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  action_type text not null,
  target_resource text not null,
  details jsonb not null default '{}'::jsonb,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  approved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.approval_records enable row level security;

create policy "Users can view own approval records"
  on public.approval_records for select
  using (auth.uid() = user_id);

create policy "Users can update own approval records"
  on public.approval_records for update
  using (auth.uid() = user_id);

-- 6. Audit Events Table
create table if not exists public.audit_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null,
  description text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  ip_address text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_events enable row level security;

create policy "Users can view own audit events"
  on public.audit_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own audit events"
  on public.audit_events for insert
  with check (auth.uid() = user_id);
