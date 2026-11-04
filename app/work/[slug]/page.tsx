import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ButtonLink,
  Kicker,
  Metric,
  PullQuote,
} from "@/components/editorial";
import { ProjectArt } from "@/components/project-art";
import { profile } from "@/lib/profile";
import { getNextProject, getProject, projects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <main id="main-content" className="page-shell project-page">
      <Suspense fallback={<ProjectFeatureFallback />}>
        <ProjectFeature params={params} />
      </Suspense>
    </main>
  );
}

async function ProjectFeature({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const bylineItems = [
    `Words by ${profile.name}`,
    project.period,
    project.readingTime,
  ].filter((item): item is string => Boolean(item));

  return (
    <article className="project-feature">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Front page</Link>
        <span aria-hidden="true">/</span>
        <Link href="/#selected-work">Selected work</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Project {project.index}</span>
      </nav>

      <header className="project-feature__header">
        <Kicker accent>{project.kicker}</Kicker>
        <h1>{project.title}</h1>
        <p className="project-feature__dek">{project.summary}</p>
        <div className="project-feature__byline">
          {bylineItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      <figure className="project-feature__visual">
        <ProjectArt project={project} size="large" />
        <figcaption>
          <span>{project.caption}</span>
          <span>Fig. {project.index}</span>
        </figcaption>
      </figure>

      <div
        className={`project-feature__body${
          project.evidence ? "" : " project-feature__body--no-outcome"
        }`}
      >
        <aside className="project-notes" aria-labelledby="project-notes-title">
          <Kicker>Project notes</Kicker>
          <h2 id="project-notes-title">At a glance</h2>
          <dl>
            {project.role ? (
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
            ) : null}
            <div>
              <dt>Focus</dt>
              <dd>{project.focus}</dd>
            </div>
            {project.period ? (
              <div>
                <dt>Period</dt>
                <dd>{project.period}</dd>
              </div>
            ) : null}
          </dl>
        </aside>

        <div className="project-copy">
          <p className="project-copy__lead">{project.story.lead}</p>
          {project.story.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          {project.story.quote ? (
            <PullQuote
              attribution={project.story.quote.attribution}
            >
              {project.story.quote.text}
            </PullQuote>
          ) : null}
        </div>

        {project.evidence ? (
          <aside className="project-outcome" aria-labelledby="outcome-title">
            <Kicker accent>Project evidence</Kicker>
            <h2 id="outcome-title">Project scope</h2>
            <Metric
              value={project.evidence.value}
              label={project.evidence.label}
            />
            <p>A project detail from the supplied curriculum vitae.</p>
          </aside>
        ) : null}
      </div>

      <footer className="next-story">
        <div>
          <Kicker>Next project / {nextProject.index}</Kicker>
          <h2>
            <Link href={`/work/${nextProject.slug}`} prefetch={true}>
              {nextProject.title}
            </Link>
          </h2>
        </div>
        <ButtonLink href={`/work/${nextProject.slug}`} variant="secondary">
          Continue reading
        </ButtonLink>
      </footer>
    </article>
  );
}

function ProjectFeatureFallback() {
  return (
    <div
      className="project-feature project-feature--loading"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="breadcrumb">Loading project story…</p>
      <div className="project-loading__header">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
