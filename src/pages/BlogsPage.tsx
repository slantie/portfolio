import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveTabs, type TabItem } from "@/components/ui/underline-tabs";
import { getBlogs } from "@/lib/api";
import type { Blog } from "@/types";
import { BLOG_TAGS } from "@/types";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { SEO } from "@/components/seo";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Create tabs array from BLOG_TAGS
  const tagTabs: TabItem[] = useMemo(
    () => [
      { value: "all", label: "All" },
      ...BLOG_TAGS.slice(0, 8).map((tag) => ({ value: tag, label: tag })),
    ],
    [],
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      selectedTag === "all" || blog.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featuredBlog = filteredBlogs.find((b) => b.featured);
  const regularBlogs = filteredBlogs.filter(
    (b) => !b.featured || b.id !== featuredBlog?.id,
  );

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Blog" />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52 relative">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 sm:mb-12 md:mb-16 text-center"
            >
              <AnimatedText
                text="My Takes"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                delayMultiplier={0.02}
              />
              <p className="text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg mb-8">
                Thoughts on coding, projects, hackathons, and everything in
                between.
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-10"
            >
              <ResponsiveTabs
                tabs={tagTabs}
                activeTab={selectedTag}
                onTabChange={setSelectedTag}
                mobileBreakpoint="md"
              />
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            {/* Featured Post */}
            {featuredBlog && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <Link to={`/blog/${featuredBlog.slug}`}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-auto">
                        {featuredBlog.cover_image && (
                          <img
                            src={featuredBlog.cover_image}
                            alt={featuredBlog.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <Badge className="absolute top-4 left-4 gap-1">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {featuredBlog.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {featuredBlog.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {featuredBlog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(featuredBlog.created_at!)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getReadTime(featuredBlog.content)} min read
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Blog Grid */}
            {!featuredBlog && regularBlogs.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  {search || selectedTag !== "all"
                    ? "Try adjusting your search or filters"
                    : "Check back soon for new content!"}
                </p>
              </div>
            ) : regularBlogs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to={`/blog/${blog.slug}`}>
                      <Card className="overflow-hidden h-full group hover:shadow-lg transition-all duration-300">
                        {blog.cover_image && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={blog.cover_image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {blog.tags?.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(blog.created_at!)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getReadTime(blog.content)} min
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : null}

            {/* Load More */}
            {regularBlogs.length >= 9 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
