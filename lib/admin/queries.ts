import "server-only";
import type { ProjectStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function getAdminProfile() {
  return db.profile.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      backgroundItems: { orderBy: { position: "asc" } },
      credentials: { orderBy: { position: "asc" } },
      skills: { orderBy: { position: "asc" } },
      _count: { select: { projects: true } },
    },
  });
}

export async function getAdminProjectList({
  query,
  status,
}: {
  query?: string;
  status?: ProjectStatus;
}) {
  return db.project.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { slug: { contains: query } },
              { kicker: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      _count: { select: { sections: true } },
      githubEntry: { select: { id: true, repositoryFullName: true } },
    },
  });
}

export async function getAdminProject(id: string) {
  return db.project.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: {
          paragraphs: { orderBy: { position: "asc" } },
        },
      },
      evidence: true,
      quote: true,
      githubEntry: true,
      author: { select: { id: true, name: true } },
    },
  });
}

export async function getAdminGithubList() {
  return db.githubShowcaseEntry.findMany({
    orderBy: [{ position: "asc" }, { repositoryFullName: "asc" }],
    include: {
      project: { select: { id: true, title: true } },
      snapshot: {
        select: {
          language: true,
          checkedAt: true,
          _count: { select: { topics: true } },
        },
      },
      _count: { select: { allowedHosts: true } },
    },
  });
}

export async function getAdminGithubEntry(id: string) {
  return db.githubShowcaseEntry.findUnique({
    where: { id },
    include: {
      allowedHosts: { orderBy: { position: "asc" } },
      snapshot: {
        include: {
          topics: { orderBy: { position: "asc" } },
        },
      },
      project: { select: { id: true, title: true } },
    },
  });
}

export async function getAdminProjectOptions() {
  return db.project.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, sortOrder: true, status: true },
  });
}

export async function getAdminOverview() {
  const [profile, projects, projectCount, publishedCount, draftCount, githubCount] =
    await Promise.all([
      db.profile.findFirst({
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          summary: true,
          availability: true,
          _count: {
            select: {
              projects: true,
              skills: true,
              backgroundItems: true,
              credentials: true,
            },
          },
        },
      }),
      db.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: {
          _count: { select: { sections: true } },
          githubEntry: {
            select: { repositoryFullName: true, isVisible: true },
          },
        },
      }),
      db.project.count(),
      db.project.count({ where: { status: "PUBLISHED" } }),
      db.project.count({ where: { status: "DRAFT" } }),
      db.githubShowcaseEntry.count(),
    ]);

  return {
    profile,
    projects,
    counts: { projectCount, publishedCount, draftCount, githubCount },
  };
}
