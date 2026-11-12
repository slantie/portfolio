import { supabase } from "@/lib/supabase";

export interface ProfessionalRefreshResult {
  type: string;
  title: string;
  success: boolean;
  error?: string;
}

type ProgressCallback = (label: string) => void;

const PROJECT_IDS = {
  learnova: "f6261fa4-69b4-483d-a044-1c543fb510b8",
  entropy: "93575439-b78f-4c7d-9036-628dc516b439",
  classicReflectify: "14707604-edec-4ee3-8d49-7aaf0f185c7f",
  gst: "a22c2423-d791-414f-b932-84c6c3de8669",
  drishtiksha: "215997a4-d015-4e53-abd8-0313124fced9",
  pirfire: "bbeab53d-20dc-40f2-8512-1d54956cd3ea",
  unifiedPortal: "46523103-fc12-408c-8172-21e414c54441",
  iprQuiz: "45841716-7fa7-44a1-bf07-26fc01603f10",
  departmentalReflectify: "8d397a41-2ef6-4b1d-b647-6871bb631f30",
} as const;

const settings = [
  {
    key: "hero_title",
    value: "M.Tech. ICT Student | Researcher | Technical Leader",
    description: "Primary professional headline",
  },
  {
    key: "hero_bio",
    value:
      "M.Tech. ICT (Software Systems) student at Dhirubhai Ambani University working across federated learning, privacy-preserving computer vision, quantum machine learning, and machine unlearning. Published in Physica Scripta, first author of an accepted Elsevier book chapter, and a former ML intern at NTRO.",
    description: "Short professional introduction",
  },
  {
    key: "bio",
    value:
      "M.Tech. ICT (Software Systems) student at Dhirubhai Ambani University with a research trajectory spanning federated learning, privacy-preserving computer vision, quantum machine learning, and machine unlearning. Former Research Assistant at KSV and Machine Learning Intern at NTRO, with experience building secure multimodal deepfake-detection and digital-media-forensics systems. Published in the Scopus-indexed Q1 journal Physica Scripta, first author of an accepted Elsevier book chapter on quantum computing for IoT systems, and an author of a published FIRE 2024 paper.",
    description: "Long professional biography",
  },
  {
    key: "email",
    value: "kandarp.gajjar.460@gmail.com",
    description: "Public contact email address",
  },
  {
    key: "stat_projects",
    value: "13",
    description: "Published portfolio projects",
  },
  {
    key: "scholar_url",
    value: "https://scholar.google.com/citations?user=IUaQOhcAAAAJ&hl=en",
    description: "Google Scholar profile URL",
  },
];

const experiences = [
  {
    id: "d8795eac-b5f6-45ed-b2a3-1614497fe621",
    title: "Teaching Assistant — IC104 Basic Electronic Circuits",
    company: "Dhirubhai Ambani University · Dr. Ankit Vijayvargiya",
    period: "2026 — Present",
    description:
      "Supporting IC104 course delivery under Dr. Ankit Vijayvargiya, covering circuit laws, network theorems, linear time-invariant systems, semiconductor devices, operational amplifiers, transient and sinusoidal analysis, filters, and transformers.",
    sort_order: 0,
  },
  {
    id: "c998605d-f60c-48ea-9c1c-6bd1d733aab5",
    title: "Research Assistant — Quantum ML & Federated Learning",
    company: "Students Research Lab (MMPSRPC), KSV, Gandhinagar",
    period: "Dec 2025 — May 2026",
    description:
      "Researched privacy-preserving object detection, quantum machine learning, and machine unlearning under Dr. Himani Trivedi. Contributed to the Fed-DETR manuscript and a first-authored Elsevier book chapter, while mentoring junior researchers in model development and technical writing.",
    sort_order: 1,
  },
  {
    id: "7cb60162-2563-4746-8990-f3aebd03c146",
    title: "Machine Learning Intern — Deepfake Detection & Forensics",
    company: "National Technical Research Organisation (NTRO), Delhi",
    period: "Aug 2025 — Oct 2025",
    description:
      "Architected a secure, offline-first multimodal forensics platform in an air-gapped environment. Built image, video, and audio manipulation detectors, real-time processing with Socket.io and Redis, PDF reporting, and a fully Dockerized deployment.",
    sort_order: 2,
  },
  {
    id: "87205ad8-6dd2-4feb-86f2-617c4e7bafff",
    title: "Full-Stack Development Intern — Web & Data Engineering",
    company: "Institute for Plasma Research (IPR), Gandhinagar",
    period: "Aug 2024 — Nov 2024",
    description:
      "Built an adaptive multilingual quiz platform with Flask and React, real-time learner analytics, and Pandas/NumPy data pipelines for assessment reporting.",
    sort_order: 3,
  },
  {
    id: "734f76a0-3e83-4bb7-b28b-66af063b5961",
    title: "Chairperson — IEEE Student Branch",
    company: "IEEE LDRP-ITR",
    period: "Dec 2023 — Dec 2024",
    description:
      "Led an 80+ member student branch delivering technical workshops and events. During the tenure, the branch received an IEEE Region 10 grant and IEEE Gujarat Section's Best Emerging Student Branch recognition.",
    sort_order: 4,
  },
  {
    id: "2d0d4a5d-658a-4a34-b46e-c46352e3a134",
    title: "Main Student Event Coordinator — Xenesis 2024",
    company: "LDRP Institute of Technology and Research",
    period: "Feb 2024",
    description:
      "Spearheaded the institute's flagship technical fest, coordinating delivery for 2,500+ participants and more than 100K social-media impressions.",
    sort_order: 5,
  },
];

