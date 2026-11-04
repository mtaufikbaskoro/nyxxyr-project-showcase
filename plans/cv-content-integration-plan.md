# CV Content Integration Plan

**Status:** Proposed  
**Created:** 2026-11-04  
**Source:** `CV APRIL 2026.pdf`  
**Project:** `nyxxyr-project-showcase`  
**Stack:** Next.js 16 App Router, React 19, TypeScript

## 1. Objective

Replace the showcase's representative specimen content with a factual personal
portfolio for M Taufik Baskoro while preserving the existing editorial design,
project routes, GitHub showcase, and responsive behavior.

The result should:

- Present three CV-backed projects: Quantum Rekatama, Astra JM, and
  Dapodikdasmen Kota Medan.
- Introduce Taufik's role, experience, education, technical skills, and
  credentials without inventing case-study evidence.
- Use the CV email address and LinkedIn profile as the primary contact routes.
- Remove all visible placeholder names, specimen metrics, fake quotes, studio
  claims, and representative-content disclosures.
- Keep the GitHub showcase separate from the authored project stories.

This plan covers content replacement and the small schema/template changes
needed to display only verified information. It does not add a CMS, redesign the
showcase, or publish the CV as a downloadable document.

## 2. Source Facts

The CV provides the following approved portfolio facts:

| Area | Fact |
| --- | --- |
| Identity | M Taufik Baskoro |
| Current role | Programmer Specialist (Tenaga Ahli Programmer), Bappeda Kota Medan, July 2024 - Present |
| Previous role | Quality Assurance Intern, ICUBE by SIRCLO, November 2020 - May 2021 |
| Education | Bachelor of Information Technology, Universitas Sumatera Utara |
| Certification | BNSP / LSP Teknologi Digital Junior Web Programmer, valid through January 2028 |
| Training | Sanbercode ReactJS Bootcamp, score 91.75/100 |
| Additional certificate | Google IT Support Certificate, Digitalent Scholarship |
| Technical skills | HTML, CSS, JavaScript, ReactJS, TypeScript, Next.js, MySQL, PHP, Python, Microsoft Office |
| Public contact | `mtaufikbaskoro@gmail.com`; `https://www.linkedin.com/in/m-taufik-baskoro/` |

The CV also contains a phone number. It should not be made public by default.
Include it only after explicit confirmation because it is not needed for the
primary portfolio journeys and would increase exposure to automated scraping.

The CV does not provide project dates, client quotes, result percentages,
traffic figures, user counts, or production incident reductions. None of those
details should be inferred.

## 3. Recommended Positioning

Use a personal programmer portfolio voice rather than the current independent
studio voice.

- Display **M Taufik Baskoro** as the public identity.
- Describe the work as frontend development, government data systems, and
  software quality.
- Keep **Nyxxyr** only if it is a confirmed public alias or brand. Do not use
  "Nyxxyr Studio," "we," or "the studio" while the supplied source describes
  one person's experience.
- Lead with Astra JM because it best combines current government work,
  cross-agency data, and a clear public-service purpose.
- Use Quantum Rekatama second and Dapodikdasmen third.
- Present credentials as supporting evidence, not as a substitute for project
  outcomes.

## 4. Content Mapping

### 4.1 Project replacement

Replace the four representative projects with three projects:

| New slug | Public title | Kicker | Role shown |
| --- | --- | --- | --- |
| `astra-jm` | A shared view of Medan's SDG progress. | Civic data / Astra JM | Omit unless a specific role is supplied |
| `quantum-rekatama` | A clearer front door for an engineering firm. | Engineering web / Quantum Rekatama | Frontend Developer |
| `dapodikdasmen-medan` | One door to education data for Medan. | Education data / Dapodikdasmen | Omit unless a specific role is supplied |

Suggested project copy, using only CV facts:

#### Astra JM

- **Summary:** An application for monitoring Sustainable Development Goals
  achievements across Medan's local government, non-profit, and private-sector
  contributors.
- **Evidence:** Shared tracking across 17 SDG goals for evaluation and planning.
- **Lead:** Brings contributions from multiple organizations into one view so
  the city can evaluate progress and plan future sustainable development work.
