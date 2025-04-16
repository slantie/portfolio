import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import CustomCursor from "@/components/ui/custom-cursor";
import { lazy, Suspense, useState, useEffect } from "react";
import Navigation from "./components/ui/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load the particles background
const LazyParticlesBackground = lazy(() => import("@/components/ui/particles-background"));

// Lazy load all page components
const HomePage = lazy(() => import("./pages/HomePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MomentsPage = lazy(() => import("./pages/Moments"));

const queryClient = new QueryClient();

// Define route order for direction detection
const routeOrder = [
  "/",
  "/projects",
  "/achievements",
  "/moments",
  "/about",
  "/contact"
];

// Page transition variants with refined timing
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      x: { 
        type: "spring", 
        stiffness: 80,
        damping: 20,
        mass: 1,
        restDelta: 0.001
      },
      opacity: { 
        duration: 0.4,
        ease: "easeOut" 
      }
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { 
        duration: 0.4, 
        ease: [0.4, 0.0, 0.2, 1]
      },
      opacity: { 
        duration: 0.3 
      }
    },
  }),
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

// AnimatedRoutes component to handle transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Determine the direction of the transition
  const getDirection = () => {
    const currentIndex = routeOrder.indexOf(location.pathname);
    const prevPathname = sessionStorage.getItem("currentPath") || "/";
    const prevIndex = routeOrder.indexOf(prevPathname);
    
    // Save current path for next transition
    sessionStorage.setItem("currentPath", location.pathname);
    
    // If path not found in order list or it's the initial load, default to forward
    if (currentIndex === -1 || prevIndex === -1) return 1;
    
    // Return 1 for forward (right to left), -1 for backward (left to right)
    return currentIndex > prevIndex ? 1 : -1;
  };
  
  const direction = getDirection();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <AnimatePresence
      initial={false}
      mode="wait"
      custom={direction}
    >
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        <Routes location={location}>
          <Route path="/" element={
            <Suspense fallback={<LoadingSpinner />}>
              <HomePage />
            </Suspense>
          } />
          <Route path="/projects" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectsPage />
            </Suspense>
          } />
          <Route path="/achievements" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AchievementsPage />
            </Suspense>
          } />
          <Route path="/moments" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MomentsPage />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <TooltipProvider>
          <CustomCursor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="relative">
              <Suspense fallback={<div className="absolute inset-0 z-0"></div>}>
                <LazyParticlesBackground />
              </Suspense>
              
              <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto relative z-10">
                {/* Navigation is outside the animated routes */}
                <Navigation />
                
                {/* Only the main content area is animated */}
                <main className="flex-grow overflow-hidden will-change-transform">
                  <AnimatedRoutes />
                </main>
                
                {/* Footer is also outside the animated routes */}
                <footer className="pb-8 pt-4 bg-background/80 backdrop-blur-md shadow-md">
                  <div className="container mx-auto px-6 text-right">
                    <p className="text-muted-foreground font-mono sm:text-[17px] text-sm">
                      slantie's Portfolio {new Date().getFullYear()}
                    </p>
                  </div>
                </footer>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
