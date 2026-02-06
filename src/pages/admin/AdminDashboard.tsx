import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Trophy,
  Image,
  Plus,
  ExternalLink,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  BarChart3,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  getTotalStats,
  getRecentStats,
  getTopPages,
  getAdminDashboardCounts,
  getContactMessages,
  type ContactMessage,
} from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";

interface VisitorStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayVisitors: number;
}

interface RecentStat {
  date: string;
  views: number;
  visitors: number;
}

interface TopPage {
  page: string;
  views: number;
}

interface Counts {
  projects: number;
  achievements: number;
  galleryImages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    todayVisitors: 0,
  });
  const [recentStats, setRecentStats] = useState<RecentStat[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [counts, setCounts] = useState<Counts>({
    projects: 0,
    achievements: 0,
    galleryImages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, recent, pages, countsData, messages] =
          await Promise.all([
            getTotalStats(),
            getRecentStats(7),
            getTopPages(5),
            getAdminDashboardCounts(),
            getContactMessages(),
          ]);

        setVisitorStats(statsData);
        setRecentStats(recent);
        setTopPages(pages);
        setCounts(countsData);
        setRecentMessages(messages.slice(0, 3));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getPageName = (path: string) => {
    const names: Record<string, string> = {
      "/": "Home",
      "/about": "About",
      "/projects": "Projects",
      "/achievements": "Achievements",
      "/moments": "Moments",
      "/contact": "Contact",
    };
    return names[path] || path;
  };

  const contentCards = [
    {
      label: "Projects",
      value: counts.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      addHref: "/admin/projects/new",
    },
    {
      label: "Achievements",
      value: counts.achievements,
      icon: Trophy,
      href: "/admin/achievements",
      addHref: "/admin/achievements/new",
    },
    {
      label: "Gallery",
      value: counts.galleryImages,
      icon: Image,
      href: "/admin/gallery",
      addHref: "/admin/gallery/new",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span className="text-4xl">👋</span> Hey, Slantie!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="shrink-0">
          <Link to="/" target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Site
          </Link>
        </Button>
      </div>

      {!isSupabaseConfigured && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>Development Mode:</strong> Supabase is not configured. Add{" "}
              <code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code>{" "}
              and{" "}
              <code className="bg-muted px-1 rounded">
                VITE_SUPABASE_ANON_KEY
              </code>{" "}
              to enable all features.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Visitor Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatNumber(visitorStats.totalViews)
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatNumber(visitorStats.uniqueVisitors)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time unique visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatNumber(visitorStats.todayViews)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Page views today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Visitors
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatNumber(visitorStats.todayVisitors)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique visitors today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {contentCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to={stat.href}>View All</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to={stat.addHref}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last 7 Days Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : recentStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data yet. Analytics will appear once visitors start coming!
              </p>
            ) : (
              <div className="space-y-3">
                {recentStats.map((stat) => {
                  const maxViews = Math.max(
                    ...recentStats.map((s) => s.views),
                    1,
                  );
                  const percentage = (stat.views / maxViews) * 100;

                  return (
                    <div key={stat.date} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">
                        {formatDate(stat.date)}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        {/* eslint-disable-next-line react/forbid-dom-props */}
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {stat.views}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No page views recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div
                    key={page.page}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <span className="font-medium">
                        {getPageName(page.page)}
                      </span>
                    </div>
                    <Badge variant="secondary">{page.views} views</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Messages Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recent Messages
            {counts.unreadMessages > 0 && (
              <Badge variant="destructive">{counts.unreadMessages} new</Badge>
            )}
          </CardTitle>
          <Link to="/admin/messages">
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Share your portfolio to get some!
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <Link
                  key={message.id}
                  to="/admin/messages"
                  className={`block p-4 rounded-lg border transition-colors hover:shadow-sm ${
                    message.read
                      ? "bg-muted/30 hover:bg-muted/50"
                      : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{message.name}</span>
                        {!message.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-primary font-medium mb-1 truncate">
                        {message.email}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {message.message}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto py-4">
            <Link
              to="/admin/projects/new"
              className="flex flex-col items-center gap-2"
            >
              <FolderKanban className="h-6 w-6" />
              <span>Add Project</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link
              to="/admin/achievements/new"
              className="flex flex-col items-center gap-2"
            >
              <Trophy className="h-6 w-6" />
              <span>Add Achievement</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link
              to="/admin/gallery/new"
              className="flex flex-col items-center gap-2"
            >
              <Image className="h-6 w-6" />
              <span>Upload Image</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link
              to="/admin/profile"
              className="flex flex-col items-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span>Edit Profile</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