const education = [
  {
    id: "c5293b98-55d1-4293-bae8-a4065817553f",
    degree: "M.Tech. Information & Communication Technology — Software Systems",
    institution: "Dhirubhai Ambani University",
    period: "2026 — 2028",
    description:
      "Advanced Algorithms, Advanced Software Engineering, Distributed Systems, Distributed Databases, Information Security, and Big Data Processing.",
    location: "Gandhinagar, Gujarat",
    sort_order: 0,
  },
  {
    id: "9a65f900-7d46-4e99-8c13-1c95b1cf6684",
    degree: "B.E. Computer Engineering",
    institution:
      "LDRP Institute of Technology and Research, Kadi Sarva Vishwavidyalaya",
    period: "2022 — 2026",
    description: "CGPA: 8.47/10",
    location: "Gandhinagar, Gujarat",
    sort_order: 1,
  },
  {
    id: "cc7df370-bfc4-4854-a458-127a2d624edf",
    sort_order: 2,
  },
  {
    id: "9d1197ec-ed58-4c52-8c85-e03554d7d17f",
    sort_order: 3,
  },
];

const projectUpdates = [
  {
    id: PROJECT_IDS.learnova,
    title: "Qubits Learnova — Adaptive eLearning Platform",
    event: "Odoo × GVP National Hackathon 2026",
    description:
      "A modular eLearning platform with 13 lesson types, payments, gamification, and asynchronous adaptive-video delivery; national runner-up.",
    long_description:
      "As team lead, architected an Express.js and Prisma backend with PostgreSQL, multi-role RBAC, Razorpay payments with HMAC verification, coupons, and gamification. Built a standalone FFmpeg and BullMQ video service for asynchronous HLS transcoding to 360p, 720p, and 1080p with S3/MinIO storage, Docker Compose, and GitHub Actions CI/CD.",
    start_month: "January",
    start_year: 2026,
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1789500833/portfolio/projects/learnova-hd.png",
    tags: ["Express.js", "Prisma", "PostgreSQL", "FFmpeg", "BullMQ", "Docker"],
    skills: [
      "Node.js",
      "Express.js",
      "Prisma",
      "PostgreSQL",
      "FFmpeg",
      "BullMQ",
      "Docker",
      "GitHub Actions",
    ],
    github_link: "https://github.com/slantie/qubits-learnova",
    live_link: "https://qubits-learnova.vercel.app/",
    category: ["web-development", "hackathon"],
    achievements: ["National Runner-Up"],
    role: "Team Lead & Backend Developer",
    featured: true,
    is_featured: true,
  },
  {
    id: PROJECT_IDS.entropy,
    title: "Entropy — Real-Time Fraud Detection",
    event: "InnovAItion Hackathon 2026",
    description:
      "A production-minded fraud detection pipeline combining XGBoost screening with LSTM sequence modeling; 4th runner-up among 185 teams.",
    long_description:
      "Led development of a multi-stage fraud detection pipeline using XGBoost and LSTM models with real-time transaction processing, configurable alert thresholds, and model monitoring for reliable production operation.",
    start_month: "March",
    start_year: 2026,
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1789499847/portfolio/projects/entropy-cover.png",
    tags: ["XGBoost", "LSTM", "FastAPI", "Real-Time Processing", "Model Monitoring"],
    skills: ["Python", "XGBoost", "LSTM", "FastAPI"],
    github_link: "https://github.com/slantie/entropy-dau",
    live_link: "https://entropy-dau.vercel.app/",
    category: ["ai-ml", "data-science", "hackathon"],
    achievements: ["4th Runner-Up · 185 Teams"],
    role: "Team Lead & ML/Backend Developer",
    featured: true,
    is_featured: true,
  },
  {
    id: PROJECT_IDS.classicReflectify,
    title: "Reflectify Feedback Portal",
    event: "Department of Computer Engineering — LDRP-ITR, KSV",
    description:
      "A production academic-feedback workspace connecting faculty structures, timetables, private response collection, and actionable analytics.",
    long_description:
      "Built for the Department of Computer Engineering at LDRP-ITR, KSV, Reflectify replaces disconnected semester spreadsheets with one role-aware workspace. It validates Excel faculty matrices, generates division timetables, manages controlled feedback cycles, protects individual responses, and turns results into filterable insights for faculty and administrators.",
    end_month: null,
    end_year: null,
    is_ongoing: true,
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1789500835/portfolio/projects/reflectify-hd.png",
    tags: ["Academic Feedback", "Analytics", "RBAC", "Excel Workflows", "Privacy"],
    skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Data Analytics"],
    github_link: "https://github.com/slantie/reflectify",
    live_link: "https://reflectify-ldrp.vercel.app/",
    achievements: ["Deployed for the Department of Computer Engineering"],
    role: "Full-Stack Developer",
    featured: true,
    is_featured: true,
  },
  {
    id: PROJECT_IDS.gst,
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1789499849/portfolio/projects/gst-analytics-cover.png",
    role: "AI/ML Developer",
  },
  {
    id: PROJECT_IDS.drishtiksha,
    title: "Drishtiksha — Deepfake Detection Platform",
    description:
      "A secure multimodal deepfake-detection platform developed for NTRO and presented as a national finalist at Smart India Hackathon 2024.",
    long_description:
      "Developed a face-swap deepfake detection platform for NTRO using EfficientNet, InceptionV3, and transformer-based models. Implemented face extraction, alignment, temporal frame analysis, Docker-based deployment, CI/CD, and Prometheus/Grafana monitoring.",
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1789500998/portfolio/projects/drishtiksha-hd.png",
    tags: ["Deepfake Detection", "Computer Vision", "PyTorch", "FastAPI", "Docker"],
    skills: [
      "Python",
      "PyTorch",
      "OpenCV",
      "FastAPI",
      "Docker",
      "Prometheus",
      "Grafana",
    ],
    live_link: "https://drishtiksha.vercel.app/docs/Overview",
    achievements: ["National Finalist · SIH 2024"],
    role: "AI/ML Developer",
    featured: true,
    is_featured: true,
  },
  {
    id: PROJECT_IDS.pirfire,
    title: "Personalized Community Question Answering",
    description:
      "A personalized information-retrieval pipeline combining BM25, MiniLM semantic reranking, and TAG-based user modeling on the SE-PQA dataset.",
    long_description:
      "Designed a personalized information-retrieval pipeline combining BM25 retrieval, MiniLM semantic reranking, and TAG-based user modeling on the SE-PQA dataset. The work was published at PIR-FIRE 2024 in CEUR Workshop Proceedings.",
    tags: ["BM25", "MiniLM", "NLP", "Information Retrieval", "Python"],
    link: "https://ceur-ws.org/Vol-4054/T5-2.pdf",
    achievements: ["Published · PIR-FIRE 2024"],
    role: "Researcher & AI/ML Developer",
  },
  {
    id: PROJECT_IDS.unifiedPortal,
    description:
      "An NLP-assisted public grievance platform that secured All India Rank 7 at Smart India Hackathon 2023.",
    long_description:
      "Led a team to design a unified public grievance-redressal portal and secured AIR 7 at Smart India Hackathon 2023. Developed a PyTorch, TensorFlow, and Keras chatbot to automate grievance lodging across civic and business applications.",
    tags: ["NLP", "PyTorch", "TensorFlow", "Chatbot", "Team Leadership"],
    achievements: ["AIR 7 · Smart India Hackathon 2023"],
    role: "Team Lead & AI/ML Developer",
    featured: true,
    is_featured: true,
  },
  {
    id: PROJECT_IDS.iprQuiz,
    role: "Full-Stack Developer",
    featured: false,
    is_featured: false,
  },
  {
    id: "2ec0e400-6c20-4f95-a0fb-30c7c7857f45",
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1789501018/portfolio/projects/mmpsrpc-website-hd.jpg",
  },
];

