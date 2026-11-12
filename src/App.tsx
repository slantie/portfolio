import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";

import ProfessionalPortfolioPage from "./pages/ProfessionalPortfolioPage";
import { PortfolioStudyPage } from "./pages/PortfolioStudies";
import SignalPortfolioPage from "./pages/SignalPortfolioPage";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import MomentsPage from "./pages/Moments";

// Admin pages - bundled together
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminBlogs from "./pages/admin/AdminBlogs";
import ProjectForm from "./pages/admin/ProjectForm";
import AchievementForm from "./pages/admin/AchievementForm";
import GalleryForm from "./pages/admin/GalleryForm";
import BlogForm from "./pages/admin/BlogForm";
import DataMigration from "./pages/admin/DataMigration";
import WorkspacePage from "./pages/admin/WorkspacePage";
import AcademicWorkspacePage from "./pages/admin/AcademicWorkspacePage";

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
            <Route path="/" element={<ProfessionalPortfolioPage />} />
            <Route path="/test-1" element={<PortfolioStudyPage study={1} />} />
            <Route path="/test-2" element={<PortfolioStudyPage study={2} />} />
            <Route path="/test-3" element={<PortfolioStudyPage study={3} />} />
            <Route path="/test-4" element={<SignalPortfolioPage />} />
            <Route path="/classic" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/moments" element={<MomentsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin routes */}
            <Route path="/slantie/login" element={<AdminLogin />} />
            <Route path="/slantie" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id" element={<ProjectForm />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="achievements/new" element={<AchievementForm />} />
              <Route path="achievements/:id" element={<AchievementForm />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="gallery/new" element={<GalleryForm />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/:id" element={<BlogForm />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="migrate" element={<DataMigration />} />
              <Route path="workspace" element={<WorkspacePage />} />
              <Route path="workspace/calendar" element={<AcademicWorkspacePage mode="calendar" />} />
              <Route path="workspace/coursework" element={<AcademicWorkspacePage mode="coursework" />} />
              <Route path="workspace/materials" element={<AcademicWorkspacePage mode="materials" />} />
              <Route path="workspace/files" element={<AcademicWorkspacePage mode="files" />} />
              <Route path="workspace/leetcode" element={<AcademicWorkspacePage mode="leetcode" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
