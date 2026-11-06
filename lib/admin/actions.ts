"use server";

import {
  BackgroundKind,
  GithubAccountType,
  Prisma,
  ProjectStatus,
  ProjectTheme,
} from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import type { AdminActionState } from "@/lib/admin/types";
import { db } from "@/lib/db";

class InputError extends Error {}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function requiredText(
  formData: FormData,
  name: string,
  label: string,
  maxLength?: number,
) {
  const value = text(formData, name);

  if (!value) {
    throw new InputError(`${label} is required.`);
  }

  if (maxLength && value.length > maxLength) {
    throw new InputError(`${label} must be ${maxLength} characters or fewer.`);
  }

  return value;
}

function optionalText(
  formData: FormData,
  name: string,
  label: string,
  maxLength?: number,
) {
  const value = text(formData, name);

  if (!value) {
    return null;
  }

  if (maxLength && value.length > maxLength) {
    throw new InputError(`${label} must be ${maxLength} characters or fewer.`);
  }

  return value;
}

function requiredId(formData: FormData, name = "id") {
  const value = text(formData, name);

  if (!value) {
    throw new InputError("The record identifier is missing.");
  }

  return value;
}

function optionalId(formData: FormData, name: string) {
  return text(formData, name) || null;
}

function integer(
  formData: FormData,
  name: string,
  label: string,
  { minimum = 1 }: { minimum?: number } = {},
) {
  const value = text(formData, name);
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    throw new InputError(`${label} must be a whole number of at least ${minimum}.`);
  }

  return parsed;
}

