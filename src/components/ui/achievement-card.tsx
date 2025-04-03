import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ExternalLink,
  Award,
  Medal,
  Trophy,
  FileText,
  X,
  PartyPopper,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Achievement,
  AchievementType,
  achievementCategoryLabels,
} from "@/data/data";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

// Icon mapping for achievement types
const achievementIcons: Record<AchievementType, React.ReactNode> = {
  award: <Trophy className="h-5 w-5" />,
  certificate: <FileText className="h-5 w-5" />,
  felicitation: <Medal className="h-5 w-5" />,
  publication: <ExternalLink className="h-5 w-5" />,
  recognition: <Award className="h-5 w-5" />,
};

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);
  const { toast } = useToast();

  const handleCardClick = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  // Function to trigger confetti effect
  const triggerConfetti = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click or modal close
    
    // Get the position of the click for targeted confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.right) / 2 / window.innerWidth;
    const y = (rect.top + rect.bottom) / 2 / window.innerHeight;
    
    // Increment local celebration count for visual feedback
    setCelebrationCount(prev => prev + 1);
    
    // Fire the confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#FFD700', '#FFC0CB', '#00FFFF', '#FF00FF', '#ADFF2F'],
      zIndex: 2000,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card
          className="overflow-hidden shadow-lg rounded-xl border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
        >
          <div className="relative">
            {/* Date Badge */}
            <div className="absolute top-3 left-3 z-30">
              <Badge className="bg-primary text-white font-medium px-3 py-1">
                {achievement.date.month} {achievement.date.year}
              </Badge>
            </div>

            {/* Type Badge */}
            <div className="absolute top-3 right-3 z-30">
              <Badge
                variant="outline"
                className="bg-black/60 text-white border-none backdrop-blur-sm"
              >
                <span className="flex items-center gap-1">
                  {achievementIcons[achievement.type]}
                  {achievementCategoryLabels[achievement.type]}
                </span>
              </Badge>
            </div>

            {/* Lighthouse Effect Container */}
            <div className="relative overflow-hidden">
              {/* Gradient overlay for lighthouse effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
                animate={{
                  opacity: isHovered ? 0.8 : 0.6,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Image */}
              <motion.img
                src={achievement.image}
                alt={achievement.title}
                className="w-full h-auto object-cover rounded-xl"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.7 }}
              />

              {/* Caption overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
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
                  className="text-white/80 text-sm"
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
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {achievement.date.month} {achievement.date.year}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {achievement.description}
              </p>
            </div>

            {/* Tags */}
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

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 md:p-8 cursor-auto"
            onClick={handleCloseFullScreen} // Close when clicking anywhere in the modal
          >
            {/* Close button */}
            <Button
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors z-50 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseFullScreen();
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Celebration button in modal */}
            <motion.div
              className="absolute bottom-24 right-8 z-50"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-6 shadow-lg flex items-center gap-2 cursor-pointer"
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
                      colors: ['#FFD700', '#FFC0CB', '#00FFFF', '#FF00FF', '#ADFF2F'],
                      zIndex: 2000,
                      startVelocity: randomInRange(40, 60),
                    });
                    }
                  
                  // Increment local celebration count
                  // setCelebrationCount(prev => prev + 1);
                }}
              >
                <PartyPopper className="h-6 w-6" />
                <span className="ml-1">Celebrate!</span>
              </Button>
            </motion.div>

            {/* Full screen image container */}
            <motion.div
              className=" items-center justify-center max-w-5xl max-h-[70vh] overflow-hidden rounded-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            >
              <img
                src={achievement.image}
                alt={achievement.title}
                className="rounded-2xl bg-white h-auto object-contain max-h-[70vh] cursor-zoom-in"
              />
            </motion.div>

            {/* Caption below image */}
            <motion.div
              className="w-full max-w-5xl mt-6 bg-black/60 p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on caption
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {achievement.title}
              </h2>
              <p className="text-lg text-white/80">
                {achievement.organization}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementCard;
