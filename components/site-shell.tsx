import Link from "next/link";
import type { PortfolioProfile } from "@/lib/queries/profile";

const baseNavigation = [
  { href: "/#front-page", label: "Front page" },
  { href: "/#selected-work", label: "Selected work" },
  { href: "/#background", label: "Background" },
  { href: "/#contact", label: "Correspondence" },
];

type SiteShellProps = {
  profile: PortfolioProfile;
};

function getGithubProfileUrl(profile: PortfolioProfile) {
  return profile.githubAccount
    ? `https://github.com/${profile.githubAccount}`
    : null;
}

export function SiteHeader({ profile }: SiteShellProps) {
  const githubProfileUrl = getGithubProfileUrl(profile);
  const navigation = githubProfileUrl
    ? [
        ...baseNavigation.slice(0, 2),
        { href: "/#open-source", label: "Open source" },
        ...baseNavigation.slice(2),
      ]
    : baseNavigation;

  return (
    <header className="site-header">
      <div className="utility-bar">
        <p>Personal portfolio</p>
        <p className="utility-bar__note">Web and data systems</p>
        <Link href="/design-system">Design desk</Link>
      </div>
      <div className="masthead">
        <Link
          className="masthead__brand"
          href="/"
          aria-label={`${profile.name} front page`}
        >
          <span>M Taufik</span>
          <span>Baskoro</span>
        </Link>
        <p className="masthead__descriptor">{profile.summary}</p>
        <p className="masthead__edition">Selected work · 2026</p>
      </div>
      <nav className="section-nav" aria-label="Primary navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/design-system">Design system ↗</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter({ profile }: SiteShellProps) {
  const githubProfileUrl = getGithubProfileUrl(profile);

  return (
    <footer className="site-footer" aria-labelledby="colophon-title">
      <div className="site-footer__lead">
        <p className="kicker">Colophon</p>
        <h2 id="colophon-title">{profile.name} / Notes from the desk</h2>
        <p>
          A personal portfolio about frontend development, government data
          systems, and software quality. Project stories are kept separate from
          public code repositories.
        </p>
      </div>
      <nav className="site-footer__nav" aria-label="Footer navigation">
        <Link href="/#selected-work">Selected work</Link>
        <a href={githubProfileUrl ?? profile.githubUrl}>GitHub profile ↗</a>
        <Link href="/#background">Background</Link>
        <Link href="/design-system">Design desk</Link>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedInUrl}>LinkedIn ↗</a>
      </nav>
      <div className="site-footer__folio">
        <span>© {profile.copyrightYear} {profile.name}</span>
        <span>Set in system editorial types</span>
        <a href="#main-content">Return to top ↑</a>
      </div>
    </footer>
  );
}