const publicationUpdates = [
  {
    id: "0541eac2-6461-46a8-a1ad-116fd6ee6179",
    title:
      "Self-Revealing Poisons: Loss-Guided Forensic Detection and Quantum Unlearning of Corrupted Training Data",
    organization: "Physica Scripta · IOP Publishing",
    description:
      "Presents a loss-guided forensic framework for identifying poisoned training samples and investigates quantum machine unlearning for selectively removing their influence, with comparison against classical approaches.",
    link: "https://doi.org/10.1088/1402-4896/ae9810",
    tags: ["Published", "Scopus Q1"],
  },
  {
    id: "696b13f6-6653-4b9d-b099-94fb978e447e",
    title: "Quantum Computing for Next-Generation IoT Systems",
    organization: "Elsevier · Advances in Computers",
    description:
      "First-authored an accepted chapter examining quantum-enhanced security, optimization, and edge-intelligence applications for next-generation IoT architectures.",
    tags: ["Accepted", "Forthcoming"],
  },
  {
    id: "cd0a70d3-edab-495f-a9c3-acb4d8b05e0f",
    title: "Fed-DETR: Privacy-Preserving Intelligent Traffic Enforcement",
    organization:
      "International Journal of Intelligent Transportation Systems Research · Springer Nature",
    description:
      "A decentralized object-detection pipeline using federated learning and DETR for privacy-preserving helmet detection in intelligent traffic monitoring.",
    tags: ["Under review"],
  },
  {
    id: "74f3f731-ee28-4904-8927-17802649d2da",
    title: "Fusing Retrieval Techniques for Personalized Community Question Answering",
    organization: "PIR-FIRE 2024 · CEUR Workshop Proceedings",
    description:
      "A personalized retrieval pipeline combining BM25, MiniLM semantic reranking, and TAG-based user modeling on the SE-PQA dataset.",
    link: "https://ceur-ws.org/Vol-4054/T5-2.pdf",
    tags: ["Published"],
  },
  {
    id: "0583371a-d831-4130-b8f4-440f9a3abdef",
    title: "Automated Waste Segregation Dustbin for Educational Institutions",
    organization: "Indian Patent Office",
    description:
      "Published Indian patent application for an IoT-enabled smart dustbin using edge-optimized computer vision for real-time waste classification. Application No. 202521111515; currently under examination.",
    link: "https://iprsearch.ipindia.gov.in/PublicSearch/PublicationSearch/ApplicationStatus",
    tags: ["Published application", "Under examination"],
  },
];

