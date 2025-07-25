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
// Import new icons
import { PartyPopper, X, ChevronLeft, ChevronRight } from "lucide-react";
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

// Updated FullscreenModal with navigation and accessibility
const FullscreenModal = ({
    achievement,
    onClose,
    onNext,
    onPrev,
}: {
    achievement: Achievement;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}) => {
    // Effect for keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowRight") onNext();
            else if (e.key === "ArrowLeft") onPrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            {/* Close button */}
            <Button
                className="absolute top-4 right-4 z-[51] p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-none hover:text-primary"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                aria-label="Close viewer"
            >
                <X className="h-6 w-6 hover:text-primary" />
            </Button>

            {/* Prev Button */}
            <Button
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-none hover:text-primary"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                aria-label="Previous achievement"
            >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>

            {/* Next Button */}
            <Button
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-none hover:text-primary"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                aria-label="Next achievement"
            >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>

            {/* Celebration button */}
            <motion.div
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
                whileHover={{ scale: 1.05 }}
            >
                <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white py-2 px-3 rounded-full shadow-lg flex items-center cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        const randomInRange = (min: number, max: number) =>
                            Math.random() * (max - min) + min;
                        for (let i = 0; i < 5; i++) {
                            confetti({
                                particleCount: randomInRange(50, 100),
                                angle: randomInRange(240, 360),
                                spread: randomInRange(360, 360),
                                origin: {
                                    x: Math.random(),
                                    y: Math.random() * 0.6,
                                },
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

            {/* Modal Content */}
            <div
                className="relative flex flex-col items-center justify-center w-full h-full p-4 sm:p-8 md:p-12"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-col items-center text-center"
                    >
                        <img
                            src={achievement.image}
                            alt={achievement.title}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-4 text-white">
                            <h2 className="text-xl sm:text-2xl font-bold">
                                {achievement.title}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-300">
                                {achievement.organization}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
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
                className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full flex flex-col relative cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => onViewDetails(achievement)}
            >
                <div className="relative">
                    <div className="relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
                            animate={{ opacity: isHovered ? 0.8 : 0.6 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.img
                            src={achievement.image}
                            alt={achievement.title}
                            className="w-full h-auto object-cover rounded-t-xl"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
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

    useEffect(() => {
        const updateSizeSettings = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            if (width < 640) setColumnCount(1);
            else if (width < 1024) setColumnCount(2);
            else if (width < 1280) setColumnCount(3);
            else setColumnCount(4);
        };
        updateSizeSettings();
        window.addEventListener("resize", updateSizeSettings);
        return () => window.removeEventListener("resize", updateSizeSettings);
    }, []);

    const achievementTypes = Array.from(
        new Set(achievements.map((a) => a.type))
    ) as AchievementType[];

    const filteredAchievements =
        activeCategory === "all"
            ? achievements
            : achievements.filter((a) => a.type === activeCategory);

    const achievementsByYear = filteredAchievements.reduce(
        (acc, achievement) => {
            const year = achievement.date.year;
            if (!acc[year]) acc[year] = [];
            acc[year].push(achievement);
            return acc;
        },
        {} as Record<number, Achievement[]>
    );

    const sortedYears = Object.keys(achievementsByYear)
        .map(Number)
        .sort((a, b) => b - a);

    const monthsOrder = [
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
    Object.keys(achievementsByYear).forEach((year) => {
        achievementsByYear[Number(year)].sort(
            (a, b) =>
                monthsOrder.indexOf(b.date.month) -
                monthsOrder.indexOf(a.date.month)
        );
    });

    const distributeAchievements = (achievementsList: Achievement[]) => {
        const columns: Achievement[][] = Array.from(
            { length: columnCount },
            () => []
        );
        achievementsList.forEach((achievement, index) => {
            columns[index % columnCount].push(achievement);
        });
        return columns;
    };

    const handleViewDetails = (achievement: Achievement) =>
        setSelectedAchievement(achievement);
    const handleCloseModal = () => setSelectedAchievement(null);

    const handleNext = () => {
        if (!selectedAchievement) return;
        const currentIndex = filteredAchievements.findIndex(
            (a) => a.id === selectedAchievement.id
        );
        const nextIndex = (currentIndex + 1) % filteredAchievements.length;
        setSelectedAchievement(filteredAchievements[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedAchievement) return;
        const currentIndex = filteredAchievements.findIndex(
            (a) => a.id === selectedAchievement.id
        );
        const prevIndex =
            (currentIndex - 1 + filteredAchievements.length) %
            filteredAchievements.length;
        setSelectedAchievement(filteredAchievements[prevIndex]);
    };

    useEffect(() => {
        document.body.style.overflow = selectedAchievement ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedAchievement]);

    return (
        <Layout>
            <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52 relative">
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
                            A showcase of awards, certificates, felicitations,
                            and recognitions received throughout my academic and
                            professional journey.
                        </p>
                    </motion.div>

                    <div className="mb-8 sm:mb-10 md:mb-12">
                        {isMobile ? (
                            <div className="sm:hidden">
                                <Select
                                    value={activeCategory}
                                    onValueChange={setActiveCategory}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Achievements
                                        </SelectItem>
                                        {achievementTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {
                                                    achievementCategoryLabels[
                                                        type
                                                    ]
                                                }
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <Tabs
                                value={activeCategory}
                                onValueChange={setActiveCategory}
                                className="w-full hidden sm:block"
                            >
                                <div className="flex justify-center items-center mb-8 sm:mb-10 md:mb-12 z-10">
                                    <TabsList className="flex items-center justify-center gap-2 sm:gap-4 px-2 py-4 sm:py-6">
                                        <TabsTrigger
                                            value="all"
                                            className="text-sm md:text-md"
                                        >
                                            All Achievements
                                        </TabsTrigger>
                                        {achievementTypes.map((type) => (
                                            <TabsTrigger
                                                key={type}
                                                value={type}
                                                className="text-sm md:text-md"
                                            >
                                                {
                                                    achievementCategoryLabels[
                                                        type
                                                    ]
                                                }
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </Tabs>
                        )}

                        <div className="mt-0">
                            {sortedYears.map((year) => (
                                <div
                                    key={year}
                                    className="mb-10 sm:mb-12 md:mb-16"
                                >
                                    <div className="flex items-center mb-6 sm:mb-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold">
                                            {year}
                                        </h2>
                                        <div className="h-px bg-border flex-grow ml-4"></div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                        {distributeAchievements(
                                            achievementsByYear[year]
                                        ).map((column, columnIndex) => (
                                            <div
                                                key={`column-${columnIndex}`}
                                                className="flex flex-col gap-4 sm:gap-6 md:gap-8"
                                            >
                                                {column.map(
                                                    (achievement, index) => (
                                                        <AchievementCardInline
                                                            key={achievement.id}
                                                            achievement={
                                                                achievement
                                                            }
                                                            index={index}
                                                            onViewDetails={
                                                                handleViewDetails
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
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

            <AnimatePresence>
                {selectedAchievement && (
                    <FullscreenModal
                        achievement={selectedAchievement}
                        onClose={handleCloseModal}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default AchievementsPage;
