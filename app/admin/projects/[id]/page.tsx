import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ProjectForm,
  ProjectRelations,
} from "@/components/admin/project-editor";
import {
  AdminBackLink,
  AdminPageHeader,
  StatusPill,
} from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProject } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Edit project",
};

type ProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
};

export default function EditProjectPage(props: ProjectPageProps) {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <EditProject params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function EditProject({
  params,
  searchParams,
}: {
  params: ProjectPageProps["params"];
  searchParams: ProjectPageProps["searchParams"];
}) {
  await requireAdmin();
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const project = await getAdminProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="admin-page">
      <AdminBackLink href="/admin/projects">Projects</AdminBackLink>
      <AdminPageHeader
        eyebrow="Project editor"
        title={project.title}
        description="Update the public story and manage its ordered sections and supporting content."
        action={
          <StatusPill
            tone={
              project.status === "PUBLISHED"
                ? "success"
                : project.status === "DRAFT"
                  ? "warning"
                  : "neutral"
            }
          >
            {project.status}
          </StatusPill>
        }
      />
      {search.created ? (
        <div className="admin-success-banner" role="status">
          Project created. Add story sections below, then publish when ready.
        </div>
      ) : null}
      <ProjectForm project={project} />
      <ProjectRelations project={project} />
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Loading project editor...</p>
    </div>
  );
}
