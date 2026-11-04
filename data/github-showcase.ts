export type GithubShowcaseEntry = {
  repository: `${string}/${string}`;
  descriptionOverride?: string;
  label?: string;
  allowedHomepageHosts?: string[];
};

export const githubShowcaseAccountType: "user" | "organization" = "user";

export const githubShowcaseEntries: GithubShowcaseEntry[] = [
  {
    repository: "mtaufikbaskoro/bas-dila-invitation-wedding",
    label: "Wedding invitation",
    descriptionOverride:
      "A TypeScript wedding invitation with a live Vercel deployment.",
    allowedHomepageHosts: ["bas-dila-invitation-wedding.vercel.app"],
  },
  {
    repository: "mtaufikbaskoro/mohan-builder",
    label: "Game companion",
    descriptionOverride:
      "A Monster Hunter World information and set builder.",
  },
  {
    repository: "mtaufikbaskoro/qr-vue",
    label: "Vue integration",
    descriptionOverride:
      "A Vue implementation for the Quantum Rekatama project.",
  },
  {
    repository: "mtaufikbaskoro/frontend-aplikasi-sdgs",
    label: "SDG frontend",
    descriptionOverride:
      "A JavaScript frontend for an SDG-focused application.",
  },
  {
    repository: "mtaufikbaskoro/fooder",
    label: "Web application",
    descriptionOverride: "A website built for a Bappeda test.",
  },
  {
    repository: "mtaufikbaskoro/onlib",
    label: "Book discovery",
    descriptionOverride: "A web project about books and their descriptions.",
  },
];
