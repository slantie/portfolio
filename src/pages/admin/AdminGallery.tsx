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
      const data = await getGalleryImages(activeTab as "home" | "main");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio images
          </p>
        </div>
        <Button asChild>
          <Link to="/slantie/gallery/new">
            <Plus className="h-4 w-4 mr-2" />
            Upload Image
          </Link>
        </Button>
      </div>

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
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No images in this gallery yet. Upload your first image!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="relative group aspect-square">
              <img
                src={optimizeCloudinaryUrl(image.url, 400)}
                alt={image.caption}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex flex-col items-center justify-center p-2">
                <p className="text-white text-sm text-center line-clamp-2 mb-3">
                  {image.caption}
                </p>
                {image.date && (
                  <p className="text-white/70 text-xs mb-3">
                    {image.date.month} {image.date.year}
                  </p>
                )}
                {isSupabaseConfigured && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(image.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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
