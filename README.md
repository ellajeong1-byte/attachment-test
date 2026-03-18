# Writers' Room OS (Lovable + Supabase)

A premium, cinematic internal tool for managing an AI-powered serialized web novel writers' room.

## What is included

- Email/password authentication using Supabase Auth
- Responsive project dashboard UI
- Role-specific workspace cards for all 6 AI roles
- Episode workflow board
- Submission and revision history panel
- Production-ready Supabase schema with RLS policies for:
  - projects
  - story bible
  - character sheets
  - timeline events
  - episodes
  - submissions
  - director approvals
  - revision history

## Stack

- React + Vite
- Tailwind directives (with custom CSS layout)
- Supabase Auth + Postgres

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in Supabase project values:

```bash
cp .env.example .env
```

3. Run the app:

```bash
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run:

```sql
-- file: supabase/schema.sql
```

3. Confirm Auth -> Providers has email enabled.
4. Add app URL and redirect URL in Auth settings for local dev.

## Lovable handoff note

This repository is structured to be directly portable to Lovable:
- frontend: React dashboard shell and auth flow
- backend: Supabase schema and RLS rules

From here, you can continue feature expansion in Lovable by connecting this schema and iterating on each module.