function boolean(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function dateTime(
  formData: FormData,
  name: string,
  label: string,
  required = false,
) {
  const value = text(formData, name);

  if (!value && optionalText(formData, name, label) === null) {
    if (required) {
      throw new InputError(`${label} is required.`);
    }

    return null;
  }

  const date =
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00.000Z`)
      : new Date(
          /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
            ? value
            : `${value}${value.length === 16 ? ":00" : ""}+07:00`,
        );

  if (Number.isNaN(date.getTime())) {
    throw new InputError(`${label} must be a valid date and time.`);
  }

  return date;
}

function webUrl(formData: FormData, name: string, label: string) {
  const value = requiredText(formData, name, label, 500);

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new InputError(`${label} must be a complete http or https URL.`);
  }

  return value;
}

function optionalWebUrl(formData: FormData, name: string, label: string) {
  const value = optionalText(formData, name, label, 500);

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new InputError(`${label} must be a complete http or https URL.`);
  }

  return value;
}

function email(formData: FormData, name: string) {
  const value = requiredText(formData, name, "Email", 254);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new InputError("Email must be a valid email address.");
  }

  return value;
}

function slug(formData: FormData) {
  const value = requiredText(formData, "slug", "Slug", 191).toLowerCase();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new InputError(
      "Slug can contain lowercase letters, numbers, and single hyphens.",
    );
  }

  return value;
}

function oneOf<T extends string>(
  formData: FormData,
  name: string,
  label: string,
  allowed: readonly T[],
) {
  const value = text(formData, name);

  if (!allowed.includes(value as T)) {
    throw new InputError(`${label} is not valid.`);
  }

  return value as T;
}

function actionError(error: unknown): AdminActionState {
  if (error instanceof InputError) {
    return { status: "error", message: error.message };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        status: "error",
        message:
          "A record with this unique value already exists. Check the slug, repository, or position.",
      };
    }

    if (error.code === "P2003") {
      return {
        status: "error",
        message:
          "This record is still connected to other content. Remove that relationship first.",
      };
    }

    if (error.code === "P2025") {
      return {
        status: "error",
        message: "That record no longer exists. Refresh the dashboard.",
      };
    }
  }

  console.error("Admin mutation failed:", error);
  return {
    status: "error",
    message: "The change could not be saved. Please try again.",
  };
}

function refreshProfile() {
  updateTag("portfolio-profile");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
}

function refreshProjects() {
  updateTag("portfolio-projects");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/projects/[id]", "page");
}

function refreshGithub() {
  updateTag("portfolio-projects");
  revalidatePath("/admin");
  revalidatePath("/admin/github");
  revalidatePath("/admin/github/[id]", "page");
}

async function canonicalProfileId() {
  const profile = await db.profile.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!profile) {
    throw new InputError(
      "No profile exists yet. Seed the database before editing profile content.",
    );
  }

  return profile.id;
}

export async function updateProfile(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const id = requiredId(formData);
    const profile = await db.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new InputError("That profile no longer exists.");
    }

    const githubAccount = optionalText(
      formData,
      "githubAccount",
      "GitHub account",
      39,
    );
    if (githubAccount && !/^[a-zA-Z0-9-]+$/.test(githubAccount)) {
      throw new InputError(
        "GitHub account can contain only letters, numbers, and hyphens.",
      );
    }

    await db.profile.update({
      where: { id },
      data: {
        name: requiredText(formData, "name", "Name", 120),
        summary: requiredText(formData, "summary", "Summary", 255),
        email: email(formData, "email"),
        linkedInUrl: webUrl(formData, "linkedInUrl", "LinkedIn URL"),
        githubUrl: webUrl(formData, "githubUrl", "GitHub URL"),
        githubAccount,
        githubAccountType: oneOf(
          formData,
          "githubAccountType",
          "GitHub account type",
          Object.values(GithubAccountType),
        ),
        availability: optionalText(
          formData,
          "availability",
          "Availability",
        ),
      },
    });

    refreshProfile();
    return { status: "success", message: "Profile saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveBackgroundItem(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const profileId = await canonicalProfileId();
    const id = optionalId(formData, "id");
    const data = {
      kind: oneOf(
        formData,
        "kind",
        "Background type",
        Object.values(BackgroundKind),
      ),
      position: integer(formData, "position", "Position"),
      title: requiredText(formData, "title", "Title", 255),
      organization: requiredText(
        formData,
        "organization",
        "Organization",
        255,
      ),
      periodLabel: optionalText(
        formData,
        "periodLabel",
        "Period label",
        120,
      ),
      body: requiredText(formData, "body", "Description"),
    };

    if (id) {
      const item = await db.backgroundItem.findFirst({
        where: { id, profileId },
      });
      if (!item) {
        throw new InputError("That background item no longer exists.");
      }
      await db.backgroundItem.update({ where: { id }, data });
    } else {
      await db.backgroundItem.create({ data: { profileId, ...data } });
    }

    refreshProfile();
    return {
      status: "success",
      message: id ? "Background item saved." : "Background item added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteBackgroundItem(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const profileId = await canonicalProfileId();
    const id = requiredId(formData);
    const item = await db.backgroundItem.findFirst({
      where: { id, profileId },
    });
    if (!item) {
      throw new InputError("That background item no longer exists.");
    }
    await db.backgroundItem.delete({ where: { id } });
    refreshProfile();
    return { status: "success", message: "Background item deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveCredential(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const profileId = await canonicalProfileId();
    const id = optionalId(formData, "id");
    const data = {
      position: integer(formData, "position", "Position"),
      name: requiredText(formData, "name", "Credential name", 255),
      issuer: requiredText(formData, "issuer", "Issuer", 255),
      validThrough: dateTime(
        formData,
        "validThrough",
        "Valid through date",
      ),
      score: optionalText(formData, "score", "Score", 32),
      description: requiredText(formData, "description", "Description"),
    };

    if (id) {
      const item = await db.credential.findFirst({
        where: { id, profileId },
      });
      if (!item) {
        throw new InputError("That credential no longer exists.");
      }
      await db.credential.update({ where: { id }, data });
    } else {
      await db.credential.create({ data: { profileId, ...data } });
    }

    refreshProfile();
    return {
      status: "success",
      message: id ? "Credential saved." : "Credential added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCredential(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const profileId = await canonicalProfileId();
    const id = requiredId(formData);
    const item = await db.credential.findFirst({
      where: { id, profileId },
    });
    if (!item) {
      throw new InputError("That credential no longer exists.");
    }
    await db.credential.delete({ where: { id } });
    refreshProfile();
    return { status: "success", message: "Credential deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveSkill(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const profileId = await canonicalProfileId();
    const id = optionalId(formData, "id");
    const data = {
      position: integer(formData, "position", "Position"),
      name: requiredText(formData, "name", "Skill name", 120),
    };

    if (id) {
      const item = await db.skill.findFirst({ where: { id, profileId } });
      if (!item) {
        throw new InputError("That skill no longer exists.");
      }
      await db.skill.update({ where: { id }, data });
    } else {
      await db.skill.create({ data: { profileId, ...data } });
    }

    refreshProfile();
    return {
      status: "success",
      message: id ? "Skill saved." : "Skill added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteSkill(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const profileId = await canonicalProfileId();
    const id = requiredId(formData);
    const item = await db.skill.findFirst({ where: { id, profileId } });
    if (!item) {
      throw new InputError("That skill no longer exists.");
    }
    await db.skill.delete({ where: { id } });
    refreshProfile();
    return { status: "success", message: "Skill deleted." };
  } catch (error) {
    return actionError(error);
  }
}

function projectFields(formData: FormData) {
  return {
    slug: slug(formData),
    sortOrder: integer(formData, "sortOrder", "Project order"),
    kicker: requiredText(formData, "kicker", "Kicker", 191),
    title: requiredText(formData, "title", "Title", 255),
    summary: requiredText(formData, "summary", "Summary"),
    lead: requiredText(formData, "lead", "Lead"),
    periodLabel: optionalText(formData, "periodLabel", "Period label", 120),
    role: optionalText(formData, "role", "Role", 191),
    focus: requiredText(formData, "focus", "Focus", 255),
    readingTime: requiredText(formData, "readingTime", "Reading time", 64),
    takeaway: requiredText(formData, "takeaway", "Takeaway"),
    theme: oneOf(
      formData,
      "theme",
      "Theme",
      Object.values(ProjectTheme),
    ),
    imageAlt: requiredText(formData, "imageAlt", "Image alternative text"),
    caption: requiredText(formData, "caption", "Caption"),
    status: oneOf(
      formData,
      "status",
      "Status",
      Object.values(ProjectStatus),
    ),
    publishedAt: dateTime(formData, "publishedAt", "Publish date and time"),
  };
}

export async function createProject(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  let projectId = "";

  try {
    const authorId = await canonicalProfileId();
    const project = await db.project.create({
      data: { authorId, ...projectFields(formData) },
    });
    projectId = project.id;

    refreshProjects();
  } catch (error) {
    return actionError(error);
  }

  redirect(`/admin/projects/${projectId}?created=1`);
}

export async function updateProject(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const authorId = await canonicalProfileId();
    const id = requiredId(formData);
    const project = await db.project.findFirst({
      where: { id, authorId },
    });
    if (!project) {
      throw new InputError("That project no longer exists.");
    }

    await db.project.update({
      where: { id },
      data: projectFields(formData),
    });

    refreshProjects();
    return { status: "success", message: "Project saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProject(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const authorId = await canonicalProfileId();
    const id = requiredId(formData);
    const project = await db.project.findFirst({
      where: { id, authorId },
    });
    if (!project) {
      throw new InputError("That project no longer exists.");
    }

    await db.project.delete({ where: { id } });
    refreshProjects();
  } catch (error) {
    return actionError(error);
  }

  redirect("/admin/projects");
}

export async function saveProjectSection(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const projectId = requiredId(formData, "projectId");
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      throw new InputError("The parent project no longer exists.");
    }

    const id = optionalId(formData, "id");
    const data = {
      position: integer(formData, "position", "Section position"),
      title: requiredText(formData, "title", "Section title", 255),
    };

    if (id) {
      const section = await db.projectSection.findFirst({
        where: { id, projectId },
      });
      if (!section) {
        throw new InputError("That section no longer exists.");
      }
      await db.projectSection.update({ where: { id }, data });
    } else {
      await db.projectSection.create({
        data: { projectId, ...data },
      });
    }

    refreshProjects();
    return {
      status: "success",
      message: id ? "Section saved." : "Section added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProjectSection(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const projectId = requiredId(formData, "projectId");
    const id = requiredId(formData);
    const section = await db.projectSection.findFirst({
      where: { id, projectId },
    });
    if (!section) {
      throw new InputError("That section no longer exists.");
    }
    await db.projectSection.delete({ where: { id } });
    refreshProjects();
    return { status: "success", message: "Section deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveProjectParagraph(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const sectionId = requiredId(formData, "sectionId");
    const section = await db.projectSection.findUnique({
      where: { id: sectionId },
      select: { id: true },
    });
    if (!section) {
      throw new InputError("The parent section no longer exists.");
    }

    const id = optionalId(formData, "id");
    const data = {
      position: integer(formData, "position", "Paragraph position"),
      body: requiredText(formData, "body", "Paragraph"),
    };

    if (id) {
      const paragraph = await db.projectParagraph.findFirst({
        where: { id, sectionId },
      });
      if (!paragraph) {
        throw new InputError("That paragraph no longer exists.");
      }
      await db.projectParagraph.update({ where: { id }, data });
    } else {
      await db.projectParagraph.create({
        data: { sectionId, ...data },
      });
    }

    refreshProjects();
    return {
      status: "success",
      message: id ? "Paragraph saved." : "Paragraph added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProjectParagraph(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const sectionId = requiredId(formData, "sectionId");
    const id = requiredId(formData);
    const paragraph = await db.projectParagraph.findFirst({
      where: { id, sectionId },
    });
    if (!paragraph) {
      throw new InputError("That paragraph no longer exists.");
    }
    await db.projectParagraph.delete({ where: { id } });
    refreshProjects();
    return { status: "success", message: "Paragraph deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveProjectEvidence(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const projectId = requiredId(formData, "projectId");
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      throw new InputError("The parent project no longer exists.");
    }

    const data = {
      value: requiredText(formData, "value", "Evidence value", 191),
      label: requiredText(formData, "label", "Evidence label"),
    };

    await db.projectEvidence.upsert({
      where: { projectId },
      create: { projectId, ...data },
      update: data,
    });

    refreshProjects();
    return { status: "success", message: "Evidence saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProjectEvidence(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const projectId = requiredId(formData, "projectId");
    const evidence = await db.projectEvidence.findUnique({
      where: { projectId },
    });
    if (!evidence) {
      throw new InputError("That evidence block no longer exists.");
    }
    await db.projectEvidence.delete({ where: { projectId } });
    refreshProjects();
    return { status: "success", message: "Evidence deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveProjectQuote(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const projectId = requiredId(formData, "projectId");
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      throw new InputError("The parent project no longer exists.");
    }

    const data = {
      body: requiredText(formData, "body", "Quote"),
      attribution: optionalText(formData, "attribution", "Attribution", 255),
    };

    await db.projectQuote.upsert({
      where: { projectId },
      create: { projectId, ...data },
      update: data,
    });

    refreshProjects();
    return { status: "success", message: "Quote saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProjectQuote(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const projectId = requiredId(formData, "projectId");
    const quote = await db.projectQuote.findUnique({
      where: { projectId },
    });
    if (!quote) {
      throw new InputError("That quote no longer exists.");
    }
    await db.projectQuote.delete({ where: { projectId } });
    refreshProjects();
    return { status: "success", message: "Quote deleted." };
  } catch (error) {
    return actionError(error);
  }
}

function githubFields(formData: FormData) {
  const repositoryFullName = requiredText(
    formData,
    "repositoryFullName",
    "Repository",
    191,
  ).toLowerCase();

  if (
    !/^[a-z\d](?:[a-z\d-]*[a-z\d])?\/[a-z\d._-]+$/.test(
      repositoryFullName,
    )
  ) {
    throw new InputError("Repository must look like owner/repository.");
  }

  return {
    repositoryFullName,
    position: integer(formData, "position", "Showcase position"),
    label: optionalText(formData, "label", "Label", 120),
    descriptionOverride: optionalText(
      formData,
      "descriptionOverride",
      "Description override",
    ),
    isVisible: boolean(formData, "isVisible"),
  };
}

async function verifyOptionalProject(projectId: string | null) {
  if (!projectId) {
    return;
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) {
    throw new InputError("The selected project no longer exists.");
  }
}

export async function createGithubEntry(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  let entryId = "";

  try {
    const projectId = optionalId(formData, "projectId");
    await verifyOptionalProject(projectId);
    const entry = await db.githubShowcaseEntry.create({
      data: { projectId, ...githubFields(formData) },
    });
    entryId = entry.id;

    refreshGithub();
  } catch (error) {
    return actionError(error);
  }

  redirect(`/admin/github/${entryId}?created=1`);
}

export async function updateGithubEntry(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const id = requiredId(formData);
    const entry = await db.githubShowcaseEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new InputError("That GitHub entry no longer exists.");
    }
    const projectId = optionalId(formData, "projectId");
    await verifyOptionalProject(projectId);

    await db.githubShowcaseEntry.update({
      where: { id },
      data: { projectId, ...githubFields(formData) },
    });

    refreshGithub();
    return { status: "success", message: "GitHub entry saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteGithubEntry(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const id = requiredId(formData);
    const entry = await db.githubShowcaseEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new InputError("That GitHub entry no longer exists.");
    }
    await db.githubShowcaseEntry.delete({ where: { id } });
    refreshGithub();
  } catch (error) {
    return actionError(error);
  }

  redirect("/admin/github");
}

export async function saveGithubHost(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const entryId = requiredId(formData, "entryId");
    const entry = await db.githubShowcaseEntry.findUnique({
      where: { id: entryId },
      select: { id: true },
    });
    if (!entry) {
      throw new InputError("The parent GitHub entry no longer exists.");
    }

    const id = optionalId(formData, "id");
    const data = {
      host: requiredText(formData, "host", "Allowed host", 255).toLowerCase(),
      position: integer(formData, "position", "Host position"),
    };

    if (id) {
      const host = await db.githubAllowedHost.findFirst({
        where: { id, entryId },
      });
      if (!host) {
        throw new InputError("That allowed host no longer exists.");
      }
      await db.githubAllowedHost.update({ where: { id }, data });
    } else {
      await db.githubAllowedHost.create({ data: { entryId, ...data } });
    }

    refreshGithub();
    return {
      status: "success",
      message: id ? "Allowed host saved." : "Allowed host added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteGithubHost(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const entryId = requiredId(formData, "entryId");
    const id = requiredId(formData);
    const host = await db.githubAllowedHost.findFirst({
      where: { id, entryId },
    });
    if (!host) {
      throw new InputError("That allowed host no longer exists.");
    }
    await db.githubAllowedHost.delete({ where: { id } });
    refreshGithub();
    return { status: "success", message: "Allowed host deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveGithubSnapshot(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const entryId = requiredId(formData, "entryId");
    const entry = await db.githubShowcaseEntry.findUnique({
      where: { id: entryId },
      select: { id: true },
    });
    if (!entry) {
      throw new InputError("The parent GitHub entry no longer exists.");
    }

    const repositoryId = requiredText(
      formData,
      "githubRepositoryId",
      "GitHub repository ID",
    );
    if (!/^\d+$/.test(repositoryId)) {
      throw new InputError("GitHub repository ID must contain only digits.");
    }

    const data = {
      githubRepositoryId: BigInt(repositoryId),
      description: optionalText(formData, "description", "Description"),
      homepageUrl: optionalWebUrl(
        formData,
        "homepageUrl",
        "Homepage URL",
      ),
      language: optionalText(formData, "language", "Language", 100),
      repositoryUpdatedAt: dateTime(
        formData,
        "repositoryUpdatedAt",
        "Repository updated date",
        true,
      )!,
      archived: boolean(formData, "archived"),
      fork: boolean(formData, "fork"),
      checkedAt: dateTime(formData, "checkedAt", "Checked date", true)!,
    };

    await db.githubSnapshot.upsert({
      where: { entryId },
      create: { entryId, ...data },
      update: data,
    });

    refreshGithub();
    return { status: "success", message: "GitHub snapshot saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteGithubSnapshot(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const entryId = requiredId(formData, "entryId");
    const snapshot = await db.githubSnapshot.findUnique({
      where: { entryId },
    });
    if (!snapshot) {
      throw new InputError("That GitHub snapshot no longer exists.");
    }
    await db.githubSnapshot.delete({ where: { entryId } });
    refreshGithub();
    return { status: "success", message: "GitHub snapshot deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveGithubTopic(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const snapshotId = requiredId(formData, "snapshotId");
    const entryId = requiredId(formData, "entryId");
    const snapshot = await db.githubSnapshot.findFirst({
      where: { id: snapshotId, entryId },
      select: { id: true },
    });
    if (!snapshot) {
      throw new InputError("The parent GitHub snapshot no longer exists.");
    }

    const id = optionalId(formData, "id");
    const data = {
      name: requiredText(formData, "name", "Topic name", 80),
      position: integer(formData, "position", "Topic position"),
    };

    if (id) {
      const topic = await db.githubTopic.findFirst({
        where: { id, snapshotId },
      });
      if (!topic) {
        throw new InputError("That topic no longer exists.");
      }
      await db.githubTopic.update({ where: { id }, data });
    } else {
      await db.githubTopic.create({ data: { snapshotId, ...data } });
    }

    refreshGithub();
    return {
      status: "success",
      message: id ? "Topic saved." : "Topic added.",
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteGithubTopic(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const snapshotId = requiredId(formData, "snapshotId");
    const entryId = requiredId(formData, "entryId");
    const id = requiredId(formData);
    const topic = await db.githubTopic.findFirst({
      where: { id, snapshotId, snapshot: { entryId } },
    });
    if (!topic) {
      throw new InputError("That topic no longer exists.");
    }
    await db.githubTopic.delete({ where: { id } });
    refreshGithub();
    return { status: "success", message: "Topic deleted." };
  } catch (error) {
    return actionError(error);
  }
}