- **Section one:** Create a collaborative data picture. The project connects
  local government agencies, non-profit institutions, and private-sector
  actors to the same SDG framework.
- **Section two:** Support planning, not just reporting. The application is
  designed to help Medan evaluate achievements and use that information for
  future planning.
- **Callout:** `17 / SDG goals represented in one tracking platform`
- **Quote:** Omit.

#### Quantum Rekatama

- **Summary:** A professional web presence for a Civil, Mechanical, and
  Electrical engineering firm focused on innovation and sustainability.
- **Evidence:** Component-based frontend work spanning a Meet the Team section
  and a portfolio of client projects.
- **Lead:** Translates a broad engineering practice into a web experience that
  makes its services, people, and client work easier to understand.
- **Section one:** Build a reusable page structure. The component-based
  implementation supports the team and portfolio sections without treating
  every content area as a one-off page.
- **Section two:** Make technical experience approachable. The interface
  emphasizes operational efficiency and future-ready infrastructure in clear,
  user-facing language.
- **Callout:** `Frontend Developer / Component-based engineering portal`
- **Quote:** Omit.

#### Dapodikdasmen Kota Medan

- **Summary:** A contribution to Medan's "one-door" data portal for primary
  and secondary education.
- **Evidence:** A shared information system for schools, students, and teaching
  staff.
- **Lead:** Gives education stakeholders one integrated place to work with
  school, student, and teaching-staff information.
- **Section one:** Reduce fragmented access. The portal is organized around a
  single entry point for education data rather than disconnected records.
- **Section two:** Make data transparency part of the design. The work focuses
  on accurate, integrated information for schools and the people who support
  them.
- **Callout:** `3 / audiences: schools, students, and teaching staff`
- **Quote:** Omit.

Do not publish the existing Northline resident metric, Common Shelf reading-list
metric, Field Atlas briefing count, Afterward handoff count, or any of their
quotes.

### 4.2 Homepage

Replace these specific specimen areas in `app/page.tsx`:

| Current content | Replacement direction |
| --- | --- |
| `Jakarta · Tuesday, 3 November 2026` | Use a non-dated portfolio edition label unless the owner wants a real dateline |
| "The project edition" | "Selected work / Web and data systems" |
| "Good digital work deserves a front page." | "Clear systems, useful interfaces, and careful implementation." |
| "Nyxxyr is an independent design and technology studio..." | Introduce Taufik as a BNSP-certified web programmer working across frontend development, government data systems, and software quality |
| Static issue stats `04 / 06 / 26` | Use factual values such as `03 / Projects`, `02 / Experience roles`, and `BNSP / Certified` |
| Hard-coded resident-first lead footer | Add a per-project `takeaway` field or use the selected project's evidence |
| "Four stories about..." | "Three projects across civic data, engineering, and education." |
| Placeholder contact address | `mtaufikbaskoro@gmail.com` plus the LinkedIn profile |

Add a short, CV-backed call to action near the contact area:

> Available for conversations about frontend development, civic data systems,
> and software quality.

This is a role preference rather than an employment-status claim. Remove
"Available" if the owner does not want to signal availability.

### 4.3 Experience and credentials

Repurpose the current three-card "Approach" section into a "Background" section
using the existing `principle-grid`, which already supports three items:

1. **Programmer Specialist / Bappeda Kota Medan**  
   Government and Human Development division, July 2024 - Present. Technical
   work supporting regional planning and collaboration with government
   officials.

2. **Quality Assurance Intern / ICUBE by SIRCLO**  
   November 2020 - May 2021. Functional and end-to-end testing, test-case
   documentation, bug identification, and quality management for public-facing
   websites.

3. **Education and credentials**  
   Bachelor of Information Technology, Universitas Sumatera Utara. BNSP Junior
   Web Programmer certification, Sanbercode ReactJS Bootcamp score of
   91.75/100, and Google IT Support Certificate.

Include the CV skills as compact tags or a metadata line using the existing
`tag` styles. Do not present the skills as proficiency levels because the CV
does not define them.

Update the navigation label from "Approach" to "Background" and change its
anchor from `#approach` to `#background`.

