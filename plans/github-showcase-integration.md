# GitHub Showcase Integration Plan

**Status:** Proposed  
**Created:** 2026-11-04  
**Project:** `nyxxyr-project-showcase`  
**Primary stack:** Next.js 16 App Router, React 19, TypeScript

## 1. Objective

Connect Nyxxyr's public GitHub work to the showcase so selected repositories can be discovered from the existing editorial site, while preserving the current newspaper design and the quality of the hand-written project stories.

The first release should:

- Show a curated set of public repositories in a new "Open source" section.
- Keep repository name, description, topics, language, and update date synchronized with GitHub.
- Provide direct links to each repository and the full GitHub profile.
- Reuse the existing typography, rules, responsive layout, and accessibility behavior.
- Keep builds and pages working if GitHub is unavailable.
- Avoid turning every repository into an automatically generated or misleading case study.

## 2. Recommended scope

Use a **read-only, server-side GitHub integration**.

GitHub will provide current repository facts. A small version-controlled curation file will decide which repositories appear, their order, and any display overrides. Existing editorial fields such as story, outcome, role, caption, and project art will remain intentionally authored.

The first release will not include GitHub sign-in, private repositories, issue dashboards, commit activity, repository writes, or automatic case-study generation.

## 3. User decisions required before implementation

These values are not present in the repository and must be supplied:

1. The GitHub username or organization name to display.
2. Whether the account is a personal account or an organization.
3. The public repositories to feature, in preferred order, or a topic such as `showcase` that marks them.
4. Whether existing project stories should also show a "View source" link where a matching repository exists.

Recommended defaults:

- Feature no more than six repositories.
- Exclude forks and archived repositories unless explicitly allowlisted.
- Use an explicit repository allowlist instead of showing all public repositories.
- Do not display star counts; language, topics, description, and recency are more useful to visitors.

## 4. Chosen architecture

### Data flow

1. A server-only GitHub adapter requests public repository metadata from the GitHub REST API.
2. The adapter filters the response to the curated allowlist and normalizes only the fields the showcase uses.
3. A cached data function exposes the normalized repositories to Server Components.
4. The homepage renders an "Open source" section using the existing editorial components and visual tokens.
5. If GitHub cannot be reached or returns invalid data, the adapter returns the last checked-in snapshot.
6. If neither GitHub nor a snapshot is available, the section is omitted without breaking the rest of the page.

### Why this approach

- It keeps the GitHub token and API traffic on the server.
- It adds live repository facts without replacing authored case-study content.
- It avoids client-side rate limits and keeps repository content in server-rendered HTML.
- It avoids a database and GitHub OAuth for a public portfolio use case.
- It keeps the existing static-first rendering model and fits the project's enabled Cache Components.

## 5. Proposed files

| File | Purpose |
| --- | --- |
| `lib/github-showcase.ts` | GitHub request, response validation, filtering, normalization, and fallback handling |
| `data/github-showcase.ts` | Curated repository allowlist and display overrides |
| `data/github-showcase-fallback.json` | Last known-good normalized repository data for resilient builds |
| `components/github-showcase.tsx` | Accessible repository section and repository cards |
| `app/page.tsx` | Adds the Open source section to the front page |
| `components/site-shell.tsx` | Adds the GitHub profile link to navigation or the colophon if approved |
| `.env.example` | Documents the server-only GitHub configuration |
| `README.md` | Documents setup, refresh, and fallback behavior |

Keep the GitHub adapter separate from `lib/projects.ts`. A GitHub repository and an editorial case study are related but are not the same content type.

## 6. Configuration and secrets

Use server-only environment variables:

```bash
GITHUB_ACCOUNT=your-github-username
GITHUB_TOKEN=optional-server-side-token
```

- `GITHUB_ACCOUNT` identifies the public profile whose repositories are requested.
- `GITHUB_TOKEN` is optional. When present, it increases API rate limits and must never use a `NEXT_PUBLIC_` prefix.
- Do not commit `.env.local` or a real token.
- Do not require a token for the normal public, cached path.
- If `GITHUB_ACCOUNT` is absent, omit the GitHub section rather than failing the build.