const awsMlAchievement = {
  id: "0e3eaf4a-3c96-4b72-b4df-f0cb0d0c1256",
  type: "certificate",
  title: "AWS Certified Machine Learning Engineer — Associate",
  organization: "Amazon Web Services",
  description: "Earned the AWS MLA-C01 certification with a score of 825/1000.",
  date_month: "May",
  date_year: 2026,
  image:
    "https://res.cloudinary.com/dfkccowgw/image/upload/f_webp,q_auto:good,w_1200,c_scale/v1778962307/certifications/vawl1fxg7p3o81sf4kjc.jpg",
  link: "https://cp.certmetrics.com/amazon/en/public/verify/credential/a36e63498ada422b97bf45c86cd5a9bd",
  tags: ["AWS", "Machine Learning", "Certification"],
};

const skillUpserts = [
  { name: "Node.js", category: "frameworks", sort_order: 23 },
  { name: "Django", category: "frameworks", sort_order: 24 },
  { name: "Docker", category: "tools", sort_order: 25 },
  { name: "Kubernetes", category: "tools", sort_order: 26 },
  { name: "GitHub Actions", category: "tools", sort_order: 27 },
  { name: "Prometheus", category: "tools", sort_order: 28 },
  { name: "Grafana", category: "tools", sort_order: 29 },
  { name: "AWS", category: "cloud", sort_order: 30 },
  { name: "GCP", category: "cloud", sort_order: 31 },
  { name: "Azure", category: "cloud", sort_order: 32 },
  { name: "PostgreSQL", category: "cloud", sort_order: 33 },
  { name: "MongoDB", category: "cloud", sort_order: 34 },
  { name: "Redis", category: "cloud", sort_order: 35 },
];

