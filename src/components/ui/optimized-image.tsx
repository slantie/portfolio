import { useState, useEffect, useRef } from "react";
import {
  getOptimalFormatUrl,
  getResponsiveUrls,
  isSvgUrl,
} from "@/lib/cloudinary";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  priority?: boolean;
}

// Simple in-memory cache for preloaded images
const imageCache = new Map<string, boolean>();

export function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if it's an SVG (don't transform)
  const isSvg = isSvgUrl(src);

  // Optimize the Cloudinary URL with WebP conversion
  const optimizedSrc = getOptimalFormatUrl(src, { width });

  // Get responsive URLs for srcset (only for Cloudinary images)
  const responsiveUrls =
    !isSvg && src.includes("cloudinary.com") ? getResponsiveUrls(src) : null;

  // Check if already cached
  useEffect(() => {
    if (imageCache.has(optimizedSrc)) {
      setIsLoaded(true);
    }
  }, [optimizedSrc]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    imageCache.set(optimizedSrc, true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

      {/* Actual image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          srcSet={
            responsiveUrls
              ? `${responsiveUrls.small} 400w, ${responsiveUrls.medium} 800w, ${responsiveUrls.large} 1200w`
              : undefined
          }
          sizes={
            responsiveUrls
              ? "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
              : undefined
          }
        />
      )}
    </div>
  );
}

export default OptimizedImage;
