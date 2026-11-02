# Design Decisions

## Decision baseline

The starter repository contained only Next.js scaffolding, a default metadata block, and Vercel assets. No project names, copy, imagery, client facts, or contact details were available. The plan's representative-content assumption was therefore used to build a complete, replaceable showcase shell.

This is a one-page front-page experience with statically generated project feature routes. It is not a CMS migration or a claim that the current specimen copy is approved client evidence.

## Decision log

| ID | Decision | Rationale | Consequence |
| --- | --- | --- | --- |
| D01 | Select restrained broadsheet | Best balance of editorial character, reading quality, and fit across varied project types | Hierarchy depends on disciplined headline and summary lengths |
| D02 | Use ink and paper with oxidized red | Warm but contrast-first; red reads as an editorial signal without becoming a wash | All derived colors must be checked against both paper and ink |
| D03 | Use system editorial font stacks | Avoids network font requests and layout shift in a starter project with no licensed font files | Type renders slightly differently across platforms; hierarchy and measure remain stable |
| D04 | Make the lead story 8.5:3.5 against a supporting rail | Creates immediate newspaper composition rather than a uniform card grid | Rail content must stay shorter than the lead |
| D05 | Use a 7/5 asymmetric story index | Repeats hierarchy without making every story equal | Card variants collapse to one story pattern on mobile |
| D06 | Use CSS custom properties plus Tailwind `@theme inline` | One source of truth for production code and the living guide | New visual values should begin as tokens, not component literals |
| D07 | Use a static dot texture and no paper images | Suggests print without shipping texture assets or reducing contrast | Texture can be removed in forced-colors mode |
| D08 | Build project artifacts from semantic HTML/CSS specimens | Delivers project-shaped visuals without unapproved client media or remote image dependencies | Replace with approved screenshots and captions when available |
| D09 | Mark project imagery with `role="img"` and descriptive names | The artifact is meaningful evidence even when built from DOM elements | Artifact content is announced as one image rather than a confusing UI tree |
| D10 | Create `work/[slug]` with `generateStaticParams` | Meets the feature-article template requirement without a data service | The four specimen routes are generated at build time |
| D11 | Make `/design-system` a live internal reference | Documentation and implementation can be compared in one place | Route is noindex; release still needs an ownership decision |
| D12 | Keep interaction server-first | No client state is needed for the initial showcase or style desk | The system remains simple and fast; future filters need a separate interaction decision |
| D13 | Place a representative-content disclosure in the colophon | Prevents specimen names and metrics from appearing as verified claims | Must be removed or updated when approved content lands |
| D14 | Use a text-first, mixed-case Nyxxyr wordmark | Creates identity without commissioning a logo or using a fake masthead image | Brand can later be replaced by an approved wordmark |

## Visual-direction comparison

### Restrained broadsheet

**Adopt.** Uses strong hierarchy, generous reading measure, structural rules, and asymmetric pacing. It remains usable after decorative print cues are removed.

### Bold tabloid

**Do not adopt as the site-wide register.** The energy is useful for project-specific campaign moments, but the scale and density would overpower research-heavy case-study copy.

### Literary supplement

**Do not adopt as the site-wide register.** Its quiet reading rhythm suits long-form stories, but the index needs more immediate project comparison and forward movement.

## Architecture decisions

### Server Components

All public pages are Server Components. The page content is static, and the only interactive-looking controls are normal links, buttons, and states. This follows the installed Next.js 16 App Router guide and avoids premature client bundles.

### Static feature routes

The dynamic route uses a promise-based `params` prop, awaits the slug, validates it with `getProject`, and returns the framework 404 route for unknown work. `generateStaticParams` emits the four specimen feature routes at build time.

### Metadata

The root layout owns the site title template and default description. Each feature route generates metadata from its project record. The design desk is explicitly `noindex, nofollow`.

### Styling

The global stylesheet holds semantic tokens, responsive layout, custom editorial patterns, state styles, keyword motion, and artifact compositions. This is intentional: the project has not yet grown enough distinct surfaces to justify many CSS modules, and a shared sheet makes the living guide render the same rules as production.

## Accessibility decisions

- The newspaper metaphor never changes element semantics.
- Decorative rules are CSS borders or pseudo-elements.
- Captions remain in the document flow.
- Project artifact text is represented as one named image.
- The headline carries the project route; repeated actions remain separate links.
- Disabled and loading controls are display specimens, not hidden interactive traps.
- Focus rings use a high-contrast accent and remain distinct from hover.
- Reduced motion reduces durations to effectively zero and disables smooth scrolling.
- Status colors are always paired with text.

## Content and asset tradeoffs

- The four projects are representative and explicitly disclosed.
- The project artifacts are original CSS compositions rather than stock images.
- The contact address is representative and must be approved.
- The current metrics are presented with the disclosure that they are specimen evidence.
- The site uses no remote media and no font downloads, which keeps the first build self-contained.

## Verification record

- `npm run lint`: passed.
- `next build --webpack`: passed; `/`, `/design-system`, root 404, and all four feature routes generated.
- Visual review: front page and design desk at 1440, 768, and 320 px.
- Project feature review: desktop article grid and 320 px single-column layout.
- DOM width check: `document.documentElement.scrollWidth` equals viewport width at 320 px.
- Contrast calculation: ink 16.01:1, muted ink 7.67:1, accent 7.19:1, warning 6.49:1, danger 7.79:1 against paper.
- Reduced-motion and forced-colors rules are present in the global stylesheet.

The default Turbopack production build could not launch its CSS transform subprocess in the execution sandbox because local port binding was denied. The same application build passed using Next.js's supported Webpack path. This is an environment constraint rather than an application compile failure.

## Open decisions

1. Approve real project content and evidence.
2. Approve or replace the contact address.
3. Decide whether volume, issue, and dateline are meaningful site context.
4. Decide whether project features need galleries, process modules, and credits.
5. Protect or remove the design desk before a public production release.
6. Decide whether a dark reading mode is needed.
7. Replace CSS artifacts with optimized project media when supplied.
