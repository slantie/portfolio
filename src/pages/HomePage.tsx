import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Code,
  Server,
  Database,
  Brain,
  Instagram,
} from "lucide-react";
import { useState, lazy, Suspense, useEffect } from "react";
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
import { projects, galleryImage, galleryImages } from "@/data/data";

// Lazy load the particles background
const LazyParticlesBackground = lazy(
  () => import("@/components/ui/particles-background")
);

const gallery = galleryImages.map(
  (image) =>
    ({
      url: image.url,
      caption: image.caption,
    } as galleryImage)
);

// Get featured projects from the data file
const featuredProjects = projects.filter((project) => project.featured);

// Hero image
const heroImage =
  "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670158/me2_cdehns.jpg";

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gallery navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
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
      {/* Hero Section */}
      <section className="relative mt-32 mb-8 flex items-center overflow-hidden">
        {/* <Suspense fallback={<div className="absolute inset-0 bg-black"></div>}>
          <LazyParticlesBackground />
        </Suspense> */}

        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-24 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8 flex flex-col">
                <AnimatedText
                  text="Kandarp Gajjar"
                  className="text-6xl font-bold mb-4"
                  delayMultiplier={0.02}
                />

                <AnimatedText
                  text="AI/ML & Full-Stack Developer"
                  className="text-2xl font-bold mb-6 text-primary/80"
                  delayMultiplier={0.02}
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-xl mb-10"
                >
                  Computer Engineering student specializing in Machine Learning,
                  Natural Language Processing, and Web Development. Passionate
                  about creating innovative solutions with cutting-edge
                  technologies.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="flex flex-col items-center sm:flex-row gap-4 "
                >
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/projects">
                      View Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                  >
                    <Link
                      to="https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      My Resume
                    </Link>
                  </Button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    className="ml-4 flex gap-4"
                  >
                    <a
                      href="https://linkedin.com/in/kandarpgajjar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                    >
                      <Linkedin className="h-8 w-8" />
                    </a>
                    <a
                      href="https://github.com/slantie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                    >
                      <Github className="h-8 w-8" />
                    </a>
                    <a
                      href="https://www.instagram.com/whoisslantie/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                    >
                      <Instagram className="h-8 w-8" />
                    </a>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-12 relative"
              >
                <div className="relative z-10">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="p-4 backdrop-blur-sm rounded-lg">
                      <h3 className="font-display text-4xl font-bold mb-2 text-primary/80">
                        7+
                      </h3>
                      <p className="text-lg">Hackathons</p>
                    </div>
                    <div className="p-4 backdrop-blur-sm rounded-lg">
                      <h3 className="font-display text-4xl font-bold mb-2 text-primary/80">
                        10+
                      </h3>
                      <p className="texl-lg">Projects</p>
                    </div>
                    <div className="p-4 backdrop-blur-sm rounded-lg">
                      <h3 className="font-display text-4xl font-bold mb-2 text-primary/80">
                        1
                      </h3>
                      <p className="texl-lg">Research Publication</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hero Image with 16:9 ratio and hover effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:block"
            >
              <div
                className="relative overflow-hidden rounded-xl shadow-2xl"
                style={{ aspectRatio: "16/11" }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
                <img
                  src={heroImage}
                  alt="AI and Machine Learning workspace"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24">
        <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="max-w-2xl mx-auto text-lg">
              A selection of my award-winning projects and innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="overflow-hidden h-full flex flex-col border-black-800 shadow-xl rounded-xl">
                  <div className="h-72 overflow-hidden relative group">
                    {/* Simple overlay */}
                    <div className="absolute inset-0 bg-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                    {/* Project image with simple scale effect */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Simple icon indicator */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <CardDescription className="text-base">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow pb-2">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-primary/70 hover:bg-primary/20 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 4 && (
                        <Badge variant="outline" className="text-white/70">
                          +{project.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full hover:bg-primary/70 hover:text-white transition-colors group"
                    >
                      <Link
                        to={project.link}
                        className="flex items-center justify-between w-full"
                      >
                        <span>View Project</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 rounded-full px-8"
            >
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24">
        <div className="max-w-[1300px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Highlights</h2>
          </div>

          <div className="relative rounded-xl">
            <div className="overflow-hidden relative rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out rounded-xl"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {gallery.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-full">
                    <div className="relative" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={image.url}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-lg md:text-xl text-primary/70 font-semibold">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={prevImage}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={nextImage}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-72 flex items-center justify-center">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center text-center">
            {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8 lg:mb-0 lg:mr-12"
        >
          <img
            src="./me3.jpg"
            alt="Kandarp Gajjar"
            className="w-60 h-60 rounded-full object-cover shadow-lg"
          />
        </motion.div> */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Let's Work Together
              </h2>
              <p className="max-w-2xl mx-auto lg:mx-0 text-lg mb-10">
                Interested in collaborating on a project or have a job
                opportunity? I'm always open to discussing new ideas and
                opportunities.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-lg"
              >
                <Link to="/contact">
                  Get In Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
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
