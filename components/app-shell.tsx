"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import type { PortfolioProfile } from "@/lib/queries/profile";

type AppShellProps = {
  profile: PortfolioProfile;
  children: ReactNode;
};

export function AppShell({ profile, children }: AppShellProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <>
      <SiteHeader profile={profile} />
      <div className="site-frame">{children}</div>
      <SiteFooter profile={profile} />
    </>
  );
}
