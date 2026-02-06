import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";

// Simple loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
  </div>
);

import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import AchievementsPage from "./pages/AchievementsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import MomentsPage from "./pages/Moments";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";

// Admin pages - lazy loaded for code splitting
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminAchievements = lazy(() => import("./pages/admin/AdminAchievements"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs"));
const ProjectForm = lazy(() => import("./pages/admin/ProjectForm"));
const AchievementForm = lazy(() => import("./pages/admin/AchievementForm"));
const GalleryForm = lazy(() => import("./pages/admin/GalleryForm"));
const BlogForm = lazy(() => import("./pages/admin/BlogForm"));
const DataMigration = lazy(() => import("./pages/admin/DataMigration"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/moments" element={<MomentsPage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin routes - lazy loaded */}
            <Route path="/admin/login" element={
              <Suspense fallback={<PageLoader />}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            }>
              <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<PageLoader />}><AdminProjects /></Suspense>} />
              <Route path="projects/new" element={<Suspense fallback={<PageLoader />}><ProjectForm /></Suspense>} />
              <Route path="projects/:id" element={<Suspense fallback={<PageLoader />}><ProjectForm /></Suspense>} />
              <Route path="achievements" element={<Suspense fallback={<PageLoader />}><AdminAchievements /></Suspense>} />
              <Route path="achievements/new" element={<Suspense fallback={<PageLoader />}><AchievementForm /></Suspense>} />
              <Route path="achievements/:id" element={<Suspense fallback={<PageLoader />}><AchievementForm /></Suspense>} />
              <Route path="gallery" element={<Suspense fallback={<PageLoader />}><AdminGallery /></Suspense>} />
              <Route path="gallery/new" element={<Suspense fallback={<PageLoader />}><GalleryForm /></Suspense>} />
              <Route path="blogs" element={<Suspense fallback={<PageLoader />}><AdminBlogs /></Suspense>} />
              <Route path="blogs/new" element={<Suspense fallback={<PageLoader />}><BlogForm /></Suspense>} />
              <Route path="blogs/:id" element={<Suspense fallback={<PageLoader />}><BlogForm /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<PageLoader />}><AdminProfile /></Suspense>} />
              <Route path="messages" element={<Suspense fallback={<PageLoader />}><AdminMessages /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
              <Route path="migrate" element={<Suspense fallback={<PageLoader />}><DataMigration /></Suspense>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
