import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProjectStatus } from "@prisma/client";
import {
  AdminPageHeader,
  EmptyState,
  StatusPill,
} from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";
import { formatAdminDate } from "@/lib/admin/format";
import { getAdminProjectList } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Projects",
};

type SearchParams = Promise<{
  q?: string | string[];
  status?: string | string[];
}>;

export default function AdminProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <AdminProjects searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminProjects({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const statusValue =
    typeof params.status === "string" ? params.status : undefined;
  const status = Object.values(ProjectStatus).includes(
    statusValue as ProjectStatus,
  )
    ? (statusValue as ProjectStatus)
    : undefined;
  const projects = await getAdminProjectList({ query, status });

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Editorial content"
        title="Projects"
        description="Create, publish, reorder, and edit every project story."
        action={
          <Link className="button button--primary" href="/admin/projects/new">
            New project <span aria-hidden="true">+</span>
          </Link>
        }
      />

      <form className="admin-filter-bar" method="get">
        <label>
          <span>Search</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Title, slug, or kicker"
          />
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <button className="button button--secondary" type="submit">
          Apply
        </button>
        {query || status ? (
          <Link className="text-link" href="/admin/projects">
            Clear
          </Link>
        ) : null}
      </form>

      <div className="admin-result-count">
        <span>{String(projects.length).padStart(2, "0")} records</span>
        <p>
          {query ? `Matching “${query}”` : "Ordered by public project position"}
        </p>
      </div>

      {projects.length ? (
        <div className="admin-table" role="table" aria-label="Project records">
          <div className="admin-table__head" role="row">
            <span role="columnheader">Order</span>
            <span role="columnheader">Project</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Updated</span>
            <span role="columnheader">Action</span>
          </div>
          {projects.map((project) => (
            <div className="admin-table__row" role="row" key={project.id}>
              <span className="admin-table__order" role="cell">
                {String(project.sortOrder).padStart(2, "0")}
              </span>
              <div role="cell">
                <p>{project.kicker}</p>
                <Link href={`/admin/projects/${project.id}`}>
                  {project.title}
                </Link>
                <small>
                  /work/{project.slug} · {project._count.sections} sections
                </small>
              </div>
              <span role="cell">
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
              </span>
              <span className="admin-table__date" role="cell">
                {formatAdminDate(project.updatedAt)}
              </span>
              <span role="cell">
                <Link
                  className="admin-row-action"
                  href={`/admin/projects/${project.id}`}
                >
                  Edit <span aria-hidden="true">→</span>
                </Link>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects match"
          description="Adjust the filters or create a new project story."
          action={
            <Link className="button button--secondary" href="/admin/projects">
              Clear filters
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
      <p>Loading projects...</p>
    </div>
  );
}
