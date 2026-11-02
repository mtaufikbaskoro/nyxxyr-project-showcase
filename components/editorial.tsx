import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";
import { ProjectArt } from "@/components/project-art";

type KickerProps = {
  children: ReactNode;
  accent?: boolean;
};

export function Kicker({ children, accent = false }: KickerProps) {
  return (
    <p className={accent ? "kicker kicker--accent" : "kicker"}>{children}</p>
  );
}

type MetaListProps = {
  items: string[];
  label?: string;
};

export function MetaList({ items, label = "Story details" }: MetaListProps) {
  return (
    <ul className="meta-list" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
}: ButtonLinkProps) {
  if (external || href.startsWith("mailto:")) {
    return (
      <a className={`button button--${variant}`} href={href}>
        {children}
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link className={`button button--${variant}`} href={href} prefetch={true}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  note?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  note,
  id,
}: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <div>
        <Kicker accent>{eyebrow}</Kicker>
        <h2 id={id}>{title}</h2>
      </div>
      {note ? <p className="section-heading__note">{note}</p> : null}
    </header>
  );
}

type StoryCardProps = {
  project: Project;
  orientation?: "wide" | "narrow" | "standard";
};

export function StoryCard({
  project,
  orientation = "standard",
}: StoryCardProps) {
  return (
    <article className={`story-card story-card--${orientation}`}>
      <ProjectArt project={project} />
      <div className="story-card__copy">
        <Kicker>{project.kicker}</Kicker>
        <h3>
          <Link href={`/work/${project.slug}`} prefetch={true}>
            {project.title}
          </Link>
        </h3>
        <p>{project.summary}</p>
        <div className="story-card__footer">
          <MetaList items={[project.date, project.readingTime]} />
          <Link
            className="text-link"
            href={`/work/${project.slug}`}
            prefetch={true}
          >
            Read the feature <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

type PullQuoteProps = {
  children: ReactNode;
  attribution?: string;
};

export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <blockquote className="pull-quote">
      <p>{children}</p>
      {attribution ? <footer>— {attribution}</footer> : null}
    </blockquote>
  );
}

type MetricProps = {
  value: string;
  label: string;
};

export function Metric({ value, label }: MetricProps) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}
