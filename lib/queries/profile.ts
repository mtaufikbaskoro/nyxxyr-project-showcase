import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export type PortfolioProfile = {
  name: string;
  summary: string;
  copyrightYear: number;
  email: string;
  linkedInUrl: string;
  githubUrl: string;
  githubAccount: string | null;
  githubAccountType: "user" | "organization";
  availability: string | null;
  skills: string[];
  background: {
    number: string;
    title: string;
    organization: string;
    period?: string;
    body: string;
  }[];
};

const copyrightYear = 2026;

export async function getProfile(): Promise<PortfolioProfile> {
  "use cache";
  cacheLife("days");
  cacheTag("portfolio-profile");

  const record = await db.profile.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      skills: { orderBy: { position: "asc" } },
      backgroundItems: { orderBy: { position: "asc" } },
      credentials: { orderBy: { position: "asc" } },
    },
  });

  if (!record) {
    throw new Error("No portfolio profile is configured.");
  }

  return {
    name: record.name,
    summary: record.summary,
    copyrightYear,
    email: record.email,
    linkedInUrl: record.linkedInUrl,
    githubUrl: record.githubUrl,
    githubAccount: record.githubAccount,
    githubAccountType:
      record.githubAccountType === "ORGANIZATION"
        ? "organization"
        : "user",
    availability: record.availability,
    skills: record.skills.map((skill) => skill.name),
    background: record.backgroundItems.map((item) => ({
      number: String(item.position).padStart(2, "0"),
      title: item.title,
      organization: item.organization,
      period: item.periodLabel ?? undefined,
      body:
        item.kind === "EDUCATION" && record.credentials.length
          ? [
              item.body,
              ...record.credentials.map(
                (credential) => credential.description,
              ),
            ].join(" ")
          : item.body,
    })),
  };
}
