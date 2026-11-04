import { cacheLife, cacheTag } from "next/cache";
import fallbackData from "@/data/github-showcase-fallback.json";
import {
  githubShowcaseAccountType,
  githubShowcaseEntries,
  type GithubShowcaseEntry,
} from "@/data/github-showcase";

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

function isApprovedHomepageUrl(
  value: string,
  approvedHosts: string[] | undefined,
) {
  if (!approvedHosts?.length) {
    return false;
  }

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username !== "" ||
      url.password !== ""
    ) {
      return false;
    }

    return approvedHosts.some(
      (host) =>
        url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

function parseRepositoryPayload(
  value: unknown,
  entry: GithubShowcaseEntry,
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
      homepage && isApprovedHomepageUrl(homepage, entry.allowedHomepageHosts)
        ? homepage
        : null,
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
  entries: GithubShowcaseEntry[],
) {
  const repositoriesByName = new Map(
    repositories.map((repository) => [
      repository.fullName.toLowerCase(),
      repository,
    ]),
  );

  return entries.flatMap((entry) => {
    const repository = repositoriesByName.get(entry.repository.toLowerCase());
    return repository && isVisibleRepository(repository) ? [repository] : [];
  });
}

function withDisplayFields(
  repositories: GithubRepositoryPayload[],
): GithubShowcaseItem[] {
  const entriesByName = new Map(
    githubShowcaseEntries.map((entry) => [
      entry.repository.toLowerCase(),
      entry,
    ]),
  );

  return repositories.map((repository) => {
    const entry = entriesByName.get(repository.fullName.toLowerCase());
    return {
      ...repository,
      description: entry?.descriptionOverride ?? repository.description,
      label: entry?.label,
    };
  });
}

function parseSnapshot(): GithubShowcaseItem[] {
  if (
    !isRecord(fallbackData) ||
    !Array.isArray(fallbackData.repositories) ||
    typeof fallbackData.checkedAt !== "string" ||
    Number.isNaN(Date.parse(fallbackData.checkedAt))
  ) {
    return [];
  }

  const entriesByName = new Map(
    githubShowcaseEntries.map((entry) => [
      entry.repository.toLowerCase(),
      entry,
    ]),
  );

  const repositories = fallbackData.repositories.flatMap((value) => {
    if (!isRecord(value) || typeof value.fullName !== "string") {
      return [];
    }

    const entry = entriesByName.get(value.fullName.toLowerCase());
    if (!entry) {
      return [];
    }

    const repository = parseRepositoryPayload(value, entry);
    return repository ? [repository] : [];
  });

  return withDisplayFields(sortByAllowlist(repositories, githubShowcaseEntries));
}

function getAccount() {
  const account = process.env.GITHUB_ACCOUNT?.trim();
  return account && accountPattern.test(account) && account.length <= 39
    ? account
    : null;
}

export function getGithubProfileUrl() {
  const account = getAccount();
  return account ? `https://github.com/${account}` : null;
}

function getFallbackShowcase(account: string): GithubShowcase {
  const checkedAt = fallbackData.checkedAt;
  const checkedAtTime = Date.parse(checkedAt);
  const repositories = parseSnapshot();

  return {
    account,
    profileUrl: `https://github.com/${account}`,
    repositories,
    source: "snapshot",
    checkedAt,
    isStaleSnapshot:
      Number.isNaN(checkedAtTime) ||
      Date.now() - checkedAtTime > fallbackStaleAfterMs,
  };
}

export async function getGithubShowcase(): Promise<GithubShowcase | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-showcase");

  const account = getAccount();
  if (!account || githubShowcaseEntries.length === 0) {
    return null;
  }

  const endpoint =
    githubShowcaseAccountType === "organization" ? "orgs" : "users";
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
      githubShowcaseEntries.map((entry) => [
        entry.repository.toLowerCase(),
        entry,
      ]),
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
      githubShowcaseEntries,
    );

    for (const entry of githubShowcaseEntries) {
      if (
        !allowlistedRepositories.some(
          (repository) =>
            repository.fullName.toLowerCase() ===
            entry.repository.toLowerCase(),
        )
      ) {
        console.warn(`GitHub showcase repository unavailable: ${entry.repository}`);
      }
    }

    const now = new Date().toISOString();
    return {
      account,
      profileUrl: `https://github.com/${account}`,
      repositories: withDisplayFields(allowlistedRepositories),
      source: "live",
      checkedAt: now,
      isStaleSnapshot: false,
    };
  } catch (error) {
    console.warn(
      `GitHub showcase is using its saved snapshot: ${
        error instanceof Error ? error.message : "request failed"
      }`,
    );
    return getFallbackShowcase(account);
  }
}
