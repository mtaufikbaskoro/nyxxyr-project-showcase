import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nyxxyr — Selected projects",
    template: "%s — Nyxxyr",
  },
  description:
    "Nyxxyr's project showcase: interfaces, identities, and useful digital systems presented as stories.",
  applicationName: "Nyxxyr Project Showcase",
  authors: [{ name: "Nyxxyr" }],
  openGraph: {
    title: "Nyxxyr — Selected projects",
    description:
      "A considered look at digital products, identities, and services made useful.",
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
