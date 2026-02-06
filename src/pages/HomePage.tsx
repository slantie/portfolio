import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProjects, getGalleryImages, getSettings } from "@/lib/api";
import type { Project, GalleryImage } from "@/types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getOptimalFormatUrl } from "@/lib/cloudinary";
import { SEO } from "@/components/seo";

// Default fallback values
const DEFAULT_SETTINGS = {
  hero_name: "Kandarp Gajjar",
  hero_title: "AI/ML & Full-Stack Developer",
  hero_bio:
    "Computer Engineering student specializing in Machine Learning, Natural Language Processing, and Web Development. Passionate about creating innovative solutions with cutting-edge technologies.",
  hero_image:
    "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825823/me2_cdehns_ulo0rz.avif",
  resume_url:
    "https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing",
  linkedin_url: "https://linkedin.com/in/kandarpgajjar",
  github_url: "https://github.com/slantie",
  instagram_url: "https://www.instagram.com/whoisslantie/",
  stat_hackathons: "7+",
  stat_projects: "10+",
  stat_publications: "1",
};

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [settings, setSettings] =
    useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [projects, gallery, settingsData] = await Promise.all([
          getFeaturedProjects(),
          getGalleryImages("home"),
          getSettings(),
        ]);
        setFeaturedProjects(projects);
        setGalleryImages(gallery);

        // Merge settings with defaults
        if (settingsData.length > 0) {
          const settingsMap: Record<string, string> = { ...DEFAULT_SETTINGS };
          settingsData.forEach((s: { key: string; value: string }) => {
            if (s.value) settingsMap[s.key] = s.value;
          });
          setSettings(settingsMap);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Gallery navigation
  const nextImage = () => {
    if (galleryImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (galleryImages.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  // Auto-advance gallery
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <SEO
        title="Home"
        description="Hey there! I'm Slantie (Kandarp Gajjar) - an AI/ML enthusiast & Full-Stack Developer. Explore my projects, achievements, and creative journey!"
        keywords="Slantie, Kandarp Gajjar, AI, ML, full-stack developer, portfolio, projects, achievements"
      />
      {/* Hero Section */}
      <section className="relative mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-8 flex items-center overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <div className="mb-6 sm:mb-8 flex flex-col">
                <AnimatedText
                  text={settings.hero_name}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4"
                  delayMultiplier={0.02}
                />

                <AnimatedText
                  text={settings.hero_title}
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-muted-foreground"
                  delayMultiplier={0.02}
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 lg:mb-10"
                >
                  {settings.hero_bio}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                >
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link
                      to="/projects"
                      className="flex items-center justify-center"
                    >
                      View Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    <a
                      href={settings.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      My Resume
                    </a>
                  </Button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.9,
                    }}
                    className="mt-5 sm:mt-0 sm:ml-4 flex gap-4"
                  >
                    {settings.linkedin_url && (
                      <a
                        href={settings.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                        title="LinkedIn"
                        className="transition-colors hover:text-foreground/70"
                      >
                        <Linkedin className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </a>
                    )}
                    {settings.github_url && (
                      <a
                        href={settings.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                        title="GitHub"
                        className="transition-colors hover:text-foreground/70"
                      >
                        <Github className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </a>
                    )}
                    {settings.instagram_url && (
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram Profile"
                        title="Instagram"
                        className="transition-colors hover:text-foreground/70"
                      >
                        <Instagram className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-8 sm:mt-10 md:mt-12 relative"
              >
                <div className="relative z-10">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 text-center">
                    <div className="p-2 sm:p-3 md:p-4 backdrop-blur-sm rounded-lg">
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-muted-foreground">
                        {settings.stat_hackathons}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg">
                        Hackathons
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 md:p-4 backdrop-blur-sm rounded-lg">
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-muted-foreground">
                        {settings.stat_projects}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg">
                        Projects
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 md:p-4 backdrop-blur-sm rounded-lg">
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-muted-foreground">
                        {settings.stat_publications}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg">
                        Publication
                        {settings.stat_publications !== "1" ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hero Image with 16:9 ratio and hover effect - show on tablet and above */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden sm:block lg:block mx-auto max-w-md lg:max-w-none"
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl aspect-[16/11]">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
                <OptimizedImage
                  src={settings.hero_image}
                  alt={`${settings.hero_name} - Portfolio`}
                  className="w-full h-full"
                  width={800}
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
              Featured Projects
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              A selection of my award-winning projects and innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="overflow-hidden h-full flex flex-col border-black-800 shadow-xl rounded-xl">
                  <div className="h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden relative group">
                    {/* Simple overlay */}
                    <div className="absolute inset-0 bg-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                    {/* Project image with simple scale effect */}
                    <img
                      src={getOptimalFormatUrl(project.image, { width: 600 })}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Simple icon indicator */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl sm:text-2xl">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow pb-2">
                    <div className="hidden sm:flex flex-wrap gap-1 sm:gap-2">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-primary/70 hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/70 hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                        >
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <Button asChild size="lg" className="px-4 sm:px-6 md:px-8">
              <Link to="/projects" className="flex items-center justify-center">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Highlights
            </h2>
          </div>

          <div className="relative rounded-xl">
            <div className="overflow-hidden relative rounded-xl">
              {/* eslint-disable-next-line react/forbid-component-props, react/forbid-dom-props */}
              <div
                className="flex transition-transform duration-500 ease-in-out rounded-xl"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-full">
                    <div className="relative aspect-video">
                      <img
                        src={getOptimalFormatUrl(image.url, { width: 1200 })}
                        alt={image.caption || `Gallery image ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="text-center mt-2 sm:mt-4">
                      <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-semibold">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={prevImage}
                className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black/50 text-white p-1 sm:p-2 rounded-md hover:bg-black/70 transition"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </Button>
              <Button
                onClick={nextImage}
                className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black/50 text-white p-1 sm:p-2 rounded-md hover:bg-black/70 transition"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 sm:py-36 md:py-48 lg:py-72 flex items-center justify-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
                Let's Work Together
              </h2>
              <p className="max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10">
                Interested in collaborating on a project or have a job
                opportunity? I'm always open to discussing new ideas and
                opportunities.
              </p>
              <Button
                asChild
                size="lg"
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-base sm:text-lg"
              >
                <Link
                  to="/contact"
                  className="flex items-center justify-center"
                >
                  Get In Touch
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