### 4.4 Site identity and contact

Update the shell in `components/site-shell.tsx`:

- Masthead: `M Taufik Baskoro` or the confirmed shorter public name.
- Descriptor: `Frontend development, civic data, and software quality.`
- Edition label: replace the specimen issue language with a factual portfolio
  label.
- Footer: replace the representative-content disclaimer with a concise personal
  description and links to email, LinkedIn, and GitHub.
- Contact: use `mtaufikbaskoro@gmail.com`; add LinkedIn as a second action.
- Copyright: use `M Taufik Baskoro` and the current year.

Update root metadata in `app/layout.tsx`:

- Default title: `M Taufik Baskoro - Web programmer`
- Application name: `M Taufik Baskoro Portfolio`
- Author: `M Taufik Baskoro`
- Description: a fact-based sentence covering frontend development, civic data,
  and government systems.

## 5. Data Model Changes

Keep `lib/projects.ts` as the authored project source, but make unsupported
case-study fields optional so the UI cannot manufacture evidence.

Recommended changes:

```ts
type Project = {
  slug: string;
  index: string;
  kicker: string;
  title: string;
  summary: string;
  period?: string;
  role?: string;
  focus: string;
  readingTime: string;
  takeaway: string;
  evidence?: {
    value: string;
    label: string;
  };
  githubRepository?: string;
  theme: "civic" | "engineering" | "education";
  imageAlt: string;
  caption: string;
  story: {
    lead: string;
    sections: ProjectStorySection[];
    quote?: {
      text: string;
      attribution: string;
    };
  };
};
```

Rules:

- Omit `period` until the owner supplies project dates.
- Omit `role` for Astra JM and Dapodikdasmen until a specific role is confirmed.
- Replace the visible "Tools" label with "Focus" because the CV does not map
  every technology to each project.
- Render the evidence callout only when `evidence` exists.
- Render the pull quote only when an approved quote exists.
- Add `githubRepository` only after confirming the repository is the same
  project. The current GitHub allowlist suggests `qr-vue` and
  `frontend-aplikasi-sdgs` may match Quantum Rekatama and Astra JM, but this
  must be verified before linking them as project evidence.

Add a `profile` export or a small `lib/profile.ts` module for the shared name,
summary, email, LinkedIn URL, skills, experience, and credentials. Use one
source across the homepage, shell, metadata, and future background content.
Avoid duplicating the email and identity in multiple components.

## 6. Component and Visual Changes

### Project feature template

Update `app/work/[slug]/page.tsx`:

- Replace "Words by Nyxxyr Studio" with `Words by M Taufik Baskoro`.
- Show "Focus" instead of "Tools."
- Omit unknown dates and roles cleanly.
- Replace "What changed" plus the specimen disclaimer with "Project scope" or
  "What this project does," based on the optional evidence object.
- Hide the pull quote when it is absent.
- Keep next-project navigation working with three projects.

Update `components/editorial.tsx`:

- Allow project metadata to omit missing values.
- Keep `Metric` as the shared evidence visual if useful, but do not require a
  metric on every project.

### Project artwork

Update `components/project-art.tsx` and the related selectors in
`app/globals.css`:

- Replace Northline civic art with an Astra JM SDG monitoring composition.
- Replace Common Shelf library art with a Dapodikdasmen education data portal.
- Replace Field Atlas and Afterward art with Quantum Rekatama engineering
  content.
- Reduce `ProjectTheme` to `civic`, `engineering`, and `education`.
- Remove unreferenced climate and care art code once the project records no
  longer use it.
- Keep all artwork clearly illustrative unless approved screenshots are
  supplied. Do not label an illustration as a product screenshot.
- Write alt text that describes the composition and explains its project role.

The visuals should reflect the new content while reusing the existing art-shell,
toolbar, typography, and responsive layout patterns.

## 7. Files to Change

