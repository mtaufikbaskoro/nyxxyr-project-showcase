import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { Project, ProjectTheme } from "@/lib/projects";

const publishedProjectInclude = {
  sections: {
    orderBy: { position: "asc" as const },
    include: {
      paragraphs: { orderBy: { position: "asc" as const } },
    },
  },
  evidence: true,
  quote: true,
  githubEntry: true,
} as const;

function displayTheme(theme: "CIVIC" | "ENGINEERING" | "EDUCATION") {
  const themes: Record<
    "CIVIC" | "ENGINEERING" | "EDUCATION",
    ProjectTheme
  > = {
    CIVIC: "civic",
    ENGINEERING: "engineering",
    EDUCATION: "education",
  };
  return themes[theme];
}

export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-projects");

  const profile = await db.profile.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!profile) {
    throw new Error("No portfolio profile is configured.");
  }

  const records = await db.project.findMany({
    where: {
      authorId: profile.id,
      status: "PUBLISHED",
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
    },
    orderBy: { sortOrder: "asc" },
    include: publishedProjectInclude,
  });

  return records.map((project) => ({
    slug: project.slug,
    index: String(project.sortOrder).padStart(2, "0"),
    kicker: project.kicker,
    title: project.title,
    summary: project.summary,
    period: project.periodLabel ?? undefined,
    role: project.role ?? undefined,
    focus: project.focus,
    readingTime: project.readingTime,
    takeaway: project.takeaway,
    evidence: project.evidence
      ? {
          value: project.evidence.value,
          label: project.evidence.label,
        }
      : undefined,
    githubRepository: project.githubEntry?.repositoryFullName,
    theme: displayTheme(project.theme),
    imageAlt: project.imageAlt,
    caption: project.caption,
    story: {
      lead: project.lead,
      sections: project.sections.map((section) => ({
        title: section.title,
        body: section.paragraphs.map((paragraph) => paragraph.body),
      })),
      quote: project.quote
        ? {
            text: project.quote.body,
            attribution: project.quote.attribution ?? "",
          }
        : undefined,
    },
  }));
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getNextPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  return projects.length
    ? projects[(currentIndex + 1) % projects.length]
    : undefined;
}
