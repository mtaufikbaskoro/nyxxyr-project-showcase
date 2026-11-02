# Nyxxyr Editorial Design Guide

## 1. Purpose and audience

Nyxxyr is presented as an independent studio with a publication's point of view. The showcase is for potential clients, collaborators, and employers who need to understand the quality and range of the work quickly, then choose a project worth reading closely.

The visitor should feel that the work has been selected and edited, understand the studio's focus on useful digital experiences, and have an obvious route to a project feature or correspondence within the first minute.

### Experience principles

1. **Lead with consequence.** Each story begins with the human or operational change, not a list of deliverables.
2. **Let strong work be seen.** Project artifacts receive space, captions, and accessible descriptions rather than decorative treatment alone.
3. **Make hierarchy legible.** A dominant lead story, supporting rail, and asymmetric index tell the reader what to read first, second, and next.
4. **Keep familiar controls familiar.** Links and buttons remain visibly interactive even when their typography follows the editorial voice.
5. **Carry the concept through structure.** Rules, columns, kickers, captions, and pacing create the newspaper character. Paper damage and faux aging are not part of the system.

## 2. Content model

The front page uses one featured project and a supporting index. Each project record contains:

- name and slug;
- department-style kicker;
- headline;
- short summary;
- date, role, tools, and reading time;
- one primary outcome and supporting metric;
- project artifact and descriptive caption;
- lead paragraph, two body sections, and a pull quote.

The current project names, outcomes, and credits are representative specimen content. Replace them with approved copy and evidence before public release.

### Content resilience

- Headlines should be tested at 60–110 characters and with three or more words that cannot break.
- Summaries should work at 120–220 characters. Missing summaries fall back to the story lead.
- Metrics need a plain-language label and a method or context before they are treated as evidence.
- Artifact descriptions must explain the visible interaction, not only the project name.
- Dense metadata should wrap in reading order; it must never require horizontal scrolling.

## 3. Selected direction

The selected direction is a restrained broadsheet.

It combines a text-first masthead, generous headline scale, high-contrast serif type, structural rules, and asymmetric story placement with contemporary digital spacing and familiar controls. It is more considered than a tabloid, more energetic than a literary supplement, and appropriate for project work that spans civic systems, culture, data, and care.

### Alternatives considered

| Direction | Strengths | Why it was not selected |
| --- | --- | --- |
| Bold tabloid | Strong first impression; suits short, opinionated work | Risks overpowering the projects and making dense case-study copy feel sensational |
| Literary supplement | Excellent reading rhythm; quieter character | Can underplay technical and service outcomes; less immediate as a project index |
| Restrained broadsheet | Balanced hierarchy, credibility, and energy; works on mobile when collapsed | Requires disciplined content lengths and a small type system |

### What makes it feel like a newspaper

- Text-first masthead with edition context
- A lead headline that is visibly more important than supporting stories
- Department-like navigation and kickers
- Twelve-column composition that becomes an asymmetric story index
- Structural rules, folios, captions, bylines, and datelines
- Long-form reading measure with a distinct feature-article template

### What to avoid

- Sepia washes or yellow paper that lower contrast
- Stains, tears, folds, tape, and page-flip interactions
- Tiny all-caps paragraphs and miniature multicolumn mobile text
- Every card becoming a faux clipping
- Decorative icons that replace readable labels
- Motion that delays content or imitates turning newsprint

## 4. Foundations

All tokens live in [`app/globals.css`](../app/globals.css). Components consume semantic CSS variables, and the same values are exposed through Tailwind's `@theme inline` block.

### Color roles

Contrast ratios are measured against paper (`#F4F0E6`).

| Role | Token | Value | Use | Contrast |
| --- | --- | --- | --- | --- |
| Paper | `--paper` | `#F4F0E6` | Page canvas | Reference |
| Deep paper | `--paper-deep` | `#E8DFCF` | Alternate editorial band | 1.16:1 |
| Ink | `--ink` | `#171512` | Primary text, reverse surfaces | 16.01:1 |
| Muted ink | `--ink-muted` | `#514A41` | Secondary copy and metadata | 7.67:1 |
| Rule | `--rule` | `#746C60` | Dividers and borders | 4.55:1 |
| Accent | `--accent` | `#8F2D22` | Kickers, links, active signals | 7.19:1 |
| Reverse | `--paper-reverse` | `#FBF8F1` | Text on ink | 15.58:1 against ink |
| Success | `--success` | `#24563B` | Success status | 7.47:1 |
| Warning | `--warning` | `#7C4A0B` | Notice status | 6.49:1 |
| Danger | `--danger` | `#8B241D` | Error status | 7.79:1 |

The accent is a signal, not a background wash. Use it for department labels, links, rules that signal a new section, and a small number of active states.

### Typography

The delivery uses system editorial stacks rather than downloaded fonts. This avoids external font requests, render variance, and layout shift. The hierarchy matters more than a specific licensed typeface.

