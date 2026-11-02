# Design Guide Plan: Nyxxyr Project Showcase

## Creative direction

**Old-newspaper editorial:** the showcase should feel like reading a considered, contemporary newspaper page, with the project work presented as the day's most important stories. Use the hierarchy, typography, rules, columns, captions, and wit of print without reproducing physical damage or sacrificing digital usability.

**Status:** Draft  
**Created:** 2026-11-03  
**Project:** `nyxxyr-project-showcase`  
**Primary stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript

## 1. Objective

Create a project-specific design guide that gives the showcase the character of an old newspaper while remaining fast, legible, accessible, and clearly digital. The interface should invite reading, create a strong sense of editorial hierarchy, and make each project feel like a story worth opening.

The design guide should:

- Define a coherent old-newspaper editorial direction rather than a collection of sepia filters and decorative props.
- Document reusable color, typography, spacing, layout, motion, and component rules.
- Translate those rules into Tailwind CSS variables and reusable React patterns.
- Include a live component reference where implementation and documentation can be compared.
- Treat project imagery, headlines, captions, and outcomes as the primary editorial content.
- Be practical enough that a new screen can be built without guessing.

## 2. Working assumptions

These assumptions should be confirmed during discovery:

- The site is a public portfolio or showcase for Nyxxyr's selected projects.
- Primary audiences are potential clients, collaborators, and employers.
- Project discovery, project detail, and contact are the core user journeys.
- Visitors should encounter a newspaper-like reading experience immediately, not after navigating to a themed section.
- The first release uses real or representative project content rather than placeholder case studies.
- The baseline appearance is warm, paper-like, and light; dark mode is not required for the first release.
- English is the initial content language.

## 3. Success criteria

The design guide phase is complete when:

- The audience, site purpose, and intended brand impression are documented.
- The old-newspaper direction is interpreted through a specific editorial model and recorded with rationale.
- The front page is recognizable as a newspaper-inspired interface within the first viewport without using a fake masthead image or destructive paper effects.
- Editorial hierarchy, not decoration, communicates what to read first, second, and next.
- Design tokens are implemented centrally instead of being scattered across components.
- Core components have documented variants, states, responsive behavior, and accessibility requirements.
- A live design-system reference demonstrates every foundational token and core component.
- The showcase's main page follows the documented system.
- Keyboard navigation, visible focus, reduced motion, and color contrast have been verified.
- The system works at 320 px through wide desktop sizes.
- Design decisions and open questions are recorded so future work has context.

## 4. Scope

### In scope

- Brand and visual-direction exploration.
- Color, typography, spacing, sizing, radius, border, elevation, and motion foundations.
- Newspaper-specific editorial patterns: masthead, section navigation, dateline, kicker, byline, lead story, multi-column copy, captions, pull quotes, folio, and colophon.
- Responsive layout principles.
- Navigation and site-shell patterns.
- Project stories, project cards, metadata, filters or tags, buttons, links, press-style imagery, and case-study content patterns.
- Loading, hover, focus, disabled, and error-state guidance where relevant.
- Accessibility and performance requirements.
- A living style-guide page and written documentation.
- Applying the system to the primary showcase page.

### Out of scope for the first pass

- A full brand-identity program such as logo redesign, stationery, or a complete marketing campaign.
- CMS selection or migration.
- A large illustration or icon-library commission.
- Complex animation unless it supports project storytelling.
- Publishing every final case-study asset and all production copy.
- Simulating paper tears, stains, folds, tape, crumples, or physical page turns throughout the live interface.
- Using a low-contrast visual treatment to make the site appear authentically aged.

## 5. Discovery and decision baseline

1. Inventory the current page, content, assets, and constraints.
2. Define the intended visitor: what they should feel, understand, and do within the first minute.
3. Identify the three primary journeys: landing, browsing projects, and opening a project or contacting Nyxxyr.
4. Gather historical newspaper references for mastheads, headline hierarchy, grids, captions, rules, and section naming; gather contemporary editorial references for how those traits translate to digital interaction.
5. Audit three to five reference sites for layout, typography, motion, and project presentation; record what to adopt and what to avoid.
6. Choose the desired newspaper register: serious broadsheet, energetic tabloid, or literary supplement. Whichever is selected, the tone should remain contemporary and appropriate for Nyxxyr.
7. Define how project names function as headlines and how concise summaries, dates, roles, tools, and outcomes function as story metadata.
8. Create a decision log for choices that affect editorial voice, print motifs, theme support, content structure, and implementation architecture.

