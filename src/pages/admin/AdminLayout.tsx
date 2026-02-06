import { useState, useEffect } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FolderKanban,
  Trophy,
  Image,
  LogOut,
  Menu,
  X,
  Database,
  User,
  Mail,
  Settings,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getContactMessages, getSetting } from "@/lib/api";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Achievements", path: "/admin/achievements", icon: Trophy },
  { label: "Gallery", path: "/admin/gallery", icon: Image },
  { label: "Blogs", path: "/admin/blogs", icon: FileText },
  { label: "Profile", path: "/admin/profile", icon: User },
  { label: "Messages", path: "/admin/messages", icon: Mail, showBadge: true },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Migrate Data", path: "/admin/migrate", icon: Database },
];

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    loadProfileImage();

    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    }) ?? { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function loadProfileImage() {
    try {
      const image = await getSetting("profile_image");
      if (image) setProfileImage(image);
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  }

  // Load unread message count
  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const messages = await getContactMessages();
        setUnreadCount(messages.filter((m) => !m.read).length);
      } catch (error) {
        console.error("Error loading unread count:", error);
      }
    }
    loadUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]); // Refresh when navigating

  async function checkAuth() {
    if (!supabase) {
      // If Supabase not configured, allow access for development
      setIsAuthenticated(true);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  }

  const isActivePath = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading admin panel...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <span className="font-semibold flex items-center gap-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt=""
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl">⚡</span>
          )}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/"
              target="_blank"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>View live site</TooltipContent>
        </Tooltip>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 overflow-hidden group-hover:scale-110 transition-transform">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">⚡</span>
              )}
            </div>
            <div>
              <p className="font-bold text-lg">Hey, Slantie!</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive && "text-primary-foreground",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.showBadge && unreadCount > 0 && (
                  <Badge
                    variant={isActive ? "secondary" : "destructive"}
                    className="h-5 min-w-[20px] flex items-center justify-center text-xs"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            asChild
          >
            <Link to="/" target="_blank">
              <ExternalLink className="h-4 w-4" />
              View Live Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
