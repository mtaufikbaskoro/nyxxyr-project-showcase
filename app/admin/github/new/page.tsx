import type { Metadata } from "next";
import { Suspense } from "react";
import { GithubEntryForm } from "@/components/admin/github-editor";
import { AdminBackLink, AdminPageHeader } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProjectOptions } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "New GitHub entry",
};

export default function NewGithubEntryPage() {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <NewGithubEntry />
    </Suspense>
  );
}

async function NewGithubEntry() {
  await requireAdmin();
  const projects = await getAdminProjectOptions();

  return (
    <div className="admin-page">
      <AdminBackLink href="/admin/github">GitHub showcase</AdminBackLink>
      <AdminPageHeader
        eyebrow="Create"
        title="New GitHub entry"
        description="Start with the repository identity, then add its snapshot, topics, and approved hosts."
      />
      <GithubEntryForm projects={projects} />
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Preparing GitHub entry...</p>
    </div>
  );
}
