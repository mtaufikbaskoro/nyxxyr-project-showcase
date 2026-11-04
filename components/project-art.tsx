import type { Project } from "@/lib/projects";

type ProjectArtProps = {
  project: Project;
  size?: "large" | "card" | "compact";
};

function SdgArt() {
  return (
    <div className="art-shell art-shell--desktop">
      <div className="art-toolbar" aria-hidden="true">
        <span className="art-dot" />
        <span className="art-dot" />
        <span className="art-dot" />
        <span className="art-url">astra-jm / sdg overview</span>
      </div>
      <div className="art-sdg">
        <div className="art-sdg-rail">
          <span className="art-mark">A</span>
          <span className="art-nav-line art-nav-line--active" />
          <span className="art-nav-line" />
          <span className="art-nav-line art-nav-line--short" />
          <strong>17</strong>
          <small>SDG goals</small>
        </div>
        <div className="art-sdg-main">
          <p className="art-eyebrow">Medan SDG monitoring</p>
          <p className="art-display">Shared goals. Shared progress.</p>
          <div className="art-contributors">
            <span>Government</span>
            <span>Non-profit</span>
            <span>Private sector</span>
          </div>
          <div className="art-goal-grid">
            <div>
              <span>01</span>
              <strong>No poverty</strong>
            </div>
            <div>
              <span>04</span>
              <strong>Quality education</strong>
            </div>
            <div>
              <span>11</span>
              <strong>Sustainable cities</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineeringArt() {
  return (
    <div className="art-shell art-shell--desktop art-shell--engineering">
      <div className="art-toolbar" aria-hidden="true">
        <span>Quantum Rekatama</span>
        <span className="art-url">Services / Team / Projects</span>
      </div>
      <div className="art-engineering">
        <div className="art-engineering-head">
          <p className="art-eyebrow">Civil · Mechanical · Electrical</p>
          <p className="art-display">Engineering for what comes next.</p>
        </div>
        <div className="art-engineering-body">
          <div className="art-engineering-services">
            <span>01 / Infrastructure</span>
            <span>02 / Operations</span>
            <span>03 / Sustainability</span>
          </div>
          <div className="art-engineering-drawing" aria-hidden="true">
            <span />
            <span />
            <span />
            <i />
          </div>
        </div>
        <div className="art-engineering-cards">
          <div>
            <span>People</span>
            <strong>Meet the team</strong>
          </div>
          <div>
            <span>Work</span>
            <strong>Client projects</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationArt() {
  return (
    <div className="art-shell art-shell--desktop art-shell--education">
      <div className="art-toolbar" aria-hidden="true">
        <span className="art-dot" />
        <span className="art-dot" />
        <span className="art-dot" />
        <span className="art-url">dapodikdasmen / medan</span>
      </div>
      <div className="art-education">
        <div className="art-education-head">
          <p className="art-eyebrow">Primary and secondary education</p>
          <p className="art-display">One door to education data.</p>
          <p className="art-note">Schools · Students · Teaching staff</p>
        </div>
        <div className="art-education-grid">
          <div className="art-education-card art-education-card--schools">
            <span>Schools</span>
            <strong>Institutional profiles</strong>
            <i aria-hidden="true" />
          </div>
          <div className="art-education-card art-education-card--students">
            <span>Students</span>
            <strong>Shared records</strong>
            <i aria-hidden="true" />
          </div>
          <div className="art-education-card art-education-card--staff">
            <span>Teaching staff</span>
            <strong>Integrated access</strong>
            <i aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectArt({ project, size = "card" }: ProjectArtProps) {
  const content =
    project.theme === "civic" ? (
      <SdgArt />
    ) : project.theme === "engineering" ? (
      <EngineeringArt />
    ) : (
      <EducationArt />
    );

  return (
    <div
      className={`project-art project-art--${project.theme} project-art--${size}`}
      role="img"
      aria-label={project.imageAlt}
    >
      {content}
    </div>
  );
}
