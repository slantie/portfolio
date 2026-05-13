// Kandarp Gajjar — full portfolio, two-column minimal. Supabase-connected.

import React from "react";
import { createClient } from "@supabase/supabase-js";
import "./helix-theme.css";
import "./portfolio.css";
import { useTweaks, TweaksPanel } from "./TweaksPanel";

// ─── supabase ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function getSbClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const Ico = {
  location: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      width="13"
      height="13"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  email: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      width="13"
      height="13"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  ),
  github: () => (
    <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  linkedin: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      width="13"
      height="13"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  resume: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      width="13"
      height="13"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

const SKILL_ICON_KEYS: Record<string, string> = {
  Python: "python",
  "C++": "cpp",
  C: "c",
  JavaScript: "js",
  TypeScript: "ts",
  HTML: "html",
  CSS: "css",
  React: "react",
  Node: "nodejs",
  FastAPI: "fastapi",
  Flask: "flask",
  Tailwind: "tailwind",
  PyTorch: "pytorch",
  TensorFlow: "tensorflow",
  Keras: "keras",
  "Scikit-learn": "sklearn",
  OpenCV: "opencv",
  Pandas: "pandas",
  Git: "git",
  GitHub: "github",
  Figma: "figma",
  Canva: "canva",
  VSCode: "vscode",
  "Raspberry Pi": "raspberrypi",
  Linux: "linux",
  AWS: "aws",
  Docker: "docker",
  Postgres: "postgres",
  MySQL: "mysql",
  MongoDB: "mongodb",
};

function SkillIcons({
  items,
  wrapRef,
}: {
  items: string[];
  wrapRef: React.RefObject<HTMLDivElement | null>;
}) {
  const iconKeys = items.map((s) => SKILL_ICON_KEYS[s]).filter(Boolean);
  const textOnly = items.filter((s) => !SKILL_ICON_KEYS[s]);
  const theme = wrapRef.current?.dataset.theme === "light" ? "light" : "dark";
  const iconUrl =
    iconKeys.length > 0
      ? `https://skillicons.dev/icons?i=${iconKeys.join(",")}&theme=${theme}&perline=10`
      : null;
  return (
    <div className="skill-icons">
      {iconUrl && <img src={iconUrl} alt={iconKeys.join(", ")} />}
      {textOnly.length > 0 && (
        <span className="skill-text-extra">{textOnly.join(" · ")}</span>
      )}
    </div>
  );
}

// ─── data loading from supabase ───────────────────────────────────────────────

function transformProject(p: any) {
  return {
    year: String(p.start_year || ""),
    title: p.title || "",
    org: [p.event, p.role].filter(Boolean).join(" · "),
    detail: p.long_description || p.description || "",
    stack: p.tags || [],
    badge:
      p.achievements && p.achievements.length > 0
        ? p.achievements[0]
        : undefined,
    href: p.live_link || p.link || undefined,
  };
}

async function loadPortfolioData() {
  const sb = getSbClient();
  if (!sb) return null;

  try {
    const [settingsRes, expRes, projRes, achRes, skillsRes, eduRes] =
      await Promise.all([
        sb.from("settings").select("*"),
        sb
          .from("experiences")
          .select("*")
          .order("sort_order", { ascending: true }),
        sb
          .from("projects")
          .select("*")
          .order("start_year", { ascending: false })
          .order("start_month", { ascending: false }),
        sb
          .from("achievements")
          .select("*")
          .order("date_year", { ascending: false })
          .order("date_month", { ascending: false }),
        sb.from("skills").select("*").order("sort_order", { ascending: true }),
        sb
          .from("education")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

    // Settings map
    const sm: Record<string, any> = {};
    (settingsRes.data || []).forEach((s: any) => {
      sm[s.key] = s.value;
    });

    // Bio
    const bio = {
      name: sm.hero_name || "",
      role: sm.hero_title || "",
      location: sm.location || "",
      email: sm.email || "",
      blurb: sm.hero_bio || "",
      photo: sm.profile_image || sm.hero_image || null,
      github: sm.github_url || null,
      linkedin: sm.linkedin_url || null,
      instagram: sm.instagram_url || null,
      resume: sm.resume_url || null,
    };

    // Stats
    const stats = [
      { n: sm.stat_hackathons || "", k: "hackathons" },
      { n: sm.stat_projects || "", k: "projects" },
      { n: sm.stat_publications || "", k: "publication" },
    ];

    // Experience
    const expData = expRes.data || [];
    const experience =
      expData.length > 0
        ? expData.map((e: any) => ({
            when: e.period || "",
            role: e.title || "",
            org: e.company || "",
            detail: e.description || "",
            tag: (e.period || "").toLowerCase().includes("now")
              ? "Ongoing"
              : undefined,
          }))
        : [];

    // Projects
    const allProj = projRes.data || [];
    const rawHighlights = allProj.filter(
      (p: any) => p.featured || p.is_featured,
    );
    const rawMore = allProj.filter((p: any) => !p.featured && !p.is_featured);
    const highlights =
      rawHighlights.length > 0 ? rawHighlights.map(transformProject) : [];
    const moreProjects =
      rawMore.length > 0 ? rawMore.map(transformProject) : [];

    // Achievements split into research + other
    const allAch = achRes.data || [];
    const pubItems = allAch.filter((a: any) => a.type === "publication");
    const research =
      pubItems.length > 0
        ? pubItems.map((a: any) => ({
            title: a.title || "",
            venue: a.organization || "",
            when: String(a.date_year || ""),
            detail: a.description || "",
            status:
              a.tags && a.tags.length > 0
                ? a.tags[0]
                : a.link
                  ? "Published"
                  : "Under review",
          }))
        : [];

    const nonPub = allAch.filter((a: any) => a.type !== "publication");
    const achievementsGrouped: Record<string, string[]> = {};
    nonPub.forEach((a: any) => {
      const year = String(a.date_year || "Other");
      if (!achievementsGrouped[year]) achievementsGrouped[year] = [];
      const label = a.organization
        ? `${a.title} — ${a.organization}`
        : a.title || "";
      achievementsGrouped[year].push(label);
    });
    const achievements =
      Object.keys(achievementsGrouped).length > 0 ? achievementsGrouped : {};

    // Skills grouped by category
    const CAT_LABELS: Record<string, string> = {
      programming: "Languages",
      frameworks: "Web",
      "ai-ml": "ML / DL",
      tools: "Tools",
      cloud: "Platforms",
      // other: "Domains",
    };
    const CAT_ORDER = [
      "programming",
      "frameworks",
      "ai-ml",
      "tools",
      "cloud",
      // 'other',
    ];
    const skillsData = skillsRes.data || [];
    const skillsGrouped: Record<string, string[]> = {};
    skillsData.forEach((s: any) => {
      const cat = s.category || "other";
      if (!skillsGrouped[cat]) skillsGrouped[cat] = [];
      skillsGrouped[cat].push(s.name);
    });
    const skills =
      Object.keys(skillsGrouped).length > 0
        ? CAT_ORDER.filter((c) => skillsGrouped[c]).map((c) => ({
            label: CAT_LABELS[c] || c,
            items: skillsGrouped[c],
          }))
        : [];

    // Education
    const eduData = eduRes.data || [];
    const education =
      eduData.length > 0
        ? eduData.map((e: any) => ({
            degree: e.degree || "",
            school: e.institution || "",
            when: e.period || "",
            note: e.description || "",
          }))
        : [];

    return {
      bio,
      stats,
      experience,
      highlights,
      moreProjects,
      research,
      education,
      skills,
      achievements,
    };
  } catch (err) {
    console.error("Supabase fetch failed, using defaults:", err);
    return null;
  }
}

// ─── components ───────────────────────────────────────────────────────────────

function SectionHead({ n, label }: { n: number; label: string }) {
  return (
    <div className="sec-h">
      <span className="sec-n">{String(n).padStart(2, "0")}</span>
      <span className="sec-l">{label}</span>
    </div>
  );
}

function Aside({ bio, stats }: { bio: any; stats: any[] }) {
  return (
    <aside className="aside">
      <div className="aside-inner">
        {bio.photo && (
          <img src={bio.photo} alt={bio.name} className="profile-pic" />
        )}
        <h1 className="name">{bio.name}</h1>
        <p className="role">{bio.role}</p>
        <p className="blurb">{bio.blurb}</p>

        <dl className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.k}>
              <dt className="stat-n">{s.n}</dt>
              <dd className="stat-k">{s.k}</dd>
            </div>
          ))}
        </dl>

        <ul className="meta-list">
          <li className="meta-item">
            <span className="meta-icon">
              <Ico.location />
            </span>
            <span className="meta-val">{bio.location}</span>
          </li>
          <li className="meta-item">
            <a href={`mailto:${bio.email}`} className="meta-link">
              <span className="meta-icon">
                <Ico.email />
              </span>
              <span className="meta-val">{bio.email}</span>
            </a>
          </li>
          {bio.github && (
            <li className="meta-item">
              <a
                href={bio.github}
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                <span className="meta-icon">
                  <Ico.github />
                </span>
                <span className="meta-val">
                  {bio.github.replace("https://github.com/", "")}
                </span>
              </a>
            </li>
          )}
          {bio.linkedin && (
            <li className="meta-item">
              <a
                href={bio.linkedin}
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                <span className="meta-icon">
                  <Ico.linkedin />
                </span>
                <span className="meta-val">
                  {bio.linkedin.replace("https://www.linkedin.com/", "")}
                </span>
              </a>
            </li>
          )}
          {bio.resume && (
            <li className="meta-item">
              <a
                href={bio.resume}
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                <span className="meta-icon">
                  <Ico.resume />
                </span>
                <span className="meta-val">Résumé</span>
              </a>
            </li>
          )}
        </ul>

        {/* <div className="foot dim">© 2026 {bio.name}</div> */}
      </div>
    </aside>
  );
}

