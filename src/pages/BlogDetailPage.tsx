import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogBySlug, trackItemView } from "@/lib/api";
import type { Blog } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

// Markdown parser
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

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  async function fetchBlog() {
    setLoading(true);
    try {
      const data = await getBlogBySlug(slug!);
      if (data) {
        setBlog(data);
        document.title = `${data.title} | Slantie's Blog`;

        // Track view
        trackItemView("blog", data.id, data.title).catch(console.error);
      } else {
        navigate("/blog");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getReadTime(content: string) {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  async function sharePost() {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-32" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-full" />
              <div className="h-96 bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Post not found</h1>
            <p className="text-muted-foreground mb-6">
              This blog post doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {blog.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {blog.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {blog.author || "Slantie"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.created_at!)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {getReadTime(blog.content)} min read
                </span>
                <div className="flex-1" />
                <Button variant="ghost" size="sm" onClick={sharePost}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "Copied!" : "Share"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cover Image */}
        {blog.cover_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="container mx-auto px-4 sm:px-6 max-w-5xl mb-12"
          >
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full rounded-xl shadow-lg object-cover aspect-video"
            />
          </motion.div>
        )}

        {/* Content */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.content) }}
            />
          </div>
        </section>

        {/* Footer */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-muted-foreground">
                      Enjoyed this post? Share it with others!
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button onClick={sharePost}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
