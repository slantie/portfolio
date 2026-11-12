import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { SEO } from "@/components/seo";
import { loadPortfolioData } from "@/professional/PortfolioApp";
import "./professional-evidence.css";

type EvidenceProject = {
  year: string;
  title: string;
  org: string;
  detail: string;
  stack: string[];
  badge?: string;
  href?: string;
  image?: string | null;
};

const projectPriority = [
  "Reflectify",
  "Learnova",
  "Drishtiksha",
  "Nivaran",
  "NischayJyot",
  "M. M. Patel",
  "Quiz",
  "Entropy",
];

function projectRank(title: string) {
  const rank = projectPriority.findIndex((name) =>
    title.toLowerCase().includes(name.toLowerCase()),
  );
  return rank === -1 ? 99 : rank;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ExternalLink({ href, children }: { href?: string | null; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function ProfessionalEvidencePage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    let active = true;
    void loadPortfolioData().then((data) => {
      if (active) setPortfolio(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const projects = useMemo<EvidenceProject[]>(() => {
    if (!portfolio) return [];
    return [...portfolio.highlights, ...portfolio.moreProjects]
      .sort((a, b) => projectRank(a.title) - projectRank(b.title))
      .slice(0, 7);
  }, [portfolio]);

  const selected = projects[activeProject] || projects[0];

  const recognitions = useMemo(() => {
    if (!portfolio) return [];
    const preferred =
      /AWS Certified Machine Learning Engineer|Odoo|Smart India Hackathon 2023|Smart India Hackathon 2024|SSIP 2023|Best Emerging|State Level Poster|EcoSmart Dustbin Project Grant/i;
    return Object.entries(portfolio.achievements as Record<string, string[]>)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .flatMap(([year, items]) => items.map((label) => ({ year, label })))
      .filter((item) => preferred.test(item.label))
      .slice(0, 7);
  }, [portfolio]);

  if (!portfolio) {
    return (
      <div className="evidence-loading">
        <span>KG / 026</span>
        <p>Assembling evidence…</p>
      </div>
    );
  }

  const { bio, stats, experience, leadership, research, education, skills } = portfolio;

  return (
    <div className="evidence-page">
      <SEO
        title="Professional Evidence Desk"
        description="Kandarp Gajjar — applied machine learning researcher and software engineer. Selected systems, research, experience, and leadership."
        type="profile"
      />

      <header className="evidence-header">
        <a className="evidence-mark" href="#top" aria-label="Back to top">
          <span>{initials(bio.name)}</span>
          <small>Evidence desk</small>
        </a>
        <nav aria-label="Professional portfolio sections">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#trajectory">Trajectory</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="evidence-header-cta" href={`mailto:${bio.email}`}>
          Start a conversation <ArrowUpRight aria-hidden />
        </a>
      </header>

      <main id="top">
        <section className="evidence-hero">
          <div className="evidence-hero-index" aria-hidden="true">
            <span>FOLIO / 026</span>
            <span>23.0225° N · 72.5714° E</span>
          </div>

          <div className="evidence-hero-copy">
            <p className="evidence-kicker">
              Applied ML researcher <i /> software engineer
            </p>
            <h1>
              I turn research
              <span>questions into</span>
              working systems.
            </h1>
            <div className="evidence-hero-bottom">
              <p>{bio.blurb}</p>
              <a href="#work" className="evidence-down-link">
                Inspect the work <ArrowDown aria-hidden />
              </a>
            </div>
          </div>

          <aside className="evidence-identity-card">
            {bio.photo ? <img src={bio.photo} alt={bio.name} /> : null}
            <div>
              <strong>{bio.name}</strong>
              <span>{bio.role}</span>
            </div>
            <p><MapPin aria-hidden /> {bio.location}</p>
            <p className="evidence-status"><i /> Available for thoughtful collaborations</p>
          </aside>

          <div className="evidence-stat-strip">
            {stats.map((stat: { n: string; k: string }, index: number) => (
              <div key={stat.k}>
                <span>0{index + 1}</span>
                <strong>{stat.n}</strong>
                <small>{stat.k}</small>
              </div>
            ))}
            <div className="evidence-stat-note">
              <span>04</span>
              <strong>Build</strong>
              <small>Research → product</small>
            </div>
          </div>
        </section>

        <section className="evidence-section evidence-work" id="work">
          <div className="evidence-section-heading">
            <p>01 / Selected evidence</p>
            <h2>Proof of work, not a wall of cards.</h2>
            <span>Choose a case file to inspect the system, context, and working surface.</span>
          </div>

          <div className="evidence-console">
            <div className="evidence-project-index" role="list" aria-label="Selected projects">
              {projects.map((project, index) => (
                <button
                  type="button"
                  role="listitem"
                  aria-pressed={activeProject === index}
                  onClick={() => setActiveProject(index)}
                  key={project.title}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{project.title}</strong>
                    <small>{project.org}</small>
                  </span>
                  <ArrowUpRight aria-hidden />
                </button>
              ))}
            </div>

            {selected ? (
              <article className="evidence-project-stage" key={selected.title}>
                <div className="evidence-project-visual">
                  {selected.image ? (
                    <img src={selected.image} alt={`${selected.title} interface`} />
                  ) : (
                    <div className="evidence-project-placeholder">
                      <span>{initials(selected.title)}</span>
                    </div>
                  )}
                  <div className="evidence-visual-label">
                    <span>CASE / {String(activeProject + 1).padStart(2, "0")}</span>
                    <span>{selected.year || "Current"}</span>
                  </div>
                </div>
                <div className="evidence-project-body">
                  <div>
                    {selected.badge ? <span className="evidence-badge">{selected.badge}</span> : null}
                    <h3>{selected.title}</h3>
                    <p>{selected.detail}</p>
                  </div>
                  <div className="evidence-project-footer">
                    <ul>
                      {selected.stack.slice(0, 6).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <ExternalLink href={selected.href}>
                      Open evidence <ArrowUpRight aria-hidden />
                    </ExternalLink>
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="evidence-section evidence-research" id="research">
          <div className="evidence-section-heading evidence-section-heading-dark">
            <p>02 / Research ledger</p>
            <h2>Ideas that survived contact with evidence.</h2>
            <span>Published, accepted, under review, and deliberately labelled as such.</span>
          </div>
          <div className="evidence-ledger">
            {research.map((item: any, index: number) => {
              const content = (
                <>
                  <span className="evidence-ledger-id">R-{String(index + 1).padStart(2, "0")}</span>
                  <span className="evidence-ledger-year">{item.when}</span>
                  <span className="evidence-ledger-copy">
                    <strong>{item.title}</strong>
                    <small>{item.venue}</small>
                  </span>
                  <span className="evidence-ledger-status">{item.status}</span>
                  <ArrowUpRight aria-hidden />
                </>
              );
              return item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>{content}</a>
              ) : (
                <div key={item.title}>{content}</div>
              );
            })}
          </div>
        </section>

        <section className="evidence-section evidence-trajectory" id="trajectory">
          <div className="evidence-section-heading">
            <p>03 / Trajectory</p>
            <h2>Technical depth, with responsibility attached.</h2>
          </div>

          <div className="evidence-track-grid">
            <div className="evidence-track">
              <header><span>A</span><h3>Professional practice</h3></header>
              {experience.map((item: any, index: number) => (
                <article key={item.role + item.when}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{item.when}{item.tag ? ` · ${item.tag}` : ""}</small>
                    <h4>{item.role}</h4>
                    <b>{item.org}</b>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="evidence-track evidence-track-leadership">
              <header><span>B</span><h3>Leadership practice</h3></header>
              {leadership.map((item: any, index: number) => (
                <article key={item.role + item.when}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{item.when}</small>
                    <h4>{item.role}</h4>
                    <b>{item.org}</b>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}

              <div className="evidence-education-note">
                <BookOpen aria-hidden />
                <div>
                  <small>Currently studying</small>
                  <strong>{education[0]?.degree}</strong>
                  <span>{education[0]?.school}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="evidence-section evidence-capabilities">
          <div className="evidence-section-heading">
            <p>04 / Working set</p>
            <h2>A stack organised around outcomes.</h2>
          </div>
          <div className="evidence-capability-grid">
            {skills.map((group: any, index: number) => (
              <article key={group.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.label}</h3>
                <p>{group.items.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="evidence-section evidence-recognition">
          <div className="evidence-section-heading evidence-section-heading-dark">
            <p>05 / Selected recognition</p>
            <h2>Only the signals worth keeping.</h2>
          </div>
          <ol>
            {recognitions.map((item, index) => (
              <li key={item.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <small>{item.year}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className="evidence-contact" id="contact">
          <div>
            <p>06 / Open channel</p>
            <h2>Have a difficult problem worth making tangible?</h2>
          </div>
          <a className="evidence-contact-mail" href={`mailto:${bio.email}`}>
            <Mail aria-hidden />
            <span>{bio.email}</span>
            <ArrowUpRight aria-hidden />
          </a>
          <div className="evidence-contact-links">
            <ExternalLink href={bio.github}><Github aria-hidden /> GitHub</ExternalLink>
            <ExternalLink href={bio.linkedin}><Linkedin aria-hidden /> LinkedIn</ExternalLink>
            <ExternalLink href={bio.scholar}><BookOpen aria-hidden /> Scholar</ExternalLink>
            <ExternalLink href={bio.resume}><FileText aria-hidden /> Résumé</ExternalLink>
          </div>
        </section>
      </main>

      <footer className="evidence-footer">
        <span>© 2026 Kandarp Gajjar</span>
        <span>Designed as an evidence desk, not a résumé template.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
