import { useState, lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Calendar, Users, Award, Linkedin } from "lucide-react";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAllProjects, 
  getProjectsByCategory, 
  ProjectCategory 
} from "@/data/data";

// Lazy load the particles background
const LazyParticlesBackground = lazy(() => import("@/components/ui/particles-background"));

const allProjects = getAllProjects().sort((a, b) => {
  const aStartDate = new Date(a.startDate.year, new Date(`${a.startDate.month} 1`).getMonth());
  const bStartDate = new Date(b.startDate.year, new Date(`${b.startDate.month} 1`).getMonth());

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
  "hackathon": "Hackathons",
  "academic": "Academic",
  "research": "Research",
  "iot": "IoT",
  "cybersecurity": "Cybersecurity",
  "data-science": "Data Science"
};

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Filter projects based on active category
  const filteredProjects = activeCategory === "all" 
    ? allProjects 
    : getProjectsByCategory(activeCategory as ProjectCategory);

  return (
    <Layout>
      <section className="relative mt-52 mb-8">
        {/* <Suspense fallback={<div className="absolute inset-0 z-0"></div>}>
                  <LazyParticlesBackground/>
                </Suspense> */}
        <div className="max-w-[1920px] mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div
            ref={containerRef}
            style={{ opacity, scale }}
            className="mb-12 text-center"
          >
            <AnimatedText
              text="Projects"
              className="text-6xl font-bold mb-6"
              delayMultiplier={0.02}
            />
            <p className="text-muted-foreground max-w-3xl text-center mx-auto text-xl">
              A showcase of my technical projects, research work, and hackathon achievements
              spanning AI/ML, web development, and more.
            </p>
          </motion.div>
          
          {/* Category Tabs */}
          <div>
            <Tabs 
              defaultValue="all" 
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <div className="flex justify-center justify-items-center items-center mb-12">
                <TabsList className="flex items-center justify-center gap-4 px-2 py-6 transition-all duration-300">
                  <TabsTrigger value="all" className="text-md">
                  All Projects
                  </TabsTrigger>
                  {(Object.keys(categoryLabels) as ProjectCategory[]).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-md">
                    {categoryLabels[category]}
                  </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value={activeCategory} className="mt-0">
                <div className="flex flex-col gap-8">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* <Card className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300"> */}
                      <Card className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer relative">
                        <div className="flex flex-col md:flex-row">
                          {/* Left side - Image with Year Badge */}
                          <div className="md:w-1/3 relative group">
                            {/* Year Badge - positioned at top left */}
                            <div className="absolute top-3 left-3 z-30">
                              <Badge className="bg-primary text-white font-medium px-3 py-1">
                                {project.endDate?.year || project.startDate.year}
                              </Badge>
                            </div>
                            
                            {/* Image container with 16:9 aspect ratio */}
                            <div className="relative" style={{ aspectRatio: "16/9" }}>
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
                                <Badge variant="outline" className="bg-black/60 text-white border-none">
                                  <Users className="h-3 w-3 mr-1" /> Team of {project.teamSize}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          {/* Right side - Content */}
                          <div className="md:w-2/3 p-6 relative">
                            {/* Tags on the top right corner */}
                            <div className="absolute bottom-5 right-5 z-30 flex flex-wrap gap-2 justify-end">
                            {project.tags.map((tag, i) => (
                                <Badge 
                                  key={i} 
                                  variant="secondary" 
                                  className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* 1. Title of the project */}
                            <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                            
                            {/* 2. Event Associated (if it's a hackathon or has achievements) */}
                            <h3 className="text-xl font-bold mb-1">{project.event}</h3>
                            
                            {/* 3. My Role */}
                            {project.role && (
                              <p className="text-primary/80 font-bold text-md mb-4">
                                {project.role}
                              </p>
                            )}
                            
                            {/* 5. Description */}
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                              {project.description}
                            </p>
                            
                            {/* Date range info */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                              <Calendar className="h-4 w-4" />
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
                            {project.liveLink && <div className="absolute top-5 right-5 z-30">
                              <div className="flex">
                              {project.link && (
                                <a 
                                href={project.liveLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:text-primary/80 transition-colors"
                                >
                                <ExternalLink className="h-6 w-6" />
                                </a>
                              )}
                              </div>
                            </div>
}

                            {/* 7. Links */}
                            <div className="absolute bottom-5 flex flex-wrap gap-3 mt-auto">
                              
                              {project.githubLink && (
                                <Button 
                                  asChild 
                                  variant="outline"
                                >
                                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Github className="h-4 w-4" />
                                    <span>GitHub</span>
                                  </a>
                                </Button>
                              )}
                              
                              {/* Additional LinkedIn post link */}
                              {project.link && (
                                <Button 
                                  asChild 
                                  variant="outline"
                                >
                                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Linkedin className="h-4 w-4" />
                                    <span>LinkedIn Post</span>
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
                  <div className="text-center py-16">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      No projects found in this category.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
