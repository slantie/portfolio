import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { getGalleryImages, deleteGalleryImage } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { GalleryImage } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import { ResponsiveTabs, TabItem } from "@/components/ui/underline-tabs";
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

const galleryTabs: TabItem[] = [
  { value: "home", label: "Home Gallery" },
  { value: "main", label: "Main Gallery" },
  { value: "moments", label: "Moments" },
];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [activeTab]);

  async function fetchImages() {
    setLoading(true);
    try {
      const data = await getGalleryImages(activeTab as "home" | "main" | "moments");
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    setDeleting(true);
    const success = await deleteGalleryImage(deleteId);

    if (success) {
      setImages((prev) => prev.filter((img) => img.id !== deleteId));
    }

    setDeleting(false);
    setDeleteId(null);
  }

  return (
    <div className="sortd-page space-y-7">
      <AdminPageHeader title="Gallery" description="A deliberate collection of images across your public portfolio." actions={<Button asChild><Link to="/slantie/gallery/new"><Plus className="h-4 w-4" />Upload image</Link></Button>} />

      <ResponsiveTabs
        tabs={galleryTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <Card className="sortd-empty">
          <CardContent className="py-14 text-center text-muted-foreground">
            No images in this gallery yet. Upload your first image!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="sortd-item relative aspect-square overflow-hidden rounded-xl border bg-card">
              <img
                src={optimizeCloudinaryUrl(image.url, 400)}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-3 pt-10 text-white">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{image.caption}</p>{image.date && <p className="mt-0.5 text-xs text-white/75">{image.date.month} {image.date.year}</p>}</div>
                {isSupabaseConfigured && <Button type="button" size="icon" variant="secondary" className="size-8 shrink-0 bg-white/90 text-black hover:bg-white" onClick={() => setDeleteId(image.id!)}><Trash2 className="size-3.5" /><span className="sr-only">Delete {image.caption}</span></Button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
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
