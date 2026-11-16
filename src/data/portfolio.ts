import { asset } from "../lib/asset";

export interface Logo {
  src: string;
  alt: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  logo?: Logo;
}

export interface Project {
  n: string;
  tag: string;
  title: string;
  org: string;
  logo?: Logo;
  when: string;
  featured?: boolean;
  summary: string;
  points: string[];
  links?: ProjectLink[];
  stack: string[];
}

export interface Job {
  time: string;
  type: string;
  role: string;
  org: string;
  logo?: Logo;
  desc: string;
}

export interface StackRow {
  k: string;
  v: string[];
}

export const stack: StackRow[] = [
  { k: "Languages", v: ["TypeScript", "JavaScript", "Python"] },
  { k: "Frameworks", v: ["Nest.js", "Express.js", "Next.js", "React.js"] },
  { k: "ORM / ODM", v: ["Sequelize", "TypeORM", "Mongoose", "Prisma"] },
  { k: "Databases", v: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
  { k: "APIs", v: ["REST", "gRPC", "Swagger", "SMS.ir", "PayPing", "IdPay", "Zibal"] },
  { k: "Real-time", v: ["Socket.IO", "gRPC services"] },
  {
    k: "AI & LLM",
    v: [
      "OpenAI-compatible APIs",
      "Ollama",
      "Embeddings",
      "RAG",
      "Qdrant",
      "ChromaDB",
      "Prompt engineering",
      "JSON mode",
    ],
  },
  { k: "DevOps", v: ["Docker", "Kubernetes (basic)", "GitHub Actions (basic)", "GitLab CI (basic)"] },
  { k: "Developer Tools", v: ["Postman", "Cursor", "Claude Code"] },
];

export const jobs: Job[] = [
  {
    time: "Dec 2025 – Present",
    type: "Part-time",
    role: "Software Engineer",
    org: "Faraz Co · Iran Zamin Bank Technology Development",
    logo: { src: asset("logos/faraz.png"), alt: "Faraz" },
    desc: "Back-end engineering on bank technology products — APIs, services and support tooling, including RAG and LLM features in pre-production testing.",
  },
  {
    time: "Jun 2023 – Present",
    type: "Full-time",
    role: "Back-end Developer",
    org: "DPA · Dade Pardazi Azmoodeh Karan",
    desc: "Server-side services, data pipelines and internal tools for legal, audit and financial workflows — from web crawlers and RAG assistants to automated financial data pipelines.",
  },
  {
    time: "Apr 2023 – Jun 2023",
    type: "Full-time",
    role: "Back-end Developer Intern",
    org: "IZICenter · Iran Zamin Bank Innovation Center",
    logo: { src: asset("logos/iranzamin.png"), alt: "Iran Zamin Bank" },
    desc: "Started at the bank's innovation center: back-end features, internal panels, and the first release of a published Android app.",
  },
];

export const projects: Project[] = [
  {
    n: "01",
    tag: "RAG / LLM",
    title: "Troubleshooting Support Chatbot",
    org: "Faraz Co · pre-production testing",
    logo: { src: asset("logos/faraz.png"), alt: "Faraz" },
    when: "2026",
    featured: true,
    summary:
      "A chatbot that tells users how to fix problems, grounded in existing troubleshooting records. RAG pipeline built in Python.",
    points: [
      "Built the embedding pipeline with Sentence Transformers and stored the vectors in ChromaDB.",
      "Each message triggers a vector search; matches go into the LLM prompt (local or API-based) with chat history.",
      "Added BM25 keyword search in parallel with semantic search to raise retrieval accuracy.",
      "Used micro-batching to keep embedding fast under many simultaneous requests.",
      "Added an LLM step that detects which data categories a question belongs to before retrieval.",
    ],
    stack: ["Python", "Sentence Transformers", "ChromaDB", "BM25", "Local & API LLMs"],
  },
  {
    n: "02",
    tag: "RAG / LEGAL",
    title: "Legal-Domain RAG Assistant",
    org: "DPA · full data pipeline from scratch",
    when: "2025",
    summary:
      "A chatbot that explains legal and regulatory questions — crawling, chunking and retrieval all built in-house. RAG pipeline built in Python.",
    points: [
      "Crawled legal websites; an LLM chunks the text and generates categories and summaries per chunk, stored in Qdrant.",
      "Retrieval routes the question to a category first, then runs vector search and parallel BM25 keyword search.",
      "Answers cite exact legal articles, and the interface shows which parts are verbatim law and which are model analysis.",
      "Reduced hallucination with prompt constraints (analyze, never invent law) and a lower temperature.",
    ],
    stack: ["Python", "Qdrant", "Web crawling", "LLM chunking", "BM25", "Prompt engineering"],
  },
  {
    n: "03",
    tag: "AUTOMATION",
    title: "Audit & Fund Compliance Automation",
    org: "DPA · ongoing",
    when: "ongoing",
    summary:
      "Internal tools that replaced manual accounting and audit work with queued, verifiable pipelines.",
    points: [
      "Bond yield: automated bulk data ingestion via background queues with instant yield calculations, replacing manual record-by-record entry.",
      "Fund threshold checks: regulatory limits are verified automatically from the uploaded fund assets.",
      "Audit automation: uploading a company's detailed accounting documents runs all calculations and checklists automatically.",
    ],
    stack: ["Background job queues"],
  },
  {
    n: "04",
    tag: "INTERNAL TOOLS",
    title: "Admin Panels & Reporting",
    org: "IZICenter · Faraz Co",
    logo: { src: asset("logos/iranzamin.png"), alt: "Iran Zamin Bank" },
    when: "2023 – Present",
    summary:
      "Internal admin panels with data display and reporting features, used by operations teams behind the scenes.",
    points: ["Built internal admin panels with data display and reporting features."],
    stack: ["Admin panels", "Reporting", "Internal tools"],
  },
  {
    n: "05",
    tag: "STARTUP PRODUCTS",
    title: "Startup Products",
    org: "DPA · prototypes",
    when: "PROTOTYPES",
    summary:
      "Prototype products built at DPA — mentoring, job board, smart fridge integrations, and a shared AI microservice.",
    points: [
      "Biztalk — mentoring and coaching platform: real-time mentor–mentee chat with Socket.IO and persistent chat history.",
      "Biztalk — online classes: integrated SkyRoom and BigBlueButton (authentication, room creation, assigning rooms to mentoring sessions) alongside a self-hosted Jitsi, all kept as options so we did not depend on one provider.",
      "Restook — job-board platform: built a standalone SMS microservice where the app pushes messages into a Redis queue and they are sent in batches through SMS.ir.",
      "Restook — SMS.ir has no delivery webhooks, so the service polls delivery status and resends undelivered messages.",
      "Waycup — smart auto-purchase fridge: built the gRPC client connecting the app to the hardware vendor's APIs for authenticated unlocking and purchases.",
      "Across products — AI microservice: extracted LLM features into a separate AI microservice that the company's apps call over gRPC.",
      "Kavosh — prototype: back-end for restaurant customer surveys, with LLM analysis of the responses.",
    ],
    stack: ["Socket.IO", "Redis", "SMS.ir", "gRPC", "SkyRoom", "BigBlueButton", "Jitsi"],
  },
  {
    n: "06",
    tag: "SHIPPED / ANDROID",
    title: "Pomodoro Study Planner",
    org: "Personal project",
    when: "12K+ INSTALLS",
    summary:
      "Designed, built and published a Pomodoro study app with a focus timer, study statistics, per-subject progress tracking and light/dark themes.",
    links: [
      {
        label: "Cafe Bazaar",
        url: "https://cafebazaar.ir/app/com.rntest",
        logo: { src: asset("logos/bazaar.png"), alt: "Cafe Bazaar" },
      },
      {
        label: "Myket",
        url: "https://myket.ir/app/com.rntest",
        logo: { src: asset("logos/myket.png"), alt: "Myket" },
      },
    ],
    points: [],
    stack: ["React Native", "Android"],
  },
];
