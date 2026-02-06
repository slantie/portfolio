import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Calendar, Users, Linkedin, Link } from "lucide-react";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTabs, TabItem } from "@/components/ui/underline-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/seo";
import { getProjects, getProjectsByCategory } from "@/lib/api";
import type { Project, ProjectCategory } from "@/types";
import { PROJECT_CATEGORY_LABELS } from "@/types";
import { getOptimalFormatUrl } from "@/lib/cloudinary";

// Sort function for projects
function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const aStartDate = new Date(
      a.start_date.year,
      new Date(`${a.start_date.month} 1`).getMonth(),
    );
    const bStartDate = new Date(
      b.start_date.year,
      new Date(`${b.start_date.month} 1`).getMonth(),
    );

    if (aStartDate.getTime() === bStartDate.getTime()) {
      if (a.is_ongoing && !b.is_ongoing) return -1;
      if (!a.is_ongoing && b.is_ongoing) return 1;

      const aEndDate = a.end_date
        ? new Date(
            a.end_date.year,
            new Date(`${a.end_date.month} 1`).getMonth(),
          )
        : new Date();
      const bEndDate = b.end_date
        ? new Date(
            b.end_date.year,
            new Date(`${b.end_date.month} 1`).getMonth(),
          )
        : new Date();

      return bEndDate.getTime() - aEndDate.getTime();
    }

    return bStartDate.getTime() - aStartDate.getTime();
  });
}

// Define category labels for tabs
const categoryLabels: Record<ProjectCategory, string> = PROJECT_CATEGORY_LABELS;

// Build tabs array from category labels
const projectTabs: TabItem[] = [
  { value: "all", label: "All Projects" },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
];

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Fetch projects when category changes
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        let data: Project[];
        if (activeCategory === "all") {
          data = await getProjects();
        } else {
          data = await getProjectsByCategory(activeCategory as ProjectCategory);
        }
        setProjects(sortProjects(data));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [activeCategory]);

  return (
    <Layout>
      <SEO
        title="Projects"
        description="Check out what Slantie has been building! Projects spanning AI/ML, web development, hackathons, and more."
        keywords="Slantie projects, AI, ML, web development, hackathon, portfolio, Kandarp Gajjar"
      />
      <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52 relative">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div
            ref={containerRef}
            style={{ opacity, scale }}
            className="mb-10 sm:mb-12 md:mb-16 text-center"
          >
            <AnimatedText
              text="Projects"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
              delayMultiplier={0.02}
            />
            <p className="text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              A showcase of my technical projects, research work, and hackathon
              achievements spanning AI/ML, web development, and more.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <ResponsiveTabs
              tabs={projectTabs}
              activeTab={activeCategory}
              onTabChange={setActiveCategory}
            />

            {/* Project Content */}
            <div className="mt-12">
              {loading ? (
                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card
                      key={i}
                      className="overflow-hidden shadow-lg rounded-xl"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <Skeleton className="aspect-video md:aspect-square w-full h-48 md:h-64" />
                        </div>
                        <div className="md:w-2/3 p-6 space-y-4">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex gap-2 pt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                    >
                      <Card className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full flex flex-col  relative">
                        <div className="flex flex-col md:flex-row">
                          {/* Left side - Image with Year Badge */}
                          <div className="relative group md:w-1/3">
                            {/* Year Badge - positioned at top left */}
                            <div className="absolute top-3 left-3 z-30">
                              <Badge className="bg-primary text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                                {project.end_date?.year ||
                                  project.start_date.year}
                              </Badge>
                            </div>

                            {/* Image container with 16:9 aspect ratio */}
                            <div className="relative aspect-video sm:aspect-16/9">
                              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                              <img
                                src={getOptimalFormatUrl(project.image, {
                                  width: 600,
                                })}
                                alt={project.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>

                            {/* Team size info on hover */}
                            {project.team_size && (
                              <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Badge
                                  variant="outline"
                                  className="bg-black/60 text-white border-none text-xs"
                                >
                                  <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />{" "}
                                  Team of {project.team_size}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Right side - Content */}
                          <div className="md:w-2/3 p-4 sm:p-6 relative">
                            {/* Tags on the bottom right corner - hidden on mobile */}
                            <div className="absolute bottom-5 right-4 sm:right-5 z-30 hidden sm:flex sm:flex-wrap gap-2 justify-end">
                              {project.tags.map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="bg-muted text-muted-foreground hover:bg-primary/20 transition-colors text-xs px-2.5 py-1"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* 1. Title of the project */}
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 pr-12 sm:pr-0">
                              {project.title}
                            </h3>

                            {/* 2. Event Associated (if it's a hackathon or has achievements) */}
                            {project.event && (
                              <h4 className="text-sm sm:text-md md:text-xl font-bold mb-1">
                                {project.event}
                              </h4>
                            )}

                            {/* 3. My Role */}
                            {project.role && (
                              <p className="text-muted-foreground font-bold text-xs sm:text-sm md:text-md mb-2 sm:mb-3 md:mb-4">
                                {project.role}
                              </p>
                            )}

                            {/* 5. Description - with line clamp on mobile */}
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 line-clamp-3 sm:line-clamp-none">
                              {project.description}
                            </p>

                            {/* Date range info */}
                            <div className="flex items-center gap-1 sm:gap-2 text-[12px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 md:mb-6">
                              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                              <span>
                                {project.start_date.month}{" "}
                                {project.start_date.year}
                                {project.is_ongoing
                                  ? " - Present"
                                  : project.end_date
                                    ? ` - ${project.end_date.month} ${project.end_date.year}`
                                    : ""}
                              </span>
                            </div>

                            {/* Project Deployment Link */}
                            {project.live_link && (
                              <div className="absolute top-5 right-3 sm:top-5 sm:right-5 z-30">
                                <div className="flex ">
                                  <a
                                    href={project.live_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground hover:text-foreground/70 transition-colors "
                                  >
                                    <div className="flex justify-center items-center gap-1 sm:gap-2 ">
                                      <Link className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 " />
                                      <span className="text-[10px] sm:text-xs md:text-sm hidden sm:inline truncate max-w-[100px] sm:max-w-[150px] ">
                                        {project.live_link}
                                      </span>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* 7. Links - positioned at bottom for all screen sizes */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-auto pt-3 sm:pt-0 sm:absolute sm:bottom-5">
                              {project.github_link && (
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 md:h-9 px-2 py-0 sm:px-3 sm:py-1 "
                                >
                                  <a
                                    href={project.github_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 sm:gap-2 "
                                  >
                                    <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                                    <span className="text-[12px] sm:text-xs md:text-sm ">
                                      GitHub
                                    </span>
                                  </a>
                                </Button>
                              )}

                              {/* Additional LinkedIn post link */}
                              {project.link && (
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 md:h-9 px-2 py-0 sm:px-3 sm:py-1 "
                                >
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 sm:gap-2 "
                                  >
                                    <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                                    <span className="text-[12px] sm:text-xs md:text-sm ">
                                      LinkedIn
                                    </span>
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty state when no projects match the filter */}
              {!loading && projects.length === 0 && (
                <div className="text-center py-10 sm:py-16">
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                    No projects found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
