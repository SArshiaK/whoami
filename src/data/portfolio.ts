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
  { k: "Frameworks", v: ["Nest.js", "Express.js", "Next.js", "React.js"] },
  { k: "ORM / ODM", v: ["Sequelize", "TypeORM", "Mongoose", "Prisma"] },
  { k: "Databases", v: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
  { k: "APIs", v: ["REST", "gRPC", "Swagger", "SMS.ir", "PayPing", "IdPay", "Zibal"] },
  { k: "Real-time", v: ["Socket.IO", "gRPC services"] },
  { k: "AI & LLM", v: ["OpenAI-compatible APIs", "Ollama", "Embeddings", "RAG", "Qdrant", "ChromaDB", "Prompt engineering", "JSON mode"] },
  { k: "DevOps", v: ["Docker", "Kubernetes (basic)", "GitHub Actions", "GitLab CI"] },
  { k: "Developer Tools", v: ["Postman", "Cursor", "Claude Code"] },
];

export const jobs: Job[] = [
  {
    time: "Dec 2025 — Aug 2026",
    type: "Part-time",
    role: "Software Engineer",
    org: "Faraz Co · Iran Zamin Bank Technology Development",
    logo: { src: asset("logos/faraz.png"), alt: "Faraz" },
    desc: "Back-end engineering with a focus on LLM features in production — retrieval pipelines, embedding services and support tooling built for real users.",
  },
  {
    time: "Jun 2023 — Present",
    type: "Full-time",
    role: "Back-end Developer",
    org: "DPA · Dade Pardazi Azmoodeh Karan",
    desc: "Server-side services, data pipelines and internal tools for legal, audit and financial workflows — from web crawlers and RAG assistants to automated financial data pipelines.",
  },
  {
    time: "Apr — Jun 2023",
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
      "A chatbot that tells users how to fix problems, grounded in existing troubleshooting records.",
    points: [
      "Built the embedding pipeline with Sentence Transformers and stored vectors in ChromaDB.",
      "Every message triggers a vector search; the matches go into a prompt the LLM answers from, with local and API models plus chat history.",
      "Added BM25 keyword search in parallel with semantic search to raise retrieval accuracy.",
      "Implemented micro-batching to group near-simultaneous embedding requests within tight time windows, maintaining high throughput under concurrent traffic.",
    ],
    stack: ["Sentence Transformers", "ChromaDB", "BM25", "Local & API LLMs", "Micro-batching"],
  },
  {
    n: "02",
    tag: "RAG / LEGAL",
    title: "Legal-Domain RAG Assistant",
    org: "DPA · full data pipeline from scratch",
    when: "2025",
    summary:
      "A chatbot that explains legal and regulatory questions — crawling, chunking and retrieval all built in-house.",
    points: [
      "Crawled legal websites, used an LLM to chunk the text, and had it generate categories and summaries for each chunk, stored in Qdrant.",
      "Retrieval routes the question to a category first, then runs vector search and parallel BM25 keyword search.",
      "Answers cite exact legal articles, and the interface shows which parts are verbatim law and which are model analysis.",
      "Reduced hallucination with prompt constraints (analyze, never invent law) and a lower temperature.",
    ],
    stack: ["Qdrant", "Web crawling", "LLM chunking", "BM25", "Prompt engineering"],
  },
  {
    n: "03",
    tag: "AUTOMATION",
    title: "Audit & Fund Compliance Automation",
    org: "DPA · ongoing",
    when: "2024 — NOW",
    summary:
      "Internal tools that replaced manual accounting and audit work with queued, verifiable pipelines.",
    points: [
      "Bond yield: automated bulk data ingestion via background queues with instant yield calculations, replacing manual record-by-record entry.",
      "Fund threshold checks: regulatory limits are verified automatically from the uploaded fund assets.",
      "Audit automation: uploading a company's detailed accounting documents runs all calculations and checklists automatically.",
    ],
    stack: ["Node.js", "Background job queues", "Batch Data Processing"],
  },
  {
    n: "04",
    tag: "INTERNAL TOOLS",
    title: "Admin Panels & Reporting",
    org: "IZICenter · Faraz Co",
    logo: { src: asset("logos/iranzamin.png"), alt: "Iran Zamin Bank" },
    when: "2023 — NOW",
    summary:
      "Internal admin panels with data display and reporting features, used by operations teams behind the scenes.",
    points: [],
    stack: ["Admin panels", "Reporting", "Internal tools"],
  },
  {
    n: "05",
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
  {
    n: "06",
    tag: "STARTUP PRODUCTS",
    title: "Startup Products",
    org: "DPA · prototypes",
    when: "PROTOTYPES",
    summary:
      "Prototype products built end to end — a mentoring platform, job boards and customer-survey analytics.",
    points: [
      "Mentoring & coaching platform: connects mentors and mentees with contracts, session scheduling and hosting, coaching plans, and a coach panel for roadmaps and exercises — plus authentication, payments, chat and search. Built end to end with AI-assisted development.",
      "Job-board platform: for cafés and restaurants, with a version for Shahed University. Sole back-end developer.",
      "Kavosh: restaurants run customer surveys, and an LLM analyzes the responses to highlight strengths and weaknesses. Back-end only; prototype.",
    ],
    stack: ["Node.js", "LLM APIs", "AI-assisted development"],
  },
];
