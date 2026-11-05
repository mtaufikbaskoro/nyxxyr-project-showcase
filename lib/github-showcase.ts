import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { getProfile } from "@/lib/queries/profile";

export type GithubShowcaseRepository = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  homepageUrl: string | null;
  language: string | null;
  topics: string[];
  updatedAt: string;
  archived: boolean;
  fork: boolean;
};

export type GithubShowcaseItem = GithubShowcaseRepository & {
  label?: string;
};

export type GithubShowcase = {
  account: string;
  profileUrl: string;
  repositories: GithubShowcaseItem[];
  source: "live" | "snapshot";
  checkedAt: string;
  isStaleSnapshot: boolean;
};

type GithubRepositoryPayload = GithubShowcaseRepository & {
  private?: boolean;
  disabled?: boolean;
  visibility?: string;
};

type CurationEntry = {
  id: string;
  repositoryFullName: string;
  label: string | null;
  descriptionOverride: string | null;
  allowedHosts: { host: string }[];
  snapshot: {
    githubRepositoryId: bigint;
    description: string | null;
    homepageUrl: string | null;
    language: string | null;
    repositoryUpdatedAt: Date;
    archived: boolean;
    fork: boolean;
    checkedAt: Date;
    topics: { name: string }[];
  } | null;
};

const accountPattern = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const githubApiVersion = "2022-11-28";
const fallbackStaleAfterMs = 7 * 24 * 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isGithubRepositoryUrl(value: string, fullName: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.port === "" &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === "" &&
      url.pathname.toLowerCase() === `/${fullName.toLowerCase()}`
    );
  } catch {
    return false;
  }
}

function isApprovedHomepageUrl(value: string, entry: CurationEntry) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username !== "" ||
      url.password !== ""
    ) {
      return false;
    }

    return entry.allowedHosts.some(
      ({ host }) =>
        url.hostname.toLowerCase() === host.toLowerCase() ||
        url.hostname.toLowerCase().endsWith(`.${host.toLowerCase()}`),
    );
  } catch {
    return false;
  }
}

function parseRepositoryPayload(
  value: unknown,
  entry: CurationEntry,
): GithubRepositoryPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    id,
    name,
    full_name,
    html_url,
    description,
    homepage,
    language,
    topics,
    updated_at,
    archived,
    fork,
    private: isPrivate,
    disabled,
    visibility,
  } = value;

  if (
    !Number.isSafeInteger(id) ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof full_name !== "string" ||
    typeof html_url !== "string" ||
    !isNullableString(description) ||
    !isNullableString(homepage) ||
    !isNullableString(language) ||
    !Array.isArray(topics) ||
    !topics.every((topic) => typeof topic === "string") ||
    typeof updated_at !== "string" ||
    Number.isNaN(Date.parse(updated_at)) ||
    typeof archived !== "boolean" ||
    typeof fork !== "boolean" ||
    (isPrivate !== undefined && typeof isPrivate !== "boolean") ||
    (disabled !== undefined && typeof disabled !== "boolean") ||
    (visibility !== undefined && typeof visibility !== "string") ||
    !isGithubRepositoryUrl(html_url, full_name)
  ) {
    return null;
  }

  return {
    id: id as number,
    name,
    fullName: full_name,
    url: html_url,
    description,
    homepageUrl:
      homepage && isApprovedHomepageUrl(homepage, entry) ? homepage : null,
    language,
    topics: topics.filter((topic) => topic.trim()).map((topic) => topic.trim()),
    updatedAt: updated_at,
    archived,
    fork,
    private: isPrivate,
    disabled,
    visibility,
  };
}

function isVisibleRepository(repository: GithubRepositoryPayload) {
  return (
    !repository.archived &&
    !repository.fork &&
    !repository.disabled &&
    repository.private !== true &&
    (repository.visibility === undefined || repository.visibility === "public")
  );
}

function sortByAllowlist(
  repositories: GithubRepositoryPayload[],
  entries: CurationEntry[],
) {
  const repositoriesByName = new Map(
    repositories.map((repository) => [
      repository.fullName.toLowerCase(),
      repository,
    ]),
  );

  return entries.flatMap((entry) => {
    const repository = repositoriesByName.get(
      entry.repositoryFullName.toLowerCase(),
    );
    return repository && isVisibleRepository(repository) ? [repository] : [];
  });
}

function withDisplayFields(
  repositories: GithubRepositoryPayload[],
  entries: CurationEntry[],
): GithubShowcaseItem[] {
  const entriesByName = new Map(
    entries.map((entry) => [entry.repositoryFullName.toLowerCase(), entry]),
  );

  return repositories.map((repository) => {
    const entry = entriesByName.get(repository.fullName.toLowerCase());
    return {
      ...repository,
      description: entry?.descriptionOverride ?? repository.description,
      label: entry?.label ?? undefined,
    };
  });
}

async function getCurationEntries() {
  return db.githubShowcaseEntry.findMany({
    where: { isVisible: true },
    orderBy: { position: "asc" },
    include: {
      allowedHosts: { orderBy: { position: "asc" } },
      snapshot: {
        include: {
          topics: { orderBy: { position: "asc" } },
        },
      },
    },
  });
}

