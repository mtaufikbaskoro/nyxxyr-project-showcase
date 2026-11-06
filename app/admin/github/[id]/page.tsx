import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  GithubEntryForm,
  GithubRelations,
} from "@/components/admin/github-editor";
import {
  AdminBackLink,
  AdminPageHeader,
  StatusPill,
} from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getAdminGithubEntry,
  getAdminProjectOptions,
} from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Edit GitHub entry",
};

type GithubPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
};

export default function EditGithubEntryPage(props: GithubPageProps) {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <EditGithubEntry params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function EditGithubEntry({
  params,
  searchParams,
}: {
  params: GithubPageProps["params"];
  searchParams: GithubPageProps["searchParams"];
}) {
  await requireAdmin();
  const [{ id }, search, projects] = await Promise.all([
    params,
    searchParams,
    getAdminProjectOptions(),
  ]);
  const entry = await getAdminGithubEntry(id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="admin-page">
      <AdminBackLink href="/admin/github">GitHub showcase</AdminBackLink>
      <AdminPageHeader
        eyebrow="Showcase editor"
        title={entry.label ?? entry.repositoryFullName}
        description="Update repository presentation and all cached metadata used by the public open-source section."
        action={
          <StatusPill tone={entry.isVisible ? "success" : "neutral"}>
            {entry.isVisible ? "VISIBLE" : "HIDDEN"}
          </StatusPill>
        }
      />
      {search.created ? (
        <div className="admin-success-banner" role="status">
          GitHub entry created. Add a snapshot and topics when ready.
        </div>
      ) : null}
      <GithubEntryForm entry={entry} projects={projects} />
      <GithubRelations entry={entry} />
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Loading GitHub entry...</p>
    </div>
  );
}
