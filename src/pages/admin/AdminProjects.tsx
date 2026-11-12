import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2, ExternalLink } from "lucide-react";
import { getProjects, deleteProject } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/types";
import { PROJECT_CATEGORY_LABELS } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page";
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

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    setDeleting(true);
    const success = await deleteProject(deleteId);

    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    }

    setDeleting(false);
    setDeleteId(null);
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="sortd-page space-y-7">
      <AdminPageHeader title="Projects" description="A clear inventory of the work you want people to remember." actions={<Button asChild><Link to="/slantie/projects/new"><Plus className="h-4 w-4" />Add project</Link></Button>} />

      <div className="sortd-toolbar relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted" />
              <CardContent className="pt-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="sortd-empty">
          <CardContent className="py-14 text-center text-muted-foreground">
            {search
              ? "No projects found matching your search."
              : "No projects yet. Add your first project!"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="sortd-item overflow-hidden shadow-none">
              <div className="relative h-40">
                <img
                  src={optimizeCloudinaryUrl(project.image, 400)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <Badge className="absolute top-2 right-2">Featured</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {(Array.isArray(project.category)
                    ? project.category
                    : [project.category]
                  )
                    .slice(0, 2)
                    .map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {PROJECT_CATEGORY_LABELS[cat] || cat}
                      </Badge>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <Button asChild variant="outline" size="sm" className="h-8 flex-1"><Link to={`/slantie/projects/${project.id}`}><Pencil className="size-3.5" />Edit</Link></Button>
                  {project.live_link && <Button asChild variant="ghost" size="icon" className="size-8"><a title="View live project" href={project.live_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-3.5" /><span className="sr-only">View live project</span></a></Button>}
                  {isSupabaseConfigured && <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(project.id)}><Trash2 className="size-3.5" /><span className="sr-only">Delete {project.title}</span></Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
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