function getStoredRepositories(entries: CurationEntry[]) {
  return entries.flatMap((entry) => {
    const snapshot = entry.snapshot;
    if (!snapshot) {
      return [];
    }

    const repositoryId = Number(snapshot.githubRepositoryId);
    if (!Number.isSafeInteger(repositoryId)) {
      return [];
    }

    const fullName = entry.repositoryFullName.toLowerCase();
    const name = fullName.split("/").at(-1);
    const repository = parseRepositoryPayload(
      {
        id: repositoryId,
        name,
        full_name: fullName,
        html_url: `https://github.com/${fullName}`,
        description: snapshot.description,
        homepage: snapshot.homepageUrl,
        language: snapshot.language,
        topics: snapshot.topics.map((topic) => topic.name),
        updated_at: snapshot.repositoryUpdatedAt.toISOString(),
        archived: snapshot.archived,
        fork: snapshot.fork,
      },
      entry,
    );

    return repository ? [repository] : [];
  });
}

function getFallbackShowcase(
  account: string,
  entries: CurationEntry[],
): GithubShowcase {
  const checkedAt = new Date(
    Math.max(
      0,
      ...entries.flatMap((entry) =>
        entry.snapshot ? [entry.snapshot.checkedAt.getTime()] : [],
      ),
    ),
  ).toISOString();
  const repositories = getStoredRepositories(entries);

  return {
    account,
    profileUrl: `https://github.com/${account}`,
    repositories: withDisplayFields(
      sortByAllowlist(repositories, entries),
      entries,
    ),
    source: "snapshot",
    checkedAt,
    isStaleSnapshot: Date.now() - Date.parse(checkedAt) > fallbackStaleAfterMs,
  };
}

async function persistSnapshots(
  repositories: GithubRepositoryPayload[],
  entries: CurationEntry[],
  checkedAt: Date,
) {
  const entriesByName = new Map(
    entries.map((entry) => [entry.repositoryFullName.toLowerCase(), entry]),
  );

  await db.$transaction(async (tx) => {
    for (const repository of repositories) {
      const entry = entriesByName.get(repository.fullName.toLowerCase());
      if (!entry) {
        continue;
      }

      const topics = repository.topics.map((name, index) => ({
        position: index + 1,
        name,
      }));
      const snapshotData = {
        githubRepositoryId: BigInt(repository.id),
        description: repository.description,
        homepageUrl: repository.homepageUrl,
        language: repository.language,
        repositoryUpdatedAt: new Date(repository.updatedAt),
        archived: repository.archived,
        fork: repository.fork,
        checkedAt,
      };

      await tx.githubSnapshot.upsert({
        where: { entryId: entry.id },
        update: {
          ...snapshotData,
          topics: {
            deleteMany: {},
            create: topics,
          },
        },
        create: {
          entryId: entry.id,
          ...snapshotData,
          topics: { create: topics },
        },
      });
    }
  });
}

export async function getGithubShowcase(): Promise<GithubShowcase | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-showcase");

  const profile = await getProfile();
  const account = profile.githubAccount?.trim();
  if (!account || !accountPattern.test(account) || account.length > 39) {
    return null;
  }

  const entries = await getCurationEntries();
  if (entries.length === 0) {
    return null;
  }

  const endpoint =
    profile.githubAccountType === "organization" ? "orgs" : "users";
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": githubApiVersion,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/${endpoint}/${encodeURIComponent(account)}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=1`,
      {
        headers,
        signal: AbortSignal.timeout(6000),
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("GitHub returned an unexpected response shape");
    }

    const entriesByName = new Map(
      entries.map((entry) => [entry.repositoryFullName.toLowerCase(), entry]),
    );
    const validRepositories: GithubRepositoryPayload[] = [];
    for (const value of payload) {
      if (!isRecord(value) || typeof value.full_name !== "string") {
        continue;
      }

      const entry = entriesByName.get(value.full_name.toLowerCase());
      if (!entry) {
        continue;
      }

      const repository = parseRepositoryPayload(value, entry);
      if (!repository) {
        throw new Error("GitHub returned invalid repository metadata");
      }

      validRepositories.push(repository);
    }

    const allowlistedRepositories = sortByAllowlist(
      validRepositories,
      entries,
    );
    for (const entry of entries) {
      if (
        !allowlistedRepositories.some(
          (repository) =>
            repository.fullName.toLowerCase() ===
            entry.repositoryFullName.toLowerCase(),
        )
      ) {
        console.warn(
          `GitHub showcase repository unavailable: ${entry.repositoryFullName}`,
        );
      }
    }

    const checkedAt = new Date();
    await persistSnapshots(allowlistedRepositories, entries, checkedAt);

    return {
      account,
      profileUrl: `https://github.com/${account}`,
      repositories: withDisplayFields(allowlistedRepositories, entries),
      source: "live",
      checkedAt: checkedAt.toISOString(),
      isStaleSnapshot: false,
    };
  } catch (error) {
    console.warn(
      `GitHub showcase is using its saved snapshot: ${
        error instanceof Error ? error.message : "request failed"
      }`,
    );
    return getFallbackShowcase(account, entries);
  }
}
