import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getAchievements, deleteAchievement } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Achievement } from "@/types";
import { ACHIEVEMENT_CATEGORY_LABELS } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    setLoading(true);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    setDeleting(true);
    const success = await deleteAchievement(deleteId);

    if (success) {
      setAchievements((prev) => prev.filter((a) => a.id !== deleteId));
    }

    setDeleting(false);
    setDeleteId(null);
  }

  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(search.toLowerCase()) ||
      achievement.organization.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by year
  const achievementsByYear = filteredAchievements.reduce(
    (acc, achievement) => {
      const year = achievement.date.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(achievement);
      return acc;
    },
    {} as Record<number, Achievement[]>,
  );

  const sortedYears = Object.keys(achievementsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground mt-1">
            Manage your awards and certificates
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/achievements/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search achievements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-4 flex gap-4">
                <div className="w-20 h-20 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAchievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {search
              ? "No achievements found matching your search."
              : "No achievements yet. Add your first achievement!"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              <h2 className="text-xl font-bold mb-4">{year}</h2>
              <div className="space-y-3">
                {achievementsByYear[year].map((achievement) => (
                  <Card key={achievement.id} className="group">
                    <CardContent className="py-4 flex gap-4">
                      <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={optimizeCloudinaryUrl(achievement.image, 160)}
                          alt={achievement.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold line-clamp-1">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.organization} •{" "}
                              {achievement.date.month} {achievement.date.year}
                            </p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button asChild size="sm" variant="ghost">
                              <Link
                                to={`/admin/achievements/${achievement.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            {isSupabaseConfigured && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteId(achievement.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {achievement.description}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {ACHIEVEMENT_CATEGORY_LABELS[achievement.type] ||
                            achievement.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this achievement? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
