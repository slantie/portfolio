import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import {
    CursorProvider,
    Cursor,
    CursorFollow,
} from "@/components/animate-ui/components/cursor";

import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import AchievementsPage from "./pages/AchievementsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import MomentsPage from "./pages/Moments";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
            <TooltipProvider>
                <CursorProvider>
                    <Cursor>
                        <svg
                            className="size-6 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 40 40"
                        >
                            <path
                                fill="currentColor"
                                d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
                            />
                        </svg>
                    </Cursor>

                    {/* --- The Following Label --- */}
                    <CursorFollow>
                        <div className="bg-primary text-primary-foreground text-white px-2 py-1 rounded-lg text-sm shadow-lg">
                            You
                        </div>
                    </CursorFollow>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                                path="/projects"
                                element={<ProjectsPage />}
                            />
                            <Route
                                path="/achievements"
                                element={<AchievementsPage />}
                            />
                            <Route path="/moments" element={<MomentsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </CursorProvider>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
