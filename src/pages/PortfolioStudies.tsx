import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { SEO } from "@/components/seo";
import { achievements as staticAchievements, projects as staticProjects } from "@/data/data";
import { loadPortfolioData } from "@/professional/PortfolioApp";
import "./portfolio-studies.css";

type Study = 1 | 2 | 3;
type Theme = "light" | "dark";

type PortfolioProject = {
  year: string;
  title: string;
  org: string;
  detail: string;
  stack: string[];
  badge?: string;
  href?: string;
};

type PortfolioData = {
  bio: {
    name: string;
    role: string;
    location: string;
    email: string;
    blurb: string;
    photo: string | null;
    github: string | null;
    linkedin: string | null;
    instagram: string | null;
    resume: string | null;
  };
  stats: Array<{ n: string; k: string }>;
  experience: Array<{ when: string; role: string; org: string; detail: string; tag?: string }>;
  highlights: PortfolioProject[];
  moreProjects: PortfolioProject[];
  research: Array<{ title: string; venue: string; when: string; detail: string; status: string }>;
  education: Array<{ degree: string; school: string; when: string; note: string }>;
  skills: Array<{ label: string; items: string[] }>;
  achievements: Record<string, string[]>;
};

const fallbackProjects: PortfolioProject[] = staticProjects.map((project) => ({
  year: String(project.endDate?.year ?? project.startDate.year),
  title: project.title,
  org: [project.event, project.role].filter(Boolean).join(" · "),
  detail: project.longDescription ?? project.description,
  stack: project.tags,
  badge: project.achievements?.[0],
  href: project.liveLink ?? project.link ?? project.githubLink,
}));

const fallbackAchievements = staticAchievements.reduce<Record<string, string[]>>((groups, item) => {
  const year = String(item.date.year);
  groups[year] ??= [];
  groups[year].push(`${item.title} — ${item.organization}`);
  return groups;
}, {});

const fallbackData: PortfolioData = {
  bio: {
    name: "Kandarp Gajjar",
    role: "AI/ML & Full-Stack Developer",
    location: "Gandhinagar, India",
    email: "slantie.contact@gmail.com",
    blurb: "I build thoughtful software at the intersection of machine learning, research, and useful web products.",
    photo: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825823/me2_cdehns_ulo0rz.avif",
    github: "https://github.com/slantie",
    linkedin: "https://linkedin.com/in/kandarpgajjar",
    instagram: "https://www.instagram.com/whoisslantie/",
    resume: "https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing",
  },
  stats: [
    { n: "7+", k: "Hackathons" },
    { n: "10+", k: "Projects" },
    { n: "1", k: "Publication" },
  ],
  experience: [
    {
      when: "2023 — 2024",
      role: "Chairperson",
      org: "IEEE Student Branch, LDRP-ITR",
      detail: "Led student initiatives, technical programming, partnerships, and a growing community of builders.",
    },
    {
      when: "2024",
      role: "AI/ML Developer",
      org: "Smart India Hackathon · IIT Guwahati",
      detail: "Built VidVigilante, a deepfake detection platform for the National Technical Research Organisation.",
    },
    {
      when: "2024",
      role: "Researcher",
      org: "PIRFIRE · FIRE 2024",
      detail: "Worked on personalised community question answering and information retrieval systems.",
    },
  ],
  highlights: fallbackProjects.filter((project) => staticProjects.find((item) => item.title === project.title)?.featured),
  moreProjects: fallbackProjects.filter((project) => !staticProjects.find((item) => item.title === project.title)?.featured),
  research: staticAchievements
    .filter((item) => item.type === "publication")
    .map((item) => ({
      title: item.title,
      venue: item.organization,
      when: String(item.date.year),
      detail: item.description,
      status: item.tags[0] ?? "Published",
    })),
  education: [
    {
      degree: "M.Tech in ICT — Software Systems",
      school: "Dhirubhai Ambani University",
      when: "2025 — 2027",
      note: "Advanced software systems, computing, and research.",
    },
    {
      degree: "B.E. in Computer Engineering",
      school: "LDRP Institute of Technology and Research",
      when: "2021 — 2025",
      note: "Machine learning, full-stack engineering, and student leadership.",
    },
  ],
  skills: [
    { label: "Languages", items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
    { label: "Web", items: ["React", "Node.js", "FastAPI", "Flask", "Tailwind CSS"] },
    { label: "ML / DL", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "OpenCV"] },
    { label: "Platforms", items: ["AWS", "Docker", "Postgres", "Linux", "GitHub"] },
  ],
  achievements: fallbackAchievements,
};

