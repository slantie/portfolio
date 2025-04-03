
import { useRef, useEffect } from "react";
import { motion, useInView, useAnimationControls } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  delayMultiplier?: number;
}

const AnimatedText = ({
  text,
  as: Tag = "h2",
  className = "",
  once = true,
  delayMultiplier = 0.1,
}: AnimatedTextProps) => {
  const controls = useAnimationControls();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once });

  // Split text into words and characters
  const words = text.split(" ");

  // Control animation when element comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              variants={{
                hidden: {
                  y: 40,
                  opacity: 0,
                },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: (wordIndex * word.length + charIndex) * delayMultiplier,
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
          {/* Add space after each word except the last one */}
          {wordIndex !== words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
