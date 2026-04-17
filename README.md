# Expense Splitter

Split expenses with friends. Type-safe, self-hosted.

## Tech Stack

Bun + Express + Prisma + PostgreSQL + React + Tailwind

## Prerequisites

- [Bun](https://bun.sh)
- [Podman](https://podman.io) — `db:start` runs Postgres in a podman container

## Quick Start

```bash
bun install
bun run dev
```

`bun run dev` starts the Postgres container, backend, and frontend.

Frontend: http://localhost:5173
Backend: http://localhost:3000/api

## Scripts

- `bun run dev` - Run both servers
- `bun run backend` - Backend only
- `bun run frontend` - Frontend only
- `bun run db:start` / `db:stop` - Postgres container
- `bun run gen-migration --name <name>` - Bless a schema change into a migration
- `bun run prisma:studio` - Database GUI
- `bun run check` - Lint + format + typecheck

## Docs

See [`docs/`](./docs/) for app design, frontend patterns, and the migration workflow.