| Role | Token or pattern | Intended size | Behavior |
| --- | --- | --- | --- |
| Masthead | `--font-display` / `.masthead__brand` | 92–218 px | Tight tracking, short brand wordmark |
| Lead headline | `--text-display` | 45–102 px | Maximum 9–13 characters per line |
| Section headline | `--text-section` | 32–61 px | Balanced at 16–19 characters per line |
| Story headline | `--text-story` | 26–38 px | Supports long titles without density |
| Dek | `--text-dek` | 18–23 px | Maximum 54–58 characters |
| Body | `--text-body` | 17–19 px | Maximum 66 characters |
| Caption | `--text-caption` | 12–14 px | Sans stack; paired with figure number |
| Kicker | `--text-label` | 11–13 px | Short all-caps labels only |
| Byline and folio | `--font-mono` or `--font-ui` | 10–12 px | Factual, compact, high contrast |

Avoid long all-caps passages. Use `text-wrap: balance` on headings and `text-wrap: pretty` on body copy.

### Space and layout

The spacing scale is `4, 8, 12, 16, 24, 32, 48, 64, 96 px`, exposed as `--space-1` through `--space-9`.

- The page is capped at `92rem` with a responsive `16–56 px` gutter.
- Wide compositions use a twelve-column grid with a `16–32 px` gutter.
- The lead-to-rail split is approximately 8.5:3.5.
- The project index alternates 7-span and 5-span stories.
- The feature article uses notes, reading copy, and outcome columns at wide sizes.
- At `72rem`, the feature outcome moves below the article.
- At `48rem`, all article layouts become one reading column.
- At `23rem`, navigation and controls receive extra wrapping and full-width actions.

Body measure remains 62–68 characters even when the surrounding page uses twelve columns.

### Rules and surfaces

- Corners are square.
- Thin (`1px`), medium (`2px`), heavy (`5px`), and double rules communicate hierarchy.
- Shadows appear only on project artifacts, where they suggest a captured object rather than a floating UI card.
- Project artifacts use a subtle static dot texture. The texture is decorative, contrast-safe, and removed in forced-colors mode.
- Paper has a very light radial dot texture in the page background. There is no overlay on text or controls.
- No large texture assets are shipped.

### Motion

- Quick state changes use `160ms`.
- Editorial reveals use `280ms`.
- Easing is `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- Allowed motion: rule reveal, short fade, small arrow movement, restrained state transition.
- Disallowed motion: parallax, paper crumpling, page turns, long image zooms, and delayed content.
- `prefers-reduced-motion` reduces all transitions and animations to effectively static behavior.

## 5. Components

### Masthead and section navigation

- **Purpose:** Establish Nyxxyr's publication identity and make routes obvious.
- **Anatomy:** Utility bar, text wordmark, studio descriptor, edition context, primary navigation.
- **Variants:** Wide masthead; mobile stacked masthead.
- **Behavior:** Navigation wraps at small widths. Every link has a 44 px target.
- **Accessibility:** The wordmark is an explicit link with an accessible name. Primary navigation is labeled.

### Kicker

- **Purpose:** Orient the reader by department, project, or story type.
- **Content limit:** One short line, ideally under 40 characters.
- **Variants:** Muted and accent.
- **Accessibility:** Not a heading. Pair with a real heading for structure.

### Metadata and tags

- **Purpose:** Provide date, reading time, role, tools, and category context.
- **Behavior:** Wraps without truncation. The slash separator is decorative.
- **Accessibility:** Use visible text instead of unexplained icons.

### Buttons and links

| Variant | Use | Style |
| --- | --- | --- |
| Primary | Main forward action | Ink block, reverse text |
| Secondary | Alternate action on light or dark surfaces | Bordered, transparent |
| Quiet | Inline editorial route | Underlined text-like control |

All controls have a 44 px minimum target, hover and active feedback, and a 3 px focus ring. Disabled controls keep readable text and a muted fill. Loading controls use `aria-busy` and a text label.

### Lead story

- **Purpose:** Lead the front page with the strongest project.
- **Anatomy:** Kicker, headline, dek, metadata, artifact, caption, short consequence, action.
- **Desktop:** Approximately eight columns with a supporting rail.
- **Mobile:** Single column with actions below copy.
- **Accessibility:** One headline link provides the main route; the action repeats it for stronger affordance.

### Supporting rail

- **Purpose:** Continue the issue without competing with the lead.
- **Anatomy:** Section header, numbered stories, one outcome feature.
- **Content:** Two to three stories. Long titles wrap rather than truncate.

### Project story card

- **Variants:** Wide seven-column and narrow five-column.
- **Anatomy:** Artifact, kicker, headline, summary, metadata, text action.
- **Responsive:** Wide and narrow variants become identical single-column stories below `48rem`.
- **Accessibility:** Only the headline carries the full-card route; avoid nested interactive elements.

### Project feature

- **Anatomy:** Breadcrumb, kicker, headline, dek, byline, artifact, project notes, reading copy, pull quote, outcome, next story.
- **Desktop:** Notes / copy / outcome grid.
- **Tablet:** Outcome moves below the reading flow.
- **Mobile:** Notes collapse, copy remains one measure, next-story action stacks.
- **Accessibility:** Uses one article, a single H1, then H2 sections. The drop cap is CSS-only and does not alter DOM text.

### Caption and artifact

- **Purpose:** Treat project imagery as evidence.
- **Anatomy:** Accessible visual name, visible caption, figure number.
- **Behavior:** Artifact composition scales without becoming horizontal scroll.
- **Accessibility:** The visual container has an `image` role and a descriptive name. No hidden interaction or unlabeled control lives inside the artifact.

### Outcome feature

- **Purpose:** Bring one approved result to the fore.
- **Anatomy:** Large value and plain-language label.
- **Accessibility:** The metric and label remain text, not an image.
- **Content:** Do not publish a metric without an explanation of what it measures.

### Pull quote

- **Purpose:** Create a deliberate reading pause.
- **Content limit:** One or two sentences.
- **Accessibility:** Uses a real `blockquote` and visible attribution.

### Contact and colophon

- **Purpose:** Provide a low-friction route to correspondence and disclose edition context.
- **Behavior:** Contact email remains a normal `mailto:` link. Replace the representative address before release.
- **Colophon:** Records the representative-content status and keeps secondary information quiet.

## 6. Page compositions

### Front page

1. Edition utility bar and text masthead.
2. Department navigation.
3. Dateline, editorial statement, and issue brief.
4. Dominant lead story with supporting rail and metric.
5. Asymmetric selected-work index.
6. Working-method band.
7. Contact strip.
8. Colophon.

### Project feature

1. Breadcrumb and newspaper-like story header.
2. Full-width press-style project artifact.
3. Structured project notes and long-form reading copy.
4. Pull quote and outcome.
5. Next-dispatch route.

### Design desk

The live route is [`/design-system`](../app/design-system/page.tsx). It presents direction, color, typography, spacing, rules, components, states, motion, review checklists, and access notes using the production tokens and components. The route is marked `noindex` and should be protected or omitted from a public build if necessary.

## 7. Accessibility

Target: WCAG 2.2 AA.

- The root page provides a skip link to `#main-content`.
- Each page has one main landmark and a logical heading sequence.
- Primary, footer, breadcrumb, and metadata navigation groups have accessible names.
- Focus is a consistent 3 px accent outline with 3 px offset.
- Interactive targets are at least 44 px high.
- Text contrast is at least 4.5:1; the lowest text role, muted ink, measures 7.67:1.
- The accent measures 7.19:1 against paper.
- Status colors are paired with text; color is not the only signal.
- Project visualizations use descriptive `img` roles and visible captions.
- Reduced motion removes animation and smooth scrolling.
- Forced-colors mode removes the artifact texture and preserves native colors for controls.
- The page has no horizontal overflow at 320 px.
- The article drop cap is decorative CSS and leaves the source text intact.

