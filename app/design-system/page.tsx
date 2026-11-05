import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ButtonLink,
  Kicker,
  MetaList,
  Metric,
  PullQuote,
  SectionHeading,
  StoryCard,
} from "@/components/editorial";
import { ProjectArt } from "@/components/project-art";
import { getProfile } from "@/lib/queries/profile";
import { getPublishedProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Design desk",
  description:
    "The living editorial design system for M Taufik Baskoro's project portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

const colors = [
  {
    name: "Paper",
    token: "--paper",
    value: "#F4F0E6",
    role: "Page canvas",
    contrast: "Reference",
  },
  {
    name: "Ink",
    token: "--ink",
    value: "#171512",
    role: "Primary text",
    contrast: "16.01:1",
  },
  {
    name: "Muted ink",
    token: "--ink-muted",
    value: "#514A41",
    role: "Secondary text",
    contrast: "7.67:1",
  },
  {
    name: "Rule",
    token: "--rule",
    value: "#746C60",
    role: "Borders, rules",
    contrast: "4.55:1",
  },
  {
    name: "Editorial red",
    token: "--accent",
    value: "#8F2D22",
    role: "Kickers, links, active states",
    contrast: "7.19:1",
  },
  {
    name: "Reverse",
    token: "--paper-reverse",
    value: "#FBF8F1",
    role: "Text on ink",
    contrast: "15.58:1",
  },
];

const typeSpecimens = [
  {
    className: "type-masthead",
    label: "Masthead / 120–218 px",
    sample: "Taufik Baskoro",
  },
  {
    className: "type-display",
    label: "Lead headline / 44–96 px",
    sample: "Clarity has a point of view.",
  },
  {
    className: "type-headline",
    label: "Section headline / 32–52 px",
    sample: "The work behind the work.",
  },
  {
    className: "type-story",
    label: "Story headline / 24–34 px",
    sample: "A calmer handoff from clinic to home.",
  },
  {
    className: "type-dek",
    label: "Dek / 18–24 px",
    sample:
      "A short introduction that gives the reader a reason to continue.",
  },
  {
    className: "type-body",
    label: "Body / 17–19 px",
    sample:
      "Long-form copy stays within a 62–68 character measure, with a 1.65 line height and generous space between sections.",
  },
  {
    className: "type-caption",
    label: "Caption and folio / 12–14 px",
    sample: "Fig. 01 · A plain-language route into a complex service.",
  },
  {
    className: "type-label",
    label: "Kicker and navigation / 11–13 px",
    sample: "Civic systems / Selected work",
  },
];

const checks = {
  keep: [
    "A text-first masthead with real edition context",
    "A dominant lead story followed by a supporting rail",
    "Expressive headline sizes and deliberate reading measure",
    "Thin and heavy rules that clarify structure",
    "Informative captions for every project artifact",
    "Familiar links, buttons, and section names",
  ],
  avoid: [
    "Sepia filters or yellow paper that reduce contrast",
    "Tears, stains, folds, tape, or page-turn effects",
    "Tiny all-caps paragraphs or dense miniature columns",
    "Uniform clipping cards for every story",
    "Ornamental icons that replace visible labels",
    "Motion that delays access to project content",
  ],
};

export default async function DesignSystemPage() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
  ]);
  const featuredProject = projects[0];

  if (!featuredProject || !projects[1] || !projects[2]) {
    notFound();
  }

  return (
    <main id="main-content" className="page-shell design-desk">
      <section className="desk-hero" aria-labelledby="desk-title">
        <div className="desk-hero__stamp">
          <span>Internal reference</span>
          <span>Living guide / 01</span>
        </div>
        <div className="desk-hero__copy">
          <Kicker accent>The style desk</Kicker>
          <h1 id="desk-title">A newspaper system built for the screen.</h1>
          <p>
            This is the working reference for M Taufik Baskoro&apos;s project
            portfolio. It documents the restrained broadsheet direction and
            renders the same tokens and components used by the live pages.
          </p>
        </div>
        <aside className="desk-hero__note">
          <span>Selected direction</span>
          <strong>Restrained broadsheet</strong>
          <p>
            Contemporary editorial pacing, asymmetric hierarchy, and print-like
            rules without simulated paper damage.
          </p>
        </aside>
      </section>

      <section className="guide-section" aria-labelledby="direction-title">
        <SectionHeading
          id="direction-title"
          eyebrow="01 / Direction"
          title="The page should feel edited, not themed."
          note="Composition carries the concept. If the rules and grid were removed, the project hierarchy would still be obvious."
        />
        <div className="direction-grid">
          <article>
            <span>01</span>
            <h3>Lead with consequence</h3>
            <p>
              A lead story gets the strongest headline, image, and CTA. The rail
              supports it rather than competing with it.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Let evidence speak</h3>
            <p>
              Project screenshots act as reported evidence. Every visual gets a
              precise caption and a meaningful accessible name.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Use the familiar</h3>
            <p>
              Navigation, links, and buttons remain conventional. Editorial
              character is expressed through type and structure, not mystery
              interactions.
            </p>
          </article>
        </div>
      </section>

      <section className="guide-section" aria-labelledby="color-title">
        <SectionHeading
          id="color-title"
          eyebrow="02 / Color"
          title="Ink and paper, with one editorial signal."
          note="Contrast ratios are measured against paper. The red is reserved for orientation and action."
        />
        <div className="swatch-grid">
          {colors.map((color) => (
            <article className="swatch" key={color.token}>
              <div
                className="swatch__chip"
                style={{ backgroundColor: `var(${color.token})` }}
                aria-hidden="true"
              />
              <div className="swatch__copy">
                <p className="kicker">{color.name}</p>
                <code>{color.token}</code>
                <p>{color.role}</p>
                <span>{color.value} · {color.contrast}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="status-row">
          <span className="status status--success">Success</span>
          <span className="status status--warning">Notice</span>
          <span className="status status--danger">Error</span>
          <p>All status labels meet 4.5:1 or better against paper.</p>
        </div>
      </section>

      <section className="guide-section" aria-labelledby="type-title">
        <SectionHeading
          id="type-title"
          eyebrow="03 / Typography"
          title="A publication voice with interface manners."
          note="System serif stacks keep delivery fast and resilient. Labels use a restrained grotesque stack."
        />
        <div className="type-specimens">
          {typeSpecimens.map((type) => (
            <article className="type-specimen" key={type.label}>
              <p className="type-specimen__label">{type.label}</p>
              <p className={type.className}>{type.sample}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-section" aria-labelledby="layout-title">
        <SectionHeading
          id="layout-title"
          eyebrow="04 / Space and structure"
          title="A twelve-column grid with a single-column reading habit."
          note="Composition changes at 48 rem and 72 rem. Mobile resolves to one column without horizontal article scrolling."
        />
        <div className="layout-specimen" aria-label="Twelve column grid example">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index}>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </span>
          ))}
          <div className="layout-specimen__story">Lead story / span 8</div>
          <div className="layout-specimen__rail">Rail / span 4</div>
        </div>
        <div className="token-strip">
          <span>4 px</span>
          <span>8 px</span>
          <span>12 px</span>
          <span>16 px</span>
          <span>24 px</span>
          <span>32 px</span>
          <span>48 px</span>
          <span>64 px</span>
          <span>96 px</span>
        </div>
        <div className="rule-specimen">
          <div>
            <span className="rule rule--thin" />
            <p>Thin / 1 px</p>
          </div>
          <div>
            <span className="rule rule--medium" />
            <p>Medium / 2 px</p>
          </div>
          <div>
            <span className="rule rule--heavy" />
            <p>Heavy / 5 px</p>
          </div>
          <div>
            <span className="rule rule--double" />
            <p>Double / 6 px</p>
          </div>
        </div>
      </section>

      <section className="guide-section" aria-labelledby="components-title">
        <SectionHeading
          id="components-title"
          eyebrow="05 / Components"
          title="The smallest set that can publish a project."
          note="Editorial labels do not replace control affordances. Links and buttons remain conventional and visibly interactive."
        />
        <div className="component-specimen">
          <div className="component-specimen__label">
            <Kicker>Actions</Kicker>
            <p>Primary, secondary, quiet, disabled, and loading states.</p>
          </div>
          <div className="button-row">
            <ButtonLink href="#components-title">Primary action</ButtonLink>
            <ButtonLink href="#components-title" variant="secondary">
              Secondary action
            </ButtonLink>
            <ButtonLink href="#components-title" variant="quiet">
              Quiet action
            </ButtonLink>
            <button className="button button--primary" disabled>
              Disabled
            </button>
            <button className="button button--secondary" aria-busy="true">
              <span className="loading-mark" aria-hidden="true" />
              Loading
            </button>
          </div>
        </div>
        <div className="component-grid">
          <article className="specimen-card">
            <Kicker accent>Labels and metadata</Kicker>
            <h3>{featuredProject.kicker}</h3>
            <p>
              Kickers orient the reader. Metadata adds context without becoming
              a second headline.
            </p>
            <MetaList
              items={[featuredProject.focus, featuredProject.readingTime]}
            />
            <div className="tag-row">
              {profile.skills.slice(0, 3).map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </article>
          <article className="specimen-card">
            <Kicker>Captions</Kicker>
            <figure>
              <ProjectArt project={featuredProject} size="compact" />
              <figcaption>
                <span>{featuredProject.caption}</span>
                <span>Fig. 01</span>
              </figcaption>
            </figure>
          </article>
          <article className="specimen-card specimen-card--dark">
            <Kicker>Conditional project evidence</Kicker>
            {featuredProject.evidence ? (
              <Metric
                value={featuredProject.evidence.value}
                label={featuredProject.evidence.label}
              />
            ) : null}
          </article>
          <article className="specimen-card">
            <Kicker>Pull quote / optional</Kicker>
            <PullQuote>
              Project evidence appears only when it can be supported.
            </PullQuote>
          </article>
        </div>
        <div className="story-shelf">
          <StoryCard project={projects[1]} orientation="narrow" />
          <StoryCard project={projects[2]} orientation="narrow" />
        </div>
      </section>

      <section className="guide-section" aria-labelledby="states-title">
        <SectionHeading
          id="states-title"
          eyebrow="06 / States and motion"
          title="Feedback is quick, visible, and quiet."
          note="Hover, focus, press, and motion all defer to the reader. Reduced motion keeps every state change legible."
        />
        <div className="state-grid">
          <a className="specimen-link" href="#states-title">
            Editorial text link
          </a>
          <button className="button button--secondary" type="button">
            Focus this control
          </button>
          <div className="notice" role="note">
            <strong>Notice</strong>
            <span>Use a short, actionable message here.</span>
          </div>
          <div className="notice notice--error" role="alert">
            <strong>Unable to load</strong>
            <span>Try again or contact a person. Keep recovery visible.</span>
          </div>
        </div>
        <div className="motion-specimen">
          <span>Rule reveal</span>
          <i aria-hidden="true" />
          <p>160 ms · editorial easing · static under reduced motion</p>
        </div>
      </section>

      <section className="guide-section" aria-labelledby="checks-title">
        <SectionHeading
          id="checks-title"
          eyebrow="07 / Review checklist"
          title="What makes it a newspaper, and what keeps it digital."
          note="Use this list as a design review gate, not a mandate to decorate every surface."
        />
        <div className="check-grid">
          <article>
            <h3>Keep</h3>
            <ul>
              {checks.keep.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Avoid</h3>
            <ul>
              {checks.avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="guide-section" aria-labelledby="access-title">
        <SectionHeading
          id="access-title"
          eyebrow="08 / Access"
          title="The print metaphor never excuses an inaccessible control."
          note="Target WCAG 2.2 AA and verify the system, not only individual components."
        />
        <div className="access-notes">
          <article>
            <h3>Reading</h3>
            <p>
              Text contrast is 4.5:1 or better. Long copy stays within 68 ch.
              Captions and metadata remain readable at 200% zoom.
            </p>
          </article>
          <article>
            <h3>Interaction</h3>
            <p>
              All controls have a 44 px minimum target and a 3 px visible focus
              ring. Focus order follows the editorial reading order.
            </p>
          </article>
          <article>
            <h3>Motion</h3>
            <p>
              Reduced motion removes transitions, image scale, and reveal
              movement. Content is available immediately in every state.
            </p>
          </article>
          <article>
            <h3>Structure</h3>
            <p>
              Pages use one main landmark, logical heading levels, descriptive
              link text, semantic figures, and an accessible skip link.
            </p>
          </article>
        </div>
        <div className="release-note">
          <strong>Release note</strong>
          <p>
            This route is marked noindex and is intended as an internal
            development reference. Add authentication or omit it from a public
            production build if the client requires a private desk.
          </p>
        </div>
      </section>
    </main>
  );
}
