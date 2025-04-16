import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { mainGalleryImages } from "@/data/data";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomCursor from "@/components/ui/custom-cursor";

const MomentsPage = () => {
  const [columnCount, setColumnCount] = useState(3);
  const [selectedImage, setSelectedImage] = useState<
    (typeof mainGalleryImages)[0] | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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
  const sortedmainGalleryImages = useMemo(() => {
    return [...mainGalleryImages].sort((a, b) => {
      if (a.date && b.date) {
        if (a.date.year !== b.date.year) {
          return b.date.year - a.date.year;
        }
        return monthToNumber(b.date.month) - monthToNumber(a.date.month);
      }
      return 0;
    });
  }, []);

  // Generate random height factors for each image - only once
  const imageHeightFactors = useMemo(() => {
    return sortedmainGalleryImages.map(() => 0.8 + Math.random() * 0.7); // Between 0.8 and 1.5
  }, [sortedmainGalleryImages]);

  // Update column count based on window size
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else if (window.innerWidth < 1280) {
        setColumnCount(3);
      } else {
        setColumnCount(4); // Set to 4 columns for larger screens
      }
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
    return sortedmainGalleryImages.reduce((acc, image, index) => {
      if (image.date) {
        const year = image.date.year;
        if (!acc[year]) {
          acc[year] = [];
        }
        // Store the image along with its height factor index
        acc[year].push({ ...image, heightFactorIndex: index });
      }
      return acc;
    }, {} as Record<number, Array<(typeof sortedmainGalleryImages)[0] & { heightFactorIndex: number }>>);
  }, [sortedmainGalleryImages]);

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(imagesByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [imagesByYear]);

  // Distribute images in a masonry layout with consistent randomness
  const distributeImages = (
    images: Array<
      (typeof sortedmainGalleryImages)[0] & { heightFactorIndex: number }
    >
  ) => {
    const columns: Array<
      Array<(typeof sortedmainGalleryImages)[0] & { heightFactorIndex: number }>
    > = Array.from({ length: columnCount }, () => []);

    // Assign each image to the column with the least total height
    // Using the pre-generated height factors
    images.forEach((image) => {
      // Find the column with the least height
      const columnHeights = columns.map((col) =>
        col.reduce(
          (height, img) => height + imageHeightFactors[img.heightFactorIndex],
          0
        )
      );
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
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
    image: (typeof sortedmainGalleryImages)[0] & { heightFactorIndex: number };
    index: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="mb-6 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => setSelectedImage(image)}
      >
        <div className="relative group">
          <div className="relative overflow-hidden">
            <img
              src={image.url}
              alt={image.caption}
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

  // Fullscreen Modal Component
  const FullscreenModal = () => {
    if (!selectedImage) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <Button
            className="absolute top-4 right-4 z-50 py-2 px-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <div className="flex flex-col max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw]">
            {/* Image container */}
            <div
              className="relative max-w-full max-h-[80vh] sm:max-h-[85vh] overflow-auto cursor-pointer bg-white rounded-lg sm:rounded-xl md:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="max-w-full max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] object-contain mx-auto cursor-pointer rounded-lg sm:rounded-xl md:rounded-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {/* Caption */}
            <div className="p-2 sm:p-3 md:p-4 text-white">
              <p className="font-medium text-base sm:text-lg text-center cursor-pointer">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
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

              {/* Masonry layout */}
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
                  )
                )}
              </div>
            </div>
          ))}

          {/* Fullscreen Modal */}
          {selectedImage && <FullscreenModal />}
        </div>
      </section>
    </Layout>
  );
};

export default MomentsPage;