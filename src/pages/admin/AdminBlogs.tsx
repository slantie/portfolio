import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  LayoutGrid,
  List,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { getBlogs, deleteBlog, updateBlog } from "@/lib/api";
import type { Blog } from "@/types";
import { toast } from "sonner";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const data = await getBlogs(true);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteBlog(deleteId);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteId));
      toast.success("Blog post deleted");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeleteId(null);
    }
  }

  async function togglePublished(blog: Blog) {
    try {
      await updateBlog(blog.id, { published: !blog.published });
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, published: !b.published } : b,
        ),
      );
      toast.success(blog.published ? "Post unpublished" : "Post published");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update post");
    }
  }

  async function toggleFeatured(blog: Blog) {
    try {
      await updateBlog(blog.id, { featured: !blog.featured });
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, featured: !b.featured } : b,
        ),
      );
      toast.success(
        blog.featured ? "Removed from featured" : "Added to featured",
      );
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update post");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Blog Posts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {blogs.length} post{blogs.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild>
          <Link to="/slantie/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {filteredBlogs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {search
                ? "Try a different search term"
                : "Create your first blog post!"}
            </p>
            <Button asChild>
              <Link to="/slantie/blogs/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden group">
              <div className="relative aspect-video bg-muted">
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link to={`/slantie/blogs/${blog.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <Link to={`/blog/${blog.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                {blog.featured && (
                  <Badge className="absolute top-2 left-2 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(blog.published_at || blog.created_at!)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={blog.published}
                      onCheckedChange={() => togglePublished(blog)}
                    />
                    <span className="text-xs">
                      {blog.published ? "Live" : "Draft"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    {blog.cover_image ? (
                      <img
                        src={blog.cover_image}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{blog.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {blog.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={blog.published}
                      onCheckedChange={() => togglePublished(blog)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={blog.featured}
                      onCheckedChange={() => toggleFeatured(blog)}
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(blog.published_at || blog.created_at!)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" asChild>
                        <Link to={`/slantie/blogs/${blog.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" asChild>
                        <Link to={`/blog/${blog.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteId(blog.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
