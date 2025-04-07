import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Calendar, Users, Linkedin, Link } from "lucide-react";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllProjects,
  getProjectsByCategory,
  ProjectCategory,
} from "@/data/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allProjects = getAllProjects().sort((a, b) => {
  const aStartDate = new Date(
    a.startDate.year,
    new Date(`${a.startDate.month} 1`).getMonth()
  );
  const bStartDate = new Date(
    b.startDate.year,
    new Date(`${b.startDate.month} 1`).getMonth()
  );

  if (aStartDate.getTime() === bStartDate.getTime()) {
    if (a.isOngoing && !b.isOngoing) return -1; // Ongoing projects come first
    if (!a.isOngoing && b.isOngoing) return 1; // Ongoing projects come first

    const aEndDate = a.endDate
      ? new Date(a.endDate.year, new Date(`${a.endDate.month} 1`).getMonth())
      : new Date(); // Treat ongoing projects as having the current date
    const bEndDate = b.endDate
      ? new Date(b.endDate.year, new Date(`${b.endDate.month} 1`).getMonth())
      : new Date(); // Treat ongoing projects as having the current date

    return bEndDate.getTime() - aEndDate.getTime(); // Sort by end date
  }

  return bStartDate.getTime() - aStartDate.getTime(); // Recent projects first
});

// Define category labels for tabs
const categoryLabels: Record<ProjectCategory, string> = {
  "ai-ml": "AI & Machine Learning",
  "web-development": "Web Development",
  hackathon: "Hackathons",
  academic: "Academic",
  research: "Research",
  iot: "IoT",
  cybersecurity: "Cybersecurity",
  "data-science": "Data Science",
};

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Check if mobile based on window size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? allProjects
      : getProjectsByCategory(activeCategory as ProjectCategory);

  // Handler for dropdown change
  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  return (
    <Layout>
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

          {/* Category Tabs/Dropdown */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            {/* Mobile Dropdown */}
            {isMobile ? (
              <div className="mb-8 sm:hidden">
                <Select
                  value={activeCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {(Object.keys(categoryLabels) as ProjectCategory[]).map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              // Desktop Tabs
              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full hidden sm:block"
              >
                <div className="flex justify-center items-center mb-8 sm:mb-10 md:mb-12 z-10">
                  <TabsList className="flex items-center justify-center gap-2 sm:gap-4 px-2 py-4 sm:py-6 transition-all duration-300">
                    <TabsTrigger value="all" className="text-sm md:text-md">
                      All Projects
                    </TabsTrigger>
                    {(Object.keys(categoryLabels) as ProjectCategory[]).map(
                      (category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="text-sm md:text-md"
                        >
                          {categoryLabels[category]}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </div>
              </Tabs>
            )}

            {/* Project Content */}
            <div className="mt-0">
              <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer relative">
                      <div className="flex flex-col md:flex-row">
                        {/* Left side - Image with Year Badge */}
                        <div className="relative group md:w-1/3">
                          {/* Year Badge - positioned at top left */}
                          <div className="absolute top-3 left-3 z-30">
                            <Badge className="bg-primary text-white font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                              {project.endDate?.year || project.startDate.year}
                            </Badge>
                          </div>

                          {/* Image container with 16:9 aspect ratio */}
                          <div className="relative aspect-video sm:aspect-16/9">
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Team size info on hover */}
                          {project.teamSize && (
                            <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Badge
                                variant="outline"
                                className="bg-black/60 text-white border-none text-xs"
                              >
                                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />{" "}
                                Team of {project.teamSize}
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
                                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs px-2.5 py-1"
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
                            <p className="text-primary/80 font-bold text-xs sm:text-sm md:text-md mb-2 sm:mb-3 md:mb-4">
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
                              {project.startDate.month} {project.startDate.year}
                              {project.isOngoing
                                ? " - Present"
                                : project.endDate
                                ? ` - ${project.endDate.month} ${project.endDate.year}`
                                : ""}
                            </span>
                          </div>

                          {/* Project Deployment Link */}
                          {project.liveLink && (
                            <div className="absolute top-5 right-3 sm:top-5 sm:right-5 z-30">
                              <div className="flex">
                                <a
                                  href={project.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  <div className="flex justify-center items-center gap-1 sm:gap-2">
                                    <Link className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                                    <span className="text-[10px] sm:text-xs md:text-sm hidden sm:inline truncate max-w-[100px] sm:max-w-[150px]">
                                      {project.liveLink}
                                    </span>
                                  </div>
                                </a>
                              </div>
                            </div>
                          )}

                          {/* 7. Links - positioned at bottom for all screen sizes */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-auto pt-3 sm:pt-0 sm:absolute sm:bottom-5">
                            {project.githubLink && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-7 sm:h-8 md:h-9 px-2 py-0 sm:px-3 sm:py-1"
                              >
                                <a
                                  href={project.githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 sm:gap-2"
                                >
                                  <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                                  <span className="text-[12px] sm:text-xs md:text-sm">
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
                                className="h-7 sm:h-8 md:h-9 px-2 py-0 sm:px-3 sm:py-1"
                              >
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 sm:gap-2"
                                >
                                  <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                                  <span className="text-[12px] sm:text-xs md:text-sm">
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

              {/* Empty state when no projects match the filter */}
              {filteredProjects.length === 0 && (
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
