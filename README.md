# Planner Pro

A modern daily task planner built with Next.js 16, Bun, TypeScript, Tailwind, and SQLite.

Planner Pro helps you organize work with smart list/view navigation, rich task metadata, fast search, and polished interactions for desktop and mobile.

## Features

- Inbox-first task flow with custom lists and labels
- Core planner views: Today, Next 7 Days, Upcoming, All
- Rich tasks: description, schedule/deadline, reminders, estimate/actual time, priority, recurrence, subtasks, attachment URL
- Task history logging for change auditing
- Fuzzy search across task content
- Responsive split layout with light/dark themes (system default)
- Keyboard shortcuts and micro-interaction polish (mobile press feedback, drag ghost states, sticky mobile save actions)

## Tech Stack

- Next.js 16 (App Router)
- Bun (package manager, scripts, test runner)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui primitives
- Framer Motion
- SQLite (local file in repo)
- Zod validation
- Playwright (e2e scaffold)

## Project Structure

- `src/app` - app routes, layouts, API routes, error/loading boundaries
- `src/components` - UI and feature components (sidebar, task editor, shortcuts, etc.)
- `src/lib/services` - domain-level task/list/view/recurrence logic
- `src/lib/validation` - Zod schemas
- `src/db` - SQLite client, schema references, seed
- `tests` - unit/integration/api/e2e tests
- `db/migrations` - migration output/reference
- `data` - local SQLite runtime files

## Prerequisites

- Bun `>= 1.3`
- Node.js `>= 20` (for Next.js tooling compatibility)

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app redirects `/` to `/today`.

## Scripts

```bash
bun run dev        # start dev server
bun run build      # production build
bun run start      # run production server
bun run lint       # eslint
bun run typecheck  # typescript checks
bun run test       # bun tests (unit/integration/api)
bun run test:e2e   # playwright tests
```

## Keyboard Shortcuts

- `/` focus global search
- `n` focus new task title
- `t` go to Today
- `a` go to All
- `?` toggle shortcut help

## Data and Persistence

- SQLite database file lives under `data/`.
- Schema/table initialization runs at app startup via `src/db/client.ts`.
- Inbox list is auto-seeded if missing.

## Testing

Current automated coverage includes:

- Unit tests: recurrence + validation
- Integration tests: planner domain behavior around view/date/schema rules
- API-boundary tests: payload validation behavior
- E2E scaffold: Playwright smoke spec under `tests/e2e`

Run all local quality checks:

```bash
bun run typecheck && bun run lint && bun run test
```

## Notes

- This is currently a **single-user local** planner (no auth/multi-tenant model yet).
- Natural-language task parsing and scheduling suggestions are scaffolded as extension hooks in `src/lib/ai`.

## Roadmap Ideas

- Full natural-language task capture ("Lunch with Sarah at 1 PM tomorrow")
- Smart scheduling recommendations based on availability
- Rich attachments and file uploads
- Notifications/background reminders
- Multi-user auth and sync
