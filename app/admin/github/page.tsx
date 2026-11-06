import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  AdminPageHeader,
  EmptyState,
  StatusPill,
} from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";
import { formatAdminDate } from "@/lib/admin/format";
import { getAdminGithubList } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "GitHub showcase",
};

export default function AdminGithubPage() {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <AdminGithub />
    </Suspense>
  );
}

async function AdminGithub() {
  await requireAdmin();
  const entries = await getAdminGithubList();

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Open-source index"
        title="GitHub showcase"
        description="Curate repository visibility, approved hosts, snapshot metadata, and project links."
        action={
          <Link className="button button--primary" href="/admin/github/new">
            New entry <span aria-hidden="true">+</span>
          </Link>
        }
      />

      <div className="admin-result-count">
        <span>{String(entries.length).padStart(2, "0")} records</span>
        <p>Ordered by showcase position</p>
      </div>

      {entries.length ? (
        <div className="admin-table admin-table--github" role="table">
          <div className="admin-table__head" role="row">
            <span role="columnheader">Order</span>
            <span role="columnheader">Repository</span>
            <span role="columnheader">Visibility</span>
            <span role="columnheader">Metadata</span>
            <span role="columnheader">Action</span>
          </div>
          {entries.map((entry) => (
            <div className="admin-table__row" role="row" key={entry.id}>
              <span className="admin-table__order" role="cell">
                {String(entry.position).padStart(2, "0")}
              </span>
              <div role="cell">
                <p>{entry.label ?? "Repository"}</p>
                <Link href={`/admin/github/${entry.id}`}>
                  {entry.repositoryFullName}
                </Link>
                <small>
                  {entry.project
                    ? `Linked to ${entry.project.title}`
                    : "Not linked to an authored project"}
                </small>
              </div>
              <span role="cell">
                <StatusPill tone={entry.isVisible ? "success" : "neutral"}>
                  {entry.isVisible ? "VISIBLE" : "HIDDEN"}
                </StatusPill>
              </span>
              <span className="admin-table__metadata" role="cell">
                {entry.snapshot
                  ? `${entry.snapshot.language ?? "Unknown language"} · ${
                      entry.snapshot._count.topics
                    } topics`
                  : "No snapshot"}
                <small>
                  {entry.snapshot
                    ? `Checked ${formatAdminDate(entry.snapshot.checkedAt)}`
                    : `${entry._count.allowedHosts} allowed hosts`}
                </small>
              </span>
              <span role="cell">
                <Link
                  className="admin-row-action"
                  href={`/admin/github/${entry.id}`}
                >
                  Edit <span aria-hidden="true">→</span>
                </Link>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No GitHub entries"
          description="Add a curated repository to populate the public open-source showcase."
          action={
            <Link className="button button--secondary" href="/admin/github/new">
              Create GitHub entry
            </Link>
          }
        />
      )}
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Loading GitHub showcase...</p>
    </div>
  );
}
