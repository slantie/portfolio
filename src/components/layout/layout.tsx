import { ReactNode } from "react";
import Navigation from "../ui/navigation";
import { motion } from "framer-motion";
import { usePageTracking } from "@/hooks/use-page-tracking";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Track page views for analytics
  usePageTracking();

  return (
    <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto">
      <Navigation />
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">Lets get better!</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
