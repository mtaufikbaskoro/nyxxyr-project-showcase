# Database operations

The portfolio uses MySQL through Prisma. Authored profile and project content,
GitHub curation, and GitHub snapshots are stored in the database. Interface copy
and cache policy remain in code.

## Local setup

1. Create a MySQL 8-compatible database and an application user.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`. Prisma and Next.js both
   load this file; `.env.local` is not loaded by the Prisma CLI.
3. Install, generate, migrate, and seed:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The application user needs access only to its portfolio database. Use TLS in
production and URL-encode reserved characters in the password.

## Content updates

`prisma/seed.mts` is the initial content importer. It uses stable IDs and
upserts, so it can be run repeatedly without creating duplicate records:

```bash
npm run db:seed
```

The current TypeScript and JSON files remain as seed inputs until production
data has been verified. Runtime reads use Prisma only. After a successful seed,
rebuild or redeploy so the `portfolio-profile`, `portfolio-projects`, and
`github-showcase` cache entries are refreshed.

Draft, archived, and future-published projects are excluded from public reads.
Project sections, paragraphs, skills, background items, and GitHub curation are
ordered by their stored `position` columns.

## Migrations

Apply committed migrations in non-development environments:

```bash
npm run db:migrate
```

Use `npx prisma migrate dev --name <change>` during development when changing
`prisma/schema.prisma`. Commit the generated migration with the schema.

## Backup and restore

Take a consistent logical backup before a migration or bulk content update:

```bash
mysqldump --single-transaction --set-gtid-purged=OFF --routines --triggers \
  -h <host> -u <user> -p <database> > portfolio.sql
```

Restore into an empty database, then apply any newer migrations:

```bash
mysql -h <host> -u <user> -p <database> < portfolio.sql
npm run db:migrate
```

Verify the restore by checking the public pages, running `npm run lint`, and
running `npm run build` against a disposable environment.

## GitHub

Repository allowlist order, labels, description overrides, visibility, approved
homepage hosts, and the GitHub account type are database records. `GITHUB_TOKEN`
remains server-only environment configuration and is never stored in MySQL.

A successful GitHub request updates all matching snapshots in one transaction.
If the request fails, validation fails, or snapshot persistence fails, the site
reads the latest stored snapshot.