export const PROFESSIONAL_REFRESH_ITEM_COUNT =
  settings.length +
  experiences.length +
  education.length +
  projectUpdates.length +
  1 +
  publicationUpdates.length +
  1 +
  skillUpserts.length;

export async function runProfessionalPortfolioRefresh(
  onProgress: ProgressCallback = () => undefined,
): Promise<ProfessionalRefreshResult[]> {
  if (!supabase) {
    return [
      {
        type: "configuration",
        title: "Supabase",
        success: false,
        error: "Supabase is not configured.",
      },
    ];
  }

  const client = supabase as any;
  const results: ProfessionalRefreshResult[] = [];

  async function updateById(
    table: string,
    id: string,
    values: Record<string, unknown>,
    title: string,
  ) {
    onProgress(`${table}: ${title}`);
    const { data, error } = await client
      .from(table)
      .update(values)
      .eq("id", id)
      .select("id");
    const updated = Array.isArray(data) && data.length === 1;
    results.push({
      type: table,
      title,
      success: !error && updated,
      error: error?.message || (!updated ? "No matching row was updated." : undefined),
    });
  }

  for (const setting of settings) {
    onProgress(`settings: ${setting.key}`);
    const { data, error } = await client
      .from("settings")
      .upsert(setting, { onConflict: "key" })
      .select("id");
    const saved = Array.isArray(data) && data.length === 1;
    results.push({
      type: "settings",
      title: setting.key,
      success: !error && saved,
      error: error?.message || (!saved ? "Setting was not saved." : undefined),
    });
  }

  for (const experience of experiences) {
    const { id, ...values } = experience;
    await updateById("experiences", id, values, experience.title);
  }

  for (const item of education) {
    const { id, ...values } = item;
    await updateById("education", id, values, String(values.degree || id));
  }

  for (const project of projectUpdates) {
    const { id, ...values } = project;
    await updateById("projects", id, values, String(values.title || id));
  }

  onProgress("projects: remove duplicate Reflectify record");
  const { error: reflectifyError } = await client
    .from("projects")
    .delete()
    .eq("id", PROJECT_IDS.departmentalReflectify);
  results.push({
    type: "projects",
    title: "Remove duplicate Reflectify record",
    success: !reflectifyError,
    error: reflectifyError?.message,
  });

  for (const publication of publicationUpdates) {
    const { id, ...values } = publication;
    await updateById("achievements", id, values, publication.title);
  }

  onProgress(`achievements: ${awsMlAchievement.title}`);
  const { data: awsData, error: awsError } = await client
    .from("achievements")
    .upsert(awsMlAchievement, { onConflict: "id" })
    .select("id");
  const awsSaved = Array.isArray(awsData) && awsData.length === 1;
  results.push({
    type: "achievements",
    title: awsMlAchievement.title,
    success: !awsError && awsSaved,
    error: awsError?.message || (!awsSaved ? "Achievement was not saved." : undefined),
  });

  for (const skill of skillUpserts) {
    onProgress(`skills: ${skill.name}`);
    const { data: existing, error: findError } = await client
      .from("skills")
      .select("id")
      .eq("name", skill.name)
      .limit(1);

    if (findError) {
      results.push({
        type: "skills",
        title: skill.name,
        success: false,
        error: findError.message,
      });
      continue;
    }

    const query = existing?.[0]
      ? client.from("skills").update(skill).eq("id", existing[0].id)
      : client.from("skills").insert(skill);
    const { data, error } = await query.select("id");
    const saved = Array.isArray(data) && data.length === 1;
    results.push({
      type: "skills",
      title: skill.name,
      success: !error && saved,
      error: error?.message || (!saved ? "Skill was not saved." : undefined),
    });
  }

  return results;
}

