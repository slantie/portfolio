import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { getGalleryImages } from "@/lib/api";
import type { GalleryImage } from "@/types";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOptimalFormatUrl } from "@/lib/cloudinary";
import SEO from "@/components/seo";
import "./moments.css";

function stableHash(value: string) {
  return Array.from(value).reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) | 0;
  }, 7);
}

const MomentsPage = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Fetch gallery images on mount
  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      try {
        const [homeImages, mainImages, momentsImages] = await Promise.all([
          getGalleryImages("home"),
          getGalleryImages("main"),
          getGalleryImages("moments"),
        ]);
        const uniqueImages = new Map(
          [...homeImages, ...mainImages, ...momentsImages].map((image) => [image.id ?? image.url, image]),
        );
        setGalleryImages(Array.from(uniqueImages.values()));
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Helper function to convert month names to numbers
  const monthToNumber = (month: string): number => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(month);
  };

  // Sort gallery images by date (most recent first)
  const sortedGalleryImages = useMemo(() => {
    return [...galleryImages].sort((a, b) => {
      if (a.date && b.date) {
        if (a.date.year !== b.date.year) {
          return b.date.year - a.date.year;
        }
        return monthToNumber(b.date.month) - monthToNumber(a.date.month);
      }
      return 0;
    });
  }, [galleryImages]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Group images by year
  const imagesByYear = useMemo(() => {
    return sortedGalleryImages.reduce(
      (acc, image, index) => {
        const year = image.date ? String(image.date.year) : "Unsorted";
        if (!acc[year]) acc[year] = [];
        acc[year].push({ ...image, heightFactorIndex: index });
        return acc;
      },
      {} as Record<string, Array<GalleryImage & { heightFactorIndex: number }>>,
    );
  }, [sortedGalleryImages]);

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(imagesByYear)
      .sort((a, b) => {
        if (a === "Unsorted") return 1;
        if (b === "Unsorted") return -1;
        return Number(b) - Number(a);
      });
  }, [imagesByYear]);

  // MasonryGalleryItem component
  const MasonryGalleryItem = ({
    image,
    index,
  }: {
    image: GalleryImage;
    index: number;
  }) => {
    const hash = Math.abs(stableHash(image.id ?? image.url));
    const rotation = ((hash % 9) - 4) * 0.55;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.035, 0.5) }}
        className="moments-polaroid-card"
        style={{ "--polaroid-rotation": `${rotation}deg` } as React.CSSProperties}
        onClick={() => setSelectedImage(image)}
      >
        <div className="moments-polaroid-inner">
          <div className="moments-polaroid-photo">
            <img
              src={getOptimalFormatUrl(image.url, { width: 600 })}
              alt={image.caption}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          <p className="moments-polaroid-caption">{image.caption}</p>
        </div>
      </motion.div>
    );
  };

  // Fullscreen Modal Component with Accessibility Features
  const FullscreenModal = () => {
    // Handlers for next and previous images
    const handleNext = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedImage((current) => {
        if (!current) return null;
        const currentIndex = sortedGalleryImages.findIndex(
          (img) => img.url === current.url,
        );
        if (currentIndex === -1) return current;
        const nextIndex = (currentIndex + 1) % sortedGalleryImages.length;
        return sortedGalleryImages[nextIndex];
      });
    };

    const handlePrev = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedImage((current) => {
        if (!current) return null;
        const currentIndex = sortedGalleryImages.findIndex(
          (img) => img.url === current.url,
        );
        if (currentIndex === -1) return current;
        const prevIndex =
          (currentIndex - 1 + sortedGalleryImages.length) %
          sortedGalleryImages.length;
        return sortedGalleryImages[prevIndex];
      });
    };

    // Effect for keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedImage(null);
        else if (e.key === "ArrowRight") handleNext();
        else if (e.key === "ArrowLeft") handlePrev();
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []); // Empty dependency array ensures this runs only once.

    if (!selectedImage) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={() => setSelectedImage(null)}
      >
        {/* Close Button */}
        <Button
          className="absolute top-4 right-4 z-[51] p-2 rounded-md bg-black/50 text-white hover:bg-black/70 transition-colors hover:text-foreground/70"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(null);
          }}
          aria-label="Close image viewer"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Prev Button */}
        <Button
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-md bg-black/50 text-white hover:bg-black/70 transition-colors hover:text-foreground/70"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </Button>

        {/* Next Button */}
        <Button
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-md bg-black/50 text-white hover:bg-black/70 transition-colors hover:text-foreground/70"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </Button>

        {/* Content */}
        <div
          className="relative flex flex-col items-center justify-center w-full h-full p-4 sm:p-8 md:p-12"
          onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on content
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={selectedImage.url}
              src={getOptimalFormatUrl(selectedImage.url, { width: 1200 })}
              alt={selectedImage.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
          </AnimatePresence>
          <motion.p className="mt-4 text-white text-center text-sm sm:text-base">
            {selectedImage.caption}
          </motion.p>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <SEO title="Moments" />
      <Layout>
        <section className="moments-stage relative pt-28 pb-16 sm:pt-36 md:pt-44 lg:pt-52">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <motion.div
              ref={containerRef}
              style={{ opacity, scale }}
              className="mb-10 sm:mb-12 md:mb-16 text-center"
            >
              <AnimatedText
                text="Memorable Moments"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                delayMultiplier={0.02}
              />
              <p className="text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                A visual journey through memorable events, achievements, and
                milestones in my professional and academic life.
              </p>
            </motion.div>

            {sortedYears.map((year) => (
              <div key={year} className="moments-year-group">
                <div className="moments-year-label">
                  <span>{year}</span>
                </div>

                <div className="moments-polaroid-grid">
                  {imagesByYear[year].map((image, index) => (
                    <MasonryGalleryItem
                      key={`${year}-${image.id ?? image.url}`}
                      image={image}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Fullscreen Modal - Wrapped in AnimatePresence for exit animations */}
          <AnimatePresence>
            {selectedImage && <FullscreenModal />}
          </AnimatePresence>
        </section>
      </Layout>
    </>
  );
};

export default MomentsPage;
