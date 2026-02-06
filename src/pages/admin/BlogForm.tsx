import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Eye,
  Sparkles,
  FileText,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { getBlogById, createBlog, updateBlog } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Blog } from "@/types";
import { BLOG_TAGS } from "@/types";
import { toast } from "sonner";

// Markdown parser for preview
function parseMarkdown(markdown: string): string {
  if (!markdown) return "";

  let html = markdown.replace(/\r\n/g, "\n");

  // Store code blocks to protect them
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` language-${lang}` : "";
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(
      `<pre class="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-6 text-sm"><code class="font-mono${langClass}">${escaped}</code></pre>`,
    );
    return placeholder;
  });

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>',
  );

  // Headers
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-3xl font-bold mt-12 mb-5">$1</h1>',
  );

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground bg-muted/30 py-2 rounded-r">$1</blockquote>',
  );

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr class="my-8 border-border" />');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full" loading="lazy" />',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Lists
  const lines = html.split("\n");
  const processedLines: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  for (const line of lines) {
    const ulMatch = line.match(/^[-*] (.+)$/);
    const olMatch = line.match(/^\d+\. (.+)$/);

    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        processedLines.push('<ul class="list-disc pl-6 my-4 space-y-1">');
        inList = true;
        listType = "ul";
      }
      processedLines.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        processedLines.push('<ol class="list-decimal pl-6 my-4 space-y-1">');
        inList = true;
        listType = "ol";
      }
      processedLines.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) {
        processedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
        listType = null;
      }
      processedLines.push(line);
    }
  }
  if (inList) processedLines.push(listType === "ul" ? "</ul>" : "</ol>");

  html = processedLines.join("\n");

  // Paragraphs
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<") &&
        !trimmed.startsWith("<a") &&
        !trimmed.startsWith("<strong") &&
        !trimmed.startsWith("<em") &&
        !trimmed.startsWith("<code")
      ) {
        return trimmed;
      }
      if (trimmed.startsWith("__CODE_BLOCK_")) return trimmed;
      return `<p class="my-4 leading-relaxed">${trimmed}</p>`;
    })
    .join("\n");

  // Line breaks in paragraphs
  html = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/g, (_, attrs, content) => {
    return `<p${attrs}>${content.replace(/\n/g, "<br />")}</p>`;
  });

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });

  // Clean empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, "");

  return html;
}

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    author: "slantie",
    tags: [],
    published: false,
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  async function fetchBlog() {
    setLoading(true);
    try {
      const blog = await getBlogById(id!);
      if (blog) {
        setFormData(blog);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof Blog, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleChange(title: string) {
    handleChange("title", title);
    if (
      !isEditing ||
      !formData.slug ||
      formData.slug === generateSlug(formData.title || "")
    ) {
      handleChange("slug", generateSlug(title));
    }
  }

  function addTag(tag?: string) {
    const newTag = tag || tagInput.trim();
    if (newTag && !formData.tags?.includes(newTag)) {
      handleChange("tags", [...(formData.tags || []), newTag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    handleChange("tags", formData.tags?.filter((t) => t !== tag) || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      toast.error("Supabase not configured. Cannot save changes.");
      return;
    }

    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.content?.trim()) {
      toast.error("Content is required");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateBlog(id!, formData);
        toast.success("Blog post updated!");
      } else {
        await createBlog(formData);
        toast.success("Blog post created!");
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog post");
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
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            {isEditing ? (
              <FileText className="h-6 w-6" />
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
            {isEditing ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing
              ? "Update your thoughts"
              : "Share something awesome, Slantie!"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="edit" className="gap-2">
              <FileText className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="My Awesome Blog Post"
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          /blog/
                        </span>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleChange("slug", e.target.value)}
                          placeholder="my-awesome-blog-post"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          handleChange("excerpt", e.target.value)
                        }
                        placeholder="A short summary of your post..."
                        className="h-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content (Markdown) *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          handleChange("content", e.target.value)
                        }
                        placeholder="Write your post in Markdown..."
                        className="h-96 font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={formData.cover_image || ""}
                      onChange={(url) => handleChange("cover_image", url)}
                      folder="portfolio/blog"
                      tags={["portfolio", "blog"]}
                      previewHeight="h-40"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {BLOG_TAGS.slice(0, 6).map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            formData.tags?.includes(tag) ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() =>
                            formData.tags?.includes(tag)
                              ? removeTag(tag)
                              : addTag(tag)
                          }
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Custom tag..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addTag()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag) => (
                        <Badge key={tag} className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publishing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Published</Label>
                        <p className="text-xs text-muted-foreground">
                          Make this post visible
                        </p>
                      </div>
                      <Switch
                        checked={formData.published}
                        onCheckedChange={(v) => handleChange("published", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Featured</Label>
                        <p className="text-xs text-muted-foreground">
                          Show on top of the list
                        </p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(v) => handleChange("featured", v)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="py-8">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl font-bold mb-4">
                    {formData.title || "Untitled Post"}
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    {formData.excerpt}
                  </p>
                  {formData.cover_image && (
                    <img
                      src={formData.cover_image}
                      alt="Cover"
                      className="w-full rounded-lg mb-8 aspect-video object-cover"
                    />
                  )}
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(formData.content || ""),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={saving || !isSupabaseConfigured}
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/blogs")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
