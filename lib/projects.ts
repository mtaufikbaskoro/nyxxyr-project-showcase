export type ProjectTheme = "civic" | "library" | "climate" | "care";

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
  date: string;
  role: string;
  tools: string;
  readingTime: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  theme: ProjectTheme;
  imageAlt: string;
  caption: string;
  story: {
    lead: string;
    sections: ProjectStorySection[];
    quote: {
      text: string;
      attribution: string;
    };
  };
};

export const projects: Project[] = [
  {
    slug: "northline-services",
    index: "01",
    kicker: "Civic systems / Northline",
    title: "A public service that starts with a human question.",
    summary:
      "Northline's residents needed to find help, not learn a government taxonomy. We rebuilt the front door around plain language, visible progress, and one clear next step.",
    date: "October 2026",
    role: "Research, service design, product build",
    tools: "Field interviews, prototyping, React",
    readingTime: "7 min read",
    outcome: "38% faster service lookup",
    metric: "38%",
    metricLabel: "faster service lookup in moderated tasks",
    theme: "civic",
    imageAlt:
      "Northline resident services interface with a plain-language search field, service navigation, and a visible application progress indicator.",
    caption:
      "The new service finder begins with a resident's question, then reveals eligibility and next steps in sequence.",
    story: {
      lead:
        "A city website does not become useful because every department is represented. It becomes useful when a resident can turn a confusing problem into a clear next step. Northline asked us to begin with that moment.",
      sections: [
        {
          title: "Start with the sentence people actually use",
          body: [
            "Service teams knew their own programs intimately. Residents knew the shape of their problem: a leaking ceiling, a missed pickup, a benefit that had not arrived. Our research began with those descriptions, not an org chart.",
            "We tested a question-led search against the existing menu-led portal. Participants found the right service faster when the interface offered examples, corrected assumptions, and showed eligibility in ordinary language.",
          ],
        },
        {
          title: "Make progress part of the service",
          body: [
            "An application is rarely one page. We carried status, ownership, and expected timing through the interaction so people could understand what was happening without calling support.",
            "The design uses familiar form patterns, a persistent save state, and a direct route to a human when the system cannot resolve an edge case. The newspaper-like structure here is editorial, not ornamental: hierarchy earns attention and sequence makes a long task feel finite.",
          ],
        },
      ],
      quote: {
        text:
          "The win was not making government feel smaller. It was making the next step feel possible.",
        attribution: "Northline service design lead",
      },
    },
  },
  {
    slug: "common-shelf",
    index: "02",
    kicker: "Digital products / Common Shelf",
    title: "The library card, reimagined as a conversation.",
    summary:
      "A neighborhood library network needed a digital membership experience that felt as welcoming as its front desk. The result is part reading list, part local noticeboard, and part invitation.",
    date: "September 2026",
    role: "Identity, content design, web",
    tools: "Brand sprint, editorial system, Next.js",
    readingTime: "6 min read",
    outcome: "2.4× more first-session saves",
    metric: "2.4×",
    metricLabel: "increase in first-session reading-list saves",
    theme: "library",
    imageAlt:
      "Common Shelf digital library interface with conversational search, curated reading lists, and a local events panel.",
    caption:
      "A conversational search prompt sits beside curated shelves and neighborhood events, giving members more than one way into the collection.",
    story: {
      lead:
        "Libraries have always been good at making a room feel open. Common Shelf wanted the same quality online: a place where people could browse without knowing the catalog number of what they hoped to find.",
      sections: [
        {
          title: "Design for browsing without pretending to be a feed",
          body: [
            "We rejected an infinite recommendation stream. Instead, the interface combines a generous search field with hand-picked shelves, fresh arrivals, and nearby events. Each route remains legible as part of a real collection.",
            "Short editorial notes connect titles to the neighborhood. They are specific enough to be useful and quiet enough to leave room for the reader's own curiosity.",
          ],
        },
        {
          title: "Membership should feel like an invitation",
          body: [
            "The join flow explains what a card unlocks in practical terms: borrowing, holds, rooms, programs, and help. It keeps the library's voice warm while making the required account steps unambiguous.",
            "A responsive editorial grid gives the system plenty of air on small screens and the density of a good reading table on larger ones.",
          ],
        },
      ],
      quote: {
        text:
          "The best compliment was that it did not feel like a portal. It felt like somewhere to stay for a while.",
        attribution: "Common Shelf program director",
      },
    },
  },
  {
    slug: "field-atlas",
    index: "03",
    kicker: "Data storytelling / Field Atlas",
    title: "Climate data that reads like a place, not a spreadsheet.",
    summary:
      "Field Atlas turns regional climate observations into a public briefing for planners, journalists, and neighbors. Maps establish context; annotations make the evidence usable.",
    date: "August 2026",
    role: "Information design, editorial direction",
    tools: "Data review, mapping, visualization",
    readingTime: "9 min read",
    outcome: "12 regional briefings shipped",
    metric: "12",
    metricLabel: "regional briefings ready for local publication",
    theme: "climate",
    imageAlt:
      "Field Atlas regional climate briefing with a topographic map, temperature bands, and annotated charts.",
    caption:
      "The atlas pairs every regional trend with a locator, a readable scale, and a short explanation of why the change matters.",
    story: {
      lead:
        "Climate evidence often arrives in a form that asks readers to bring their own expertise. Field Atlas asked the opposite: what if the data arrived with a sense of place and a clear reason to care?",
      sections: [
        {
          title: "Give every number a geography",
          body: [
            "The briefing system anchors observations to recognizable regions and local landmarks while preserving enough context to compare across an area. The map is not wallpaper; it is the reader's index.",
            "Charts use consistent scales and direct labels. Color carries one meaning at a time, and every trend has a plain-language annotation that explains the observation and its practical consequence.",
          ],
        },
        {
          title: "Build for careful sharing",
          body: [
            "Journalists and local advocates need evidence they can excerpt without breaking its meaning. Each section works as a standalone card, while captions retain source, period, and method.",
            "The visual language borrows the confidence of a field report and the pacing of a newspaper feature. Dense layouts are reserved for wide screens; mobile readers receive the same sequence as a single reading column.",
          ],
        },
      ],
      quote: {
        text:
          "The map gives people a place to begin. The annotation gives them a reason to keep reading.",
        attribution: "Field Atlas research editor",
      },
    },
  },
  {
    slug: "afterward-care",
    index: "04",
    kicker: "Service design / Afterward",
    title: "A calmer handoff from clinic to home.",
    summary:
      "Afterward helps patients and caregivers coordinate the first week after a procedure. The service reduces the handoff to a short, shared plan without hiding the details that matter.",
    date: "July 2026",
    role: "Research, UX, design system",
    tools: "Caregiver diaries, service blueprint, PWA",
    readingTime: "8 min read",
    outcome: "4 handoff steps removed",
    metric: "4",
    metricLabel: "care handoff steps removed from the common path",
    theme: "care",
    imageAlt:
      "Afterward mobile care plan showing a shared daily timeline, medication check, and a direct care-team message action.",
    caption:
      "The shared care plan combines the day's priorities with a direct route back to a human when instructions no longer fit the situation.",
    story: {
      lead:
        "The most difficult part of recovery often begins after the appointment ends. Instructions scatter across paper, portals, and conversations while patients and caregivers try to turn them into a shared routine.",
      sections: [
        {
          title: "One plan, shared by the people in the room",
          body: [
            "Afterward gives patients and caregivers the same view of the first seven days. The plan prioritizes the next action, preserves the full care team's instructions, and makes it clear who can be contacted when something changes.",
            "We prototyped with caregivers in their homes rather than only in clinic settings. That context exposed the small but consequential gaps: unclear ownership, duplicate reminders, and instructions that assumed uninterrupted attention.",
          ],
        },
        {
          title: "Reduce effort without removing agency",
          body: [
            "The service removes unnecessary account steps and brings the daily plan to the surface. It does not hide warnings or automate decisions that need a care team's judgment.",
            "The visual system is calm by structure: fewer competing actions, larger touch targets, a visible current day, and language that distinguishes a task from an emergency. Motion is limited to confirming state changes.",
          ],
        },
      ],
      quote: {
        text:
          "What changed was not the amount of information. It was our ability to agree on what mattered today.",
        attribution: "Family caregiver, research participant",
      },
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