**Deliverables**

- One-page discovery brief.
- Experience principles.
- Content and asset inventory.
- Reference board with annotations.
- Decision log.

**Checkpoint:** The concept is specific enough to guide page composition, and the content model supports a newspaper-like hierarchy without forcing projects into misleading or artificial stories.

## 6. Visual direction

1. Explore two or three interpretations of the old-newspaper direction: a restrained broadsheet, a bold tabloid, and a quieter literary supplement.
2. Show each interpretation using the same representative content: masthead, section navigation, lead project, supporting project stories, and a case-study introduction.
3. Evaluate each interpretation for originality, readability, responsive behavior, accessibility, and fit with the project work. Favor the interpretation that remains usable when its decorative details are removed.
4. Select one interpretation and document its defining traits, motifs, typographic voice, and constraints.
5. Define “newspaper” through composition: expressive headline hierarchy, asymmetric story placement, modular columns, rules, captions, and editorial pacing.
6. Treat imagery as press photography: project screenshots, details, and outcomes should have informative captions rather than existing only as decoration.

### Direction guardrails

- **Always:** preserve generous reading measure, obvious navigation, consistent interaction affordances, and a clear path into each project.
- **Sometimes:** use subtle paper grain, halftone image treatment, drop caps, ornamental rules, or issue-style metadata where they strengthen the editorial concept.
- **Avoid:** faux aging that lowers contrast, immersive page-flipping, tiny dense type, ornamental icons replacing labels, and every card becoming a faux newspaper clipping.

**Deliverables**

- Direction boards for desktop and mobile.
- A short comparison and recommendation.
- Selected direction with explicit “always” and “avoid” rules.

**Checkpoint:** Nyxxyr reads as a distinctive digital newspaper rather than a generic portfolio wearing a serif font and beige background.

## 7. Design foundations

Document and implement the following:

### Color

- Build around a restrained ink-and-paper palette: warm off-white or newsprint-toned canvas, near-black ink, slightly muted secondary ink, and one editorial accent such as oxidized red or deep blue.
- Define primitive palette values and semantic roles: paper, ink, muted ink, rule, accent, reverse text, image overlay, and status colors.
- Use the accent primarily for section labels, links, active states, and other editorial signals; do not use it as a decorative wash over large areas.
- Define how the palette behaves over project imagery and within captions, pull quotes, notices, and the footer.
- Target a paper-like appearance without making the paper yellow enough to reduce contrast or make every surface feel artificially antique.
- Keep controls visually distinct from body copy even when they use the same ink palette.

### Typography

- Select a high-contrast or condensed editorial serif for masthead and headlines, a highly readable serif for long-form body copy, and a restrained sans or mono face for labels, navigation, metadata, and controls.
- Use Web fonts only after checking licensing, file size, fallback metrics, and rendering across platforms.
- Define a type scale for masthead, lead headline, section headline, story headline, dek, body, caption, kicker, byline, navigation, and folio.
- Set line-height, tracking, weight, maximum measure, and responsive behavior for each role.
- Use all-caps small labels sparingly and with adequate letter spacing; avoid long all-caps passages.
- Permit drop caps and pull quotes only when they do not interrupt keyboard, screen-reader, or text-resize behavior.
- Preserve a clear distinction between editorial voice and interface language so users can still recognize buttons, filters, and navigation.

### Space and layout

- Define a spacing scale tied to a readable baseline rhythm.
- Use a responsive 12-column editorial grid at wide sizes, collapsing deliberately as content width decreases.
- Design the front page around a dominant lead project, a secondary column, and a supporting story rail rather than a uniform grid of equal cards.
- Establish rules for column counts, gutters, column rules, section separators, image spans, and headline spans.
- Keep body-copy measure readable even when the surrounding layout resembles a broadsheet.
- On mobile, reduce to a single reading column. Carry the newspaper identity through hierarchy, rules, kickers, captions, and metadata rather than horizontal scrolling or miniature columns.
- Define breakpoints based on grid and composition changes rather than device names.

### Surface and form

- Prefer square corners, crisp rules, dividers, and occasional offset blocks over rounded cards, soft shadows, and glass effects.
- Define thin, medium, and heavy rule tokens, including double-rule patterns for major editorial divisions.
- Treat borders and rules as structural information, not ornament alone.
- Define press-style image treatment: preferred aspect ratios, cropping, optional halftone or duotone variants, and rules for legibility over media.
- Use captions, credit lines, and image labels intentionally so images read as editorial evidence.
- Use very subtle grain or texture only if it remains static, lightweight, and contrast-safe; provide a no-texture fallback.
- Design a high-contrast focus indicator and minimum 44-by-44 px interactive targets. Newspaper styling must not excuse small or ambiguous controls.

