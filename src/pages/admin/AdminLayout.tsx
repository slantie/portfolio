import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Files,
  GraduationCap,
  FolderOpen,
  Database,
  ExternalLink,
  FileText,
  FolderKanban,
  Image,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Moon,
  PanelLeftClose,
  Pin,
  Search,
  Settings,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getContactMessages, getSetting } from "@/lib/api";

const navSections = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", path: "/slantie", icon: LayoutDashboard, exact: true },
      { label: "Workspace", path: "/slantie/workspace", icon: BriefcaseBusiness },
      { label: "Calendar", path: "/slantie/workspace/calendar", icon: CalendarDays },
      { label: "Coursework", path: "/slantie/workspace/coursework", icon: GraduationCap },
      { label: "Materials", path: "/slantie/workspace/materials", icon: FolderOpen },
      { label: "Files", path: "/slantie/workspace/files", icon: Files },
      { label: "LeetCode", path: "/slantie/workspace/leetcode", icon: Code2 },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { label: "Projects", path: "/slantie/projects", icon: FolderKanban },
      { label: "Achievements", path: "/slantie/achievements", icon: Trophy },
      { label: "Gallery", path: "/slantie/gallery", icon: Image },
      { label: "Blogs", path: "/slantie/blogs", icon: FileText },
      { label: "Profile", path: "/slantie/profile", icon: User },
      { label: "Messages", path: "/slantie/messages", icon: Mail, showBadge: true },
      { label: "Settings", path: "/slantie/settings", icon: Settings },
      { label: "Migrate data", path: "/slantie/migrate", icon: Database },
    ],
  },
];

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(() => localStorage.getItem("portfolio-admin-sidebar") === "pinned");
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [dark, setDark] = useState(() => localStorage.getItem("sortd-admin-theme") === "dark");
  const location = useLocation();
  const sidebarOpen = sidebarPinned || sidebarHovered;

  const pageTitle = useMemo(() => navSections.flatMap((section) => section.items).find((item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  })?.label ?? "Admin", [location.pathname]);

  useEffect(() => {
    void checkAuth();
    void loadProfileImage();
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => setIsAuthenticated(!!session)) ?? { data: { subscription: null } };
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-admin-sidebar", sidebarPinned ? "pinned" : "hidden");
  }, [sidebarPinned]);

  useEffect(() => {
    localStorage.setItem("sortd-admin-theme", dark ? "dark" : "light");
    // Tailwind dark variants and Radix portals resolve from the document root.
    // Keep a real `.dark` class there only while private admin is mounted.
    const root = window.document.documentElement;
    root.classList.toggle("dark", dark);
    return () => root.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const messages = await getContactMessages();
        setUnreadCount(messages.filter((message) => !message.read).length);
      } catch (error) {
        console.error("Error loading unread count:", error);
      }
    }
    void loadUnreadCount();
    const interval = setInterval(() => void loadUnreadCount(), 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  async function loadProfileImage() {
    try { setProfileImage((await getSetting("profile_image")) || null); }
    catch (error) { console.error("Error loading profile image:", error); }
  }

  async function checkAuth() {
    if (!supabase) { setIsAuthenticated(true); return; }
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
  }

  const isActivePath = (path: string, exact?: boolean) => exact ? location.pathname === path : location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (isAuthenticated === null) {
    return <div className="sortd-admin grid min-h-screen place-items-center bg-background text-foreground"><div className="flex items-center gap-3 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin text-primary" />Opening your workspace…</div></div>;
  }
  if (!isAuthenticated) return <Navigate to="/slantie/login" replace />;

  const brandMark = profileImage ? <img src={profileImage} alt="" className="size-full object-cover" /> : <span className="text-sm font-bold">S</span>;

  return (
    <div className={cn("sortd-admin relative h-svh overflow-hidden bg-background text-foreground", dark && "dark")}>
      {/* A deliberately thin desktop target recreates Sortd's hidden, hover-to-reveal navigation. */}
      {!sidebarPinned && <button type="button" aria-label="Show navigation" className="fixed inset-y-0 left-0 z-40 hidden w-2 cursor-e-resize lg:block" onClick={() => setSidebarPinned(true)} onFocus={() => setSidebarHovered(true)} onBlur={() => setSidebarHovered(false)} onMouseEnter={() => setSidebarHovered(true)} onMouseLeave={() => setSidebarHovered(false)} />}

      <aside
        aria-label="Primary navigation"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground shadow-2xl shadow-black/10 transition-transform duration-200 ease-out lg:w-64",
          "lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          mobileOpen && "translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/" className="flex items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setMobileOpen(false)}>
            <span className="grid size-8 overflow-hidden rounded-lg bg-primary text-primary-foreground">{brandMark}</span>
            <span><span className="block text-sm font-semibold tracking-tight">Slantie</span><span className="block text-[11px] text-muted-foreground">Personal workspace</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => sidebarPinned ? setSidebarPinned(false) : setSidebarPinned(true)} aria-label={sidebarPinned ? "Hide navigation" : "Keep navigation open"}>
            {sidebarPinned ? <PanelLeftClose className="size-4" /> : <Pin className="size-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navSections.map((section) => <div key={section.label}>
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActivePath(item.path, item.exact);
                const Icon = item.icon;
                return <li key={item.path}>
                  <Link to={item.path} onClick={() => setMobileOpen(false)} className={cn("group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/55 hover:text-foreground")}>
                    <Icon className={cn("size-[18px] shrink-0", active && "text-primary")} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.showBadge && unreadCount > 0 && <Badge variant="secondary" className="h-5 min-w-5 justify-center bg-primary/12 px-1 text-[10px] text-primary">{unreadCount > 9 ? "9+" : unreadCount}</Badge>}
                    {active && <span className="size-1.5 rounded-full bg-primary" />}
                  </Link>
                </li>;
              })}
            </ul>
          </div>)}
        </nav>

        <div className="border-t border-border px-5 py-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">Dhirubhai Ambani University<br />Personal workspace</p>
        </div>
      </aside>

      <div className={cn("flex h-full min-w-0 flex-col transition-[padding] duration-200 ease-out", sidebarPinned && "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></Button>
          <div className="min-w-0"><p className="truncate text-sm font-semibold tracking-tight">{pageTitle}</p><p className="hidden text-[11px] text-muted-foreground sm:block">Slantie private workspace</p></div>
          <label className="ml-auto hidden h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-border bg-muted/35 px-3 text-muted-foreground transition-colors focus-within:border-ring focus-within:bg-card md:flex">
            <Search className="size-4 shrink-0" /><Input aria-label="Search workspace" className="h-auto border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0" placeholder="Search…" />
            <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </label>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search workspace"><Search className="size-[18px]" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">{dark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}</Button>
          <Button variant="ghost" size="icon" asChild><Link to="/" target="_blank" aria-label="View live portfolio"><ExternalLink className="size-[17px]" /></Link></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => void handleSignOut()} aria-label="Sign out"><LogOut className="size-[17px]" /></Button>
        </header>
        <main className="flex-1 overflow-y-auto"><div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8"><Outlet /></div></main>
      </div>
      {mobileOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}><X className="sr-only" /></button>}
    </div>
  );
}
