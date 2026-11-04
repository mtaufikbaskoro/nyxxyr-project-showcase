import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { profile } from "@/lib/profile";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <div className="site-frame">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
