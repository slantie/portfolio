import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { createGalleryImage } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { GalleryImage } from "@/types";
import { MONTHS_ORDER } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function GalleryForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    url: "",
    caption: "",
    date: { month: "", year: currentYear },
  });
  const [category, setCategory] = useState<"home" | "main" | "moments">("main");

  function handleChange(field: keyof GalleryImage, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      alert("Supabase not configured. Cannot save changes.");
      return;
    }

    setSaving(true);
    try {
      await createGalleryImage(
        {
          url: formData.url!,
          caption: formData.caption!,
          date: formData.date?.month ? formData.date : undefined,
        },
        category,
      );
      navigate("/admin/gallery");
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/gallery")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Upload Image</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Image Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={formData.url || ""}
              onChange={(url) => handleChange("url", url)}
              folder={`portfolio/gallery/${category}`}
              tags={["portfolio", "gallery", category]}
              label="Gallery Image *"
              description="Upload an image. Images are automatically converted to WebP for optimal loading."
              previewHeight="h-64"
            />

            <div className="space-y-2">
              <Label htmlFor="caption">Caption *</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => handleChange("caption", e.target.value)}
                placeholder="Describe this image..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gallery Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as typeof category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Page Gallery</SelectItem>
                  <SelectItem value="main">Main Gallery (Moments)</SelectItem>
                  <SelectItem value="moments">Moments Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={formData.date?.month || "none"}
                  onValueChange={(v) =>
                    handleChange("date", {
                      ...formData.date,
                      month: v === "none" ? undefined : v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No month</SelectItem>
                    {MONTHS_ORDER.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select
                  value={
                    formData.date?.year ? String(formData.date.year) : "none"
                  }
                  onValueChange={(v) =>
                    handleChange("date", {
                      ...formData.date,
                      year: v === "none" ? undefined : Number(v),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No year</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving || !isSupabaseConfigured}>
            <ImagePlus className="h-4 w-4 mr-2" />
            {saving ? "Uploading..." : "Add to Gallery"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/gallery")}
          >
            Cancel
          </Button>
        </div>

        {!isSupabaseConfigured && (
          <p className="text-sm text-muted-foreground">
            Note: Supabase is not configured. Enable it to save changes to the
            database.
          </p>
        )}
      </form>
    </div>
  );
}
