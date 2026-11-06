import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { getProfile } from "@/lib/queries/profile";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    title: {
      default: "M Taufik Baskoro - Web programmer",
      template: `%s | ${profile.name}`,
    },
    description:
      "M Taufik Baskoro's portfolio: frontend development, civic data, and government systems, with work spanning Medan's public-sector projects.",
    applicationName: "M Taufik Baskoro Portfolio",
    authors: [{ name: profile.name }],
    openGraph: {
      title: "M Taufik Baskoro - Web programmer",
      description:
        "Selected work in frontend development, civic data, and government systems.",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Suspense fallback={<div className="site-frame">{children}</div>}>
          <AppShell profile={profile}>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