The account type must be reflected in the request URL: use the user repositories endpoint for a personal account and the organization repositories endpoint for an organization. Support whichever account type is confirmed; do not guess at runtime from a failed request.

## 7. Repository data contract

Normalize the GitHub response into a small internal type:

```ts
type GithubShowcaseRepository = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  homepageUrl: string | null;
  language: string | null;
  topics: string[];
  updatedAt: string;
  archived: boolean;
  fork: boolean;
};
```

Only accept public repositories. Validate that the response is an array, that required repository fields have the expected types, and that all links are GitHub or explicitly approved HTTPS URLs before rendering them.

Field ownership:

| Field | Source |
| --- | --- |
| Repository name and full name | GitHub |
| Description | GitHub, with optional curated override |
| Topics and language | GitHub |
| Last updated date | GitHub |
| Repository URL and homepage URL | GitHub |
| Display order and visibility | Curated allowlist |
| Editorial title, summary, theme, caption, outcome, and story | Existing authored project data |

The GitHub section should not infer roles, client outcomes, metrics, or testimonials from repository contents.

## 8. Curation model

Define an explicit, ordered allowlist in `data/github-showcase.ts`. Each entry should support only the controls actually needed:

```ts
type GithubShowcaseEntry = {
  repository: `${string}/${string}`;
  descriptionOverride?: string;
  label?: string;
};
```

Rules:

- Unknown repositories returned by GitHub remain hidden.
- Missing allowlisted repositories are skipped and logged without exposing secrets.
- Forks, archived repositories, disabled repositories, and repositories without a public URL are excluded by default.
- A manually supplied description override may be used when a repository description is empty or too implementation-focused.
- Authors must not use a repository description as a substitute for case-study evidence.

If the user prefers a topic-based workflow, filter on a confirmed topic before applying the allowlist. The recommended first implementation is an allowlist because it provides predictable ordering and prevents unplanned visibility.

## 9. Fetching and caching

Implement the GitHub read as an async server function using the installed Next.js 16 Cache Components pattern:

- Add `"use cache"` to the data function.
- Set an explicit `cacheLife("hours")` lifetime.
- Add a `cacheTag("github-showcase")` tag for later on-demand invalidation.
- Request only public repository metadata and a bounded page size.
- Paginate only if the account can exceed one page and an allowlisted repository may fall beyond the first page.
- Send `Accept: application/vnd.github+json` and the current GitHub API version header.
- Add the optional bearer token only on the server.
- Handle non-2xx responses, rate limiting, timeouts, malformed JSON, and empty results explicitly.

The cached result should be shared across visitors. No browser code should call the GitHub API directly.

## 10. Failure and fallback behavior

The showcase currently builds without external data, and that reliability should remain.

1. On a successful request, return validated, normalized repositories.
2. On a transient failure, read `data/github-showcase-fallback.json`.
3. If an allowlisted repository disappears or becomes private, remove it from the rendered result.
4. If no usable repositories remain, omit the section.
5. Never display an API error, token, raw GitHub response, or stack trace to visitors.

The fallback snapshot should be updated only from a successful response. It should not contain secrets or unnecessary GitHub payload fields.

Before release, decide whether the UI should disclose when data is from the fallback snapshot. Recommended treatment: show a quiet "Updated from a saved snapshot" note only when the cached repository's age exceeds a reasonable threshold.

## 11. UI plan

Add an "Open source / GitHub" section after "Selected work" and before "Approach", unless visual review shows a stronger location.

Section content:

- A short editorial heading such as "Work in public."
- One sentence explaining that these are selected public repositories, not padded case studies.
- A primary link to the full GitHub profile.
- A responsive list of repository cards.

Each repository card should show:

- Repository name as the link.
- Curated or GitHub description.
- Primary language, if present.
- Up to three topics.
- Last updated date.
- Optional live site link when `homepage` is an approved URL.
- A separate, unambiguous GitHub source link.

