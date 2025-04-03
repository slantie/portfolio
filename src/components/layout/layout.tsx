
import { ReactNode, lazy, Suspense } from "react";
import Navigation from "../ui/navigation";
import { motion } from "framer-motion";

// Lazy load the particles background
const LazyParticlesBackground = lazy(() => import("@/components/ui/particles-background"));

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Suspense fallback={<div className="absolute inset-0 z-0"></div>}>
          <LazyParticlesBackground />
        </Suspense>
        <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto relative z-10">
      <Navigation/>
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <footer className="pb-8 bg-background/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6 text-right">
          <p className="text-muted-foreground font-mono">
            slantie's Portfolio {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
    </div>
    
  );
};

export default Layout;