### Motion

- Keep motion restrained and editorial: quick fades, rule reveals, restrained image zooms, and state transitions rather than page flips or paper-crumpling effects.
- Define short duration and easing tokens that make interactions feel immediate.
- Use motion to reinforce hierarchy or state change, never to imitate turning newsprint.
- Honor `prefers-reduced-motion` with a complete static experience.
- Avoid large animated textures, parallax, and effects that compete with reading or delay access to project content.

**Implementation requirement:** Expose tokens through CSS custom properties and Tailwind's `@theme` so components consume semantic roles instead of hard-coded values.

**Deliverables**

- Token table in the written guide.
- Implemented token definitions in `app/globals.css`.
- Desktop, tablet, and mobile spacing/layout examples.

**Checkpoint:** A new component can be designed using only documented tokens.

## 8. Component and pattern library

Define the smallest useful system rather than a large generic UI kit.

### Core primitives

- Editorial text links with clear hover, focus, and visited behavior.
- Button-style links and buttons, with primary, secondary, and quiet variants styled as decisive print controls rather than generic pills.
- Kickers, section labels, tags, and project-category labels.
- Dateline, issue number, byline, reading-time, caption, and image-credit patterns.
- Icons and icon-button behavior.
- Focus, hover, active, disabled, loading, and error states.

### Showcase components

- Newspaper masthead with a text-first Nyxxyr identity, issue-style context, and a clear digital navigation affordance.
- Responsive section navigation that reads like newspaper departments while remaining immediately recognizable as a website menu.
- Front-page lead story block with headline, dek, project image, caption, metadata, and a direct route into the project.
- Supporting project story cards with image, kicker, headline, summary, metadata, and an obvious read-more affordance.
- Editorial project index combining a lead item, secondary stories, and optional filters or tags.
- Pull quote, metric or outcome feature, image gallery, caption cluster, and section-break patterns for project details.
- Case-study section headings and project-to-project navigation.
- Contact call to action framed as correspondence without obscuring that it is a contact link.
- Footer or colophon with navigation, credits, year, and quiet secondary information.

For each component, document:

- Purpose and when to use it.
- Anatomy and available variants.
- Content limits and empty/long-content behavior.
- Desktop, tablet, and mobile behavior.
- Hover, focus, pressed, and disabled states as applicable.
- Keyboard and screen-reader expectations.
- Relevant tokens and implementation path.
- Its editorial role: when it should lead, support, summarize, or interrupt the story.

**Checkpoint:** The party trick is the page's editorial composition, not a pile of themed components. The same project markup remains readable with most print styling removed.

## 9. Living design-guide page

Create an internal design-system route that renders the real implementation.

Suggested route: `/design-system`

The page should include:

- Visual-direction summary and principles.
- A front-page composition specimen showing the masthead, lead story, secondary story, and section rhythm.
- Color roles with contrast notes.
- Newspaper type specimens: masthead, headline levels, dek, body, caption, kicker, byline, and folio.
- Spacing, column, rule, image-treatment, and responsive-layout samples.
- Motion examples, including reduced-motion behavior.
- Every core component in its supported states.
- A “what makes this feel like a newspaper” checklist and an “avoid fake aged-paper effects” checklist.
- Notes on accessibility constraints and preferred usage.

Present the guide as a working style desk rather than a generic component catalog. Before implementation, read the relevant Next.js 16 guide under `node_modules/next/dist/docs/` as required by the repository's `AGENTS.md`. Mark the route as an internal development reference or protect it before any public release.

**Checkpoint:** Documentation and code use the same source of truth and can be reviewed in a browser.

## 10. Showcase application

1. Establish the front-page hierarchy: masthead, short editorial introduction, lead project, supporting projects, contact path, and colophon.
2. Build the site shell and responsive navigation with the newspaper section model.
3. Implement the lead story, project story cards, project index, and contact path.
4. Add a representative project-detail template that reads as a feature article rather than a generic case-study stack.
5. Replace generic default metadata, fonts, icons, and imagery with project-specific choices.
6. Remove newspaper-style props unless they communicate hierarchy, context, or project meaning.
7. Check that every visual decision maps back to a token, component rule, or documented exception.

**Checkpoint:** The primary page feels like the front page of Nyxxyr's publication. A visitor can scan it quickly, understand the hierarchy, and choose a project to read without first learning a novel interaction model.

