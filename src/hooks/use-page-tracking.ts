import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/api";

/**
 * Hook to automatically track page views
 * Add this to your Layout or App component
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname);
  }, [location.pathname]);
}
