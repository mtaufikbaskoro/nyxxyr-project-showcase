import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "@/lib/admin-auth-actions";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Portfolio admin",
  },
  description: "Private portfolio administration dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__masthead">
          <p>Portfolio admin</p>
          <Link href="/admin">
            <span>Desk</span>
            <strong>Control</strong>
          </Link>
          <span>Private workspace / 2026</span>
        </div>
        <AdminNav />
        <div className="admin-sidebar__footer">
          <Link href="/">View public site ↗</Link>
          <form action={logoutAdmin}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <main id="main-content" className="admin-main">
        {children}
      </main>
    </div>
  );
}

function AdminShellFallback() {
  return (
    <div className="admin-shell-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Checking admin session...</p>
    </div>
  );
}
