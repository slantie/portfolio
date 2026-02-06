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

const MomentsPage = () => {
  const [columnCount, setColumnCount] = useState(3);
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
        const data = await getGalleryImages("main");
        setGalleryImages(data);
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

  // Generate random height factors for each image - only once
  const imageHeightFactors = useMemo(() => {
    return sortedGalleryImages.map(() => 0.8 + Math.random() * 0.7);
  }, [sortedGalleryImages]);

  // Update column count based on window size
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth < 640) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else if (window.innerWidth < 1280) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

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
        if (image.date) {
          const year = image.date.year;
          if (!acc[year]) acc[year] = [];
          acc[year].push({ ...image, heightFactorIndex: index });
        }
        return acc;
      },
      {} as Record<number, Array<GalleryImage & { heightFactorIndex: number }>>,
    );
  }, [sortedGalleryImages]);

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(imagesByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [imagesByYear]);

  // Distribute images in a masonry layout
  const distributeImages = (
    images: Array<GalleryImage & { heightFactorIndex: number }>,
  ) => {
    const columns: Array<Array<GalleryImage & { heightFactorIndex: number }>> =
      Array.from({ length: columnCount }, () => []);

    images.forEach((image) => {
      const columnHeights = columns.map((col) =>
        col.reduce(
          (height, img) => height + imageHeightFactors[img.heightFactorIndex],
          0,
        ),
      );
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      );
      columns[shortestColumnIndex].push(image);
    });

    return columns;
  };

  // MasonryGalleryItem component
  const MasonryGalleryItem = ({
    image,
    index,
  }: {
    image: GalleryImage & {
      heightFactorIndex: number;
    };
    index: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="mb-6 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 "
        onClick={() => setSelectedImage(image)}
      >
        <div className="relative group">
          <div className="relative overflow-hidden">
            <img
              src={getOptimalFormatUrl(image.url, { width: 600 })}
              alt={image.caption}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <p className="font-medium text-sm text-center">{image.caption}</p>
          </div>
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
        <section className="relative pt-28 sm:pt-36 md:pt-44 lg:pt-52">
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
              <div key={year} className="mb-10 sm:mb-12 md:mb-16">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="h-px bg-border flex-grow mr-4 sm:mr-6"></div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {year}
                  </h2>
                  <div className="h-px bg-border flex-grow ml-4 sm:ml-6"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {distributeImages(imagesByYear[year]).map(
                    (column, columnIndex) => (
                      <div
                        key={`column-${columnIndex}-${year}`}
                        className="flex flex-col"
                      >
                        {column.map((image, index) => (
                          <MasonryGalleryItem
                            key={`${year}-${columnIndex}-${index}`}
                            image={image}
                            index={index}
                          />
                        ))}
                      </div>
                    ),
                  )}
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