export const REQUESTED_PROJECT_REFRESH_ITEM_COUNT = 10;

export async function runRequestedProjectRefresh(
  onProgress: ProgressCallback = () => undefined,
): Promise<ProfessionalRefreshResult[]> {
  if (!supabase) {
    return [{ type: "configuration", title: "Supabase", success: false, error: "Supabase is not configured." }];
  }

  const client = supabase as any;
  const results: ProfessionalRefreshResult[] = [];
  const updates = [
    {
      id: PROJECT_IDS.learnova,
      title: "Learnova",
      values: {
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789500833/portfolio/projects/learnova-hd.png",
        live_link: "https://qubits-learnova.vercel.app/",
        github_link: "https://github.com/slantie/qubits-learnova",
      },
    },
    {
      id: PROJECT_IDS.entropy,
      title: "Entropy",
      values: {
        live_link: "https://entropy-dau.vercel.app/",
        github_link: "https://github.com/slantie/entropy-dau",
      },
    },
    {
      id: PROJECT_IDS.classicReflectify,
      title: "Reflectify Feedback Portal",
      values: {
        title: "Reflectify Feedback Portal",
        event: "Department of Computer Engineering — LDRP-ITR, KSV",
        description: "A production academic-feedback workspace connecting faculty structures, timetables, private response collection, and actionable analytics.",
        long_description: "Built for the Department of Computer Engineering at LDRP-ITR, KSV, Reflectify replaces disconnected semester spreadsheets with one role-aware workspace. It validates Excel faculty matrices, generates division timetables, manages controlled feedback cycles, protects individual responses, and turns results into filterable insights for faculty and administrators.",
        end_month: null,
        end_year: null,
        is_ongoing: true,
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789500835/portfolio/projects/reflectify-hd.png",
        tags: ["Academic Feedback", "Analytics", "RBAC", "Excel Workflows", "Privacy"],
        skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Data Analytics"],
        github_link: "https://github.com/slantie/reflectify",
        live_link: "https://reflectify-ldrp.vercel.app/",
        achievements: ["Deployed for the Department of Computer Engineering"],
        role: "Full-Stack Developer",
        featured: true,
        is_featured: true,
        category: ["web-development", "academic"],
      },
    },
    {
      id: PROJECT_IDS.pirfire,
      title: "Personalized Retrieval paper",
      values: { link: "https://ceur-ws.org/Vol-4054/T5-2.pdf" },
    },
    {
      id: "30a0856e-1635-4b3e-b25b-0e1bcca72a4f",
      title: "ISRO IIRS",
      values: { github_link: "https://github.com/slantie/isro-hackathon" },
    },
    {
      id: PROJECT_IDS.gst,
      title: "GST predictive model",
      values: {
        github_link: null,
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789499849/portfolio/projects/gst-analytics-cover.png",
      },
    },
    {
      id: "2ec0e400-6c20-4f95-a0fb-30c7c7857f45",
      title: "MMPSRPC website cover",
      values: {
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789501018/portfolio/projects/mmpsrpc-website-hd.jpg",
      },
    },
    {
      id: PROJECT_IDS.drishtiksha,
      title: "Drishtiksha cover",
      values: {
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789500998/portfolio/projects/drishtiksha-hd.png",
      },
    },
  ];

  for (const update of updates) {
    onProgress(`projects: ${update.title}`);
    const { data, error } = await client.from("projects").update(update.values).eq("id", update.id).select("id");
    const saved = Array.isArray(data) && data.length === 1;
    results.push({
      type: "projects",
      title: update.title,
      success: !error && saved,
      error: error?.message || (!saved ? "No matching project was updated." : undefined),
    });
  }

  onProgress("projects: merge duplicate Reflectify entry");
  const { error: deleteError } = await client.from("projects").delete().eq("id", PROJECT_IDS.departmentalReflectify);
  results.push({
    type: "projects",
    title: "Merge duplicate Reflectify entry",
    success: !deleteError,
    error: deleteError?.message,
  });

  onProgress("settings: project count");
  const { data: settingData, error: settingError } = await client
    .from("settings")
    .upsert({ key: "stat_projects", value: "13", description: "Published portfolio projects" }, { onConflict: "key" })
    .select("id");
  const settingSaved = Array.isArray(settingData) && settingData.length === 1;
  results.push({
    type: "settings",
    title: "Project count",
    success: !settingError && settingSaved,
    error: settingError?.message || (!settingSaved ? "Project count was not saved." : undefined),
  });

  return results;
}

