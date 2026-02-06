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
      variants={{
        hidden: {
          opacity: 0,
          y: 20,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
    >
      {text}
    </motion.div>
  );
};

export default AnimatedText;
