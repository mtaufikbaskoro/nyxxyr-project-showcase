# Admin Dashboard CRUD Plan

**Status:** Ready for implementation  
**Created:** 2026-11-06  
**Project:** `nyxxyr-project-showcase`  
**Stack:** Next.js 16 App Router, React 19, Prisma 6, MySQL

## 1. Objective

Replace the read-only admin overview with a private dashboard that supports
create, read, update, and delete operations for every content model in
`prisma/schema.prisma`. Keep the existing `requireAdmin` session boundary and
the portfolio's ink-and-paper editorial design system.

The dashboard should prioritize common editorial work: publishing projects,
editing profile content, maintaining ordered lists, and managing GitHub
showcase metadata. Database relationships and generated values should remain
visible only where they help the editor.

## 2. Information Architecture

Use a persistent admin shell with a compact sidebar and a contextual main area.

- `/admin`: overview, content health, quick actions, and recent records.
- `/admin/profile`: the Profile singleton plus Background, Credential, and
  Skill collections.
- `/admin/projects`: searchable/filterable project list.
- `/admin/projects/new`: create a project.
- `/admin/projects/[id]`: edit project fields and manage child records in
  context, including sections, paragraphs, evidence, and quote.
- `/admin/github`: GitHub showcase list.
- `/admin/github/new`: create a showcase entry.
- `/admin/github/[id]`: edit entry fields and manage allowed hosts, snapshot,
  and topics in context.

This exposes all 13 Prisma models without making users understand foreign keys
or navigate to a separate page for each child table.

## 3. Interaction Design

- Use the existing serif display type, monospace metadata, square controls,
  warm paper surfaces, thin rules, and editorial-red actions.
- Give each collection a clear create action, empty state, row actions, and
  destructive confirmation.
- Use direct forms with visible labels, optional-field hints, sensible input
  types, and grouped sections for long records.
- Show local validation and database errors beside the form with an accessible
  live region.
- Redirect after create/delete so database-generated IDs and relations are
  always loaded from Prisma.
- Keep list ordering explicit through the existing `position`/`sortOrder`
  fields; show duplicate-order conflicts as actionable errors.
- Make the shell responsive: persistent sidebar on desktop and horizontally
  scrollable route navigation on small screens.

## 4. Data and Mutation Layer

Add focused server-only admin queries and server actions:

- Authenticate with `requireAdmin` inside every action; rendered-form gating is
  not a security boundary.
- Validate all current fields, enums, URLs, emails, required relations, dates,
  booleans, and numeric positions from untrusted `FormData`.
- Use Prisma transactions where a project or GitHub entry mutation affects
  ordered child records.
- Preserve model constraints: unique slugs/repositories, profile/project
  ownership, unique optional relations, and `[parentId, position]` ordering.
- Treat timestamps as database-managed and do not expose them as editable.
- Convert GitHub bigint IDs safely at the form boundary.
- After mutations, call `updateTag("portfolio-profile")` and/or
  `updateTag("portfolio-projects")` so public cached reads are immediately
  refreshed, then invalidate relevant admin routes.

## 5. CRUD Coverage

| Entity | Create | Read | Update | Delete |
| --- | --- | --- | --- | --- |
| Profile | Initialized by seed; no duplicate create | Profile page | Full core fields | Blocked when it owns projects |
| Project | Project form | Filtered list + editor | Full fields/status | Confirmed, cascades children |
| ProjectSection | Project editor | Ordered sections | Title/position | Confirmed, cascades paragraphs |
| ProjectParagraph | Section editor | Ordered paragraphs | Body/position | Confirmed |
| ProjectEvidence | Project editor | Status/summary | Value/label | Confirmed |
| ProjectQuote | Project editor | Status/summary | Body/attribution | Confirmed |
| BackgroundItem | Profile collection | Ordered list | Full fields | Confirmed |
| Credential | Profile collection | Ordered list | Full fields | Confirmed |
| Skill | Profile collection | Ordered list | Name/position | Confirmed |
| GithubShowcaseEntry | GitHub form | Filtered list + editor | Full fields | Confirmed |
| GithubAllowedHost | GitHub entry editor | Ordered list | Host/position | Confirmed |
| GithubSnapshot | GitHub entry editor | One per entry | Full metadata | Confirmed |
| GithubTopic | Snapshot editor | Ordered list | Name/position | Confirmed |

Profile creation is intentionally excluded because the public site requires one
singleton profile; the seed remains the bootstrap path. A second profile would
make `getProfile()` ambiguous.

## 6. Components and Files

- `app/admin/layout.tsx`: authenticated admin shell and navigation.
- `app/admin/page.tsx`: operational overview.
- `app/admin/profile/page.tsx`: profile and lightweight collections.
- `app/admin/projects/page.tsx`, `new/page.tsx`, `[id]/page.tsx`.
- `app/admin/github/page.tsx`, `new/page.tsx`, `[id]/page.tsx`.
- `components/admin/*`: shared fields, table, status, empty state, submit button,
  delete confirmation, and entity forms.
- `lib/admin/queries.ts`: direct admin reads, including unpublished records.
- `lib/admin/actions.ts`: authenticated and validated mutations.
- `app/globals.css`: admin shell, forms, tables, editor panels, and responsive
  states built from existing design tokens.
- `components/app-shell.tsx` and `app/layout.tsx`: hide the public masthead and
  footer for `/admin` while keeping them on public/login routes.

## 7. Implementation Sequence

1. Add the dashboard plan and shared admin shell/navigation.
2. Add admin query and validation helpers, then implement profile and project
   actions.
3. Build the overview, profile editor, project list, and project editor.
4. Add nested project section/paragraph/evidence/quote editors.
5. Build GitHub showcase list/editor and nested hosts/snapshot/topics.
6. Add responsive styles, focus/disabled/error states, and public cache
   revalidation.
7. Run focused lint/type/build checks and exercise authenticated CRUD flows
   against the configured database where available.

## 8. Verification

- Every action rejects unauthenticated requests and invalid entity IDs.
- Every field and relation can be created, read, changed, and deleted through
  the UI, except the documented Profile singleton rule.
- Unique and ordering constraint failures return useful form errors.
- Public portfolio queries reflect edits immediately after successful actions.
- No public site chrome appears on `/admin`; login remains styled and usable.
- Forms and tables work by keyboard at 320 px through desktop widths.
- `npm run lint` and `npm run build` pass.

Before code changes, consult the installed Next.js 16 guides for layouts,
dynamic routes, caching/revalidation, forms, and server actions.
