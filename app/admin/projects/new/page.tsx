import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectForm } from "@/components/admin/project-editor";
import { AdminBackLink, AdminPageHeader } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "New project",
};

export default function NewProjectPage() {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <NewProject />
    </Suspense>
  );
}

async function NewProject() {
  await requireAdmin();

  return (
    <div className="admin-page">
      <AdminBackLink href="/admin/projects">Projects</AdminBackLink>
      <AdminPageHeader
        eyebrow="Create"
        title="New project"
        description="Start with the core story, then add sections and supporting evidence after it exists."
      />
      <ProjectForm />
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Preparing project form...</p>
    </div>
  );
}
