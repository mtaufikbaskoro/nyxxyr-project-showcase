import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
import { Kicker } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Admin access",
  description: "Private access to the portfolio administration desk.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main id="main-content" className="page-shell admin-access-page">
      <section className="admin-access" aria-labelledby="admin-access-title">
        <div className="admin-access__brief">
          <div className="admin-access__stamp">
            <span>Private desk</span>
            <span>Authorized personnel / 01</span>
          </div>
          <Kicker accent>Administration</Kicker>
          <h1 id="admin-access-title">Access the working desk.</h1>
          <p className="admin-access__lede">
            The dashboard is reserved for the portfolio owner. Enter the
            authorized NIK to continue.
          </p>
          <div className="admin-access__rules" aria-label="Access details">
            <div>
              <span>Verification</span>
              <strong>Server-side</strong>
            </div>
            <div>
              <span>Session</span>
              <strong>8 hours</strong>
            </div>
          </div>
        </div>

        <div className="admin-access__panel">
          <header>
            <Kicker>Sign in</Kicker>
            <h2>Owner verification</h2>
            <p>
              Only the NIK registered in the server environment can open the
              dashboard.
            </p>
          </header>
          <AdminLoginForm />
          <footer>
            <Link className="text-link" href="/">
              Return to portfolio <span aria-hidden="true">→</span>
            </Link>
            <span>Restricted access</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