## 11. Quality and validation

### Accessibility

- Target WCAG 2.2 AA.
- Verify text contrast at 4.5:1 and large-text contrast at 3:1.
- Ensure full keyboard operation and visible, consistent focus.
- Test at 200% zoom and with 320 px viewport width.
- Include reduced-motion behavior and meaningful alternative text.
- Maintain a logical heading order and landmark structure.
- Verify that decorative rules, texture, drop caps, and display type do not break text resizing, zoom, forced colors, or screen-reader order.
- Ensure navigation, buttons, and links remain clearly interactive despite the editorial visual language.

### Responsiveness

- Test representative widths around 320, 375, 768, 1024, 1280, and 1440 px.
- Verify column collapse, content reflow, image cropping, caption placement, navigation behavior, and target size.

### Content resilience

- Test long project names, missing summaries, portrait and landscape media, and dense metadata.
- Test headline and dek lengths that could break the intended front-page composition.
- Confirm useful empty and unavailable states for any filters or dynamic content.

### Performance and polish

- Optimize image dimensions and formats through Next.js image handling.
- Avoid layout shift from fonts and media.
- Use animation only where it improves comprehension or interaction feedback.
- Keep texture and image treatments lightweight; do not ship oversized decorative assets.
- Check the development and production builds with linting, keyboard testing, and browser-level visual review.

**Checkpoint:** Accessibility, responsive, content, and performance checks are recorded with fixes or accepted exceptions.

## 12. Delivery sequence

| Milestone | Outcome | Review gate |
| --- | --- | --- |
| M0: Baseline | Discovery brief, assumptions, decision log | Purpose and audience agreed |
| M1: Direction | Broadsheet, tabloid, and literary-supplement interpretations | One old-newspaper interpretation selected |
| M2: Foundations | Ink-and-paper tokens, editorial type scale, column system, and motion rules | New component can use the foundations |
| M3: Component system | Masthead, story patterns, primitives, and states | Editorial role and accessibility reviewed |
| M4: Applied showcase | Newspaper-style front page and design-system reference live | Desktop and mobile review passes |
| M5: Handoff | Final guide, checks, exceptions, and next steps | Acceptance criteria met |

## 13. Planned outputs

- `docs/design-guide.md`: the practical, project-specific design guide.
- `docs/design-decisions.md`: choices, rationale, and accepted tradeoffs.
- `app/globals.css`: semantic design tokens and global foundations.
- Reusable project-specific components, organized only after confirming the Next.js 16 conventions.
- A live `/design-system` reference page.
- A newspaper-style showcase page that demonstrates the system in production-like content.

File and route names are preliminary and should be adjusted to the final component architecture.

## 14. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| The old-newspaper direction becomes costume-like | Make hierarchy, grid, typography, and editorial pacing carry the concept; remove any decorative effect that does not help orientation or storytelling |
| The page feels old-fashioned in the wrong way | Use contemporary spacing, responsive behavior, interaction patterns, and project presentation with historical print references |
| Dense columns and display type reduce readability | Set conservative measure and line-height, test real copy, and collapse to one column on smaller screens |
| Texture and low-contrast sepia reduce accessibility | Keep the reading palette contrast-first and test with forced colors and zoom |
| Token definitions drift from usage | Build the living guide from the same primitives used by production components |
| Accessibility is treated as a final audit | Add requirements to each component definition and test states during implementation |
| Placeholder content hides layout problems | Stress-test with realistic long and short content early |
| Paper metaphors obscure digital interaction | Pair every editorial label with familiar navigation and control cues; use semantic HTML and test with users |
| Decoration competes with project work | Give project headlines, imagery, captions, and outcomes priority over ornamental details |

## 15. Decisions needed before implementation

- Confirm the primary audience and desired visitor takeaway.
- Confirm whether the first release is a one-page showcase or includes project-detail pages.
- Choose the newspaper register: restrained broadsheet, bold tabloid, or quiet literary supplement.
- Choose the editorial accent color and decide whether a subtle paper texture is included.
- Define the voice for masthead labels, section names, and calls to action so they feel clever rather than forced.
- Confirm whether issue numbers, dates, and newspaper-style metadata represent real project facts, editorial site context, or a fictional publication identity.
- Confirm availability of real project imagery, outcomes, and copy.
- Decide whether a dark reading mode is needed after the core light, paper-like experience is validated.
- Decide whether `/design-system` should remain internal, be protected, or be omitted from the production build.
