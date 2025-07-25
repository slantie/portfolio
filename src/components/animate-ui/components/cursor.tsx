"use client";

import * as React from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    AnimatePresence,
    type HTMLMotionProps,
    type SpringOptions,
} from "framer-motion";

import { cn } from "@/lib/utils";

// --- Context and Hook ---
type CursorContextType = {
    cursorPos: { x: number; y: number };
    isActive: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    cursorRef: React.RefObject<HTMLDivElement | null>;
};

const CursorContext = React.createContext<CursorContextType | undefined>(
    undefined
);

const useCursor = (): CursorContextType => {
    const context = React.useContext(CursorContext);
    if (!context) {
        throw new Error("useCursor must be used within a CursorProvider");
    }
    return context;
};

// --- Prop Types ---
export type CursorProviderProps = React.ComponentProps<"div"> & {
    children: React.ReactNode;
};

export type CursorProps = HTMLMotionProps<"div"> & {
    children: React.ReactNode;
};

type Align =
    | "top"
    | "top-left"
    | "top-right"
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "left"
    | "right"
    | "center";

export type CursorFollowProps = HTMLMotionProps<"div"> & {
    sideOffset?: number;
    align?: Align;
    transition?: SpringOptions;
    children: React.ReactNode;
};

export const CursorProvider = React.forwardRef<
    HTMLDivElement,
    CursorProviderProps
>(({ children, ...props }, ref) => {
    const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const cursorRef = React.useRef<HTMLDivElement>(null);
    const lastMouseEvent = React.useRef<MouseEvent | null>(null);

    React.useImperativeHandle(
        ref,
        () => containerRef.current as HTMLDivElement
    );

    React.useEffect(() => {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        if (getComputedStyle(parent).position === "static") {
            parent.style.position = "relative";
        }

        const updatePosition = (e: MouseEvent) => {
            const rect = parent.getBoundingClientRect();
            setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        const handleMouseMove = (e: MouseEvent) => {
            lastMouseEvent.current = e;
            updatePosition(e);
            if (!isActive) {
                // 👇 Add class when cursor becomes active
                parent.classList.add("hide-native-cursor");
                setIsActive(true);
            }
        };

        const handleMouseLeave = () => {
            // 👇 Remove class when cursor leaves
            parent.classList.remove("hide-native-cursor");
            setIsActive(false);
        };

        const handleScroll = () => {
            if (lastMouseEvent.current) {
                updatePosition(lastMouseEvent.current);
            }
        };

        parent.addEventListener("mousemove", handleMouseMove);
        parent.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            parent.removeEventListener("mousemove", handleMouseMove);
            parent.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("scroll", handleScroll);
            // Clean up class on unmount
            parent.classList.remove("hide-native-cursor");
        };
    }, [isActive]); // Note: added isActive to dependencies

    return (
        <CursorContext.Provider
            value={{ cursorPos, isActive, containerRef, cursorRef }}
        >
            <div ref={containerRef} data-slot="cursor-provider" {...props}>
                {children}
            </div>
        </CursorContext.Provider>
    );
});
CursorProvider.displayName = "CursorProvider";

export const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(
    ({ children, className, style, ...props }, ref) => {
        const { cursorPos, isActive, containerRef, cursorRef } = useCursor();
        React.useImperativeHandle(
            ref,
            () => cursorRef.current as HTMLDivElement
        );

        const x = useMotionValue(0);
        const y = useMotionValue(0);

        React.useEffect(() => {
            const parentElement = containerRef.current?.parentElement;
            if (parentElement && isActive) {
                parentElement.style.cursor = "none";
            }
            return () => {
                if (parentElement) {
                    parentElement.style.cursor = "default";
                }
            };
        }, [containerRef, isActive]);

        React.useEffect(() => {
            x.set(cursorPos.x);
            y.set(cursorPos.y);
        }, [cursorPos, x, y]);

        return (
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        ref={cursorRef}
                        data-slot="cursor"
                        className={cn(
                            "transform-[translate(-50%,-50%)] pointer-events-none z-[9999] absolute",
                            className
                        )}
                        style={{ top: y, left: x, ...style }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        {...props}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }
);
Cursor.displayName = "Cursor";

export const CursorFollow = React.forwardRef<HTMLDivElement, CursorFollowProps>(
    (
        {
            sideOffset = 15,
            align = "bottom-right",
            children,
            className,
            style,
            transition = { stiffness: 500, damping: 50, bounce: 0 },
            ...props
        },
        ref
    ) => {
        const { cursorPos, isActive, cursorRef } = useCursor();
        const cursorFollowRef = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(
            ref,
            () => cursorFollowRef.current as HTMLDivElement
        );

        const x = useMotionValue(0);
        const y = useMotionValue(0);
        const springX = useSpring(x, transition);
        const springY = useSpring(y, transition);

        const calculateOffset = React.useCallback(() => {
            const rect = cursorFollowRef.current?.getBoundingClientRect();
            const width = rect?.width ?? 0;
            const height = rect?.height ?? 0;

            switch (align) {
                case "center":
                    return { x: width / 2, y: height / 2 };
                case "top":
                    return { x: width / 2, y: height + sideOffset };
                case "top-left":
                    return { x: width + sideOffset, y: height + sideOffset };
                case "top-right":
                    return { x: -sideOffset, y: height + sideOffset };
                case "bottom":
                    return { x: width / 2, y: -sideOffset };
                case "bottom-left":
                    return { x: width + sideOffset, y: -sideOffset };
                case "bottom-right":
                    return { x: -sideOffset, y: -sideOffset };
                case "left":
                    return { x: width + sideOffset, y: height / 2 };
                case "right":
                    return { x: -sideOffset, y: height / 2 };
                default:
                    return { x: 0, y: 0 };
            }
        }, [align, sideOffset]);

        React.useEffect(() => {
            const offset = calculateOffset();
            const cursorRect = cursorRef.current?.getBoundingClientRect();
            const cursorWidth = cursorRect?.width ?? 20;
            const cursorHeight = cursorRect?.height ?? 20;

            x.set(cursorPos.x - offset.x + cursorWidth / 2);
            y.set(cursorPos.y - offset.y + cursorHeight / 2);
        }, [calculateOffset, cursorPos, cursorRef, x, y]);

        return (
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        ref={cursorFollowRef}
                        data-slot="cursor-follow"
                        className={cn(
                            "transform-[translate(-50%,-50%)] pointer-events-none z-[9998] absolute",
                            className
                        )}
                        style={{ top: springY, left: springX, ...style }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        {...props}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }
);
CursorFollow.displayName = "CursorFollow";
