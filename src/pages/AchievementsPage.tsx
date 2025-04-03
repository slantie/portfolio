import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementCard from "@/components/ui/achievement-card";
import {
  Achievement,
  achievements,
  AchievementType,
  achievementCategoryLabels,
} from "@/data/data";

// Lazy load the particles background
const LazyParticlesBackground = lazy(() => import("@/components/ui/particles-background"));

const AchievementsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [columnCount, setColumnCount] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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

  return (
    <Layout>
      <section className="relative mt-52">
      <Suspense fallback={<div className="absolute inset-0 z-0"></div>}>
          <LazyParticlesBackground />
        </Suspense>
        <div className="max-w-[1920px] mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div
            ref={containerRef}
            style={{ opacity, scale }}
            className="mb-16 text-center"
          >
            <AnimatedText
              text="Achievements"
              className="text-4xl md:text-5xl font-bold mb-6"
              delayMultiplier={0.02}
            />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A showcase of awards, certificates, felicitations, and
              recognitions received throughout my academic and professional
              journey.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-12">
            <Tabs
              defaultValue="all"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <div className="flex justify-center justify-items-center items-center mb-12 z-10">
                <TabsList className="flex items-center justify-center gap-4 px-2 py-6 transition-all duration-300">
                  <TabsTrigger
                    value="all"
                    className="text-md"
                    onClick={() => setActiveCategory("all")}
                  >
                    All Achievements
                  </TabsTrigger>
                  {achievementTypes.map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="text-md"
                      onClick={() => setActiveCategory(type)}
                    >
                      {achievementCategoryLabels[type]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeCategory} className="mt-0">
                {sortedYears.map((year) => (
                  <div key={year} className="mb-16" data-value={year}>
                    <div className="flex items-center mb-8">
                      <h2 className="text-3xl font-bold">{year}</h2>
                      <div className="h-px bg-border flex-grow ml-4"></div>
                    </div>

                    {/* Masonry layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {distributeAchievements(achievementsByYear[year]).map(
                        (column, columnIndex) => (
                          <div
                            key={`column-${columnIndex}`}
                            className="flex flex-col gap-8"
                          >
                            {column.map((achievement, index) => (
                              <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                index={index}
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
                  <div className="text-center py-16">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      No achievements found in this category.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AchievementsPage;
