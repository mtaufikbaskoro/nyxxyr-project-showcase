import {
  BackgroundKind,
  GithubAccountType,
  Prisma,
  PrismaClient,
  ProjectStatus,
  ProjectTheme,
} from "@prisma/client";
import fallbackData from "../data/github-showcase-fallback.json" with {
  type: "json",
};
import {
  githubShowcaseAccountType,
  githubShowcaseEntries,
} from "../data/github-showcase.ts";
import { profile } from "../lib/profile.ts";
import { projects } from "../lib/projects.ts";

const prisma = new PrismaClient();

const profileId = "seed-profile-mtaufik-baskoro";

function projectId(slug: string) {
  return `seed-project-${slug}`;
}

function repositoryId(repository: string) {
  return `seed-github-${repository.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function normalizeRepository(repository: string) {
  const normalized = repository.trim().toLowerCase();
  if (!/^[a-z\d](?:[a-z\d-]*[a-z\d])?\/[a-z\d._-]+$/.test(normalized)) {
    throw new Error(`Invalid GitHub repository name: ${repository}`);
  }
  return normalized;
}

function projectThemes(theme: (typeof projects)[number]["theme"]) {
  const themes: Record<
    (typeof projects)[number]["theme"],
    (typeof ProjectTheme)[keyof typeof ProjectTheme]
  > = {
    civic: ProjectTheme.CIVIC,
    engineering: ProjectTheme.ENGINEERING,
    education: ProjectTheme.EDUCATION,
  };
  return themes[theme];
}

async function seedProfile(tx: Prisma.TransactionClient) {
  const profileRecord = profile;
  const githubAccount =
    new URL(profileRecord.githubUrl).pathname.split("/").filter(Boolean).at(-1) ||
    null;

  await tx.profile.upsert({
    where: { id: profileId },
    update: {
      name: profileRecord.name,
      summary: profileRecord.summary,
      email: profileRecord.email,
      linkedInUrl: profileRecord.linkedInUrl,
      githubUrl: profileRecord.githubUrl,
      githubAccount,
      githubAccountType:
        githubShowcaseAccountType === "organization"
          ? GithubAccountType.ORGANIZATION
          : GithubAccountType.USER,
      availability: profileRecord.availability,
    },
    create: {
      id: profileId,
      name: profileRecord.name,
      summary: profileRecord.summary,
      email: profileRecord.email,
      linkedInUrl: profileRecord.linkedInUrl,
      githubUrl: profileRecord.githubUrl,
      githubAccount,
      githubAccountType:
        githubShowcaseAccountType === "organization"
          ? GithubAccountType.ORGANIZATION
          : GithubAccountType.USER,
      availability: profileRecord.availability,
    },
  });

  const backgroundKinds = [
    BackgroundKind.EXPERIENCE,
    BackgroundKind.EXPERIENCE,
    BackgroundKind.EDUCATION,
  ] as const;

  for (const [index, item] of profileRecord.background.entries()) {
    const id = `seed-background-${index + 1}`;
    const data = {
      profileId,
      kind: backgroundKinds[index],
      position: index + 1,
      title: item.title,
      organization: item.organization,
      periodLabel: "period" in item ? item.period : null,
      body:
        index === 2 ? "Bachelor of Information Technology." : item.body,
    };
    await tx.backgroundItem.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  const credentials = [
    {
      id: "seed-credential-bnsp",
      position: 1,
      name: "Junior Web Programmer",
      issuer: "BNSP",
      validThrough: new Date("2028-01-31T00:00:00.000Z"),
      score: null,
      description:
        "BNSP Junior Web Programmer certification valid through January 2028.",
    },
    {
      id: "seed-credential-sanbercode",
      position: 2,
      name: "ReactJS Bootcamp",
      issuer: "Sanbercode",
      validThrough: null,
      score: "91.75/100",
      description: "Sanbercode ReactJS Bootcamp score of 91.75/100.",
    },
    {
      id: "seed-credential-google-it-support",
      position: 3,
      name: "IT Support Certificate",
      issuer: "Google",
      validThrough: null,
      score: null,
      description: "Google IT Support Certificate.",
    },
  ];

  for (const credential of credentials) {
    const data = { profileId, ...credential };
    await tx.credential.upsert({
      where: { id: credential.id },
      update: data,
      create: data,
    });
  }

  for (const [index, name] of profileRecord.skills.entries()) {
    const id = `seed-skill-${index + 1}`;
    const data = { profileId, position: index + 1, name };
    await tx.skill.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }
}

async function seedProjects(tx: Prisma.TransactionClient) {
  for (const [index, project] of projects.entries()) {
    const id = projectId(project.slug);
    const data = {
      authorId: profileId,
      slug: project.slug,
      sortOrder: index + 1,
      kicker: project.kicker,
      title: project.title,
      summary: project.summary,
      lead: project.story.lead,
      periodLabel: project.period ?? null,
      role: project.role ?? null,
      focus: project.focus,
      readingTime: project.readingTime,
      takeaway: project.takeaway,
      theme: projectThemes(project.theme),
      imageAlt: project.imageAlt,
      caption: project.caption,
      status: ProjectStatus.PUBLISHED,
      publishedAt: null,
    };

    await tx.project.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });

    for (const [sectionIndex, section] of project.story.sections.entries()) {
      const sectionId = `seed-section-${project.slug}-${sectionIndex + 1}`;
      const sectionData = {
        projectId: id,
        position: sectionIndex + 1,
        title: section.title,
      };
      await tx.projectSection.upsert({
        where: { id: sectionId },
        update: sectionData,
        create: { id: sectionId, ...sectionData },
      });

      for (const [paragraphIndex, body] of section.body.entries()) {
        const paragraphId = `${sectionId}-paragraph-${paragraphIndex + 1}`;
        const paragraphData = {
          sectionId,
          position: paragraphIndex + 1,
          body,
        };
        await tx.projectParagraph.upsert({
          where: { id: paragraphId },
          update: paragraphData,
          create: { id: paragraphId, ...paragraphData },
        });
      }
    }

    if (project.evidence) {
      const evidenceId = `seed-evidence-${project.slug}`;
      const evidenceData = {
        projectId: id,
        value: project.evidence.value,
        label: project.evidence.label,
      };
      await tx.projectEvidence.upsert({
        where: { id: evidenceId },
        update: evidenceData,
        create: { id: evidenceId, ...evidenceData },
      });
    }

    if (project.story.quote) {
      const quoteId = `seed-quote-${project.slug}`;
      const quoteData = {
        projectId: id,
        body: project.story.quote.text,
        attribution: project.story.quote.attribution,
      };
      await tx.projectQuote.upsert({
        where: { id: quoteId },
        update: quoteData,
        create: { id: quoteId, ...quoteData },
      });
    }
  }
}

async function seedGithubShowcase(tx: Prisma.TransactionClient) {
  const repositoryProjects: Record<string, string> = {
    "mtaufikbaskoro/frontend-aplikasi-sdgs": "astra-jm",
    "mtaufikbaskoro/qr-vue": "quantum-rekatama",
  };
  const snapshots = new Map(
    fallbackData.repositories.map((repository) => [
      repository.fullName.toLowerCase(),
      repository,
    ]),
  );
  const checkedAt = new Date(fallbackData.checkedAt);

  for (const [index, entry] of githubShowcaseEntries.entries()) {
    const repository = normalizeRepository(entry.repository);
    const id = repositoryId(repository);
    const linkedSlug = repositoryProjects[repository];
    const data = {
      projectId: linkedSlug ? projectId(linkedSlug) : null,
      position: index + 1,
      repositoryFullName: repository,
      label: entry.label ?? null,
      descriptionOverride: entry.descriptionOverride ?? null,
      isVisible: true,
    };

    await tx.githubShowcaseEntry.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });

    for (const [hostIndex, host] of (
      entry.allowedHomepageHosts ?? []
    ).entries()) {
      const hostId = `${id}-host-${hostIndex + 1}`;
      const hostData = { entryId: id, host, position: hostIndex + 1 };
      await tx.githubAllowedHost.upsert({
        where: { id: hostId },
        update: hostData,
        create: { id: hostId, ...hostData },
      });
    }

    const snapshot = snapshots.get(repository);
    if (!snapshot) {
      continue;
    }

    const snapshotId = `${id}-snapshot`;
    const snapshotData = {
      entryId: id,
      githubRepositoryId: BigInt(snapshot.id),
      description: snapshot.description,
      homepageUrl: snapshot.homepageUrl,
      language: snapshot.language,
      repositoryUpdatedAt: new Date(snapshot.updatedAt),
      archived: snapshot.archived,
      fork: snapshot.fork,
      checkedAt,
    };
    await tx.githubSnapshot.upsert({
      where: { id: snapshotId },
      update: snapshotData,
      create: { id: snapshotId, ...snapshotData },
    });

    for (const [topicIndex, name] of snapshot.topics.entries()) {
      const topicId = `${snapshotId}-topic-${topicIndex + 1}`;
      const topicData = {
        snapshotId,
        position: topicIndex + 1,
        name,
      };
      await tx.githubTopic.upsert({
        where: { id: topicId },
        update: topicData,
        create: { id: topicId, ...topicData },
      });
    }
  }
}

async function main() {
  await prisma.$transaction(
    async (tx) => {
      await seedProfile(tx);
      await seedProjects(tx);
      await seedGithubShowcase(tx);
    },
    { timeout: 30_000 },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
