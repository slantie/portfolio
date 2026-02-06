import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { getProjectById, createProject, updateProject } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Project, ProjectCategory } from "@/types";
import { PROJECT_CATEGORY_LABELS, MONTHS_ORDER } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    long_description: "",
    event: "",
    start_date: { month: "January", year: currentYear },
    end_date: undefined,
    is_ongoing: false,
    image: "",
    tags: [],
    github_link: "",
    live_link: "",
    featured: false,
    category: [],
    skills: [],
    role: "",
    team_size: undefined,
  });
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  async function fetchProject() {
    setLoading(true);
    try {
      const project = await getProjectById(id!);
      if (project) {
        setFormData(project);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof Project, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoryToggle(category: ProjectCategory, checked: boolean) {
    const currentCategories = Array.isArray(formData.category)
      ? formData.category
      : [];
    if (checked) {
      handleChange("category", [...currentCategories, category]);
    } else {
      handleChange(
        "category",
        currentCategories.filter((c) => c !== category),
      );
    }
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

  function addSkill() {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      handleChange("skills", [...(formData.skills || []), skillInput.trim()]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    handleChange("skills", formData.skills?.filter((s) => s !== skill) || []);
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
        await updateProject(id!, formData);
      } else {
        await createProject(
          formData as Omit<Project, "id" | "created_at" | "updated_at">,
        );
      }
      navigate("/slantie/projects");
    } catch (error) {
      console.error("Error saving project:", error);
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
          onClick={() => navigate("/slantie/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Project" : "New Project"}
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Long Description</Label>
              <Textarea
                id="long_description"
                value={formData.long_description || ""}
                onChange={(e) =>
                  handleChange("long_description", e.target.value)
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event">Event/Hackathon</Label>
                <Input
                  id="event"
                  value={formData.event || ""}
                  onChange={(e) => handleChange("event", e.target.value)}
                  placeholder="e.g., Smart India Hackathon 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  value={formData.role || ""}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder="e.g., Team Lead"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Month</Label>
                <Select
                  value={formData.start_date?.month}
                  onValueChange={(v) =>
                    handleChange("start_date", {
                      ...formData.start_date,
                      month: v,
                    })
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
                <Label>Start Year</Label>
                <Select
                  value={String(formData.start_date?.year)}
                  onValueChange={(v) =>
                    handleChange("start_date", {
                      ...formData.start_date,
                      year: Number(v),
                    })
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

            <div className="flex items-center gap-2">
              <Switch
                id="is_ongoing"
                checked={formData.is_ongoing}
                onCheckedChange={(v) => handleChange("is_ongoing", v)}
              />
              <Label htmlFor="is_ongoing">Ongoing Project</Label>
            </div>

            {!formData.is_ongoing && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Month</Label>
                  <Select
                    value={formData.end_date?.month || ""}
                    onValueChange={(v) =>
                      handleChange("end_date", {
                        ...formData.end_date,
                        month: v,
                        year: formData.end_date?.year || currentYear,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
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
                  <Label>End Year</Label>
                  <Select
                    value={String(formData.end_date?.year || "")}
                    onValueChange={(v) =>
                      handleChange("end_date", {
                        ...formData.end_date,
                        year: Number(v),
                        month: formData.end_date?.month || "January",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={formData.image || ""}
              onChange={(url) => handleChange("image", url)}
              folder="portfolio/projects"
              tags={["portfolio", "project"]}
              label="Project Image *"
              description="Upload an image for this project. Images are automatically converted to WebP for optimal performance."
              previewHeight="h-56"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_link">GitHub Link</Label>
                <Input
                  id="github_link"
                  value={formData.github_link || ""}
                  onChange={(e) => handleChange("github_link", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_link">Live Link</Label>
                <Input
                  id="live_link"
                  value={formData.live_link || ""}
                  onChange={(e) => handleChange("live_link", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]).map(
                (cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Checkbox
                      id={cat}
                      checked={(
                        (formData.category as ProjectCategory[]) || []
                      ).includes(cat)}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(cat, !!checked)
                      }
                    />
                    <Label htmlFor={cat} className="text-sm">
                      {PROJECT_CATEGORY_LABELS[cat]}
                    </Label>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags & Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tags</Label>
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
              <div className="flex flex-wrap gap-2 mt-2">
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
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Add a skill..."
                />
                <Button type="button" onClick={addSkill} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                  >
                    {skill}
                    <button
                      title="Close"
                      type="button"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(v) => handleChange("featured", v)}
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                type="number"
                min={1}
                value={formData.team_size || ""}
                onChange={(e) =>
                  handleChange(
                    "team_size",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving || !isSupabaseConfigured}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/slantie/projects")}
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
