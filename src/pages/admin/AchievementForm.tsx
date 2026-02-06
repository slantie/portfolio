import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import {
  getAchievements,
  createAchievement,
  updateAchievement,
} from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Achievement, AchievementType } from "@/types";
import { ACHIEVEMENT_CATEGORY_LABELS, MONTHS_ORDER } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function AchievementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Achievement>>({
    title: "",
    type: "award",
    organization: "",
    description: "",
    date: { month: "January", year: currentYear },
    image: "",
    link: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchAchievement();
    }
  }, [id]);

  async function fetchAchievement() {
    setLoading(true);
    try {
      const achievements = await getAchievements();
      const achievement = achievements.find((a) => a.id === id);
      if (achievement) {
        setFormData(achievement);
      }
    } catch (error) {
      console.error("Error fetching achievement:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof Achievement, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function addTag() {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      handleChange("tags", [...(formData.tags || []), tagInput.trim()]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    handleChange("tags", formData.tags?.filter((t) => t !== tag) || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      alert("Supabase not configured. Cannot save changes.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateAchievement(id!, formData);
      } else {
        await createAchievement(
          formData as Omit<Achievement, "id" | "created_at" | "updated_at">,
        );
      }
      navigate("/slantie/achievements");
    } catch (error) {
      console.error("Error saving achievement:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <Card className="animate-pulse">
          <CardContent className="py-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/slantie/achievements")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Achievement" : "New Achievement"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Best Paper Award"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    handleChange("type", v as AchievementType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.keys(
                        ACHIEVEMENT_CATEGORY_LABELS,
                      ) as AchievementType[]
                    ).map((type) => (
                      <SelectItem key={type} value={type}>
                        {ACHIEVEMENT_CATEGORY_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  placeholder="e.g., IEEE"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={formData.date?.month}
                  onValueChange={(v) =>
                    handleChange("date", { ...formData.date, month: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  value={String(formData.date?.year)}
                  onValueChange={(v) =>
                    handleChange("date", { ...formData.date, year: Number(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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

        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">External Link</Label>
              <Input
                id="link"
                value={formData.link || ""}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add a tag..."
              />
              <Button type="button" onClick={addTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                >
                  {tag}
                  <button
                    title="Close"
                    type="button"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving || !isSupabaseConfigured}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Achievement"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/slantie/achievements")}
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
