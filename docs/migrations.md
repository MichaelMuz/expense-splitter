# Migrations

How schema changes flow from dev to prod.

## Dev workflow

1. Edit `prisma/schema.prisma`.
2. `bun dev` runs `prisma db push` on startup, silently syncing local DB to match the schema. Iterate freely, no migration files created during this phase.
3. When the schema stabilizes, run `bun gen-migration --name <descriptive_name>` once. This:
   - Diffs the current schema against the last applied migration
   - Writes `prisma/migrations/<timestamp>_<name>/migration.sql`
   - Applies it to your local DB (Prisma detects drift from `db push` and prompts to reset. Say yes; your local data gets wiped, this is the cost of the prototyping loop)
4. Commit the generated migration folder alongside the code change. Review the `.sql` before pushing.

## Prod workflow

`Dockerfile.backend` sets `CMD ["bun", "run", "start"]`, which resolves to:

```
bunx prisma migrate deploy && bun run src/server/index.ts
```

On pod startup:

1. `prisma migrate deploy` reads `prisma/migrations/` (baked into the image), applies any migrations not yet recorded in the `_prisma_migrations` table.
2. A Postgres advisory lock serializes concurrent pods — one applies, the rest no-op after acquiring and seeing nothing pending.
3. If the migration fails, the process exits non-zero, the container crashes, K8s crashloops. Old pods keep serving. Rollout stalls rather than corrupting state.
4. On success, the Express server starts.

## Post-merge local sync

After pulling main with a migration you didn't author (or one CI/another branch introduced), your local DB already has those schema changes from `db push`. Don't run `migrate deploy`, it'll fail because the tables already exist. Instead:

```
bunx prisma migrate resolve --applied <migration_name>
```

Marks the migration as applied in `_prisma_migrations` without running the SQL. Db push loses data, but this applied resolution doesn't.

## TODOs

- [ ] **CI drift check.** Add a CI step that runs `bunx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --exit-code`, fails the PR if someone edited `schema.prisma` without running `bun gen-migration`.
- [ ] **Seeding.** Wire up `prisma db seed` so local dev data survives the `gen-migration` reset.
- [ ] **Refresh README.md.** Current Quick Start references nonexistent scripts (`prisma:migrate`, `server`, `client`).
- [ ] **Verify Dockerfile locally.** Build the backend image and confirm `migrate deploy` actually runs on startup (`prisma` CLI is in dependencies, but hasn't been tested end-to-end).
