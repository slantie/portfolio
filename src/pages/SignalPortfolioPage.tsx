import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { SEO } from "@/components/seo";
import { projects as staticProjects } from "@/data/data";
import { loadPortfolioData } from "@/professional/PortfolioApp";
import { TweaksPanel, useTweaks } from "@/professional/TweaksPanel";
import "@/professional/helix-theme.css";
import "./signal-portfolio.css";

type PortfolioProject = {
  year: string;
  title: string;
  org: string;
  detail: string;
  stack: string[];
  badge?: string;
  href?: string;
};

function sectionId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function projectImage(project: PortfolioProject, index: number) {
  return staticProjects.find((item) => item.title === project.title)?.image
    ?? staticProjects[index % staticProjects.length]?.image;
}

function SectionHeading({ number, title, note }: { number: string; title: string; note: string }) {
  return (
    <header className="signal-section-heading">
      <span>{number}</span>
      <div><h2>{title}</h2><p>{note}</p></div>
    </header>
  );
}

function ProjectCard({ project, index, featured = false }: { project: PortfolioProject; index: number; featured?: boolean }) {
  const content = (
    <article className={`signal-project${featured ? " signal-project--featured" : ""}`}>
      {featured && <div className="signal-project-image"><img src={projectImage(project, index)} alt="" loading="lazy" /></div>}
      <div className="signal-project-copy">
        <div className="signal-project-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.year}</span></div>
        <h3>{project.title}</h3>
        {project.org && <p className="signal-project-org">{project.org}</p>}
        <p className="signal-project-detail">{project.detail}</p>
        <div className="signal-project-footer">
          <div>{project.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>
          {project.href && <ArrowUpRight />}
        </div>
      </div>
    </article>
  );

  return project.href ? <a href={project.href} target="_blank" rel="noreferrer">{content}</a> : content;
}

export default function SignalPortfolioPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [tweaks, setTweak] = useTweaks();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void loadPortfolioData().then((data) => active && setPortfolio(data));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const apply = () => {
      const theme = tweaks.theme === "device"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        : tweaks.theme;
      wrap.dataset.theme = theme;
      wrap.dataset.accent = tweaks.accent;
      wrap.dataset.neutral = "warm";
    };
    apply();
    if (tweaks.theme === "device") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
  }, [tweaks.theme, tweaks.accent]);

  const projects = useMemo(() => portfolio ? [...portfolio.highlights, ...portfolio.moreProjects] as PortfolioProject[] : [], [portfolio]);
  const achievementYears = useMemo(() => portfolio
    ? Object.entries(portfolio.achievements as Record<string, string[]>).sort((a, b) => Number(b[0]) - Number(a[0]))
    : [], [portfolio]);

  if (!portfolio) {
    return <div className="signal-loading">Preparing portfolio…</div>;
  }

  const socialLinks = [
    { label: "GitHub", href: portfolio.bio.github, icon: Github },
    { label: "LinkedIn", href: portfolio.bio.linkedin, icon: Linkedin },
    { label: "Email", href: `mailto:${portfolio.bio.email}`, icon: Mail },
    { label: "Résumé", href: portfolio.bio.resume, icon: Download },
  ].filter((item) => item.href);

  const nav = ["Experience", "Selected work", "Research", "Education", "Capabilities", "Recognition"];

  return (
    <div className="signal-portfolio" ref={wrapRef}>
      <SEO title="Signal & Structure — Portfolio study" description="A portfolio study for Kandarp Gajjar, AI/ML and full-stack developer." type="profile" />

      <div className="signal-rail" aria-hidden="true"><i /><i /><i /><i /><i /></div>

      <aside className="signal-aside">
        <div className="signal-aside-inner">
          <a href="#top" className="signal-wordmark">KANDARP / 26</a>

          {portfolio.bio.photo && <img className="signal-portrait" src={portfolio.bio.photo} alt={portfolio.bio.name} />}

          <div className="signal-identity">
            <p>Developer · Researcher</p>
            <h1>{portfolio.bio.name}</h1>
            <span>{portfolio.bio.role}</span>
          </div>

          <p className="signal-bio">{portfolio.bio.blurb}</p>

          <div className="signal-socials">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label}><Icon /><span>{label}</span></a>
            ))}
          </div>

          <dl className="signal-stats">
            {portfolio.stats.map((stat: { n: string; k: string }) => <div key={stat.k}><dt>{stat.n}</dt><dd>{stat.k}</dd></div>)}
          </dl>

          <nav className="signal-nav" aria-label="Portfolio sections">
            {nav.map((item, index) => <a key={item} href={`#${sectionId(item)}`}><span>{String(index + 1).padStart(2, "0")}</span>{item}</a>)}
          </nav>
        </div>
      </aside>

      <main className="signal-main" id="top">
        <header className="signal-hero">
          <div className="signal-hero-meta"><span>Independent portfolio</span><span>Updated 2026</span></div>
          <h2>Building systems that make complexity feel <em>useful.</em></h2>
          <div className="signal-hero-bottom">
            <p>I work across applied machine learning, research, and full-stack product engineering—moving from an uncertain problem to something people can actually use.</p>
            <div><span><MapPin />{portfolio.bio.location}</span><a href="#selected-work">View selected work <ArrowDownRight /></a></div>
          </div>
        </header>

        <section className="signal-section" id="experience">
          <SectionHeading number="01" title="Experience" note="Roles, collaborations, and ongoing work." />
          <div className="signal-experience-list">
            {portfolio.experience.map((item: any) => (
              <article key={`${item.role}-${item.when}`}>
                <div className="signal-experience-when">{item.when}{item.tag && <span>{item.tag}</span>}</div>
                <div><h3>{item.role}</h3><h4>{item.org}</h4><p>{item.detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="signal-section" id="selected-work">
          <SectionHeading number="02" title="Selected work" note="Systems with real constraints, context, and outcomes." />
          <div className="signal-projects">
            {projects.slice(0, 6).map((project, index) => <ProjectCard key={project.title} project={project} index={index} featured={index === 0} />)}
          </div>
        </section>

        {portfolio.research.length > 0 && (
          <section className="signal-section" id="research">
            <SectionHeading number="03" title="Research" note="Questions that deserved more than a quick answer." />
            <div className="signal-research-list">
              {portfolio.research.map((item: any) => <article key={item.title}><div><span>{item.when}</span><span>{item.status}</span></div><h3>{item.title}</h3><p className="signal-research-venue">{item.venue}</p><p>{item.detail}</p></article>)}
            </div>
          </section>
        )}

        <section className="signal-section" id="education">
          <SectionHeading number="04" title="Education" note="The formal foundation beneath the practice." />
          <div className="signal-education-list">
            {portfolio.education.map((item: any) => <article key={item.degree}><span>{item.when}</span><div><h3>{item.degree}</h3><p>{item.school}</p><small>{item.note}</small></div></article>)}
          </div>
        </section>

        <section className="signal-section" id="capabilities">
          <SectionHeading number="05" title="Capabilities" note="A working toolkit, not a keyword collection." />
          <div className="signal-skills">
            {portfolio.skills.map((group: any) => <article key={group.label}><h3>{group.label}</h3><p>{group.items.join(" · ")}</p></article>)}
          </div>
        </section>

        <section className="signal-section" id="recognition">
          <SectionHeading number="06" title="Recognition" note="A selective record of milestones and trust earned." />
          <div className="signal-recognition">
            {achievementYears.slice(0, 4).map(([year, items]) => <article key={year}><span>{year}</span><ul>{items.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul></article>)}
          </div>
        </section>

        <footer className="signal-contact">
          <p>Have a complex problem worth simplifying?</p>
          <a href={`mailto:${portfolio.bio.email}`}>Let’s talk. <ArrowUpRight /></a>
          <div><span>© 2026 {portfolio.bio.name}</span><a href="#top">Back to top ↑</a></div>
        </footer>
      </main>

      <TweaksPanel tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}
