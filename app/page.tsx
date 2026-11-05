import Link from "next/link";
import {
  ButtonLink,
  Kicker,
  MetaList,
  Metric,
  SectionHeading,
  StoryCard,
} from "@/components/editorial";
import { GithubShowcase } from "@/components/github-showcase";
import { ProjectArt } from "@/components/project-art";
import { getProfile } from "@/lib/queries/profile";
import { getPublishedProjects } from "@/lib/queries/projects";

export default async function Home() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
  ]);
  const featuredProject = projects[0];

  if (!featuredProject) {
    throw new Error("No published projects are configured.");
  }

  const railProjects = projects.slice(1);
  const featuredMeta = [
    `Story ${featuredProject.index}`,
    featuredProject.period,
    featuredProject.readingTime,
  ].filter((item): item is string => Boolean(item));

  return (
    <main id="main-content" className="page-shell front-page">
      <section className="edition-intro" aria-labelledby="edition-title">
        <div className="edition-intro__dateline">
          <p>Portfolio edition</p>
          <p>Selected work / Web and data systems</p>
        </div>
        <div className="edition-intro__statement">
          <Kicker accent>Selected work / Web and data systems</Kicker>
          <h1 id="edition-title">
            Clear systems, useful interfaces, and careful implementation.
          </h1>
          <p className="lede">
            I am a BNSP-certified web programmer working across frontend
            development, government data systems, and software quality.
          </p>
          <div className="button-row">
            <ButtonLink href="#selected-work">Browse selected work</ButtonLink>
            <ButtonLink href="#contact" variant="quiet">
              Start a conversation
            </ButtonLink>
          </div>
        </div>
        <aside className="issue-brief" aria-labelledby="issue-brief-title">
          <Kicker>Profile</Kicker>
          <h2 id="issue-brief-title">Between planning and the interface.</h2>
          <p>
            Experience across Medan&apos;s government data work, engineering
            web development, and public-facing software quality informs how I
            approach useful digital systems.
          </p>
          <dl className="issue-brief__stats">
            <div>
              <dt>Projects</dt>
              <dd>03</dd>
            </div>
            <div>
              <dt>Experience roles</dt>
              <dd>02</dd>
            </div>
            <div>
              <dt>Certification</dt>
              <dd>BNSP</dd>
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
            <MetaList items={featuredMeta} />
          </header>
          <figure className="lead-story__visual">
            <ProjectArt project={featuredProject} size="large" />
            <figcaption>
              <span>{featuredProject.caption}</span>
              <span>Fig. {featuredProject.index}</span>
            </figcaption>
          </figure>
          <footer className="lead-story__footer">
            <p>{featuredProject.takeaway}</p>
            <ButtonLink href={`/work/${featuredProject.slug}`}>
              Read the project
            </ButtonLink>
          </footer>
        </article>

        <aside className="story-rail" aria-labelledby="rail-title">
          <div className="story-rail__header">
            <Kicker>More selected work</Kicker>
            <h2 id="rail-title">Systems in context.</h2>
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
                Open project <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
          {featuredProject.evidence ? (
            <Metric
              value={featuredProject.evidence.value}
              label={featuredProject.evidence.label}
            />
          ) : null}
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
          title="Three projects across civic data, engineering, and education."
          note="Read the project context, follow the verified evidence, or open the full project story."
        />
        <div className="story-grid">
          {projects.map((project, index) => (
            <StoryCard
              key={project.slug}
              project={project}
              orientation={index === 1 ? "narrow" : "wide"}
            />
          ))}
        </div>
      </section>

      <GithubShowcase />

      <section
        id="background"
        className="background"
        aria-labelledby="background-title"
      >
        <SectionHeading
          id="background-title"
          eyebrow="Background"
          title="Government delivery, quality practice, and a technical foundation."
          note="Experience and credentials from the supplied curriculum vitae, without inferred proficiency levels."
        />
        <div className="principle-grid">
          {profile.background.map((item) => (
            <article className="principle" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p className="principle__role">
                {item.organization}
                {"period" in item && item.period ? ` · ${item.period}` : ""}
              </p>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="skill-index" aria-label="Technical skills">
          <span className="skill-index__label">Technical skills</span>
          <ul className="tag-row">
            {profile.skills.map((skill) => (
              <li className="tag" key={skill}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contact"
        className="contact-desk"
        aria-labelledby="contact-title"
      >
        <div className="contact-desk__copy">
          <Kicker accent>Correspondence</Kicker>
          <h2 id="contact-title">Have a useful problem worth making clearer?</h2>
          {profile.availability ? <p>{profile.availability}</p> : null}
        </div>
        <div className="contact-desk__action">
          <span>Contact</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="button-row">
            <ButtonLink href={`mailto:${profile.email}`} variant="secondary">
              Email Taufik
            </ButtonLink>
            <ButtonLink
              href={profile.linkedInUrl}
              variant="secondary"
              external
            >
              LinkedIn
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
