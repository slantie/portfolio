import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "./button";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Achievements", path: "/achievements" },
  { label: "Moments", path: "/moments" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navigation background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation variants for menu items
  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Custom burger button animation variants
  const burgerVariants = {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: 45,
    },
  };

  const secondLineVariants = {
    closed: {
      opacity: 1,
    },
    open: {
      opacity: 0,
    },
  };

  const thirdLineVariants = {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: -90,
      translateY: -8,
      translateX: 8,
    },
  };

  return (
    <div className="z-50">
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled || isOpen ? "bg-background shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-mono font-regular relative z-10"
            aria-label="Home"
          >
            {"<s1antie/>"}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, i) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 font-medium text-md rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full z-0"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* Custom Burger Menu Button with Icon */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Button
              onClick={toggleMenu}
              className="ml-4 p-2 rounded-full relative z-[60] flex items-center justify-center w-10 h-10 focus:outline-none bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              variant="ghost"
            >
              {isOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay for mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/80 z-40 md:hidden"
                onClick={toggleMenu}
              />

              {/* Menu content */}
              <motion.div
                className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-background shadow-xl border-l border-border z-[55] md:hidden"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
              >
                <div className="flex flex-col h-full p-6">
                  <div className="mb-8">
                    <Link
                      to="/"
                      className="text-2xl font-mono font-regular"
                      onClick={toggleMenu}
                    >
                      {"<s1antie/>"}
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-6">
                    {navItems.map((item, i) => (
                      <motion.div
                        key={item.path}
                        custom={i}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <Link
                          to={item.path}
                          className={`block px-4 py-2 text-md font-medium border-l-2 transition-all duration-300 ${
                            location.pathname === item.path
                              ? "border-primary text-foreground pl-6"
                              : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground hover:pl-6"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Navigation;
