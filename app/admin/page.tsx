import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logoutAdmin } from "@/lib/admin-auth-actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getProfile } from "@/lib/queries/profile";
import { getPublishedProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Private portfolio administration dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main id="main-content" className="page-shell admin-dashboard">
      <Suspense fallback={<AdminDashboardFallback />}>
        <AdminDashboard />
      </Suspense>
    </main>
  );
}

async function AdminDashboard() {
  await requireAdmin();
  const [profile, projects] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
  ]);

  return (
    <>
      <header className="admin-dashboard__header">
        <div>
          <p className="kicker kicker--accent">Portfolio administration</p>
          <h1>Control room</h1>
          <p>
            A private overview of the published portfolio for {profile.name}.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button className="button button--secondary" type="submit">
            Sign out
          </button>
        </form>
      </header>

      <section
        className="admin-dashboard__metrics"
        aria-label="Portfolio summary"
      >
        <article>
          <span>Published projects</span>
          <strong>{String(projects.length).padStart(2, "0")}</strong>
          <p>Visible on the public portfolio.</p>
        </article>
        <article>
          <span>Admin access</span>
          <strong>01</strong>
          <p>One authorized NIK is configured.</p>
        </article>
        <article>
          <span>Session window</span>
          <strong>8h</strong>
          <p>The signed session expires automatically.</p>
        </article>
      </section>

      <div className="admin-dashboard__columns">
        <section
          className="admin-dashboard__projects"
          aria-labelledby="admin-projects-title"
        >
          <header>
            <div>
              <p className="kicker">Published work</p>
              <h2 id="admin-projects-title">Live project index</h2>
            </div>
            <Link className="text-link" href="/#selected-work">
              View public index <span aria-hidden="true">→</span>
            </Link>
          </header>
          <ol>
            {projects.map((project) => (
              <li key={project.slug}>
                <span className="admin-dashboard__index">{project.index}</span>
                <div>
                  <p>{project.kicker}</p>
                  <h3>{project.title}</h3>
                  <span>
                    {[project.period, project.readingTime]
                      .filter(Boolean)
                      .join(" / ")}
                  </span>
                </div>
                <Link href={`/work/${project.slug}`}>
                  Open <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <aside className="admin-dashboard__profile">
          <p className="kicker">Account context</p>
          <h2>{profile.name}</h2>
          <p>{profile.summary}</p>
          <dl>
            <div>
              <dt>Public status</dt>
              <dd>Portfolio online</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Access policy</dt>
              <dd>Environment hash + signed cookie</dd>
            </div>
          </dl>
          <Link className="button button--primary" href="/">
            Open public site <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
    </>
  );
}

function AdminDashboardFallback() {
  return (
    <div className="admin-dashboard__loading" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Checking admin session...</p>
    </div>
  );
}
