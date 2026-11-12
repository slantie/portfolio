import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, Calendar, Eye, FileText, FolderKanban, Image, Loader2, Mail, Plus, TrendingUp, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminDashboardCounts, getContactMessages, getRecentStats, getTopPages, getTotalStats, type ContactMessage } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";

interface VisitorStats { totalViews: number; uniqueVisitors: number; todayViews: number; todayVisitors: number }
interface RecentStat { date: string; views: number; visitors: number }
interface TopPage { page: string; views: number }
interface Counts { projects: number; achievements: number; galleryImages: number; unreadMessages: number }

const number = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const pageName = (path: string) => ({ "/": "Home", "/about": "About", "/projects": "Projects", "/achievements": "Achievements", "/moments": "Moments", "/contact": "Contact" })[path] || path;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ totalViews: 0, uniqueVisitors: 0, todayViews: 0, todayVisitors: 0 });
  const [recentStats, setRecentStats] = useState<RecentStat[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [counts, setCounts] = useState<Counts>({ projects: 0, achievements: 0, galleryImages: 0, unreadMessages: 0 });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => { void (async () => { try { const [stats, recent, pages, content, messages] = await Promise.all([getTotalStats(), getRecentStats(7), getTopPages(5), getAdminDashboardCounts(), getContactMessages()]); setVisitorStats(stats); setRecentStats(recent); setTopPages(pages); setCounts(content); setRecentMessages(messages.slice(0, 3)); } catch (error) { console.error("Error loading dashboard:", error); } finally { setLoading(false); } })(); }, []);
  const maxViews = useMemo(() => Math.max(...recentStats.map((item) => item.views), 1), [recentStats]);

  const metrics = [
    { label: "Total views", value: visitorStats.totalViews, detail: "All-time page views", icon: Eye },
    { label: "Visitors", value: visitorStats.uniqueVisitors, detail: "Unique people reached", icon: Users },
    { label: "Today’s views", value: visitorStats.todayViews, detail: "Since midnight", icon: TrendingUp },
    { label: "Today’s visitors", value: visitorStats.todayVisitors, detail: "Unique visits today", icon: Calendar },
  ];
  const content = [
    { label: "Projects", value: counts.projects, icon: FolderKanban, href: "/slantie/projects", addHref: "/slantie/projects/new", action: "New project" },
    { label: "Achievements", value: counts.achievements, icon: Trophy, href: "/slantie/achievements", addHref: "/slantie/achievements/new", action: "New achievement" },
    { label: "Gallery items", value: counts.galleryImages, icon: Image, href: "/slantie/gallery", addHref: "/slantie/gallery/new", action: "Upload image" },
  ];

  return <div className="space-y-7">
    <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-muted-foreground">Portfolio command center</p><h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Good to see you, Slantie.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">A calm view of your portfolio’s reach, content, and incoming conversations.</p></div>
      <Button asChild variant="outline" className="rounded-xl"><Link to="/" target="_blank">View portfolio <ArrowUpRight className="ml-1.5 size-4" /></Link></Button>
    </header>

    {!isSupabaseConfigured && <div className="sortd-status-warning rounded-2xl border border-amber-500/30 p-4 text-sm"><strong>Development mode.</strong> Add <code className="rounded bg-background/60 px-1.5 py-0.5">VITE_SUPABASE_URL</code> and <code className="rounded bg-background/60 px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> to load your live data.</div>}

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <Card key={metric.label} className="rounded-2xl border bg-card shadow-none"><CardContent className="p-5"><div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{metric.label}</p><span className="grid size-8 place-items-center rounded-lg bg-muted"><metric.icon className="size-4 text-muted-foreground" /></span></div><p className="mt-5 text-3xl font-semibold tracking-tight">{loading ? <Loader2 className="size-5 animate-spin" /> : number.format(metric.value)}</p><p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p></CardContent></Card>)}</section>

    <section className="grid gap-3 lg:grid-cols-3">{content.map((item) => <Card key={item.label} className="rounded-2xl border bg-card shadow-none"><CardContent className="p-5"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-muted"><item.icon className="size-5" /></span><Link to={item.href} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">Manage <ArrowUpRight className="inline size-3" /></Link></div><p className="mt-5 text-3xl font-semibold">{loading ? <Loader2 className="size-5 animate-spin" /> : item.value}</p><p className="mt-1 text-sm text-muted-foreground">{item.label}</p><Button asChild variant="secondary" className="mt-5 h-9 w-full rounded-lg text-xs"><Link to={item.addHref}><Plus className="mr-1 size-3.5" />{item.action}</Link></Button></CardContent></Card>)}</section>

    <section className="grid gap-5 xl:grid-cols-5">
      <Card className="rounded-2xl border bg-card shadow-none xl:col-span-3"><CardContent className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold">Traffic pulse</p><p className="mt-1 text-sm text-muted-foreground">Views over the last seven days</p></div><BarChart3 className="size-5 text-muted-foreground" /></div>{loading ? <div className="grid h-52 place-items-center"><Loader2 className="size-5 animate-spin" /></div> : recentStats.length === 0 ? <EmptyState text="Traffic will appear here as people visit your portfolio." /> : <div className="mt-8 space-y-4">{recentStats.map((stat) => <div key={stat.date} className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3"><span className="text-xs text-muted-foreground">{new Date(stat.date).toLocaleDateString("en-US", { weekday: "short" })}</span><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${Math.max((stat.views / maxViews) * 100, stat.views ? 4 : 0)}%` }} /></div><span className="text-right text-xs font-medium tabular-nums">{stat.views}</span></div>)}</div>}</CardContent></Card>
      <Card className="rounded-2xl border bg-card shadow-none xl:col-span-2"><CardContent className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold">Most visited</p><p className="mt-1 text-sm text-muted-foreground">Your audience’s favourites</p></div><TrendingUp className="size-5 text-muted-foreground" /></div>{loading ? <div className="grid h-52 place-items-center"><Loader2 className="size-5 animate-spin" /></div> : topPages.length === 0 ? <EmptyState text="Your most-viewed pages will show up here." /> : <div className="mt-5 divide-y">{topPages.map((page, index) => <div key={page.page} className="flex items-center justify-between py-3"><div className="flex min-w-0 items-center gap-3"><span className="w-4 text-xs text-muted-foreground">0{index + 1}</span><span className="truncate text-sm font-medium">{pageName(page.page)}</span></div><Badge variant="secondary" className="rounded-md font-normal">{page.views}</Badge></div>)}</div>}</CardContent></Card>
    </section>

    <section className="grid gap-5 xl:grid-cols-5">
      <Card className="rounded-2xl border bg-card shadow-none xl:col-span-3"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Recent messages {counts.unreadMessages > 0 && <Badge className="ml-1.5 rounded-md">{counts.unreadMessages} new</Badge>}</p><p className="mt-1 text-sm text-muted-foreground">Keep conversations moving.</p></div><Button asChild variant="ghost" size="sm" className="rounded-lg text-xs"><Link to="/slantie/messages">Open inbox <ArrowUpRight className="ml-1 size-3.5" /></Link></Button></div>{loading ? <div className="grid h-40 place-items-center"><Loader2 className="size-5 animate-spin" /></div> : recentMessages.length === 0 ? <EmptyState text="New portfolio messages will appear here." /> : <div className="mt-5 divide-y">{recentMessages.map((message) => <Link key={message.id} to="/slantie/messages" className="block py-3 first:pt-0 transition-opacity hover:opacity-70"><div className="flex gap-3"><span className={message.read ? "mt-2 size-1.5 rounded-full bg-border" : "mt-2 size-1.5 rounded-full bg-foreground"} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="truncate text-sm font-medium">{message.name}</p><time className="shrink-0 text-xs text-muted-foreground">{new Date(message.created_at).toLocaleDateString()}</time></div><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{message.message}</p></div></div></Link>)}</div>}</CardContent></Card>
      <Card className="rounded-2xl border bg-card shadow-none xl:col-span-2"><CardContent className="p-5 sm:p-6"><p className="text-sm font-semibold">Create</p><p className="mt-1 text-sm text-muted-foreground">Keep the portfolio fresh.</p><div className="mt-5 grid gap-2">{[{ label: "New project", to: "/slantie/projects/new", icon: FolderKanban }, { label: "New achievement", to: "/slantie/achievements/new", icon: Trophy }, { label: "Write a blog", to: "/slantie/blogs/new", icon: FileText }].map((action) => <Button key={action.to} asChild variant="secondary" className="h-11 justify-between rounded-xl"><Link to={action.to}><span className="flex items-center gap-2"><action.icon className="size-4" />{action.label}</span><ArrowUpRight className="size-4" /></Link></Button>)}</div></CardContent></Card>
    </section>
  </div>;
}

function EmptyState({ text }: { text: string }) { return <p className="grid h-52 place-items-center text-center text-sm leading-6 text-muted-foreground">{text}</p>; }
