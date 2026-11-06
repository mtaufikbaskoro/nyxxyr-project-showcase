"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/profile", label: "Profile & CV" },
  { href: "/admin/github", label: "GitHub showcase" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar__nav" aria-label="Admin navigation">
      {navigation.map((item, index) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
