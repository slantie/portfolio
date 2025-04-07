import { useState, useRef, useEffect, lazy, Suspense } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartyPopper, X } from "lucide-react";
import confetti from "canvas-confetti";
import {
  Achievement,
  achievements,
  AchievementType,
  achievementCategoryLabels,
} from "@/data/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Lazy load the particles background
const LazyParticlesBackground = lazy(
  () => import("@/components/ui/particles-background")
);

const FullscreenModal = ({
  achievement,
  isOpen,
  onClose,
}: {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!achievement || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 cursor-pointer"
        onClick={onClose}
      >
        {/* Close button */}
        <Button
          className="absolute top-4 right-4 z-50 py-2 px-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Celebration button */}
        <motion.div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-3 rounded-full shadow-lg flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal close

              // Special confetti for the modal view - more spectacular!
              const randomInRange = (min: number, max: number) =>
                Math.random() * (max - min) + min;

              for (let i = 0; i < 5; i++) {
                confetti({
                  particleCount: randomInRange(50, 100),
                  angle: randomInRange(240, 360),
                  spread: randomInRange(360, 360),
                  origin: { x: Math.random(), y: Math.random() * 0.6 },
                  colors: [
                    "#FFD700",
                    "#FFC0CB",
                    "#00FFFF",
                    "#FF00FF",
                    "#ADFF2F",
                  ],
                  zIndex: 2000,
                  startVelocity: randomInRange(40, 60),
                });
              }
            }}
          >
            <PartyPopper className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline-block ml-1 text-xs sm:text-sm">
              Celebrate!
            </span>
          </Button>
        </motion.div>

        <div className="flex flex-col max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw]">
          {/* Image container */}
          <div
            className="relative max-w-full max-h-[80vh] sm:max-h-[85vh] overflow-auto cursor-pointer rounded-lg sm:rounded-xl md:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={achievement.image}
              alt={achievement.title}
              className="max-w-full max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] object-contain mx-auto cursor-pointer rounded-lg sm:rounded-xl md:rounded-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Caption */}
          <div className="p-2 sm:p-3 md:p-4 text-white">
            <h2 className="text-xl text-center cursor-pointer">
              {achievement.title}
            </h2>
            <p className="text-md text-center cursor-pointer">
              {achievement.organization}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const AchievementCardInline = ({
  achievement,
  index,
  onViewDetails,
}: {
  achievement: Achievement;
  index: number;
  onViewDetails: (achievement: Achievement) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewDetails(achievement)}
      >
        <div className="relative">
          <div className="relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
              animate={{
                opacity: isHovered ? 0.8 : 0.6,
              }}
              transition={{ duration: 0.5 }}
            />

            <motion.img
              src={achievement.image}
              alt={achievement.title}
              className="w-full h-auto object-cover rounded-xl"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.7 }}
            />

            <div
              className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 bg-black/10"
              style={{ backdropFilter: "blur(1px)" }}
            >
              <motion.h3
                className="text-xl font-bold line-clamp-2"
                animate={{
                  y: isHovered ? 0 : 5,
                  opacity: isHovered ? 1 : 0.9,
                }}
                transition={{ duration: 0.4 }}
              >
                {achievement.title}
              </motion.h3>
              <motion.p
                className="text-white text-sm"
                animate={{
                  y: isHovered ? 0 : 5,
                  opacity: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {achievement.organization}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex flex-wrap gap-2 mt-auto">
            {achievement.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const AchievementsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [columnCount, setColumnCount] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Update column count and check if mobile based on window size
  useEffect(() => {
    const updateSizeSettings = () => {
      // Update column count
      if (window.innerWidth < 640) {
        setColumnCount(1);
        setIsMobile(true);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
        setIsMobile(false);
      } else if (window.innerWidth < 1280) {
        setColumnCount(3);
        setIsMobile(false);
      } else {
        setColumnCount(4); // Set to 4 columns for larger screens
        setIsMobile(false);
      }
    };

    updateSizeSettings();
    window.addEventListener("resize", updateSizeSettings);
    return () => window.removeEventListener("resize", updateSizeSettings);
  }, []);

  // Get all achievement types from the data
  const achievementTypes = Array.from(
    new Set(achievements.map((achievement) => achievement.type))
  ) as AchievementType[];

  // Filter achievements based on active category
  const filteredAchievements =
    activeCategory === "all"
      ? achievements
      : achievements.filter(
          (achievement) => achievement.type === activeCategory
        );

  // Group achievements by year (most recent first)
  const achievementsByYear = filteredAchievements.reduce((acc, achievement) => {
    const year = achievement.date.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(achievement);
    return acc;
  }, {} as Record<number, Achievement[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(achievementsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Sort achievements within each year by month (most recent first)
  Object.keys(achievementsByYear).forEach((year) => {
    achievementsByYear[Number(year)].sort((a, b) => {
      // Convert month names to numbers for comparison
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
      return months.indexOf(b.date.month) - months.indexOf(a.date.month);
    });
  });

  // Distribute achievements in a masonry layout
  const distributeAchievements = (achievements: Achievement[]) => {
    // Sort achievements by year and month before distributing
    const sortedAchievements = [...achievements].sort((a, b) => {
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
      if (b.date.year !== a.date.year) {
        return b.date.year - a.date.year;
      }
      return months.indexOf(b.date.month) - months.indexOf(a.date.month);
    });

    const columns: Achievement[][] = Array.from(
      { length: columnCount },
      () => []
    );

    sortedAchievements.forEach((achievement, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(achievement);
    });

    return columns;
  };

  // Handle opening the achievement details modal
  const handleViewDetails = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  // Handle closing the achievement details modal
  const handleCloseModal = () => {
    setSelectedAchievement(null);
  };

  // Handler for dropdown change
  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedAchievement) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedAchievement]);

  return (
    <Layout>
      <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52 relative">
        <Suspense fallback={<div className="absolute inset-0 z-0"></div>}>
          <LazyParticlesBackground />
        </Suspense>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div
            ref={containerRef}
            style={{ opacity, scale }}
            className="mb-10 sm:mb-12 md:mb-16 text-center"
          >
            <AnimatedText
              text="Achievements"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
              delayMultiplier={0.02}
            />
            <p className="text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              A showcase of awards, certificates, felicitations, and
              recognitions received throughout my academic and professional
              journey.
            </p>
          </motion.div>

          {/* Category Tabs/Dropdown */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            {/* Mobile Dropdown */}
            {isMobile ? (
              <div className="mb-8 sm:hidden">
                <Select
                  value={activeCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Achievements</SelectItem>
                    {achievementTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {achievementCategoryLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              // Desktop Tabs
              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full hidden sm:block"
              >
                <div className="flex justify-center items-center mb-8 sm:mb-10 md:mb-12 z-10">
                  <TabsList className="flex items-center justify-center gap-2 sm:gap-4 px-2 py-4 sm:py-6 transition-all duration-300">
                    <TabsTrigger
                      value="all"
                      className="text-sm md:text-md"
                      onClick={() => setActiveCategory("all")}
                    >
                      All Achievements
                    </TabsTrigger>
                    {achievementTypes.map((type) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="text-sm md:text-md"
                        onClick={() => setActiveCategory(type)}
                      >
                        {achievementCategoryLabels[type]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
            )}

            {/* Achievement Content */}
            <div className="mt-0">
              {sortedYears.map((year) => (
                <div
                  key={year}
                  className="mb-10 sm:mb-12 md:mb-16"
                  data-value={year}
                >
                  <div className="flex items-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold">{year}</h2>
                    <div className="h-px bg-border flex-grow ml-4"></div>
                  </div>

                  {/* Masonry layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {distributeAchievements(achievementsByYear[year]).map(
                      (column, columnIndex) => (
                        <div
                          key={`column-${columnIndex}`}
                          className="flex flex-col gap-4 sm:gap-6 md:gap-8"
                        >
                          {column.map((achievement, index) => (
                            <AchievementCardInline
                              key={achievement.id}
                              achievement={achievement}
                              index={index}
                              onViewDetails={handleViewDetails}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* Empty state when no achievements match the filter */}
              {sortedYears.length === 0 && (
                <div className="text-center py-10 sm:py-16">
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                    No achievements found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal - now separate from the card component */}
      <FullscreenModal
        achievement={selectedAchievement}
        isOpen={!!selectedAchievement}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default AchievementsPage;