function ProjectCard({ p, i }: { p: any; i: number }) {
  return (
    <li className="proj" key={p.title + i}>
      <div className="proj-meta">
        <span className="proj-year">{p.year}</span>
        {p.badge ? <span className="proj-badge">{p.badge}</span> : null}
      </div>
      <div className="proj-body">
        <h3 className="proj-title">{p.title}</h3>
        <div className="proj-org">{p.org}</div>
        <p className="proj-detail">{p.detail}</p>
        <div className="proj-stack">
          {p.stack.map((s: string) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        {p.href ? (
          <div className="proj-actions">
            <a
              className="ghost-btn"
              href={p.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${p.title}`}
            >
              <span>Visit</span>
              <span className="ghost-btn-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function ProjectsSection({
  highlights,
  moreProjects,
}: {
  highlights: any[];
  moreProjects: any[];
}) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <section className="block" data-screen-label="02 Projects">
      <SectionHead n={2} label="Projects" />
      <ul className="proj-list">
        {highlights.map((p, i) => (
          <ProjectCard p={p} i={i} key={p.title + i} />
        ))}
        {expanded
          ? moreProjects.map((p, i) => (
              <ProjectCard p={p} i={i + 100} key={p.title + i + 100} />
            ))
          : null}
      </ul>
      {moreProjects.length > 0 && (
        <button
          type="button"
          className="more-btn"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span>
            {expanded
              ? "Show fewer"
              : `Show ${moreProjects.length} more projects`}
          </span>
          <span className="more-arrow" data-open={expanded ? "on" : "off"}>
            ↓
          </span>
        </button>
      )}
    </section>
  );
}

function Main({
  experience,
  highlights,
  moreProjects,
  research,
  education,
  skills,
  achievements,
  wrapRef,
}: {
  experience: any[];
  highlights: any[];
  moreProjects: any[];
  research: any[];
  education: any[];
  skills: any[];
  achievements: Record<string, string[]>;
  wrapRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <main className="main">
      <section className="block" data-screen-label="01 Experience">
        <SectionHead n={1} label="Experience" />
        <ul className="xp-list">
          {experience.map((x) => (
            <li className="xp" key={x.role + x.when}>
              <div className="xp-when">
                {x.when}
                {x.tag ? <span className="xp-tag">{x.tag}</span> : null}
              </div>
              <div className="xp-body">
                <div className="xp-role">{x.role}</div>
                <div className="xp-org">{x.org}</div>
                <p className="xp-detail">{x.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ProjectsSection highlights={highlights} moreProjects={moreProjects} />

      <section className="block" data-screen-label="03 Research">
        <SectionHead n={3} label="Research & Publications" />
        <ul className="xp-list">
          {research.map((r) => (
            <li className="xp" key={r.title}>
              <div className="xp-when">
                {r.when}
                <span className="xp-tag">{r.status}</span>
              </div>
              <div className="xp-body">
                <div className="xp-role">{r.title}</div>
                <div className="xp-org">{r.venue}</div>
                <p className="xp-detail">{r.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="block" data-screen-label="04 Education">
        <SectionHead n={4} label="Education" />
        <ul className="edu-list">
          {education.map((e) => (
            <li className="edu" key={e.degree}>
              <div className="edu-when">{e.when}</div>
              <div>
                <div className="edu-deg">{e.degree}</div>
                <div className="edu-school dim">{e.school}</div>
                <div className="edu-note">{e.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="block" data-screen-label="05 Skills">
        <SectionHead n={5} label="Stack" />
        <dl className="skills">
          {skills.map((g) => (
            <div className="skill-row" key={g.label}>
              <dt className="skill-k">{g.label}</dt>
              <dd className="skill-v">
                <SkillIcons items={g.items} wrapRef={wrapRef} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="block" data-screen-label="06 Achievements">
        <SectionHead n={6} label="Achievements & certifications" />
        {Object.entries(achievements)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, items]) => (
            <div className="ach-year" key={year}>
              <div className="ach-y">{year}</div>
              <ul className="ach-list">
                {items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
      </section>

      <div
        style={{
          // marginTop: "32px",
          // paddingTop: "32px",
          borderTop: "1px solid var(--border-1)",
          textAlign: "center",
        }}
      >
        <a
          href="/classic"
          style={{
            color: "var(--fg-3)",
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            letterSpacing: "0.01em",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg-1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
        >
          View interactive portfolio ↗
        </a>
      </div>
    </main>
  );
}

export default function PortfolioApp() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [portfolio, setPortfolio] = React.useState<any>(null);
  const [t, setTweak] = useTweaks();

  React.useEffect(() => {
    loadPortfolioData().then((data) => {
      setPortfolio(data);
    });
  }, []);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const apply = () => {
      const resolved =
        t.theme === "device"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : t.theme;
      wrap.setAttribute("data-theme", resolved);
      wrap.setAttribute("data-accent", t.accent);
      wrap.setAttribute("data-neutral", "warm");
    };

    apply();

    if (t.theme === "device") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [t.theme, t.accent]);

  if (!portfolio) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg-3)",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          letterSpacing: "0.04em",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div
      className="portfolio-wrap"
      ref={wrapRef}
      data-serif-headings="on"
      style={{ minHeight: "100vh" }}
    >
      <div className="page">
        <Aside bio={portfolio.bio} stats={portfolio.stats} />
        <Main
          experience={portfolio.experience}
          highlights={portfolio.highlights}
          moreProjects={portfolio.moreProjects}
          research={portfolio.research}
          education={portfolio.education}
          skills={portfolio.skills}
          achievements={portfolio.achievements}
          wrapRef={wrapRef}
        />
      </div>

      <TweaksPanel tweaks={t} setTweak={setTweak} />
    </div>
  );
}