Reuse existing type, rule, accent, focus, and spacing tokens. Add only the styles required for repository metadata. Do not introduce a generic rounded-card UI that conflicts with the broadsheet direction.

Responsive behavior:

- Wide screens use the existing editorial grid and structural rules.
- Medium screens reduce to two columns where descriptions remain readable.
- Mobile uses a single column with 44 px minimum interactive targets.
- Long repository names and descriptions wrap without horizontal scrolling.
- Empty language, topics, or description fields collapse without leaving broken spacing.

## 12. Existing case-study integration

Repository cards are the required first release.

If approved later, add an optional `githubRepository` field to `Project` and render a "View source" action on matching `/work/[slug]` pages. Link only when the repository is public and explicitly allowlisted. Do not automatically create project routes from GitHub metadata because the current route requires a headline, narrative, image description, role, outcome, and approved evidence.

## 13. Security and privacy

- Request public repository data only.
- Keep tokens server-side and out of logs, client bundles, screenshots, and error messages.
- Use the least-privileged token possible if one is required; a read-only token is sufficient.
- Do not use GitHub OAuth or request write scopes for this feature.
- Treat repository descriptions and topics as untrusted external text and render them as text, never HTML.
- Allow only expected HTTPS links and reject unexpected protocols.
- Do not expose email addresses, contributor data, issue text, or raw API payloads.
- Respect GitHub API terms and caching/rate-limit guidance.

## 14. Implementation sequence

1. Confirm the account, account type, and initial repository allowlist.
2. Create the normalized repository type and curation data.
3. Implement the cached GitHub adapter with validation and fallback handling.
4. Add a checked-in last-known-good snapshot.
5. Build the repository section using existing server-first components and visual tokens.
6. Add the homepage section and approved GitHub profile navigation link.
7. Add a "View source" link to matching editorial projects if requested.
8. Document environment setup, allowlist updates, snapshot refresh, and fallback behavior.
9. Run a focused visual and accessibility review at wide, tablet, and 320 px widths.
10. Validate the production build with GitHub available and unavailable.

## 15. Verification checklist

- A valid account and allowlist produce only the intended public repositories in the intended order.
- Repositories outside the allowlist never render.
- Forks and archived repositories remain hidden by default.
- GitHub token values never appear in client output or logs.
- A successful API response renders correct names, descriptions, languages, topics, dates, and links.
- Missing optional fields render cleanly.
- API failure uses the fallback snapshot.
- Missing configuration or an empty result omits the section without a crash.
- Rate-limit and malformed-response paths are handled.
- External links have clear labels and do not create ambiguous duplicate names.
- Keyboard focus, contrast, text resizing, and reduced motion remain correct.
- No horizontal overflow appears at 320 px.
- `npm run lint` passes.
- `npm run build` passes with network access and again with the adapter forced to its fallback path.

## 16. Acceptance criteria

The integration is complete when:

- The approved GitHub profile is reachable from the showcase.
- The approved public repositories appear in a dedicated, responsive Open source section.
- Repository facts refresh from GitHub on the configured cache schedule.
- Curated editorial projects keep their existing content and visual hierarchy.
- GitHub is not required for the site to render successfully.
- No secret, private repository data, or unvalidated external HTML is exposed.
- Documentation tells the owner how to add, remove, and reorder featured repositories.

## 17. Out of scope

- GitHub sign-in for showcase visitors.
- OAuth account linking.
- Private repository display.
- Writing issues, stars, or other data back to GitHub.
- Automatically generated case-study pages.
- Commit, pull-request, contribution, or issue feeds.
- Star-count leaderboards or other vanity metrics.
- A CMS or database.

## 18. Open questions

1. What GitHub account should be connected?
2. Is it a personal account or an organization?
3. Which repositories should be featured first?
4. Should the GitHub profile link appear in the main navigation, the Open source section, the footer, or more than one place?
5. Should a matching editorial project display a repository source link?
6. Is a saved-snapshot age disclosure desired?
