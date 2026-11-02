import Link from "next/link";
import {
  ButtonLink,
  Kicker,
  MetaList,
  Metric,
  SectionHeading,
  StoryCard,
} from "@/components/editorial";
import { ProjectArt } from "@/components/project-art";
import { featuredProject, projects } from "@/lib/projects";

const railProjects = projects.slice(1, 3);

const principles = [
  {
    number: "01",
    title: "Begin before the screen",
    body: "We study the work around the interface: the decisions, handoffs, language, and constraints that shape the experience.",
  },
  {
    number: "02",
    title: "Make the useful desirable",
    body: "Clarity earns trust. Character gives the work a reason to be remembered. The best systems carry both without competing.",
  },
  {
    number: "03",
    title: "Leave room to continue",
    body: "A launch is a handoff, not a conclusion. We build systems that teams can understand, extend, and use with confidence.",
  },
];

export default function Home() {
  return (
    <main id="main-content" className="page-shell front-page">
      <section className="edition-intro" aria-labelledby="edition-title">
        <div className="edition-intro__dateline">
          <p>Jakarta · Tuesday, 3 November 2026</p>
          <p>Selected work / Issue 01</p>
        </div>
        <div className="edition-intro__statement">
          <Kicker accent>The project edition</Kicker>
          <h1 id="edition-title">Good digital work deserves a front page.</h1>
          <p className="lede">
            Nyxxyr is an independent design and technology studio. This issue
            gathers four projects where clarity, service, and a little craft
            changed the experience.
          </p>
          <div className="button-row">
            <ButtonLink href="#selected-work">Browse the stories</ButtonLink>
            <ButtonLink href="#contact" variant="quiet">
              Send a dispatch
            </ButtonLink>
          </div>
        </div>
        <aside className="issue-brief" aria-labelledby="issue-brief-title">
          <Kicker>From the editor</Kicker>
          <h2 id="issue-brief-title">The work behind the work.</h2>
          <p>
            Each project here starts with a real human moment: finding help,
            asking for a book, understanding a map, or bringing care home.
            The design follows from that moment.
          </p>
          <dl className="issue-brief__stats">
            <div>
              <dt>Stories</dt>
              <dd>04</dd>
            </div>
            <div>
              <dt>Disciplines</dt>
              <dd>06</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>26</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section
        id="front-page"
        className="front-grid"
        aria-labelledby="lead-story-title"
      >
        <article className="lead-story">
          <header className="lead-story__header">
            <Kicker accent>{featuredProject.kicker}</Kicker>
            <h2 id="lead-story-title">
              <Link href={`/work/${featuredProject.slug}`} prefetch={true}>
                {featuredProject.title}
              </Link>
            </h2>
            <p className="lead-story__dek">{featuredProject.summary}</p>
            <MetaList
              items={[
                `Story ${featuredProject.index}`,
                featuredProject.date,
                featuredProject.readingTime,
              ]}
            />
          </header>
          <figure className="lead-story__visual">
            <ProjectArt project={featuredProject} size="large" />
            <figcaption>
              <span>{featuredProject.caption}</span>
              <span>Fig. {featuredProject.index}</span>
            </figcaption>
          </figure>
          <footer className="lead-story__footer">
            <p>
              A resident-first service model turns a maze of departments into
              one understandable path forward.
            </p>
            <ButtonLink href={`/work/${featuredProject.slug}`}>
              Read the full feature
            </ButtonLink>
          </footer>
        </article>

        <aside className="story-rail" aria-labelledby="rail-title">
          <div className="story-rail__header">
            <Kicker>Inside this issue</Kicker>
            <h2 id="rail-title">More from the desk</h2>
          </div>
          {railProjects.map((project) => (
            <article className="rail-story" key={project.slug}>
              <span className="rail-story__index">{project.index}</span>
              <Kicker>{project.kicker}</Kicker>
              <h3>
                <Link href={`/work/${project.slug}`} prefetch={true}>
                  {project.title}
                </Link>
              </h3>
              <p>{project.summary}</p>
              <Link
                className="text-link"
                href={`/work/${project.slug}`}
                prefetch={true}
              >
                Open story <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
          <Metric
            value={featuredProject.metric}
            label={featuredProject.metricLabel}
          />
        </aside>
      </section>

      <section
        id="selected-work"
        className="selected-work"
        aria-labelledby="selected-work-title"
      >
        <SectionHeading
          id="selected-work-title"
          eyebrow="Selected work / Index"
          title="Four stories about making the complex feel clear."
          note="Read the headline, follow the evidence, or open a full project feature."
        />
        <div className="story-grid">
          {projects.map((project, index) => (
            <StoryCard
              key={project.slug}
              project={project}
              orientation={
                index === 0 || index === 3 ? "wide" : "narrow"
              }
            />
          ))}
        </div>
      </section>

      <section
        id="approach"
        className="approach"
        aria-labelledby="approach-title"
      >
        <SectionHeading
          id="approach-title"
          eyebrow="The working method"
          title="Enough structure to be useful. Enough curiosity to find the better question."
          note="A small editorial system for planning, making, and handing work over."
        />
        <div className="principle-grid">
          {principles.map((principle) => (
            <article className="principle" key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="contact-desk"
        aria-labelledby="contact-title"
      >
        <div className="contact-desk__copy">
          <Kicker accent>Correspondence</Kicker>
          <h2 id="contact-title">Have a useful problem worth taking seriously?</h2>
          <p>
            Send a note with the context, the constraint, and the change you
            hope to make. We will reply with a considered next step.
          </p>
        </div>
        <div className="contact-desk__action">
          <span>Address</span>
          <a href="mailto:hello@nyxxyr.studio">hello@nyxxyr.studio</a>
          <ButtonLink href="mailto:hello@nyxxyr.studio" variant="secondary">
            Start a conversation
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