export const CREDIBILITY_CLEANUP_ITEM_COUNT = 8;

export async function runProjectCredibilityCleanup(
  onProgress: ProgressCallback = () => undefined,
): Promise<ProfessionalRefreshResult[]> {
  if (!supabase) {
    return [{ type: "configuration", title: "Supabase", success: false, error: "Supabase is not configured." }];
  }

  const client = supabase as any;
  const results: ProfessionalRefreshResult[] = [];
  const updates = [
    {
      id: PROJECT_IDS.entropy,
      title: "Entropy",
      values: {
        description: "A hackathon prototype exploring real-time fraud detection with XGBoost screening and LSTM sequence modelling; 4th runner-up among 185 teams.",
        long_description: "Designed and demonstrated a multi-stage fraud-detection concept for hackathon evaluation using XGBoost and LSTM models, sample transaction flows, configurable alert thresholds, and a monitoring-oriented system design.",
        github_link: null,
        role: "Team Lead — ML & Backend Prototype",
      },
    },
    {
      id: PROJECT_IDS.gst,
      title: "GST predictive model",
      values: {
        description: "A hackathon exploration of GST revenue forecasting using competition data, feature engineering, and classical machine-learning methods.",
        long_description: "Prepared an analytical prototype and presentation-led submission for the GST Analytics Hackathon, exploring data cleaning, feature engineering, forecasting approaches, and interpretable visual analysis. This was a competition prototype rather than a production deployment.",
        github_link: "https://github.com/slantie/GSTN_589-Team-Coding-Brigades",
        role: "AI/ML Prototype Developer",
      },
    },
    {
      id: "30a0856e-1635-4b3e-b25b-0e1bcca72a4f",
      title: "ISRO IIRS",
      values: {
        description: "A hackathon exploration of lunar hyperspectral classification using Chandrayaan-2 IIRS data.",
        long_description: "Developed an experimental, notebook-based pipeline for preprocessing and classifying lunar hyperspectral data from the Chandrayaan-2 IIRS instrument. The work was prepared as a Bharatiya Antariksh Hackathon submission and is presented as an exploratory prototype.",
        github_link: "https://github.com/slantie/isro-hackathon",
        role: "AI/ML Prototype Developer",
      },
    },
    {
      id: "f1133130-1613-4cfd-9b49-401a3d2d7193",
      title: "EcoSmart patent project",
      values: {
        event: "Indian Patent Application 202521111515",
        description: "A patent-backed concept and prototype for automated waste segregation in educational institutions, currently under examination.",
        long_description: "Co-designed an IoT and computer-vision concept for automated waste classification in educational institutions. The public portfolio intentionally focuses on the problem, intended impact, and patent status while the application remains under examination; implementation-specific mechanisms are not disclosed.",
        tags: ["Patent", "Sustainability", "Computer Vision Concept", "Edge AI"],
        skills: ["Computer Vision", "Edge AI", "IoT", "Research & Prototyping"],
        achievements: ["Patent application published · Under examination"],
        github_link: null,
        live_link: null,
        link: "https://iprsearch.ipindia.gov.in/PublicSearch/PublicationSearch/ApplicationStatus",
        role: "AI/ML Researcher & Co-Inventor",
      },
    },
    {
      id: PROJECT_IDS.unifiedPortal,
      title: "Nivaran — Unified Grievance Portal",
      values: {
        title: "Nivaran — Unified Grievance Portal",
        description: "A polished frontend demonstration of the AIR 7 Smart India Hackathon 2023 concept for guided grievance lodging, transparent routing, and visible resolution progress.",
        long_description: "Rebuilt the original competition concept as Nivaran, a responsive frontend-only civic-service demo. It includes guided grievance submission, inspectable rule-based routing, reference-number tracking, citizen and administration dashboards, and clearly labelled fictional local data without claiming a live government integration.",
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789505262/portfolio/projects/nivaran-portal.jpg",
        tags: ["Next.js", "TypeScript", "Civic Tech", "Frontend Demo"],
        skills: ["Next.js", "TypeScript", "Responsive UI", "Product Design", "Local State"],
        github_link: "https://github.com/slantie/nivaran-sih",
        live_link: null,
        role: "Team Lead & Frontend Developer",
      },
    },
    {
      id: "0cf0d084-3da7-4e5d-93b1-acf9cf197275",
      title: "NischayJyot — ONOC Grievance Portal",
      values: {
        title: "NischayJyot — ONOC Grievance Portal",
        description: "A polished frontend demonstration of the 3rd-place Gujarat Hackathon concept for a clearer One Nation One Challan grievance workflow.",
        long_description: "Rebuilt the presentation-led concept as NischayJyot, a responsive frontend-only experience for lodging and tracking challan-related grievances. It demonstrates transparent local routing, citizen and administrator views, resolution timelines, and fictional sample data without claiming a production or government integration.",
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1789505262/portfolio/projects/nischayjyot-portal.jpg",
        tags: ["Next.js", "TypeScript", "Civic Tech", "Data Visualization"],
        skills: ["Next.js", "TypeScript", "UI/UX", "Responsive UI", "Local State"],
        github_link: "https://github.com/slantie/nischayjyot-ssip",
        live_link: null,
        role: "Frontend & Product Design",
      },
    },
  ];

  for (const update of updates) {
    onProgress(`projects: ${update.title}`);
    const { data, error } = await client.from("projects").update(update.values).eq("id", update.id).select("id");
    const saved = Array.isArray(data) && data.length === 1;
    results.push({
      type: "projects",
      title: update.title,
      success: !error && saved,
      error: error?.message || (!saved ? "No matching project was updated." : undefined),
    });
  }

  onProgress("projects: remove GreenVend duplicate");
  const { error: deleteError } = await client.from("projects").delete().eq("id", "967d5856-7299-4984-b2f0-4990b066a014");
  results.push({
    type: "projects",
    title: "Remove GreenVend duplicate",
    success: !deleteError,
    error: deleteError?.message,
  });

  onProgress("settings: project count");
  const { data: settingData, error: settingError } = await client
    .from("settings")
    .upsert({ key: "stat_projects", value: "12", description: "Published portfolio projects" }, { onConflict: "key" })
    .select("id");
  const settingSaved = Array.isArray(settingData) && settingData.length === 1;
  results.push({
    type: "settings",
    title: "Project count",
    success: !settingError && settingSaved,
    error: settingError?.message || (!settingSaved ? "Project count was not saved." : undefined),
  });

  return results;
}

export async function runTeachingAssistantExperienceUpdate(
  onProgress: ProgressCallback = () => undefined,
): Promise<ProfessionalRefreshResult[]> {
  if (!supabase) {
    return [{ type: "configuration", title: "Supabase", success: false, error: "Supabase is not configured." }];
  }

  const client = supabase as any;
  const experience = experiences[0];
  onProgress("experiences: IC104 Teaching Assistant");
  const { data, error } = await client
    .from("experiences")
    .upsert(experience, { onConflict: "id" })
    .select("id");
  const saved = Array.isArray(data) && data.length === 1;

  return [{
    type: "experiences",
    title: experience.title,
    success: !error && saved,
    error: error?.message || (!saved ? "The teaching-assistant experience was not saved." : undefined),
  }];
}
