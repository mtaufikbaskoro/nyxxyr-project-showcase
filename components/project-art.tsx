import type { Project } from "@/lib/projects";

type ProjectArtProps = {
  project: Project;
  size?: "large" | "card" | "compact";
};

function CivicArt() {
  return (
    <div className="art-shell art-shell--desktop">
      <div className="art-toolbar" aria-hidden="true">
        <span className="art-dot" />
        <span className="art-dot" />
        <span className="art-dot" />
        <span className="art-url">northline.gov / services</span>
      </div>
      <div className="art-civic">
        <div className="art-civic-side">
          <span className="art-mark">N</span>
          <span className="art-nav-line art-nav-line--active" />
          <span className="art-nav-line" />
          <span className="art-nav-line" />
          <span className="art-nav-line art-nav-line--short" />
        </div>
        <div className="art-civic-main">
          <p className="art-eyebrow">Resident services</p>
          <p className="art-display">What do you need today?</p>
          <div className="art-search">
            <span>Describe your question</span>
            <span aria-hidden="true">→</span>
          </div>
          <div className="art-service-row">
            <span>Report a problem</span>
            <span className="art-chip">2 min</span>
          </div>
          <div className="art-service-row">
            <span>Find local support</span>
            <span className="art-chip">Start here</span>
          </div>
          <div className="art-progress">
            <span className="art-progress-dot" />
            <span />
            <span className="art-progress-label">Application 3 of 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryArt() {
  return (
    <div className="art-shell art-shell--desktop art-shell--library">
      <div className="art-toolbar" aria-hidden="true">
        <span>Common Shelf</span>
        <span className="art-url">Browse / This week</span>
      </div>
      <div className="art-library">
        <p className="art-eyebrow">Ask the shelf</p>
        <p className="art-display">Find something worth staying up for.</p>
        <div className="art-search">
          <span>A quiet mystery, set nearby</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div className="art-shelves">
          <div className="art-book art-book--one">
            <span>New arrivals</span>
            <strong>Five books for a slow Sunday</strong>
          </div>
          <div className="art-book art-book--two">
            <span>Around the corner</span>
            <strong>Neighborhood reading room</strong>
          </div>
          <div className="art-book art-book--three">
            <span>Staff shelf</span>
            <strong>What we are reading</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClimateArt() {
  return (
    <div className="art-shell art-shell--desktop art-shell--climate">
      <div className="art-toolbar" aria-hidden="true">
        <span>Field Atlas / Regional brief</span>
        <span className="art-url">03 / 12</span>
      </div>
      <div className="art-climate">
        <div className="art-map">
          <span className="art-map-label">North / 12°C</span>
          <span className="art-map-line art-map-line--a" />
          <span className="art-map-line art-map-line--b" />
          <span className="art-map-line art-map-line--c" />
          <span className="art-map-marker" />
        </div>
        <div className="art-climate-copy">
          <p className="art-eyebrow">Seasonal shift</p>
          <p className="art-display">Warmer winters. Later rains.</p>
          <div className="art-chart" aria-hidden="true">
            <span style={{ height: "34%" }} />
            <span style={{ height: "46%" }} />
            <span style={{ height: "41%" }} />
            <span style={{ height: "62%" }} />
            <span style={{ height: "76%" }} />
            <span style={{ height: "88%" }} />
          </div>
          <p className="art-note">Five-year observation · Regional station data</p>
        </div>
      </div>
    </div>
  );
}

function CareArt() {
  return (
    <div className="art-shell art-shell--phone-frame">
      <div className="art-phone">
        <span className="art-phone-speaker" />
        <div className="art-phone-top">
          <p className="art-eyebrow">Afterward / Day 02</p>
          <span className="art-phone-avatar">MJ</span>
        </div>
        <p className="art-display">Today, one thing at a time.</p>
        <div className="art-care-plan">
          <span className="art-care-time">8:00</span>
          <div>
            <strong>Morning review</strong>
            <span>Check incision · 2 min</span>
          </div>
          <span className="art-check">✓</span>
        </div>
        <div className="art-care-plan art-care-plan--next">
          <span className="art-care-time">12:30</span>
          <div>
            <strong>Medication</strong>
            <span>With lunch · 1 dose</span>
          </div>
          <span className="art-outline" />
        </div>
        <div className="art-care-help">
          <span>Questions today?</span>
          <strong>Message the care team</strong>
        </div>
      </div>
    </div>
  );
}

export function ProjectArt({ project, size = "card" }: ProjectArtProps) {
  const content =
    project.theme === "civic" ? (
      <CivicArt />
    ) : project.theme === "library" ? (
      <LibraryArt />
    ) : project.theme === "climate" ? (
      <ClimateArt />
    ) : (
      <CareArt />
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