| File | Planned change |
| --- | --- |
| `lib/projects.ts` | Replace four specimen projects with three CV-backed projects; revise the project type |
| `lib/profile.ts` | Add shared personal/contact/background data, or export the same shape from `lib/projects.ts` |
| `app/page.tsx` | Replace front-page identity, counts, story copy, background section, and contact actions |
| `app/work/[slug]/page.tsx` | Personalize byline and conditionally render verified metadata/evidence/quotes |
| `app/layout.tsx` | Replace Nyxxyr metadata with personal portfolio metadata |
| `components/site-shell.tsx` | Update identity, navigation, footer, email, LinkedIn, and GitHub links |
| `components/editorial.tsx` | Handle optional project metadata without empty labels |
| `components/project-art.tsx` | Replace placeholder project visuals and theme map |
| `app/globals.css` | Add/reuse the three new visual themes; remove dead placeholder themes |
| `app/design-system/page.tsx` | Replace Northline specimen content with personal project examples |
| `README.md` | Rename and document the personal portfolio |
| `docs/design-guide.md` | Replace representative-content references and update the release checklist |
| `docs/design-decisions.md` | Record source-of-truth and evidence decisions |

`data/github-showcase.ts`, `data/github-showcase-fallback.json`, and
`lib/github-showcase.ts` should remain unchanged unless repository matching is
approved.

## 8. Implementation Sequence

1. Confirm the public name, whether Nyxxyr is a personal alias, and whether the
   phone number should remain private.
2. Confirm the two possible GitHub-to-project matches and any missing project
   dates or roles.
3. Create the shared profile data and revise the project type.
4. Replace the four project records with the three CV-backed records.
5. Update the homepage, background section, shell, metadata, and contact links.
6. Update the project feature template and remove fabricated metric/quote
   rendering.
7. Replace project artwork and remove obsolete theme code.
8. Update the design-system examples and project documentation.
9. Run lint, production build, and focused visual checks.

Before editing framework code, read the relevant Next.js 16 guide under
`node_modules/next/dist/docs/`, as required by `AGENTS.md`.

## 9. Verification

### Content integrity

- No visible occurrence of Northline, Common Shelf, Field Atlas, Afterward,
  Nyxxyr Studio, the placeholder email, or representative project metrics.
- Every project claim can be traced to the CV or an explicitly supplied fact.
- Unsupported dates, roles, outcomes, and quotes are omitted.
- The phone number is not rendered.
- Email, LinkedIn, and GitHub links are correct.

### Routes and behavior

- `/` renders three project cards and a useful background section.
- `/work/astra-jm`, `/work/quantum-rekatama`, and
  `/work/dapodikdasmen-medan` are generated.
- Next-project navigation cycles across the three routes.
- Unknown project slugs still return the existing 404.
- The GitHub section still renders with live data or its fallback snapshot.

### Visual and accessibility checks

- Inspect the homepage and all three project pages at 1440, 768, and 320 px.
- Confirm no horizontal overflow and no clipped long project titles.
- Check heading order, focus visibility, link names, image descriptions, and
  keyboard navigation.
- Confirm absent optional fields leave no empty definition-list rows, labels,
  quote blocks, or spacing gaps.
- Verify 200% zoom and reduced motion.

### Commands

```bash
npm run lint
npm run build
```

If Turbopack is blocked by the local sandbox, use the supported fallback:

```bash
npx next build --webpack
```

## 10. Acceptance Criteria

The content integration is complete when:

- The site presents M Taufik Baskoro as the author, not a fictional studio.
- The three CV projects appear as the only authored case studies.
- Experience, education, certifications, and technical skills are represented
  without invented proficiency or outcome claims.
- The public email and LinkedIn profile replace the placeholder contact.
- No placeholder project, quote, metric, disclosure, or artwork text remains.
- The existing editorial design and GitHub showcase continue working.
- Lint, build, route generation, and responsive visual checks pass.

## 11. Decisions Needed Before Implementation

1. Should the public identity be `M Taufik Baskoro`, `Taufik Baskoro`, or a
   retained `Nyxxyr` alias?
2. Should the phone number be published? Recommended default: no.
3. Are `qr-vue` and `frontend-aplikasi-sdgs` the correct repositories for
   Quantum Rekatama and Astra JM?
4. Are project dates and specific roles available for Astra JM and
   Dapodikdasmen?
5. Are approved project screenshots or testimonials available? If not, use the
   illustrative artifacts and omit quotes.