function usePortfolioData() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(fallbackData);

  useEffect(() => {
    let active = true;
    void loadPortfolioData().then((data) => {
      if (active && data) setPortfolio(data as PortfolioData);
    });
    return () => {
      active = false;
    };
  }, []);

  return portfolio;
}

function useStudyTheme(study: Study) {
  const key = `portfolio-study-${study}-theme`;
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => localStorage.setItem(key, theme), [key, theme]);
  return [theme, () => setTheme((value) => (value === "light" ? "dark" : "light"))] as const;
}

function StudyControls({ study, theme, onTheme }: { study: Study; theme: Theme; onTheme: () => void }) {
  return (
    <div className="study-controls" aria-label="Portfolio study controls">
      <span className="study-controls-label">Studies</span>
      {[1, 2, 3, 4].map((item) => (
        <Link key={item} to={`/test-${item}`} aria-current={study === item ? "page" : undefined}>
          0{item}
        </Link>
      ))}
      <button type="button" onClick={onTheme} aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}>
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </div>
  );
}

function SocialLinks({ data, className = "" }: { data: PortfolioData; className?: string }) {
  const links = [
    { href: data.bio.github, label: "GitHub", icon: <Github /> },
    { href: data.bio.linkedin, label: "LinkedIn", icon: <Linkedin /> },
    { href: `mailto:${data.bio.email}`, label: "Email", icon: <Mail /> },
    { href: data.bio.resume, label: "Résumé", icon: <Download /> },
  ].filter((item) => item.href);

  return (
    <div className={`study-socials ${className}`}>
      {links.map((item) => (
        <a key={item.label} href={item.href ?? undefined} target={item.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {item.icon}
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

function ProjectLink({ project, children }: { project: PortfolioProject; children: ReactNode }) {
  if (!project.href) return <>{children}</>;
  return <a href={project.href} target="_blank" rel="noreferrer">{children}</a>;
}

function getProjectImage(project: PortfolioProject, index: number) {
  return staticProjects.find((item) => item.title === project.title)?.image ?? staticProjects[index % staticProjects.length]?.image;
}

function ThemeSEO({ study }: { study: Study }) {
  const names = ["Powder Grid", "Chromatic Ledger", "Stacked Chapters"];
  return (
    <SEO
      title={`${names[study - 1]} — Portfolio study`}
      description="A colourful portfolio study for Kandarp Gajjar, AI/ML and full-stack developer."
      type="profile"
    />
  );
}

export function PortfolioStudyPage({ study }: { study: Study }) {
  const data = usePortfolioData();
  const [theme, toggleTheme] = useStudyTheme(study);

  return (
    <>
      <ThemeSEO study={study} />
      {study === 1 && <PowderGrid data={data} theme={theme} toggleTheme={toggleTheme} />}
      {study === 2 && <ChromaticLedger data={data} theme={theme} toggleTheme={toggleTheme} />}
      {study === 3 && <StackedChapters data={data} theme={theme} toggleTheme={toggleTheme} />}
    </>
  );
}

function PowderGrid({ data, theme, toggleTheme }: { data: PortfolioData; theme: Theme; toggleTheme: () => void }) {
  const projects = [...data.highlights, ...data.moreProjects].slice(0, 6);
  const achievements = Object.entries(data.achievements).flatMap(([year, items]) => items.slice(0, 2).map((item) => ({ year, item }))).slice(0, 6);

  return (
    <div className="portfolio-study study-one" data-theme={theme}>
      <StudyControls study={1} theme={theme} onTheme={toggleTheme} />
      <header className="s1-nav">
        <a className="s1-wordmark" href="#top">KG<span>●</span></a>
        <nav><a href="#work">Work</a><a href="#projects">Projects</a><a href="#profile">Profile</a></nav>
        <a className="s1-contact" href={`mailto:${data.bio.email}`}>Let’s talk <ArrowUpRight /></a>
      </header>

      <main id="top" className="s1-main">
        <section className="s1-hero">
          <div className="s1-hero-copy">
            <p className="s1-kicker"><Sparkles /> Developer · Researcher · Builder</p>
            <h1>I turn difficult ideas into <em>useful</em> software.</h1>
            <p className="s1-intro">{data.bio.blurb}</p>
            <SocialLinks data={data} />
          </div>
          <div className="s1-portrait-wrap">
            {data.bio.photo && <img src={data.bio.photo} alt={data.bio.name} className="s1-portrait" />}
            <div className="s1-location"><MapPin /> {data.bio.location}</div>
          </div>
          <div className="s1-stats">
            {data.stats.map((stat, index) => <div key={stat.k} data-color={index}><strong>{stat.n}</strong><span>{stat.k}</span></div>)}
          </div>
        </section>

        <section id="work" className="s1-section s1-work">
          <SectionTitle number="01" eyebrow="What I’ve been doing" title="Experience" />
          <div className="s1-timeline">
            {data.experience.map((item) => (
              <article key={`${item.role}-${item.when}`}>
                <span>{item.when}</span>
                <div><h3>{item.role}</h3><p className="s1-org">{item.org}</p><p>{item.detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="s1-section s1-projects">
          <SectionTitle number="02" eyebrow="Selected systems and experiments" title="Projects" />
          <div className="s1-project-grid">
            {projects.map((project, index) => (
              <ProjectLink project={project} key={project.title}>
                <article className="s1-project-card" data-color={index % 5}>
                  <div className="s1-project-image"><img src={getProjectImage(project, index)} alt="" loading="lazy" /></div>
                  <div className="s1-project-body">
                    <div className="s1-project-meta"><span>{project.year}</span><ArrowUpRight /></div>
                    <h3>{project.title}</h3>
                    <p>{project.detail}</p>
                    <div className="s1-tags">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                </article>
              </ProjectLink>
            ))}
          </div>
        </section>

        <section id="profile" className="s1-profile-grid">
          <div className="s1-section s1-research">
            <SectionTitle number="03" eyebrow="Questions worth pursuing" title="Research" />
            {data.research.length ? data.research.map((item) => <article key={item.title}><span>{item.when} · {item.status}</span><h3>{item.title}</h3><p>{item.venue}</p></article>) : <article><span>Ongoing practice</span><h3>Personalised information retrieval</h3><p>Researching systems that adapt useful answers to people and context.</p></article>}
          </div>
          <div className="s1-section s1-education">
            <SectionTitle number="04" eyebrow="Formal foundations" title="Education" />
            {data.education.map((item) => <article key={item.degree}><span>{item.when}</span><h3>{item.degree}</h3><p>{item.school}</p></article>)}
          </div>
        </section>

        <section className="s1-section s1-skills">
          <SectionTitle number="05" eyebrow="Tools I trust" title="Capabilities" />
          <div className="s1-skill-grid">{data.skills.map((group) => <div key={group.label}><h3>{group.label}</h3><p>{group.items.join(" · ")}</p></div>)}</div>
        </section>

        <section className="s1-section s1-achievements">
          <SectionTitle number="06" eyebrow="A few meaningful markers" title="Recognition" />
          <div className="s1-achievement-list">{achievements.map(({ year, item }) => <div key={`${year}-${item}`}><span>{year}</span><p>{item}</p></div>)}</div>
        </section>
      </main>

      <footer className="s1-footer"><p>Have an interesting problem?</p><a href={`mailto:${data.bio.email}`}>Let’s build something useful. <ArrowUpRight /></a><span>© 2026 {data.bio.name}</span></footer>
    </div>
  );
}

function SectionTitle({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return <header className="study-section-title"><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></header>;
}

function ChromaticLedger({ data, theme, toggleTheme }: { data: PortfolioData; theme: Theme; toggleTheme: () => void }) {
  const [showAll, setShowAll] = useState(false);
  const projects = [...data.highlights, ...data.moreProjects];
  const visibleProjects = showAll ? projects : projects.slice(0, 5);
  const achievements = Object.entries(data.achievements).flatMap(([year, items]) => items.map((item) => ({ year, item }))).slice(0, 8);

  return (
    <div className="portfolio-study study-two" data-theme={theme}>
      <StudyControls study={2} theme={theme} onTheme={toggleTheme} />
      <div className="s2-shell">
        <header className="s2-nav">
          <a href="#top" className="s2-mark">KANDARP®</a>
          <nav><a href="#s2-projects">Index</a><a href="#s2-profile">Profile</a><a href={`mailto:${data.bio.email}`}>Contact</a></nav>
        </header>

        <main id="top">
          <section className="s2-hero">
            <div className="s2-hero-number">PORTFOLIO / 26</div>
            <div className="s2-hero-title"><h1>{data.bio.name}</h1><p>{data.bio.role}</p></div>
            <p className="s2-hero-blurb">{data.bio.blurb}</p>
            <div className="s2-hero-bottom">
              <div className="s2-palette" aria-label="Colour key"><i /><i /><i /><i /><i /></div>
              <span><MapPin /> {data.bio.location}</span>
              <a href="#s2-projects">Selected index <ArrowDownRight /></a>
            </div>
          </section>

          <LedgerSection id="s2-profile" number="01" label="Experience" tone="orange">
            <div className="s2-experience">
              {data.experience.map((item, index) => <article key={`${item.role}-${item.when}`}><b>0{index + 1}</b><span>{item.when}</span><div><h3>{item.role}</h3><p className="s2-accent">{item.org}</p><p>{item.detail}</p></div></article>)}
            </div>
          </LedgerSection>

          <LedgerSection id="s2-projects" number="02" label="Project index" tone="blue">
            <div className="s2-project-index">
              {visibleProjects.map((project, index) => (
                <ProjectLink project={project} key={project.title}>
                  <article>
                    <span className="s2-project-no">{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{project.title}</h3><p>{project.org || project.detail}</p></div>
                    <div className="s2-project-tags">{project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <span className="s2-project-year">{project.year}</span><ArrowUpRight />
                  </article>
                </ProjectLink>
              ))}
              {projects.length > 5 && <button type="button" className="s2-more" onClick={() => setShowAll((value) => !value)}>{showAll ? "Collapse index" : `Open full index (+${projects.length - 5})`}</button>}
            </div>
          </LedgerSection>

          <div className="s2-split">
            <LedgerSection number="03" label="Education" tone="yellow">
              <div className="s2-education">{data.education.map((item) => <article key={item.degree}><span>{item.when}</span><h3>{item.degree}</h3><p>{item.school}</p><small>{item.note}</small></article>)}</div>
            </LedgerSection>
            <LedgerSection number="04" label="Technical stack" tone="green">
              <div className="s2-skills">{data.skills.map((group) => <article key={group.label}><h3>{group.label}</h3><p>{group.items.join(" / ")}</p></article>)}</div>
            </LedgerSection>
          </div>

          <LedgerSection number="05" label="Recognition log" tone="red">
            <div className="s2-recognition">{achievements.map(({ year, item }, index) => <article key={`${year}-${item}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{year}</span><p>{item}</p></article>)}</div>
          </LedgerSection>

          <section className="s2-contact">
            <p>AVAILABLE FOR RESEARCH, PRODUCT & ENGINEERING CONVERSATIONS</p>
            <h2>Make the complex<br /><em>clear and useful.</em></h2>
            <SocialLinks data={data} />
          </section>
        </main>
        <footer className="s2-footer"><span>© 2026 {data.bio.name}</span><a href="#top">Back to top ↑</a></footer>
      </div>
    </div>
  );
}

function LedgerSection({ id, number, label, tone, children }: { id?: string; number: string; label: string; tone: string; children: ReactNode }) {
  return <section id={id} className="s2-section" data-tone={tone}><header><span>{number}</span><h2>{label}</h2></header><div className="s2-section-content">{children}</div></section>;
}

function StackedChapters({ data, theme, toggleTheme }: { data: PortfolioData; theme: Theme; toggleTheme: () => void }) {
  const projects = [...data.highlights, ...data.moreProjects].slice(0, 6);
  const achievementYears = useMemo(() => Object.entries(data.achievements).sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, 3), [data.achievements]);

  return (
    <div className="portfolio-study study-three" data-theme={theme}>
      <StudyControls study={3} theme={theme} onTheme={toggleTheme} />
      <header className="s3-nav"><a href="#s3-top">SLANTIE / K.G.</a><nav><a href="#s3-work">Work</a><a href="#s3-lab">Lab</a><a href="#s3-about">About</a></nav></header>

      <main id="s3-top">
        <section className="s3-hero">
          <div className="s3-orb s3-orb-one" /><div className="s3-orb s3-orb-two" /><div className="s3-orb s3-orb-three" />
          <p className="s3-overline">Developer × Researcher × Relentless learner</p>
          <h1><span>Kandarp</span><span>makes ideas</span><span>work.</span></h1>
          <div className="s3-hero-note"><p>{data.bio.blurb}</p><a href={`mailto:${data.bio.email}`}>Start a conversation <ArrowUpRight /></a></div>
          <div className="s3-hero-meta"><span><MapPin /> {data.bio.location}</span><span>Scroll through the chapters ↓</span></div>
        </section>

        <Chapter id="s3-work" number="01" label="The work" color="blue">
          <div className="s3-project-deck">
            {projects.map((project, index) => (
              <ProjectLink project={project} key={project.title}>
                <article>
                  <div className="s3-project-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.year}</span></div>
                  <h3>{project.title}</h3><p>{project.detail}</p>
                  <div>{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <ArrowUpRight className="s3-project-arrow" />
                </article>
              </ProjectLink>
            ))}
          </div>
        </Chapter>

        <Chapter number="02" label="The trajectory" color="orange">
          <div className="s3-timeline">
            {data.experience.map((item, index) => <article key={`${item.role}-${item.when}`}><div className="s3-time-marker"><span>{index + 1}</span></div><div><p>{item.when}</p><h3>{item.role}</h3><h4>{item.org}</h4><div>{item.detail}</div></div></article>)}
          </div>
        </Chapter>

        <Chapter id="s3-lab" number="03" label="The lab" color="green">
          <div className="s3-lab-grid">
            <div className="s3-research-card"><p>Current curiosity</p><h3>{data.research[0]?.title ?? "Personalised systems that understand context."}</h3><span>{data.research[0]?.detail ?? "Machine learning becomes useful when it helps a person make a better decision."}</span></div>
            <div className="s3-skill-cloud">{data.skills.flatMap((group) => group.items.slice(0, 5)).map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}</div>
          </div>
        </Chapter>

        <Chapter id="s3-about" number="04" label="The foundations" color="yellow">
          <div className="s3-foundations">
            <div>{data.education.map((item) => <article key={item.degree}><span>{item.when}</span><h3>{item.degree}</h3><p>{item.school}</p></article>)}</div>
            <div>{achievementYears.map(([year, items]) => <article key={year}><span>{year}</span><ul>{items.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
          </div>
        </Chapter>

        <section className="s3-finale">
          <p>One last chapter?</p><h2>Let’s make<br />something <em>alive.</em></h2><SocialLinks data={data} />
          <footer><span>© 2026 {data.bio.name}</span><a href="#s3-top">Return to top ↑</a></footer>
        </section>
      </main>
    </div>
  );
}

function Chapter({ id, number, label, color, children }: { id?: string; number: string; label: string; color: string; children: ReactNode }) {
  return <section id={id} className="s3-chapter" data-color={color}><header><span>{number}</span><h2>{label}</h2></header>{children}</section>;
}

export default PortfolioStudyPage;
