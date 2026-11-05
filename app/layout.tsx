import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
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
        <SiteHeader profile={profile} />
        <div className="site-frame">{children}</div>
        <SiteFooter profile={profile} />
      </body>
    </html>
  );
}
