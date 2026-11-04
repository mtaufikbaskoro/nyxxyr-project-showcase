export type ProjectTheme = "civic" | "engineering" | "education";

export type ProjectStorySection = {
  title: string;
  body: string[];
};

export type Project = {
  slug: string;
  index: string;
  kicker: string;
  title: string;
  summary: string;
  period?: string;
  role?: string;
  focus: string;
  readingTime: string;
  takeaway: string;
  evidence?: {
    value: string;
    label: string;
  };
  githubRepository?: string;
  theme: ProjectTheme;
  imageAlt: string;
  caption: string;
  story: {
    lead: string;
    sections: ProjectStorySection[];
    quote?: {
      text: string;
      attribution: string;
    };
  };
};

export const projects: Project[] = [
  {
    slug: "astra-jm",
    index: "01",
    kicker: "Civic data / Astra JM",
    title: "A shared view of Medan's SDG progress.",
    summary:
      "An application for monitoring Sustainable Development Goals achievements across Medan's local government, non-profit, and private-sector contributors.",
    focus: "SDG monitoring and cross-sector data",
    readingTime: "4 min read",
    takeaway:
      "Contributions from government, non-profit, and private-sector actors are brought into one SDG view for evaluation and planning.",
    evidence: {
      value: "17",
      label: "SDG goals represented in one tracking platform",
    },
    theme: "civic",
    imageAlt:
      "Illustrative Astra JM SDG monitoring interface showing 17 goals, contributor groups, and progress rows.",
    caption:
      "An illustrative view of the shared SDG framework used to compare contributions and support planning.",
    story: {
      lead:
        "Brings contributions from multiple organizations into one view so the city can evaluate progress and plan future sustainable development work.",
      sections: [
        {
          title: "Create a collaborative data picture",
          body: [
            "The project connects local government agencies, non-profit institutions, and private-sector actors to the same SDG framework.",
          ],
        },
        {
          title: "Support planning, not just reporting",
          body: [
            "The application is designed to help Medan evaluate achievements and use that information for future planning.",
          ],
        },
      ],
    },
  },
  {
    slug: "quantum-rekatama",
    index: "02",
    kicker: "Engineering web / Quantum Rekatama",
    title: "A clearer front door for an engineering firm.",
    summary:
      "A professional web presence for a Civil, Mechanical, and Electrical engineering firm focused on innovation and sustainability.",
    role: "Frontend Developer",
    focus: "Frontend development and component systems",
    readingTime: "3 min read",
    takeaway:
      "A component-based frontend makes the firm's services, team, and client projects easier to explore.",
    evidence: {
      value: "Component-based",
      label: "Frontend implementation for the engineering portal",
    },
    theme: "engineering",
    imageAlt:
      "Illustrative Quantum Rekatama engineering website showing service areas, a team section, and a client project portfolio.",
    caption:
      "An illustrative composition of the component-based site structure for services, people, and client work.",
    story: {
      lead:
        "Translates a broad engineering practice into a web experience that makes its services, people, and client work easier to understand.",
      sections: [
        {
          title: "Build a reusable page structure",
          body: [
            "The component-based implementation supports the team and portfolio sections without treating every content area as a one-off page.",
          ],
        },
        {
          title: "Make technical experience approachable",
          body: [
            "The interface emphasizes operational efficiency and future-ready infrastructure in clear, user-facing language.",
          ],
        },
      ],
    },
  },
  {
    slug: "dapodikdasmen-medan",
    index: "03",
    kicker: "Education data / Dapodikdasmen",
    title: "One door to education data for Medan.",
    summary:
      "A contribution to Medan's one-door data portal for primary and secondary education.",
    focus: "Integrated education data",
    readingTime: "3 min read",
    takeaway:
      "A single entry point organizes school, student, and teaching-staff information for education stakeholders.",
    evidence: {
      value: "3",
      label: "Audiences: schools, students, and teaching staff",
    },
    theme: "education",
    imageAlt:
      "Illustrative Dapodikdasmen Kota Medan portal showing one entry point for schools, students, and teaching staff.",
    caption:
      "An illustrative view of the integrated portal structure for primary and secondary education data.",
    story: {
      lead:
        "Gives education stakeholders one integrated place to work with school, student, and teaching-staff information.",
      sections: [
        {
          title: "Reduce fragmented access",
          body: [
            "The portal is organized around a single entry point for education data rather than disconnected records.",
          ],
        },
        {
          title: "Make data transparency part of the design",
          body: [
            "The work focuses on accurate, integrated information for schools and the people who support them.",
          ],
        },
      ],
    },
  },
];

export const featuredProject = projects[0];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  return projects[(currentIndex + 1) % projects.length];
}
