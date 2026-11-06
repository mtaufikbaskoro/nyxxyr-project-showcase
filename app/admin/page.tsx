import Link from "next/link";
import { Suspense } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  StatusPill,
} from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOverview } from "@/lib/admin/queries";

export const metadata = {
  title: "Overview",
};

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <AdminOverview />
    </Suspense>
  );
}

async function AdminOverview() {
  await requireAdmin();
  const { profile, projects, counts } = await getAdminOverview();

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Portfolio administration"
        title="Control room"
        description="Manage the stories, profile content, and GitHub showcase that power the public portfolio."
        action={
          <Link className="button button--primary" href="/admin/projects/new">
            New project <span aria-hidden="true">+</span>
          </Link>
        }
      />

      <section className="admin-metrics" aria-label="Portfolio summary">
        <article>
          <span>All projects</span>
          <strong>{String(counts.projectCount).padStart(2, "0")}</strong>
          <p>
            {counts.publishedCount} published / {counts.draftCount} draft
          </p>
        </article>
        <article>
          <span>Published</span>
          <strong>{String(counts.publishedCount).padStart(2, "0")}</strong>
          <p>Visible on the public portfolio.</p>
        </article>
        <article>
          <span>GitHub entries</span>
          <strong>{String(counts.githubCount).padStart(2, "0")}</strong>
          <p>Curated repository showcase entries.</p>
        </article>
        <article>
          <span>Supporting content</span>
          <strong>
            {String(
              (profile?._count.backgroundItems ?? 0) +
                (profile?._count.credentials ?? 0) +
                (profile?._count.skills ?? 0),
            ).padStart(2, "0")}
          </strong>
          <p>Background, credentials, and skills.</p>
        </article>
      </section>

      <div className="admin-overview-grid">
        <AdminPanel
          id="recent-projects"
          title="Recently updated"
          description="Unpublished work is included here."
          action={
            <Link className="text-link" href="/admin/projects">
              All projects <span aria-hidden="true">→</span>
            </Link>
          }
        >
          {projects.length ? (
            <ol className="admin-project-list">
              {projects.map((project) => (
                <li key={project.id}>
                  <span className="admin-project-list__number">
                    {String(project.sortOrder).padStart(2, "0")}
                  </span>
                  <div>
                    <p>{project.kicker}</p>
                    <Link href={`/admin/projects/${project.id}`}>
                      {project.title}
                    </Link>
                    <small>
                      {project._count.sections} sections
                      {project.githubEntry
                        ? ` / ${project.githubEntry.repositoryFullName}`
                        : ""}
                    </small>
                  </div>
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
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              title="No project stories yet"
              description="Create the first record to start building the public work index."
              action={
                <Link
                  className="button button--secondary"
                  href="/admin/projects/new"
                >
                  Create project
                </Link>
              }
            />
          )}
        </AdminPanel>

        <aside className="admin-overview-rail">
          <AdminPanel title="Current profile" tone="reverse">
            {profile ? (
              <>
                <p className="admin-profile-name">{profile.name}</p>
                <p className="admin-muted">{profile.summary}</p>
                <dl className="admin-mini-list">
                  <div>
                    <dt>Projects</dt>
                    <dd>{profile._count.projects}</dd>
                  </div>
                  <div>
                    <dt>Background</dt>
                    <dd>{profile._count.backgroundItems}</dd>
                  </div>
                  <div>
                    <dt>Credentials</dt>
                    <dd>{profile._count.credentials}</dd>
                  </div>
                </dl>
                <Link
                  className="button button--secondary"
                  href="/admin/profile"
                >
                  Edit profile
                </Link>
              </>
            ) : (
              <EmptyState
                title="Profile missing"
                description="Seed the database to create the portfolio profile."
              />
            )}
          </AdminPanel>

          <AdminPanel title="Quick actions">
            <nav className="admin-quick-links" aria-label="Quick actions">
              <Link href="/admin/projects/new">
                <span>Project</span>
                <strong>Create a story</strong>
                <i aria-hidden="true">↗</i>
              </Link>
              <Link href="/admin/profile#background">
                <span>CV</span>
                <strong>Add background</strong>
                <i aria-hidden="true">↗</i>
              </Link>
              <Link href="/admin/github/new">
                <span>GitHub</span>
                <strong>Add repository</strong>
                <i aria-hidden="true">↗</i>
              </Link>
            </nav>
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Loading dashboard...</p>
    </div>
  );
}