### Keyboard review

1. Press `Tab` on initial load: the skip link appears first.
2. Confirm every masthead, navigation, project, and footer link receives a visible ring.
3. Open a project with `Enter` and confirm focus starts on the new route's body.
4. Confirm disabled and loading samples are not part of the public navigation path.
5. Confirm the page remains usable at 200% zoom.

## 8. Responsive review

| Width | Result |
| --- | --- |
| `320px` | Single column, wrapped navigation, full-width primary actions, no overflow |
| `375px` | Single column with comfortable margins and intact metadata |
| `768px` | Single reading column; masthead and editorial sections stack deliberately |
| `1024px` | Editorial grids return; feature outcome supports article below |
| `1280px` | Lead and rail composition; asymmetric index |
| `1440px` | Full broadsheet composition with sustained reading measure |

## 9. Implementation map

| Concern | Path |
| --- | --- |
| Tokens, foundations, components | `app/globals.css` |
| Root metadata and shell | `app/layout.tsx` |
| Front page | `app/page.tsx` |
| Project feature route | `app/work/[slug]/page.tsx` |
| Living design desk | `app/design-system/page.tsx` |
| Reusable editorial components | `components/editorial.tsx` |
| Reusable site shell | `components/site-shell.tsx` |
| Press-style project artifacts | `components/project-art.tsx` |
| Representative project data | `lib/projects.ts` |
| Decisions and open questions | `docs/design-decisions.md` |

## 10. Release checklist

- Replace representative project names, roles, metrics, captions, and credits.
- Replace `hello@nyxxyr.studio` with the approved contact address.
- Confirm the edition date and volume are real site context.
- Decide whether `/design-system` remains noindex, is protected, or is excluded.
- Add approved case-study media and replace or refine the representative artifact compositions.
- Confirm site title, description, and social preview copy.
- Test with VoiceOver/NVDA, 200% zoom, forced colors, and reduced motion.
- Restore an approved accent only after checking contrast against every surface.

## 11. Open questions

- Are the four project stories representative or should they be replaced with live client work?
- Should project features include gallery, process, and team-credit modules?
- Is a dark reading mode required after validating the light paper experience?
- Should issue numbers, volume, and dateline be editorial site context or removed?
- Which contact workflow should replace the placeholder email?
- Should the design desk be internal-only in the first production release?
