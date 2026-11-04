import Link from "next/link";
import { getGithubProfileUrl } from "@/lib/github-showcase";

const baseNavigation = [
  { href: "/#front-page", label: "Front page" },
  { href: "/#selected-work", label: "Selected work" },
  { href: "/#approach", label: "Approach" },
  { href: "/#contact", label: "Correspondence" },
];

export function SiteHeader() {
  const githubProfileUrl = getGithubProfileUrl();
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
        <p>Vol. 01 · November 2026</p>
        <p className="utility-bar__note">An independent project showcase</p>
        <Link href="/design-system">Design desk</Link>
      </div>
      <div className="masthead">
        <Link className="masthead__brand" href="/" aria-label="Nyxxyr front page">
          Nyxxyr
        </Link>
        <p className="masthead__descriptor">
          Interfaces, identities, and useful things.
        </p>
        <p className="masthead__edition">Specimen edition · No. 01</p>
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

export function SiteFooter() {
  const githubProfileUrl = getGithubProfileUrl();

  return (
    <footer className="site-footer" aria-labelledby="colophon-title">
      <div className="site-footer__lead">
        <p className="kicker">Colophon</p>
        <h2 id="colophon-title">Nyxxyr / Notes from the desk</h2>
        <p>
          A working showcase for thoughtful digital products. Project names,
          outcomes, and credits in this edition are representative until final
          material is approved.
        </p>
      </div>
      <nav className="site-footer__nav" aria-label="Footer navigation">
        <Link href="/#selected-work">Selected work</Link>
        {githubProfileUrl ? (
          <a href={githubProfileUrl}>GitHub profile ↗</a>
        ) : null}
        <Link href="/#approach">Approach</Link>
        <Link href="/design-system">Design desk</Link>
        <a href="mailto:hello@nyxxyr.studio">hello@nyxxyr.studio</a>
      </nav>
      <div className="site-footer__folio">
        <span>© 2026 Nyxxyr</span>
        <span>Set in system editorial types</span>
        <a href="#main-content">Return to top ↑</a>
      </div>
    </footer>
  );
}
