
import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Function to update cursor position
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      
      // Show cursor if it was hidden
      if (!isVisible.current) {
        cursor.style.opacity = "1";
        isVisible.current = true;
      }
    };

    // Function to handle when mouse leaves the window
    const onMouseLeave = () => {
      cursor.style.opacity = "0";
      isVisible.current = false;
    };

    // Function to handle clicks
    const onMouseDown = () => {
      cursor.classList.add("active");
    };

    const onMouseUp = () => {
      cursor.classList.remove("active");
    };

    // Listen for interactive elements to change cursor appearance
    const handleLinkHover = () => {
      cursor.classList.add("active");
    };

    const handleLinkLeave = () => {
      cursor.classList.remove("active");
    };

    // Add event listeners for the cursor
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleLinkHover);
      el.addEventListener("mouseleave", handleLinkLeave);
    });

    // Cleanup
    return () => {
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleLinkHover);
        el.removeEventListener("mouseleave", handleLinkLeave);
      });
    };
  }, []);

  return <div ref={cursorRef} className="animated-cursor" />;
};

export default CustomCursor;
