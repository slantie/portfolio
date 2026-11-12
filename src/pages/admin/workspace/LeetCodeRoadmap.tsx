import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight, ExternalLink, Filter, Loader2, NotebookPen, Search, Target } from "lucide-react";
import roadmap from "@/data/striver-a2z-sheet.json";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type LinkItem = { label: string; url: string };
type Resource = { text: string | null; links: LinkItem[] } | null;
type Problem = { topic: { text: string; links: LinkItem[] }; gfg: Resource; solution: Resource; leetcode: Resource };
type Substep = { name: string; problems: Problem[] };
type Step = { name: string; substeps: Substep[] };
type Difficulty = "Easy" | "Medium" | "Hard";
type ProgressItem = { roadmap_key: string; solved: boolean; solved_at: string | null; note: string | null };
type ProgressTable = {
  select: (columns: string) => Promise<{ data: ProgressItem[] | null; error: { message: string } | null }>;
  upsert: (values: Record<string, unknown>, options: { onConflict: string }) => Promise<{ error: { message: string } | null }>;
};

const sheet = roadmap as Step[];
const DAILY_GOAL = 3;
const difficultyStyles: Record<Difficulty, { color: string; track: string }> = {
  Easy: { color: "hsl(var(--sortd-info))", track: "hsl(var(--sortd-info-surface))" },
  Medium: { color: "hsl(var(--sortd-warning))", track: "hsl(var(--sortd-warning-surface))" },
  Hard: { color: "hsl(var(--destructive))", track: "hsl(var(--destructive) / .12)" },
};

function resourceLink(resource: Resource) { return resource?.links?.[0] ?? null; }
function slug(problem: Problem) {
  const url = resourceLink(problem.leetcode)?.url;
  if (!url) return null;
  try { return new URL(url).pathname.match(/\/problems\/([^/]+)/)?.[1] ?? null; } catch { return null; }
}
function cleanTitle(value: string) { return value.replace(/^Step \d+(?:\.\d+)?:\s*/, ""); }
function dayKey() { return new Date().toISOString().slice(0, 10); }
function progressTable() {
  return supabase ? (supabase as unknown as { from: (table: string) => ProgressTable }).from("leetcode_progress") : null;
}

async function fetchDifficulties(slugs: string[]) {
  const cached = localStorage.getItem("sortd-a2z-difficulties");
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { fetchedAt: number; values: Record<string, Difficulty> };
      if (Date.now() - parsed.fetchedAt < 1000 * 60 * 60 * 24 * 21) return parsed.values;
    } catch { /* refresh malformed cache */ }
  }
  const values: Record<string, Difficulty> = {};
  for (let index = 0; index < slugs.length; index += 20) {
    const batch = slugs.slice(index, index + 20);
    const query = `query { ${batch.map((item, itemIndex) => `q${itemIndex}: question(titleSlug: ${JSON.stringify(item)}) { difficulty }`).join(" ")} }`;
    try {
      const response = await fetch("https://leetcode.com/graphql", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query }) });
      const payload = await response.json() as { data?: Record<string, { difficulty?: Difficulty }> };
      batch.forEach((item, itemIndex) => {
        const difficulty = payload.data?.[`q${itemIndex}`]?.difficulty;
        if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") values[item] = difficulty;
      });
    } catch { /* graceful fallback: the roadmap does not need external data to work */ }
  }
  localStorage.setItem("sortd-a2z-difficulties", JSON.stringify({ fetchedAt: Date.now(), values }));
  return values;
}

