import {
  Kicker,
  SectionHeading,
} from "@/components/editorial";
import { getGithubShowcase } from "@/lib/github-showcase";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export async function GithubShowcase() {
  const showcase = await getGithubShowcase();

  if (!showcase || showcase.repositories.length === 0) {
    return null;
  }

  return (
    <section
      id="open-source"
      className="github-showcase"
      aria-labelledby="open-source-title"
    >
      <SectionHeading
        id="open-source-title"
        eyebrow="Open source / GitHub"
        title="Work in public."
        note="Selected public repositories, kept separate from the authored project stories. These are a record of the work and the learning around it."
      />

      <div className="github-showcase__intro">
        <p>
          Repository details are current as of {dateFormatter.format(
            new Date(showcase.checkedAt),
          )}. Follow along on GitHub for the latest code.
        </p>
        <a
          className="button button--quiet"
          href={showcase.profileUrl}
          aria-label={`Visit the ${showcase.account} GitHub profile`}
        >
          Visit GitHub profile <span aria-hidden="true">↗</span>
        </a>
      </div>

      {showcase.isStaleSnapshot ? (
        <p className="github-showcase__snapshot-note">
          Updated from a saved snapshot while GitHub is unavailable.
        </p>
      ) : null}

      <div className="github-repository-grid">
        {showcase.repositories.map((repository, index) => (
          <article className="github-repository" key={repository.id}>
            <span className="github-repository__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Kicker>{repository.label ?? "Public repository"}</Kicker>
            <h3>
              <a
                href={repository.url}
                aria-label={`Open ${repository.fullName} on GitHub`}
              >
                {repository.name}
              </a>
            </h3>
            {repository.description ? <p>{repository.description}</p> : null}

            <dl className="github-repository__meta">
              {repository.language ? (
                <div>
                  <dt>Language</dt>
                  <dd>{repository.language}</dd>
                </div>
              ) : null}
              {repository.topics.length ? (
                <div>
                  <dt>Topics</dt>
                  <dd>
                    <ul>
                      {repository.topics.slice(0, 3).map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Last updated</dt>
                <dd>
                  <time dateTime={repository.updatedAt}>
                    {dateFormatter.format(new Date(repository.updatedAt))}
                  </time>
                </dd>
              </div>
            </dl>

            <div className="github-repository__actions">
              {repository.homepageUrl ? (
                <a href={repository.homepageUrl}>Visit live site ↗</a>
              ) : null}
              <a
                href={repository.url}
                aria-label={`View ${repository.fullName} source on GitHub`}
              >
                View source on GitHub ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