export function LeetCodeRoadmap() {
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({ 0: true });
  const [openSubsteps, setOpenSubsteps] = useState<Record<string, boolean>>({ "0-0": true });
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [solvedOn, setSolvedOn] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [difficulties, setDifficulties] = useState<Record<string, Difficulty>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "solved">("all");
  const [noteTarget, setNoteTarget] = useState<{ key: string; title: string } | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const allSlugs = useMemo(() => sheet.flatMap((step) => step.substeps.flatMap((substep) => substep.problems.map(slug).filter((item): item is string => !!item))), []);
  const totalProblems = useMemo(() => sheet.reduce((total, step) => total + step.substeps.reduce((count, substep) => count + substep.problems.length, 0), 0), []);
  const today = dayKey();
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const solvedToday = Object.values(solvedOn).filter((date) => date === today).length;

  useEffect(() => {
    let alive = true;
    async function load() {
      const pending = fetchDifficulties(allSlugs).then((items) => alive && setDifficulties(items));
      if (!supabase) { await pending; if (alive) setLoading(false); return; }
      const { data, error } = await progressTable()!.select("roadmap_key, solved, solved_at, note");
      if (error) toast.error("Couldn’t load LeetCode progress. Check the academic workspace migration.");
      else if (alive) {
        const items = (data ?? []) as ProgressItem[];
        setSolved(Object.fromEntries(items.filter((item) => item.solved).map((item) => [item.roadmap_key, true])));
        setSolvedOn(Object.fromEntries(items.filter((item) => item.solved_at).map((item) => [item.roadmap_key, item.solved_at!.slice(0, 10)])));
        setNotes(Object.fromEntries(items.filter((item) => item.note).map((item) => [item.roadmap_key, item.note!])));
      }
      await pending;
      if (alive) setLoading(false);
    }
    void load();
    return () => { alive = false; };
  }, [allSlugs]);

  const stats = useMemo(() => {
    const result: Record<Difficulty, { total: number; solved: number }> = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } };
    sheet.forEach((step, stepIndex) => step.substeps.forEach((substep, substepIndex) => substep.problems.forEach((problem, problemIndex) => {
      const difficulty = difficulties[slug(problem) ?? ""];
      if (difficulty) { result[difficulty].total += 1; if (solved[`${stepIndex}-${substepIndex}-${problemIndex}`]) result[difficulty].solved += 1; }
    })));
    return result;
  }, [difficulties, solved]);

  const matching = (problem: Problem, key: string) => {
    const text = `${problem.topic.text} ${problem.topic.links.map((link) => link.label).join(" ")}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (filter === "solved" && !solved[key]) return false;
    if (filter === "open" && solved[key]) return false;
    return true;
  };
  const hasOpen = Object.values(openSteps).some(Boolean);
  const toggleAll = () => {
    if (hasOpen) { setOpenSteps({}); setOpenSubsteps({}); return; }
    setOpenSteps(Object.fromEntries(sheet.map((_, index) => [index, true])));
    setOpenSubsteps(Object.fromEntries(sheet.flatMap((step, stepIndex) => step.substeps.map((_, substepIndex) => [`${stepIndex}-${substepIndex}`, true]))));
  };
  async function saveProgress(key: string, update: { solved?: boolean; note?: string }) {
    if (!supabase) return;
    const values = { roadmap_key: key, ...update, ...(update.solved !== undefined ? { solved_at: update.solved ? new Date().toISOString() : null } : {}) };
    const { error } = await progressTable()!.upsert(values, { onConflict: "user_id,roadmap_key" });
    if (error) toast.error(error.message);
  }
  function setProblemSolved(key: string, checked: boolean) {
    setSolved((items) => ({ ...items, [key]: checked }));
    setSolvedOn((items) => { const next = { ...items }; if (checked) next[key] = today; else delete next[key]; return next; });
    void saveProgress(key, { solved: checked });
  }
  function openNote(key: string, title: string) { setNoteTarget({ key, title }); setNoteDraft(notes[key] ?? ""); }
  function saveNote() {
    if (!noteTarget) return;
    const target = noteTarget;
    setNotes((items) => ({ ...items, [target.key]: noteDraft.trim() }));
    setNoteTarget(null);
    void saveProgress(target.key, { note: noteDraft.trim() });
  }

  return <main className="sortd-page sortd-page--fluid space-y-5 pb-10">
    <header className="sortd-page-header">
      <div><p className="sortd-page-kicker">Practice workspace</p><h1 className="sortd-page-title">LeetCode roadmap</h1><p className="sortd-page-description">Striver A2Z, in one deliberate place. Solve three problems a day and leave yourself useful notes.</p></div>
      <div className="flex items-center gap-2"><DailyGoal solvedToday={solvedToday} /><Button variant="outline" size="sm" onClick={toggleAll}>{hasOpen ? "Collapse" : "Expand"}</Button></div>
    </header>

    <SolvedChart solved={solvedCount} total={totalProblems} stats={stats} solvedToday={solvedToday} loading={loading} />

    <section className="sortd-surface"><div className="sortd-toolbar"><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 pl-9" placeholder="Find a problem or concept…" /></div><div className="sortd-segmented" aria-label="Problem filter"><Filter className="ml-1 size-3.5 text-muted-foreground" />{(["all", "open", "solved"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={cn("sortd-segmented-item capitalize", filter === item && "is-active")}>{item === "all" ? "All" : item}</button>)}</div></div>
      <div className="divide-y divide-border">{sheet.map((step, stepIndex) => {
        const allStep = step.substeps.flatMap((substep, substepIndex) => substep.problems.map((problem, problemIndex) => ({ problem, key: `${stepIndex}-${substepIndex}-${problemIndex}` })));
        const visible = allStep.filter(({ problem, key }) => matching(problem, key));
        if (!visible.length) return null;
        const stepSolved = allStep.filter(({ key }) => solved[key]).length;
        const percent = allStep.length ? Math.round((stepSolved / allStep.length) * 100) : 0;
        const open = !!openSteps[stepIndex];
        return <Collapsible key={step.name} open={open} onOpenChange={(value) => setOpenSteps((items) => ({ ...items, [stepIndex]: value }))}><CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/45"><span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-xs font-medium text-muted-foreground">{stepIndex + 1}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-foreground">{cleanTitle(step.name)}</span><span className="mt-1 flex max-w-sm items-center gap-2 text-xs text-muted-foreground"><span>{allStep.length} problems · {stepSolved} solved</span><span className="h-1 min-w-12 flex-1 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} /></span></span></span><span className="text-xs tabular-nums text-muted-foreground">{percent}%</span>{open ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}</CollapsibleTrigger><CollapsibleContent><div className="border-t border-border bg-muted/[.18] py-1">{step.substeps.map((substep, substepIndex) => { const subOpen = !!openSubsteps[`${stepIndex}-${substepIndex}`]; const count = substep.problems.filter((problem, problemIndex) => matching(problem, `${stepIndex}-${substepIndex}-${problemIndex}`)).length; return count ? <SubstepCard key={substep.name} substep={substep} stepIndex={stepIndex} substepIndex={substepIndex} open={subOpen} onOpenChange={(value) => setOpenSubsteps((items) => ({ ...items, [`${stepIndex}-${substepIndex}`]: value }))} solved={solved} notes={notes} difficulties={difficulties} visible={matching} onSolvedChange={setProblemSolved} onOpenNote={openNote} /> : null; })}</div></CollapsibleContent></Collapsible>;
      })}{!sheet.some((step, stepIndex) => step.substeps.some((substep, substepIndex) => substep.problems.some((problem, problemIndex) => matching(problem, `${stepIndex}-${substepIndex}-${problemIndex}`)))) && <div className="sortd-empty-state"><p className="text-sm font-medium text-foreground">No problems found</p><p className="mt-1 text-xs text-muted-foreground">Try another search or remove the current filter.</p></div>}</div>
    </section>
    <Dialog open={!!noteTarget} onOpenChange={(open) => { if (!open) setNoteTarget(null); }}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Problem notes</DialogTitle><DialogDescription>{noteTarget?.title}</DialogDescription></DialogHeader><Textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Approach, tricky cases, complexity, or what to review next…" rows={7} /><DialogFooter><Button onClick={saveNote}>Save note</Button></DialogFooter></DialogContent></Dialog>
  </main>;
}

function SubstepCard({ substep, stepIndex, substepIndex, open, onOpenChange, solved, notes, difficulties, visible, onSolvedChange, onOpenNote }: { substep: Substep; stepIndex: number; substepIndex: number; open: boolean; onOpenChange: (value: boolean) => void; solved: Record<string, boolean>; notes: Record<string, string>; difficulties: Record<string, Difficulty>; visible: (problem: Problem, key: string) => boolean; onSolvedChange: (key: string, checked: boolean) => void; onOpenNote: (key: string, title: string) => void }) {
  const rows = substep.problems.filter((problem, problemIndex) => visible(problem, `${stepIndex}-${substepIndex}-${problemIndex}`));
  return <Collapsible open={open} onOpenChange={onOpenChange} className="ml-4 border-l border-border"><CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/40"><span className="min-w-0 flex-1 text-sm text-foreground">{cleanTitle(substep.name)}</span><span className="text-xs tabular-nums text-muted-foreground">{rows.length}</span>{open ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}</CollapsibleTrigger><CollapsibleContent className="border-t border-border bg-background">{rows.map((problem) => { const problemIndex = substep.problems.indexOf(problem); const key = `${stepIndex}-${substepIndex}-${problemIndex}`; return <ProblemRow key={key} problem={problem} solved={!!solved[key]} note={notes[key]} difficulty={difficulties[slug(problem) ?? ""]} onSolvedChange={(checked) => onSolvedChange(key, checked)} onOpenNote={() => onOpenNote(key, problem.topic.text)} />; })}</CollapsibleContent></Collapsible>;
}

function ProblemRow({ problem, solved, note, difficulty, onSolvedChange, onOpenNote }: { problem: Problem; solved: boolean; note?: string; difficulty?: Difficulty; onSolvedChange: (value: boolean) => void; onOpenNote: () => void }) {
  return <div className={cn("flex items-center gap-3 border-b border-border px-4 py-3 last:border-0", solved && "bg-primary/[.025]")}><Checkbox checked={solved} onCheckedChange={(value) => onSolvedChange(value === true)} aria-label={`Mark ${problem.topic.text} solved`} /><span className="min-w-0 flex-1"><span className={cn("block truncate text-sm text-foreground", solved && "text-muted-foreground line-through")}>{problem.topic.text}</span><span className="mt-1 flex items-center gap-2 sm:hidden"><DifficultyBadge difficulty={difficulty} /><ResourceLinks problem={problem} /></span></span><span className="hidden sm:block"><DifficultyBadge difficulty={difficulty} /></span><button type="button" onClick={onOpenNote} className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted hover:text-foreground", note ? "text-primary" : "text-muted-foreground")} title={note ? "Edit note" : "Add note"} aria-label={note ? `Edit note for ${problem.topic.text}` : `Add note for ${problem.topic.text}`}><NotebookPen className="size-3.5" /></button><span className="hidden shrink-0 sm:block"><ResourceLinks problem={problem} /></span></div>;
}
function ResourceLinks({ problem }: { problem: Problem }) { const links = [{ label: "Read", link: problem.topic.links[0] }, { label: "GFG", link: resourceLink(problem.gfg) ?? undefined }, { label: "LeetCode", link: resourceLink(problem.leetcode) ?? undefined }, { label: "Solution", link: resourceLink(problem.solution) ?? undefined }]; return <span className="inline-flex items-center gap-0.5">{links.map(({ label, link }) => link ? <a key={label} href={link.url} target="_blank" rel="noreferrer" title={label} aria-label={`${label}: ${problem.topic.text}`} className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><ExternalLink className="size-3.5" /></a> : <span key={label} className="grid size-7 place-items-center text-xs text-muted-foreground" title={`${label} unavailable`}>—</span>)}</span>; }
function DifficultyBadge({ difficulty }: { difficulty?: Difficulty }) { if (!difficulty) return <span className="text-xs text-muted-foreground">—</span>; const style = difficultyStyles[difficulty]; return <span className="w-fit rounded-full px-2 py-1 text-[10px] font-semibold" style={{ color: style.color, backgroundColor: style.track }}>{difficulty}</span>; }

function DailyGoal({ solvedToday }: { solvedToday: number }) { return <div className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground sm:flex"><Target className="size-3.5" /><span>Today</span><span className="font-medium tabular-nums text-foreground">{Math.min(solvedToday, DAILY_GOAL)}/{DAILY_GOAL}</span></div>; }
function SolvedChart({ solved, total, stats, loading }: { solved: number; total: number; stats: Record<Difficulty, { total: number; solved: number }>; solvedToday: number; loading: boolean }) {
  const rings: Array<{ difficulty: Difficulty; radius: number }> = [{ difficulty: "Easy", radius: 72 }, { difficulty: "Medium", radius: 61 }, { difficulty: "Hard", radius: 50 }];
  return <section className="sortd-surface p-4 sm:p-5"><div className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center"><div className="relative mx-auto grid size-36 place-items-center"><svg viewBox="0 0 180 180" className="size-36 -rotate-90" aria-label={`${solved} of ${total} A2Z problems solved`}>{rings.map(({ difficulty, radius }) => { const item = stats[difficulty]; const circumference = 2 * Math.PI * radius; const percentage = item.total ? item.solved / item.total : 0; const palette = difficultyStyles[difficulty]; return <g key={difficulty}><circle cx="90" cy="90" r={radius} fill="none" stroke={palette.track} strokeWidth="7" /><circle cx="90" cy="90" r={radius} fill="none" stroke={palette.color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percentage)} className="transition-all duration-500" /></g>; })}</svg><div className="absolute text-center"><p className="text-2xl font-semibold tracking-tight text-foreground">{solved}<span className="text-sm text-muted-foreground">/{total}</span></p><p className="mt-0.5 inline-flex items-center gap-1 text-xs text-[hsl(var(--sortd-success))]"><Check className="size-3" />Solved</p></div></div><div><div className="flex items-baseline justify-between gap-3"><div><h2 className="text-sm font-medium text-foreground">Your problem progress</h2><p className="mt-1 text-xs text-muted-foreground">A2Z problems with linked LeetCode difficulty.</p></div><span className="text-sm font-medium tabular-nums text-foreground">{total ? Math.round((solved / total) * 100) : 0}%</span></div><div className="mt-4 space-y-3">{(["Easy", "Medium", "Hard"] as Difficulty[]).map((difficulty) => { const item = stats[difficulty]; const percentage = item.total ? Math.round((item.solved / item.total) * 100) : 0; const palette = difficultyStyles[difficulty]; return <div key={difficulty}><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-foreground"><span className="size-2 rounded-full" style={{ background: palette.color }} />{difficulty}</span><span className="tabular-nums text-muted-foreground"><strong className="font-medium text-foreground">{item.solved}</strong>/{item.total}</span></div><span className="mt-1.5 block h-1.5 overflow-hidden rounded-full" style={{ background: palette.track }}><span className="block h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, background: palette.color }} /></span></div>; })}</div>{loading && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Loader2 className="size-3 animate-spin" />Loading your saved progress…</p>}</div></div></section>;
}
